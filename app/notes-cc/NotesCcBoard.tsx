"use client";

import { useState } from "react";
import Card from "@/components/Card";
import SearchBar from "@/components/SearchBar";
import { cn } from "@/lib/utils";
import { useSharedData } from "@/lib/useSharedData";
import type { Group, NotesCcEntry, SpecialtyNote } from "@/lib/data";

const SPECIALTIES = [
  { key: "fi" as const, label: "FI", dot: "bg-info", text: "text-info" },
  { key: "cacg" as const, label: "CACG", dot: "bg-accent", text: "text-accent" },
  { key: "rh" as const, label: "RH", dot: "bg-success", text: "text-success" },
];

export default function NotesCcBoard({
  entries: initialEntries,
  groups,
}: {
  entries: NotesCcEntry[];
  groups: Group[];
}) {
  const [entries, setEntries] = useSharedData<NotesCcEntry[]>("notes-cc", initialEntries);
  const [query, setQuery] = useState("");

  function update(
    groupId: string,
    specialty: "fi" | "cacg" | "rh",
    field: keyof SpecialtyNote,
    value: string
  ) {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.groupId !== groupId) return e;
        const current = e[specialty];
        const next: SpecialtyNote =
          field === "note"
            ? { ...current, note: value === "" ? null : Number(value) }
            : { ...current, commentaire: value };
        return { ...e, [specialty]: next };
      })
    );
  }

  const q = query.trim().toLowerCase();
  const filtered = entries.filter((e) => {
    if (!q) return true;
    const group = groups.find((g) => g.id === e.groupId);
    return (
      e.groupId.toLowerCase().includes(q) ||
      group?.name.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-5">
      <SearchBar value={query} onChange={setQuery} placeholder="Rechercher un groupe..." />

      {/* Desktop: tableau unique */}
      <div className="hidden overflow-x-auto rounded-2xl border border-border md:block">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="bg-ink text-foreground">
              <th className="sticky left-0 z-10 bg-ink px-4 py-3 text-left font-semibold">
                Groupe
              </th>
              {SPECIALTIES.map((sp) => (
                <th key={sp.key} colSpan={2} className="px-4 py-3 text-left font-semibold">
                  <span className={cn("inline-flex items-center gap-1.5")}>
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
                  className={cn(i % 2 === 1 && "bg-foreground/[0.02]", "border-t border-border")}
                >
                  <td className="sticky left-0 z-10 bg-surface px-4 py-2.5 font-medium text-foreground">
                    {group?.name ?? e.groupId}
                  </td>
                  {SPECIALTIES.map((sp) => {
                    const value = e[sp.key];
                    return (
                      <td key={sp.key} colSpan={2} className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            max={20}
                            value={value.note ?? ""}
                            onChange={(ev) =>
                              update(e.groupId, sp.key, "note", ev.target.value)
                            }
                            placeholder="—"
                            className={cn(
                              "w-14 shrink-0 rounded-lg border border-border bg-surface px-2 py-1.5 text-center font-semibold outline-none focus:border-accent",
                              sp.text
                            )}
                          />
                          <input
                            type="text"
                            value={value.commentaire}
                            onChange={(ev) =>
                              update(e.groupId, sp.key, "commentaire", ev.target.value)
                            }
                            placeholder="Commentaire..."
                            className="w-full min-w-[10rem] rounded-lg border border-border bg-surface px-2 py-1.5 text-xs outline-none focus:border-accent"
                          />
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile: cartes empilées */}
      <div className="space-y-3 md:hidden">
        {filtered.map((e) => {
          const group = groups.find((g) => g.id === e.groupId);
          return (
            <Card key={e.groupId}>
              <p className="mb-3 text-sm font-semibold text-foreground">
                {group?.name ?? e.groupId}
              </p>
              <div className="space-y-3">
                {SPECIALTIES.map((sp) => {
                  const value = e[sp.key];
                  return (
                    <div
                      key={sp.key}
                      className="rounded-xl border border-border px-3 py-2.5"
                      style={{ borderLeftWidth: 4 }}
                    >
                      <div className="mb-1.5 flex items-center justify-between">
                        <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", sp.text)}>
                          <span className={cn("h-2 w-2 rounded-full", sp.dot)} />
                          {sp.label}
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={20}
                          value={value.note ?? ""}
                          onChange={(ev) => update(e.groupId, sp.key, "note", ev.target.value)}
                          placeholder="—"
                          className="w-14 rounded-lg border border-border bg-surface px-2 py-1 text-center text-sm font-semibold outline-none focus:border-accent"
                        />
                      </div>
                      <input
                        type="text"
                        value={value.commentaire}
                        onChange={(ev) =>
                          update(e.groupId, sp.key, "commentaire", ev.target.value)
                        }
                        placeholder="Commentaire..."
                        className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-xs outline-none focus:border-accent"
                      />
                    </div>
                  );
                })}
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
