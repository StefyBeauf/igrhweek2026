"use client";

import { useEffect, useRef, useState } from "react";

/** Keeps a piece of state in sync with the shared Google Sheets store
 * (`/api/store/[key]`) instead of per-browser localStorage: loads it once on
 * mount, and saves it whenever it changes.
 *
 * Several formateurs can have the same page open at once, each with their
 * own local copy of the data. To avoid one person's save silently wiping out
 * another person's edit made a moment earlier:
 * 1. Every save re-fetches the latest remote value first and replays the
 *    local edits on top of it, instead of blindly overwriting the server
 *    with a possibly stale local snapshot.
 * 2. Because two saves can still start their own re-fetch within the same
 *    brief window (a few hundred ms) and race each other, a short
 *    reconciliation check runs ~2s after every save: it re-fetches once
 *    more and, if this browser's own last edits are no longer reflected
 *    (overwritten by someone else's concurrent save), re-applies and saves
 *    them again. */
export function useSharedData<T>(key: string, initial: T) {
  const [data, setDataState] = useState<T>(initial);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconcileTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingUpdaters = useRef<Array<(prev: T) => T>>([]);
  const lastAppliedUpdaters = useRef<Array<(prev: T) => T>>([]);
  const isSaving = useRef(false);
  // Guards the initial fetch: if the user already started editing before it
  // resolves, don't clobber what they typed with the (now stale) snapshot.
  const editedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/store/${key}`, { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((remote) => {
        if (cancelled) return;
        if (!editedRef.current && remote !== null && remote !== undefined) {
          setDataState(remote as T);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  function scheduleReconcile() {
    if (reconcileTimer.current) clearTimeout(reconcileTimer.current);
    reconcileTimer.current = setTimeout(() => {
      void reconcile();
    }, 2000);
  }

  async function reconcile() {
    // A newer edit or save already supersedes this check.
    if (lastAppliedUpdaters.current.length === 0) return;
    if (isSaving.current || pendingUpdaters.current.length > 0) return;
    try {
      const res = await fetch(`/api/store/${key}`, { cache: "no-store" });
      const remote = res.ok ? await res.json() : null;
      if (remote === null || remote === undefined) return;
      let reconciled = remote as T;
      for (const u of lastAppliedUpdaters.current) reconciled = u(reconciled);
      if (JSON.stringify(reconciled) !== JSON.stringify(remote)) {
        setDataState(reconciled);
        await fetch(`/api/store/${key}`, {
          method: "PUT",
          body: JSON.stringify(reconciled),
        });
      }
    } catch {
      // best effort — give up silently rather than loop forever
    } finally {
      lastAppliedUpdaters.current = [];
    }
  }

  async function runSave() {
    if (isSaving.current) return; // already mid-save; finally-block below re-triggers
    const updaters = pendingUpdaters.current;
    if (updaters.length === 0) return;
    pendingUpdaters.current = [];
    isSaving.current = true;
    try {
      let base: T = data;
      try {
        const res = await fetch(`/api/store/${key}`, { cache: "no-store" });
        const remote = res.ok ? await res.json() : null;
        if (remote !== null && remote !== undefined) base = remote as T;
      } catch {
        // couldn't refresh — fall back to our own local copy as the base
      }
      for (const u of updaters) base = u(base);
      setDataState(base);
      await fetch(`/api/store/${key}`, {
        method: "PUT",
        body: JSON.stringify(base),
      });
      lastAppliedUpdaters.current = [...lastAppliedUpdaters.current, ...updaters];
      scheduleReconcile();
    } catch {
      // network hiccup: put the edits back in the queue, retried below
      pendingUpdaters.current = [...updaters, ...pendingUpdaters.current];
    } finally {
      isSaving.current = false;
      if (pendingUpdaters.current.length > 0) scheduleSave();
    }
  }

  function scheduleSave() {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => {
      void runSave();
    }, 600);
  }

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
      if (reconcileTimer.current) clearTimeout(reconcileTimer.current);
    };
  }, []);

  function setData(value: React.SetStateAction<T>) {
    editedRef.current = true;
    const updater: (prev: T) => T =
      typeof value === "function" ? (value as (prev: T) => T) : () => value;
    pendingUpdaters.current.push(updater);
    setDataState((prev) => updater(prev));
    scheduleSave();
  }

  return [data, setData] as const;
}
