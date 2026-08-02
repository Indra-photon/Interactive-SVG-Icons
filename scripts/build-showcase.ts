/**
 * Generates constants/showcase.ts from the R2 bucket listing.
 *
 * R2's list API returns keys and sizes but never video dimensions, and we need
 * the aspect ratio up front — it's what reserves each card's box before the
 * video loads, so the masonry column doesn't reflow mid-scroll. Rather than
 * hand-fill them, we read each file's `tkhd` box over HTTP range requests
 * (~1KB per video) and derive the ratio from the container itself. No ffmpeg.
 *
 * Anything you hand-edit afterwards (title, description, aspect, href) is read
 * back and preserved, so re-running only ever appends newly uploaded videos.
 *
 * Usage:
 *   npm run build:showcase              write constants/showcase.ts
 *   npm run build:showcase -- --dry     list the bucket, write nothing
 */

import fs from 'fs/promises';
import path from 'path';
import { AwsClient } from 'aws4fetch';

const VIDEO_EXT = /\.(mp4|webm|mov|m4v)$/i;
const OUTPUT = 'constants/showcase.ts';
const FALLBACK_ASPECT = '16 / 9';

interface ShowcaseEntry {
  id: string;
  title: string;
  description?: string;
  src: string;
  aspect: string;
  href?: string;
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env — the script is run with --env-file=.env`,
    );
  }
  return value;
}

function makeClient(): AwsClient {
  return new AwsClient({
    accessKeyId: requireEnv('R2_ACCESS_KEY_ID'),
    secretAccessKey: requireEnv('R2_SECRET_ACCESS_KEY'),
    service: 's3',
    region: 'auto',
  });
}

/** Signed S3 endpoint — works whether or not public access is switched on. */
function bucketEndpoint(): string {
  const accountId = requireEnv('CLOUDFLARE_ACCOUNT_ID');
  return `https://${accountId}.r2.cloudflarestorage.com/${requireEnv('R2_BUCKET')}`;
}

// ─── Listing ──────────────────────────────────────────────────────────────────

/**
 * Pulls every key in the bucket, following continuation tokens. The response is
 * XML; rather than take a parser dependency for one field, we match the tag
 * directly — S3 list output never nests <Key>, so this stays safe.
 */
async function listBucket(client: AwsClient): Promise<string[]> {
  const keys: string[] = [];
  let token: string | undefined;

  do {
    const url = new URL(bucketEndpoint());
    url.searchParams.set('list-type', '2');
    url.searchParams.set('max-keys', '1000');
    if (token) url.searchParams.set('continuation-token', token);

    const res = await client.fetch(url.toString());
    if (!res.ok) {
      throw new Error(
        `R2 list failed: ${res.status} ${res.statusText}\n${await res.text()}`,
      );
    }

    const xml = await res.text();
    for (const m of xml.matchAll(/<Key>([^<]+)<\/Key>/g)) {
      keys.push(decodeXml(m[1]));
    }

    token = /<IsTruncated>true<\/IsTruncated>/.test(xml)
      ? xml.match(/<NextContinuationToken>([^<]+)<\/NextContinuationToken>/)?.[1]
      : undefined;
  } while (token);

  return keys;
}

function decodeXml(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

// ─── MP4 dimension probe ──────────────────────────────────────────────────────

async function readRange(
  client: AwsClient,
  url: string,
  start: number,
  end: number,
): Promise<Buffer> {
  const res = await client.fetch(url, {
    headers: { Range: `bytes=${start}-${end}` },
  });
  if (res.status !== 206 && res.status !== 200) {
    throw new Error(`range request failed: ${res.status} ${res.statusText}`);
  }
  return Buffer.from(await res.arrayBuffer());
}

interface BoxHeader {
  size: number;
  type: string;
  headerSize: number;
}

function readBoxHeader(buf: Buffer, offset: number): BoxHeader | null {
  if (offset + 8 > buf.length) return null;

  let size = buf.readUInt32BE(offset);
  const type = buf.toString('latin1', offset + 4, offset + 8);
  let headerSize = 8;

  // size === 1 means the real size is a 64-bit value after the type; size === 0
  // means "extends to end of file", which we can't seek past.
  if (size === 1) {
    if (offset + 16 > buf.length) return null;
    size = Number(buf.readBigUInt64BE(offset + 8));
    headerSize = 16;
  } else if (size === 0) {
    return null;
  }

  return size < headerSize ? null : { size, type, headerSize };
}

/**
 * Walks the top-level box list to find `moov` and returns its body. Reads only
 * a 16-byte header per box, so a faststart file costs two requests and a
 * moov-at-the-end file costs three or four.
 */
async function fetchMoov(
  client: AwsClient,
  url: string,
): Promise<Buffer | null> {
  let pos = 0;

  // Real files have a handful of top-level boxes (ftyp, moov, mdat, free); the
  // cap just stops a malformed file from looping forever.
  for (let i = 0; i < 24; i++) {
    const header = await readRange(client, url, pos, pos + 15);
    const box = readBoxHeader(header, 0);
    if (!box) return null;

    if (box.type === 'moov') {
      return readRange(client, url, pos + box.headerSize, pos + box.size - 1);
    }
    pos += box.size;
  }

  return null;
}

/**
 * Collects every `tkhd` under `moov`. A file has one per track, so an A/V file
 * yields two — the audio track reports 0×0, which the caller filters out.
 */
function collectTkhd(buf: Buffer, out: Buffer[] = []): Buffer[] {
  let offset = 0;

  while (offset + 8 <= buf.length) {
    const box = readBoxHeader(buf, offset);
    if (!box || offset + box.size > buf.length) break;

    const body = buf.subarray(offset + box.headerSize, offset + box.size);
    if (box.type === 'tkhd') out.push(body);
    else if (box.type === 'trak') collectTkhd(body, out);

    offset += box.size;
  }

  return out;
}

/** tkhd stores width/height as 16.16 fixed point, after a 36-byte matrix. */
function parseTkhd(b: Buffer): { width: number; height: number } | null {
  const version = b[0];
  let offset = 4; // version + flags
  offset += version === 1 ? 32 : 20; // times, track id, reserved, duration
  offset += 16; // reserved, layer, alternate group, volume, reserved

  if (offset + 36 + 8 > b.length) return null;

  const matrix: number[] = [];
  for (let i = 0; i < 9; i++) matrix.push(b.readInt32BE(offset + i * 4));
  offset += 36;

  const width = b.readUInt32BE(offset) / 65536;
  const height = b.readUInt32BE(offset + 4) / 65536;

  // A 90°/270° rotation zeroes the diagonal and fills the off-diagonal, so the
  // stored width/height are swapped relative to how the video displays.
  const rotated =
    matrix[0] === 0 && matrix[4] === 0 && (matrix[1] !== 0 || matrix[3] !== 0);

  return rotated ? { width: height, height: width } : { width, height };
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

/**
 * `1920×1080` → `'16 / 9'`. Odd capture sizes reduce to something unreadable
 * like `195 / 422`, so past a threshold we keep the raw pixel values — both are
 * valid CSS and the raw form is self-documenting.
 */
function toAspect(width: number, height: number): string {
  const w = Math.round(width);
  const h = Math.round(height);
  const d = gcd(w, h);
  const sw = w / d;
  const sh = h / d;
  return sh <= 64 ? `${sw} / ${sh}` : `${w} / ${h}`;
}

async function probeAspect(
  client: AwsClient,
  url: string,
): Promise<string | null> {
  const moov = await fetchMoov(client, url);
  if (!moov) return null;

  for (const tkhd of collectTkhd(moov)) {
    const dims = parseTkhd(tkhd);
    if (dims && dims.width > 0 && dims.height > 0) {
      return toAspect(dims.width, dims.height);
    }
  }

  return null;
}

// ─── Naming ───────────────────────────────────────────────────────────────────

/** `ui/ContactRevealCard.mp4` → `ContactRevealCard` */
function baseFromKey(key: string): string {
  return path.basename(key).replace(VIDEO_EXT, '');
}

/**
 * `ContactRevealCard` → `Contact Reveal Card`, `SVGIconGrid` → `SVG Icon Grid`.
 * The second replace keeps acronym runs intact by splitting only before the
 * capital that begins the next word.
 */
function humanize(base: string): string {
  return base
    .replace(/[-_]+/g, ' ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** `ContactRevealCard` → `contact-reveal-card` */
function slugFromBase(base: string): string {
  return humanize(base).toLowerCase().replace(/\s+/g, '-');
}

// ─── Output ───────────────────────────────────────────────────────────────────

/**
 * Reads the hand-editable fields out of the previous generated file so a re-run
 * doesn't reset them. Keyed by id; a missing file means first run.
 */
async function readExisting(
  file: string,
): Promise<Map<string, Partial<ShowcaseEntry>>> {
  const existing = new Map<string, Partial<ShowcaseEntry>>();

  let source: string;
  try {
    source = await fs.readFile(file, 'utf-8');
  } catch {
    return existing;
  }

  // Every generated object literal leads with its id, so splitting on the
  // opening brace gives one chunk per entry to scan.
  for (const block of source.split(/\n\s*\{\s*\n/).slice(1)) {
    const id = block.match(/id:\s*'([^']+)'/)?.[1];
    if (!id) continue;

    existing.set(id, {
      title: block.match(/title:\s*'([^']*)'/)?.[1],
      description: block.match(/description:\s*'([^']*)'/)?.[1],
      aspect: block.match(/aspect:\s*'([^']*)'/)?.[1],
      href: block.match(/href:\s*'([^']*)'/)?.[1],
    });
  }

  return existing;
}

function quote(s: string): string {
  return `'${s.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function render(entries: ShowcaseEntry[]): string {
  const items = entries
    .map((e) => {
      const lines = [`    id: ${quote(e.id)},`, `    title: ${quote(e.title)},`];
      if (e.description) lines.push(`    description: ${quote(e.description)},`);
      lines.push(`    src: ${quote(e.src)},`);
      lines.push(`    aspect: ${quote(e.aspect)},`);
      if (e.href) lines.push(`    href: ${quote(e.href)},`);
      return `  {\n${lines.join('\n')}\n  },`;
    })
    .join('\n');

  return `// Generated by scripts/build-showcase.ts — run \`npm run build:showcase\`.
//
// \`aspect\` is read from each MP4's tkhd box, and \`title\` is derived from the
// filename. Both are preserved on re-run alongside \`description\` and \`href\`,
// so edit them freely here — only newly uploaded videos get appended.
//
// Don't change \`id\`: it's the key the script matches your edits against.

export interface ShowcaseItem {
  /** Stable key, derived from the R2 object name. */
  id: string;
  title: string;
  description?: string;
  /** Absolute URL on R2_PUBLIC_BASE_URL. */
  src: string;
  /** CSS aspect-ratio. Reserves the card's box before the video loads. */
  aspect: string;
  /** Optional link target for the card. */
  href?: string;
}

export const SHOWCASE_ITEMS: ShowcaseItem[] = [
${items}
];
`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  const dry = process.argv.includes('--dry');
  const publicBase = requireEnv('R2_PUBLIC_BASE_URL').replace(/\/+$/, '');
  const client = makeClient();
  const endpoint = bucketEndpoint();

  console.log('🔨 Building showcase manifest...\n');

  const keys = await listBucket(client);
  const videos = keys.filter((k) => VIDEO_EXT.test(k)).sort();

  console.log(
    `📁 ${keys.length} object(s) in bucket, ${videos.length} video(s)\n`,
  );

  if (dry) {
    for (const key of videos) console.log(`  ${key}`);
    console.log('\n(dry run — nothing written)');
    return;
  }

  if (videos.length === 0) {
    console.log('No videos found. Check R2_BUCKET and the token’s bucket scope.');
    return;
  }

  const outputPath = path.resolve(OUTPUT);
  const existing = await readExisting(outputPath);
  const unresolved: string[] = [];

  const entries: ShowcaseEntry[] = [];
  for (const key of videos) {
    const base = baseFromKey(key);
    const id = slugFromBase(base);
    const prev = existing.get(id);

    let aspect = prev?.aspect;
    if (!aspect) {
      const objectUrl = `${endpoint}/${key.split('/').map(encodeURIComponent).join('/')}`;
      try {
        aspect = (await probeAspect(client, objectUrl)) ?? undefined;
      } catch (err) {
        aspect = undefined;
        console.log(`  ⚠️  ${id}: probe failed (${(err as Error).message})`);
      }
      if (aspect) {
        console.log(`  📐 ${id} → ${aspect}`);
      } else {
        unresolved.push(id);
        aspect = FALLBACK_ASPECT;
      }
    }

    entries.push({
      id,
      title: prev?.title ?? humanize(base),
      description: prev?.description,
      // Each path segment is encoded separately so slashes survive.
      src: `${publicBase}/${key.split('/').map(encodeURIComponent).join('/')}`,
      aspect,
      href: prev?.href,
    });
  }

  await fs.writeFile(outputPath, render(entries), 'utf-8');

  console.log(`\n✅ Wrote ${OUTPUT} — ${entries.length} item(s)`);
  if (unresolved.length > 0) {
    console.log(
      `\n⚠️  Could not read dimensions for ${unresolved.length} item(s); ` +
        `they fall back to ${FALLBACK_ASPECT} and need a manual value:`,
    );
    for (const id of unresolved) console.log(`   ${id}`);
  }
}

main().catch((err) => {
  console.error(`\n❌ ${err.message}`);
  process.exit(1);
});
