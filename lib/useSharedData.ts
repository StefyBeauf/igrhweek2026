"use client";

import { useEffect, useRef, useState } from "react";

/** Keeps a piece of state in sync with the shared Google Sheets store
 * (`/api/store/[key]`) instead of per-browser localStorage: loads it once on
 * mount, and saves it (debounced) whenever it changes. */
export function useSharedData<T>(key: string, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [hydrated, setHydrated] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/store/${key}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((remote) => {
        if (cancelled) return;
        if (remote !== null && remote !== undefined) setData(remote as T);
        setHydrated(true);
      })
      .catch(() => {
        if (!cancelled) setHydrated(true);
      });
    return () => {
      cancelled = true;
    };
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      fetch(`/api/store/${key}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }).catch(() => {});
    }, 600);
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, hydrated]);

  return [data, setData] as const;
}
