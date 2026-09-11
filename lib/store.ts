const WEBAPP_URL = process.env.SHEETS_WEBAPP_URL;
const WEBAPP_SECRET = process.env.SHEETS_WEBAPP_SECRET;

/** Reads a shared JSON blob from the Google Sheets web app.
 * Falls back silently to `fallback` if the web app isn't configured yet
 * or unreachable, so the site never breaks before Stéphanie finishes setup. */
// Google Apps Script Web Apps can occasionally take a while to respond from
// Vercel's servers; cap the wait so the site never hangs on a slow sync.
const TIMEOUT_MS = 9000;

export async function getStoredJSON<T>(key: string, fallback: T): Promise<T> {
  if (!WEBAPP_URL || !WEBAPP_SECRET) return fallback;
  try {
    const res = await fetch(
      `${WEBAPP_URL}?key=${encodeURIComponent(key)}&token=${encodeURIComponent(WEBAPP_SECRET)}`,
      { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) }
    );
    if (!res.ok) return fallback;
    const text = await res.text();
    if (!text || text === "null") return fallback;
    return JSON.parse(text) as T;
  } catch {
    return fallback;
  }
}

export async function setStoredJSON(key: string, value: unknown): Promise<boolean> {
  if (!WEBAPP_URL || !WEBAPP_SECRET) return false;
  try {
    const res = await fetch(
      `${WEBAPP_URL}?key=${encodeURIComponent(key)}&token=${encodeURIComponent(WEBAPP_SECRET)}`,
      {
        method: "POST",
        body: JSON.stringify(value),
        signal: AbortSignal.timeout(TIMEOUT_MS),
      }
    );
    return res.ok;
  } catch {
    return false;
  }
}
