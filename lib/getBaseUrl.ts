/**
 * Gets the base URL for API calls
 * - Server-side: Returns the full site URL from env
 * - Client-side: Returns the full site URL from env
 */
export function getBaseUrl(): string {
  // Always use the environment variable for consistency
  return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
}

/**
 * Builds a full URL for API calls
 */
export function buildApiUrl(path: string): string {
  const baseUrl = getBaseUrl();
  // Ensure path starts with /
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${baseUrl}${cleanPath}`;
}