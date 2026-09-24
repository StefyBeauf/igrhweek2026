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
 *    them again.
 * 3. The Apps Script backend has occasionally returned HTTP 200 with a body
 *    that doesn't match the expected shape (e.g. `{}` instead of an array)
 *    while it's having trouble — treating that as real data crashed the
 *    page for everyone (`.filter is not a function`). `isValid`, when
 *    given, rejects malformed remote payloads the same way a network
 *    error would: the load/save is retried instead of adopted. */
export function useSharedData<T>(
  key: string,
  initial: T,
  isValid?: (value: unknown) => boolean
) {
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
    let attempt = 0;

    function load() {
      fetch(`/api/store/${key}`, { cache: "no-store" })
        .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`status ${res.status}`))))
        .then((remote) => {
          if (cancelled) return;
          if (
            !editedRef.current &&
            remote !== null &&
            remote !== undefined &&
            (!isValid || isValid(remote))
          ) {
            setDataState(remote as T);
          }
        })
        .catch(() => {
          // Upstream (Apps Script) can be transiently locked/slow under
          // concurrent load — retry a few times before giving up, rather
          // than silently leaving `data` on the empty initial template
          // (which a later save could then use as its base and wipe
          // everyone else's shared content).
          if (cancelled || editedRef.current) return;
          attempt += 1;
          if (attempt <= 4) setTimeout(load, 1500 * attempt);
        });
    }
    load();

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
      if (!res.ok) return;
      const remote = await res.json();
      if (remote === null || remote === undefined) return;
      if (isValid && !isValid(remote)) return;
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
      // The remote value is the ONLY safe base to save on top of. Never
      // fall back to our own local `data` here: if this browser's copy is
      // stale (e.g. tab left open a while, or its own initial load never
      // completed), saving it as the base would silently overwrite real
      // shared content that other formateurs already wrote for other
      // groups/days. If the refresh fails, requeue and retry instead.
      const res = await fetch(`/api/store/${key}`, { cache: "no-store" });
      if (!res.ok) throw new Error(`status ${res.status}`);
      const remote = await res.json();
      if (remote === null || remote === undefined) throw new Error("empty remote");
      // A malformed remote payload (e.g. `{}` from a struggling Apps
      // Script call) must never become the save base — that would PUT a
      // near-empty object back and erase everyone's real data.
      if (isValid && !isValid(remote)) throw new Error("malformed remote");
      let base: T = remote as T;
      for (const u of updaters) base = u(base);
      setDataState(base);
      await fetch(`/api/store/${key}`, {
        method: "PUT",
        body: JSON.stringify(base),
      });
      lastAppliedUpdaters.current = [...lastAppliedUpdaters.current, ...updaters];
      scheduleReconcile();
    } catch {
      // network hiccup or upstream lock: put the edits back in the queue,
      // retried below — never save a possibly-stale local base instead.
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
