"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import SearchBar from "@/components/SearchBar";
import { cn } from "@/lib/utils";
import type { CommentsByDay, Group, GroupComment } from "@/lib/data";

const STORAGE_KEY = "igrh-week-comments";

const SPECIALTIES = [
  { key: "rh" as const, label: "RH", dot: "bg-success", text: "text-success" },
  { key: "cacg" as const, label: "CACG", dot: "bg-accent", text: "text-accent" },
  { key: "fi" as const, label: "FI", dot: "bg-info", text: "text-info" },
];

function loadStored(initial: CommentsByDay): CommentsByDay {
  if (typeof window === "undefined") return initial;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return initial;
    const parsed = JSON.parse(raw) as CommentsByDay;
    if (typeof parsed !== "object" || parsed === null) return initial;
    return parsed;
  } catch {
    return initial;
  }
}

export default function CommentsBoard({
  initialComments,
  groups,
  day,
}: {
  initialComments: CommentsByDay;
  groups: Group[];
  day: string;
}) {
  const [byDay, setByDay] = useState<CommentsByDay>(initialComments);
  const [query, setQuery] = useState("");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setByDay(loadStored(initialComments));
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(byDay));
  }, [byDay, hydrated]);

  const entries: GroupComment[] = byDay[day] ?? [];

  function update(groupId: string, specialty: "rh" | "cacg" | "fi", value: string) {
    setByDay((prev) => {
      const dayEntries = prev[day] ?? [];
      const next = dayEntries.map((e) =>
        e.groupId === groupId ? { ...e, [specialty]: value } : e
      );
      return { ...prev, [day]: next };
    });
  }

  const q = query.trim().toLowerCase();
  const filtered = entries.filter((e) => {
    if (!q) return true;
    const group = groups.find((g) => g.id === e.groupId);
    return e.groupId.toLowerCase().includes(q) || group?.name.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-5">
      <SearchBar value={query} onChange={setQuery} placeholder="Rechercher un groupe..." />

      {/* Desktop : tableau unique */}
      <div className="hidden overflow-x-auto rounded-2xl border border-border md:block">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink text-foreground">
              <th className="sticky left-0 z-10 bg-ink px-4 py-3 text-left font-semibold">
                Groupe
              </th>
              {SPECIALTIES.map((sp) => (
                <th
                  key={sp.key}
                  className="border-l border-border/50 px-4 py-3 text-left font-semibold"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <span className={cn("h-2 w-2 rounded-full", sp.dot)} />
                    {sp.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => {
              const group = groups.find((g) => g.id === e.groupId);
              return (
                <tr
                  key={e.groupId}
                  className={cn("border-t border-border", i % 2 === 1 && "bg-foreground/[0.02]")}
                >
                  <td className="sticky left-0 z-10 bg-surface px-4 py-2.5 align-top font-medium text-foreground">
                    {group?.name ?? e.groupId}
                  </td>
                  {SPECIALTIES.map((sp) => (
                    <td key={sp.key} className="border-l border-border/30 px-4 py-2.5 align-top">
                      <textarea
                        value={e[sp.key]}
                        onChange={(ev) => update(e.groupId, sp.key, ev.target.value)}
                        placeholder="Commentaire..."
                        rows={2}
                        className="w-full min-w-[12rem] resize-y rounded-lg border border-border bg-surface px-2 py-1.5 text-xs outline-none focus:border-accent"
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile : cartes empilées */}
      <div className="space-y-3 md:hidden">
        {filtered.map((e) => {
          const group = groups.find((g) => g.id === e.groupId);
          return (
            <Card key={e.groupId}>
              <p className="mb-3 text-sm font-semibold text-foreground">
                {group?.name ?? e.groupId}
              </p>
              <div className="space-y-3">
                {SPECIALTIES.map((sp) => (
                  <div
                    key={sp.key}
                    className="rounded-xl border border-border px-3 py-2.5"
                    style={{ borderLeftWidth: 4 }}
                  >
                    <span
                      className={cn(
                        "mb-1.5 inline-flex items-center gap-1.5 text-xs font-semibold",
                        sp.text
                      )}
                    >
                      <span className={cn("h-2 w-2 rounded-full", sp.dot)} />
                      {sp.label}
                    </span>
                    <textarea
                      value={e[sp.key]}
                      onChange={(ev) => update(e.groupId, sp.key, ev.target.value)}
                      placeholder="Commentaire..."
                      rows={2}
                      className="w-full resize-y rounded-lg border border-border bg-surface px-2 py-1.5 text-xs outline-none focus:border-accent"
                    />
                  </div>
                ))}
              </div>
            </Card>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-muted">Aucun résultat pour « {query} ».</p>
      )}

      <p className="text-xs text-muted">
        La saisie est enregistrée dans ce navigateur uniquement (pas partagée entre
        appareils). Pour la conserver durablement, reportez-la dans{" "}
        <code className="rounded bg-foreground/5 px-1 py-0.5">data/comments.json</code>.
      </p>
    </div>
  );
}
