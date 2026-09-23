const WEBAPP_URL = process.env.SHEETS_WEBAPP_URL;
const WEBAPP_SECRET = process.env.SHEETS_WEBAPP_SECRET;

/** Reads a shared JSON blob from the Google Sheets web app.
 * If the web app isn't configured yet, returns `fallback` with `ok: true`
 * (legitimately empty — used for local dev without the shared store).
 * If it IS configured but the call times out or fails (e.g. Apps Script's
 * anti-concurrent-write lock under load), returns `ok: false` — callers must
 * NOT treat this as "genuinely empty", or a stale/empty save can silently
 * overwrite real shared data for everyone. */
// Google Apps Script Web Apps can occasionally take a while to respond from
// Vercel's servers; cap the wait so the site never hangs on a slow sync.
const TIMEOUT_MS = 20000;

export async function getStoredJSON<T>(
  key: string,
  fallback: T
): Promise<{ ok: boolean; data: T }> {
  if (!WEBAPP_URL || !WEBAPP_SECRET) return { ok: true, data: fallback };
  try {
    const res = await fetch(
      `${WEBAPP_URL}?key=${encodeURIComponent(key)}&token=${encodeURIComponent(WEBAPP_SECRET)}`,
      { cache: "no-store", signal: AbortSignal.timeout(TIMEOUT_MS) }
    );
    if (!res.ok) return { ok: false, data: fallback };
    const text = await res.text();
    if (!text || text === "null") return { ok: true, data: fallback };
    return { ok: true, data: JSON.parse(text) as T };
  } catch {
    return { ok: false, data: fallback };
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
