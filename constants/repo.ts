/**
 * The one place the source repository is named.
 *
 * The star count, the "view source" links and the prefilled issue links all
 * point at the same repo, and a fork or a rename should not mean hunting
 * through three files.
 */
export const GITHUB_REPO = "Indra-photon/Interactive-SVG-Icons";

export const GITHUB_REPO_URL = `https://github.com/${GITHUB_REPO}`;

/** Blob link to a repo-relative path on the default branch. */
export function repoFileUrl(filePath: string, branch = "master"): string {
  return `${GITHUB_REPO_URL}/blob/${branch}/${filePath}`;
}

/**
 * A "report an issue" link with the item already filled in, so a report
 * arrives naming the thing it is about rather than "the button on the loaders
 * page". GitHub reads `title` and `body` off the query string.
 */
export function repoIssueUrl({
  title,
  itemLabel,
  itemUrl,
}: {
  title: string;
  itemLabel: string;
  itemUrl: string;
}): string {
  const body = [
    `**Item:** ${itemLabel}`,
    `**Page:** ${itemUrl}`,
    "",
    "**What happened**",
    "",
    "",
    "**What you expected**",
    "",
  ].join("\n");

  const params = new URLSearchParams({ title, body });
  return `${GITHUB_REPO_URL}/issues/new?${params.toString()}`;
}
