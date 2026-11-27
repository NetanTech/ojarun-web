/**
 * Remembers the page a shopper was on when they went to log in, so that after
 * logging in (or signing up and verifying their email) they land back there,
 * e.g. on checkout with their cart, instead of on the marketplace home.
 * Kept in sessionStorage: it survives the login → register → verify steps but
 * not a new browser session.
 */
const KEY = "ojarun_return_to";
const DEFAULT_PATH = "/marketplace";

/** Only same-site paths, never the auth pages themselves. */
function isSafe(path: string): boolean {
  return (
    path.startsWith("/") &&
    !path.startsWith("//") &&
    !/^\/(login|register|verify-email|forget-password|sucess)(\/|$|\?)/.test(path)
  );
}

export function rememberReturnTo(path: string): void {
  if (!isSafe(path)) return;
  try {
    sessionStorage.setItem(KEY, path);
  } catch {
    // Storage can be blocked (private mode); falling back to the default is fine.
  }
}

/** Reads and clears the remembered page; defaults to the marketplace. */
export function takeReturnTo(): string {
  try {
    const path = sessionStorage.getItem(KEY);
    sessionStorage.removeItem(KEY);
    if (path && isSafe(path)) return path;
  } catch {
    // ignore
  }
  return DEFAULT_PATH;
}
