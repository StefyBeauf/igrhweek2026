"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import { cn } from "@/lib/utils";
import { useSharedData } from "@/lib/useSharedData";
import {
  PARTIEL_CRITERES,
  PARTIEL_MAX_TOTAL,
  partielTotal,
  type CritereKey,
  type Group,
  type PartielEvaluation,
} from "@/lib/data";

const TABS = ["Saisie", "Vue synthétique"] as const;
type Tab = (typeof TABS)[number];

export default function PartielBoard({
  evaluations: initialEvaluations,
  groups,
}: {
  evaluations: PartielEvaluation[];
  groups: Group[];
}) {
  const [evaluations, setEvaluations] = useSharedData<PartielEvaluation[]>(
    "partiel",
    initialEvaluations
  );
  const [tab, setTab] = useState<Tab>("Saisie");
  const [activeGroupId, setActiveGroupId] = useState(groups[0]?.id ?? "");
  const [savedFlash, setSavedFlash] = useState(false);

  const active = evaluations.find((e) => e.groupId === activeGroupId);

  function setScore(critere: CritereKey, value: number) {
    setEvaluations((prev) =>
      prev.map((e) =>
        e.groupId === activeGroupId
          ? { ...e, scores: { ...e.scores, [critere]: value } }
          : e
      )
    );
  }

  function setCommentaire(texte: string) {
    setEvaluations((prev) =>
      prev.map((e) => (e.groupId === activeGroupId ? { ...e, commentaire: texte } : e))
    );
  }

  function handleSave() {
    setEvaluations((prev) =>
      prev.map((e) => (e.groupId === activeGroupId ? { ...e, evalue: true } : e))
    );
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1600);
  }

  const synthese = useMemo(() => {
    return evaluations
      .map((e) => ({
        ...e,
        group: groups.find((g) => g.id === e.groupId),
        total: e.evalue ? partielTotal(e.scores) : null,
      }))
      .sort((a, b) => {
        if (a.total === null && b.total === null) return 0;
        if (a.total === null) return 1;
        if (b.total === null) return -1;
        return b.total - a.total;
      });
  }, [evaluations, groups]);

  return (
    <div className="space-y-5">
      <div className="flex gap-1 overflow-x-auto border-b border-border pb-px">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition",
              tab === t
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Saisie" && (
        <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
          <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {groups.map((g) => {
              const ev = evaluations.find((e) => e.groupId === g.id);
              return (
                <button
                  key={g.id}
                  onClick={() => setActiveGroupId(g.id)}
                  className={cn(
                    "flex shrink-0 items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition lg:shrink",
                    activeGroupId === g.id
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border bg-surface text-foreground hover:border-accent/50"
                  )}
                >
                  {g.name}
                  <span
                    className={cn(
                      "h-2 w-2 rounded-full",
                      ev?.evalue ? "bg-success" : "bg-border"
                    )}
                  />
                </button>
              );
            })}
          </div>

          {active && (
            <Card className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-semibold text-foreground">
                  Évaluation — {groups.find((g) => g.id === activeGroupId)?.name}
                </h2>
                {!active.evalue && (
                  <span className="rounded-full bg-warning/10 px-2.5 py-1 text-xs font-medium text-warning">
                    En attente
                  </span>
                )}
              </div>

              <div className="space-y-4">
                {PARTIEL_CRITERES.map((c) => {
                  const value = active.scores[c.key] ?? 0;
                  return (
                    <div key={c.key}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-foreground">{c.label}</span>
                        <span className="text-xs font-medium text-muted">/{c.max}</span>
                      </div>
                      <div className="flex gap-1.5">
                        {Array.from({ length: c.max + 1 }, (_, n) => n).map((n) => (
                          <button
                            key={n}
                            onClick={() => setScore(c.key, n)}
                            aria-label={`${n}/${c.max}`}
                            className={cn(
                              "h-9 flex-1 rounded-lg border text-sm font-medium transition",
                              value === n
                                ? "border-accent bg-accent text-ink"
                                : "border-border bg-surface text-foreground/70 hover:border-accent/50"
                            )}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-accent bg-accent/10 px-4 py-3">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="text-2xl font-semibold text-accent">
                  {partielTotal(active.scores)} / {PARTIEL_MAX_TOTAL}
                </span>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium text-muted">
                  Commentaire du jury
                </label>
                <textarea
                  value={active.commentaire}
                  onChange={(e) => setCommentaire(e.target.value)}
                  rows={3}
                  placeholder="Observations du jury..."
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                />
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleSave}
                  className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-ink hover:opacity-90"
                >
                  Enregistrer
                </button>
                {savedFlash && (
                  <span className="text-sm font-medium text-success">Enregistré ✓</span>
                )}
              </div>
              <p className="text-xs text-muted">
                Sauvegarde automatique, partagée avec toute l&apos;équipe en temps réel.
              </p>
            </Card>
          )}
        </div>
      )}

      {tab === "Vue synthétique" && (
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-ink text-foreground">
                <th className="px-4 py-3 text-left font-semibold">Groupe</th>
                <th className="px-4 py-3 text-left font-semibold">Note finale /20</th>
                <th className="px-4 py-3 text-left font-semibold">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {synthese.map((s, i) => (
                <tr
                  key={s.groupId}
                  onClick={() => {
                    setActiveGroupId(s.groupId);
                    setTab("Saisie");
                  }}
                  className={cn(
                    "cursor-pointer border-t border-border transition hover:bg-accent/5",
                    i % 2 === 1 && "bg-foreground/[0.02]"
                  )}
                >
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {s.group?.name ?? s.groupId}
                  </td>
                  <td className="px-4 py-2.5">
                    {s.total === null ? (
                      <span className="text-xs font-medium text-muted">En attente</span>
                    ) : (
                      <span
                        className={cn(
                          "font-semibold",
                          s.total >= 16 ? "text-accent" : "text-foreground"
                        )}
                      >
                        {s.total} / 20
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-foreground/80">
                    {s.commentaire || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
