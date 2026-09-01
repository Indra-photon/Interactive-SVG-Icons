import fs from 'fs';
import path from 'path';

/**
 * Collects the `design.md` files shipped alongside catalog items, keyed by
 * slug. Server-only — call this from the gallery page and pass the map down.
 *
 * Read on the server rather than fetched from the client so the gallery knows
 * at first paint which items have design notes: the "Design.md" button exists
 * only for those, and a button whose presence depends on a request in flight
 * either flickers in or silently never appears.
 *
 * Most items ship no design doc, so the map is usually small.
 */
export function loadDesignDocs(
  catalogDir: string,
  slugs: string[],
): Record<string, string> {
  const docs: Record<string, string> = {};

  for (const slug of slugs) {
    const docPath = path.join(
      process.cwd(),
      'components/craftui',
      catalogDir,
      slug,
      'design.md',
    );
    // Absent is the normal case, not an error.
    if (!fs.existsSync(docPath)) continue;
    docs[slug] = fs.readFileSync(docPath, 'utf-8');
  }

  return docs;
}
