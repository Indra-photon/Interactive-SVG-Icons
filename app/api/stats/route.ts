import { NextResponse } from "next/server";

const GITHUB_REPO = "Indra-photon/Interactive-SVG-Icons";
const VERCEL_ANALYTICS_API =
  "https://api.vercel.com/v1/query/web-analytics/visits/aggregate";
const WINDOW_DAYS = 30;

/** One hour. Both upstreams are rate-limited and neither number moves fast. */
const REVALIDATE = 3600;

async function fetchStars(): Promise<number | null> {
  try {
    const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}`, {
      headers: { Accept: "application/vnd.github+json" },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null;
  } catch {
    return null;
  }
}

/** YYYY-MM-DD, the format the `since`/`until` params expect. */
function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/**
 * Page views over the last 30 days, from Vercel Web Analytics.
 *
 * Deliberately page *views*, not unique visitors: the aggregate endpoint
 * returns one row per day, and daily unique-visitor counts cannot be summed
 * into a 30-day unique count — the same person browsing on three days would
 * count three times. Page views sum correctly, so that is what we report.
 *
 * Returns null whenever the number can't be trusted (missing credentials, a
 * bad response, an unexpected shape) so the widget renders nothing rather
 * than a misleading zero.
 */
async function fetchViews(): Promise<number | null> {
  const token = process.env.VERCEL_TOKEN;
  const projectId = process.env.VERCEL_PROJECT_ID;
  if (!token || !projectId) return null;

  try {
    const until = new Date();
    const since = new Date(until.getTime() - WINDOW_DAYS * 86_400_000);

    const params = new URLSearchParams({
      projectId,
      since: isoDate(since),
      until: isoDate(until),
      by: "day",
      // The API defaults to limit=10. Day-grouped queries appear to ignore it
      // (31 rows come back regardless), but an explicit limit means a change
      // in that behaviour can't silently truncate the window to 10 days.
      limit: "100",
    });
    // Only team-owned projects take this; personal-account projects must omit
    // it entirely rather than send an empty value.
    if (process.env.VERCEL_TEAM_ID) {
      params.set("teamId", process.env.VERCEL_TEAM_ID);
    }

    const res = await fetch(`${VERCEL_ANALYTICS_API}?${params}`, {
      headers: { Authorization: `Bearer ${token}` },
      next: { revalidate: REVALIDATE },
    });
    if (!res.ok) return null;

    const body = await res.json();
    if (!Array.isArray(body?.data)) return null;

    const total = body.data.reduce(
      (sum: number, row: { pageviews?: number }) =>
        sum + (typeof row.pageviews === "number" ? row.pageviews : 0),
      0
    );
    return total;
  } catch {
    return null;
  }
}

export async function GET() {
  const [stars, views] = await Promise.all([fetchStars(), fetchViews()]);

  return NextResponse.json(
    { stars, views },
    { headers: { "Cache-Control": `public, s-maxage=${REVALIDATE}` } }
  );
}
