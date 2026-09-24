"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import SearchBar from "@/components/SearchBar";
import { cn } from "@/lib/utils";
import { useSharedData } from "@/lib/useSharedData";
import { isGroupActive } from "@/lib/data";
import type { CommentsByDay, Day, Group, GroupComment } from "@/lib/data";

const SPECIALTIES = [
  { key: "rh" as const, label: "RH", dot: "bg-success", text: "text-success" },
  { key: "cacg" as const, label: "CACG", dot: "bg-accent", text: "text-accent" },
  { key: "fi" as const, label: "FI", dot: "bg-info", text: "text-info" },
];

export default function CommentsBoard({
  initialComments,
  groups,
  days,
}: {
  initialComments: CommentsByDay;
  groups: Group[];
  days: Day[];
}) {
  const [byDay, setByDay] = useSharedData<CommentsByDay>(
    "comments",
    initialComments,
    (v) => typeof v === "object" && v !== null && !Array.isArray(v)
  );
  const [activeDay, setActiveDay] = useState(days[0]?.key ?? "");
  const [query, setQuery] = useState("");

  const entries: GroupComment[] = byDay[activeDay] ?? [];

  function update(groupId: string, specialty: "rh" | "cacg" | "fi", value: string) {
    setByDay((prev) => {
      const dayEntries = prev[activeDay] ?? [];
      const next = dayEntries.map((e) =>
        e.groupId === groupId ? { ...e, [specialty]: value } : e
      );
      return { ...prev, [activeDay]: next };
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
      {/* Sous-onglets jour, propres aux commentaires */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => (
          <button
            key={d.key}
            onClick={() => setActiveDay(d.key)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
              activeDay === d.key
                ? "bg-accent text-ink"
                : "border border-border bg-surface text-foreground/80 hover:bg-foreground/5"
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

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
              const active = !group || isGroupActive(group);
              return (
                <tr
                  key={e.groupId}
                  className={cn(
                    "border-t border-border",
                    i % 2 === 1 && "bg-foreground/[0.02]",
                    !active && "opacity-40"
                  )}
                >
                  <td className="sticky left-0 z-10 bg-surface px-4 py-2.5 align-top font-medium text-foreground">
                    {group?.name ?? e.groupId}
                    {!active && (
                      <Badge tone="neutral" className="ml-2 align-middle">
                        Fermé
                      </Badge>
                    )}
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
          const active = !group || isGroupActive(group);
          return (
            <Card key={e.groupId} className={cn(!active && "opacity-40")}>
              <p className="mb-3 text-sm font-semibold text-foreground">
                {group?.name ?? e.groupId}
                {!active && (
                  <Badge tone="neutral" className="ml-2 align-middle">
                    Fermé
                  </Badge>
                )}
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
        Sauvegarde automatique, partagée avec toute l&apos;équipe en temps réel.
      </p>
    </div>
  );
}
