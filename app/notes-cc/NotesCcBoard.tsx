"use client";

import { useState } from "react";
import Card from "@/components/Card";
import Badge from "@/components/Badge";
import SearchBar from "@/components/SearchBar";
import { cn } from "@/lib/utils";
import { useSharedData } from "@/lib/useSharedData";
import {
  CACG_CHALLENGES,
  cacgTotal,
  FI_LIVRABLE_JOURS,
  FI_LIVRABLE_MAX,
  fiTotal,
  isGroupActive,
  type CacgChallengeKey,
  type FiLivrableJour,
  type Group,
  type NotesCcEntry,
  type SpecialtyNote,
} from "@/lib/data";

const JOUR_LABEL: Record<FiLivrableJour, string> = {
  lundi: "Lun",
  mardi: "Mar",
  mercredi: "Mer",
  jeudi: "Jeu",
};

const RH_SPECIALTY = { key: "rh" as const, label: "RH", dot: "bg-success", text: "text-success" };

export default function NotesCcBoard({
  entries: initialEntries,
  groups,
}: {
  entries: NotesCcEntry[];
  groups: Group[];
}) {
  const [entries, setEntries] = useSharedData<NotesCcEntry[]>(
    "notes-cc",
    initialEntries,
    Array.isArray
  );
  const [query, setQuery] = useState("");

  function updateRh(groupId: string, field: keyof SpecialtyNote, value: string) {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.groupId !== groupId) return e;
        const next: SpecialtyNote =
          field === "note"
            ? { ...e.rh, note: value === "" ? null : Number(value) }
            : { ...e.rh, commentaire: value };
        return { ...e, rh: next };
      })
    );
  }

  function updateCacgChallenge(groupId: string, key: CacgChallengeKey, value: string) {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.groupId !== groupId) return e;
        const num = value === "" ? null : Number(value);
        return {
          ...e,
          cacg: { ...e.cacg, scores: { ...e.cacg.scores, [key]: num } },
        };
      })
    );
  }

  function updateCacgComment(groupId: string, value: string) {
    setEntries((prev) =>
      prev.map((e) =>
        e.groupId === groupId ? { ...e, cacg: { ...e.cacg, commentaire: value } } : e
      )
    );
  }

  function updateFiLivrable(groupId: string, jour: FiLivrableJour, value: string) {
    setEntries((prev) =>
      prev.map((e) => {
        if (e.groupId !== groupId) return e;
        const num = value === "" ? null : Number(value);
        return {
          ...e,
          fi: { ...e.fi, livrables: { ...e.fi.livrables, [jour]: num } },
        };
      })
    );
  }

  function updateFiComment(groupId: string, value: string) {
    setEntries((prev) =>
      prev.map((e) => (e.groupId === groupId ? { ...e, fi: { ...e.fi, commentaire: value } } : e))
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
        <table className="w-full min-w-[1100px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink text-foreground">
              <th className="sticky left-0 z-10 bg-ink px-4 py-3 text-left font-semibold">
                Groupe
              </th>
              <th className="border-l border-border/50 px-4 py-3 text-left font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-info" />
                  FI — 4 livrables (/5 chacun, /20 au total)
                </span>
              </th>
              <th className="border-l border-border/50 px-4 py-3 text-left font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-accent" />
                  CACG — 3 challenges (/20, /15, /10), ramenés sur 20
                </span>
              </th>
              <th colSpan={2} className="border-l border-border/50 px-4 py-3 text-left font-semibold">
                <span className="inline-flex items-center gap-1.5">
                  <span className={cn("h-2 w-2 rounded-full", RH_SPECIALTY.dot)} />
                  {RH_SPECIALTY.label}
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((e, i) => {
              const group = groups.find((g) => g.id === e.groupId);
              const active = !group || isGroupActive(group);
              const total = fiTotal(e.fi);
              return (
                <tr
                  key={e.groupId}
                  className={cn(
                    i % 2 === 1 && "bg-foreground/[0.02]",
                    "border-t border-border",
                    !active && "opacity-40"
                  )}
                >
                  <td className="sticky left-0 z-10 bg-surface px-4 py-2.5 font-medium text-foreground">
                    {group?.name ?? e.groupId}
                    {!active && (
                      <Badge tone="neutral" className="ml-2 align-middle">
                        Fermé
                      </Badge>
                    )}
                  </td>
                  <td className="border-l border-border/30 px-4 py-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {FI_LIVRABLE_JOURS.map((jour) => (
                        <div key={jour} className="flex flex-col items-center">
                          <span className="mb-0.5 text-[10px] font-medium uppercase text-muted">
                            {JOUR_LABEL[jour]}
                          </span>
                          <input
                            type="number"
                            min={0}
                            max={FI_LIVRABLE_MAX}
                            step={0.5}
                            value={e.fi.livrables[jour] ?? ""}
                            onChange={(ev) => updateFiLivrable(e.groupId, jour, ev.target.value)}
                            placeholder="—"
                            className="w-12 rounded-lg border border-border bg-surface px-1.5 py-1.5 text-center text-sm font-semibold text-info outline-none focus:border-accent"
                          />
                        </div>
                      ))}
                      <span className="ml-1 whitespace-nowrap rounded-lg bg-info/10 px-2.5 py-1.5 text-sm font-semibold text-info">
                        {total} / 20
                      </span>
                    </div>
                    <input
                      type="text"
                      value={e.fi.commentaire}
                      onChange={(ev) => updateFiComment(e.groupId, ev.target.value)}
                      placeholder="Commentaire..."
                      className="mt-1.5 w-full min-w-[12rem] rounded-lg border border-border bg-surface px-2 py-1.5 text-xs outline-none focus:border-accent"
                    />
                  </td>
                  <td className="border-l border-border/30 px-4 py-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {CACG_CHALLENGES.map((c) => (
                        <div key={c.key} className="flex flex-col items-center">
                          <span className="mb-0.5 text-[10px] font-medium uppercase text-muted">
                            /{c.max}
                          </span>
                          <input
                            type="number"
                            min={0}
                            max={c.max}
                            step={0.5}
                            value={e.cacg.scores[c.key] ?? ""}
                            onChange={(ev) => updateCacgChallenge(e.groupId, c.key, ev.target.value)}
                            placeholder="—"
                            className="w-12 rounded-lg border border-border bg-surface px-1.5 py-1.5 text-center text-sm font-semibold text-accent outline-none focus:border-accent"
                          />
                        </div>
                      ))}
                      <span className="ml-1 whitespace-nowrap rounded-lg bg-accent/10 px-2.5 py-1.5 text-sm font-semibold text-accent">
                        {cacgTotal(e.cacg)} / 20
                      </span>
                    </div>
                    <input
                      type="text"
                      value={e.cacg.commentaire}
                      onChange={(ev) => updateCacgComment(e.groupId, ev.target.value)}
                      placeholder="Commentaire..."
                      className="mt-1.5 w-full min-w-[12rem] rounded-lg border border-border bg-surface px-2 py-1.5 text-xs outline-none focus:border-accent"
                    />
                  </td>
                  <td colSpan={2} className="border-l border-border/30 px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={0}
                        max={20}
                        value={e.rh.note ?? ""}
                        onChange={(ev) => updateRh(e.groupId, "note", ev.target.value)}
                        placeholder="—"
                        className={cn(
                          "w-14 shrink-0 rounded-lg border border-border bg-surface px-2 py-1.5 text-center font-semibold outline-none focus:border-accent",
                          RH_SPECIALTY.text
                        )}
                      />
                      <input
                        type="text"
                        value={e.rh.commentaire}
                        onChange={(ev) => updateRh(e.groupId, "commentaire", ev.target.value)}
                        placeholder="Commentaire..."
                        className="w-full min-w-[10rem] rounded-lg border border-border bg-surface px-2 py-1.5 text-xs outline-none focus:border-accent"
                      />
                    </div>
                  </td>
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
          const active = !group || isGroupActive(group);
          const total = fiTotal(e.fi);
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
                <div className="rounded-xl border border-info/40 border-l-4 px-3 py-2.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-info">
                      <span className="h-2 w-2 rounded-full bg-info" />
                      FI
                    </span>
                    <span className="rounded-lg bg-info/10 px-2 py-1 text-xs font-semibold text-info">
                      {total} / 20
                    </span>
                  </div>
                  <div className="mb-2 grid grid-cols-4 gap-1.5">
                    {FI_LIVRABLE_JOURS.map((jour) => (
                      <div key={jour} className="flex flex-col items-center">
                        <span className="mb-0.5 text-[10px] font-medium uppercase text-muted">
                          {JOUR_LABEL[jour]}
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={FI_LIVRABLE_MAX}
                          step={0.5}
                          value={e.fi.livrables[jour] ?? ""}
                          onChange={(ev) => updateFiLivrable(e.groupId, jour, ev.target.value)}
                          placeholder="—"
                          className="w-full rounded-lg border border-border bg-surface px-1 py-1 text-center text-sm font-semibold text-info outline-none focus:border-accent"
                        />
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={e.fi.commentaire}
                    onChange={(ev) => updateFiComment(e.groupId, ev.target.value)}
                    placeholder="Commentaire..."
                    className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-xs outline-none focus:border-accent"
                  />
                </div>
                <div className="rounded-xl border border-accent/40 border-l-4 px-3 py-2.5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-accent">
                      <span className="h-2 w-2 rounded-full bg-accent" />
                      CACG
                    </span>
                    <span className="rounded-lg bg-accent/10 px-2 py-1 text-xs font-semibold text-accent">
                      {cacgTotal(e.cacg)} / 20
                    </span>
                  </div>
                  <div className="mb-2 grid grid-cols-3 gap-1.5">
                    {CACG_CHALLENGES.map((c) => (
                      <div key={c.key} className="flex flex-col items-center">
                        <span className="mb-0.5 text-[10px] font-medium uppercase text-muted">
                          /{c.max}
                        </span>
                        <input
                          type="number"
                          min={0}
                          max={c.max}
                          step={0.5}
                          value={e.cacg.scores[c.key] ?? ""}
                          onChange={(ev) => updateCacgChallenge(e.groupId, c.key, ev.target.value)}
                          placeholder="—"
                          className="w-full rounded-lg border border-border bg-surface px-1 py-1 text-center text-sm font-semibold text-accent outline-none focus:border-accent"
                        />
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={e.cacg.commentaire}
                    onChange={(ev) => updateCacgComment(e.groupId, ev.target.value)}
                    placeholder="Commentaire..."
                    className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-xs outline-none focus:border-accent"
                  />
                </div>
                <div
                  className="rounded-xl border border-border px-3 py-2.5"
                  style={{ borderLeftWidth: 4 }}
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className={cn("inline-flex items-center gap-1.5 text-xs font-semibold", RH_SPECIALTY.text)}>
                      <span className={cn("h-2 w-2 rounded-full", RH_SPECIALTY.dot)} />
                      {RH_SPECIALTY.label}
                    </span>
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={e.rh.note ?? ""}
                      onChange={(ev) => updateRh(e.groupId, "note", ev.target.value)}
                      placeholder="—"
                      className="w-14 rounded-lg border border-border bg-surface px-2 py-1 text-center text-sm font-semibold outline-none focus:border-accent"
                    />
                  </div>
                  <input
                    type="text"
                    value={e.rh.commentaire}
                    onChange={(ev) => updateRh(e.groupId, "commentaire", ev.target.value)}
                    placeholder="Commentaire..."
                    className="w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-xs outline-none focus:border-accent"
                  />
                </div>
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
