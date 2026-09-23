"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import Badge, { specialtyTone } from "@/components/Badge";
import { cn } from "@/lib/utils";
import { useSharedData } from "@/lib/useSharedData";
import SoutenancePlanning from "./SoutenancePlanning";
import {
  defaultPartielStudent,
  isGroupActive,
  PARTIEL_CRITERES,
  PARTIEL_MAX_TOTAL,
  partielTotal,
  studentFinalNote,
  type CritereKey,
  type Group,
  type PartielEvaluation,
  type PartielStudentEval,
  type Soutenance,
} from "@/lib/data";

const TABS = ["Saisie", "Vue synthétique", "Planning"] as const;
type Tab = (typeof TABS)[number];

function formatScore(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",");
}

export default function PartielBoard({
  evaluations: initialEvaluations,
  groups,
  soutenance,
}: {
  evaluations: PartielEvaluation[];
  groups: Group[];
  soutenance: Soutenance;
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

  function toggleHalf(critere: CritereKey, max: number) {
    const raw = active?.scores[critere] ?? 0;
    const base = Math.floor(raw);
    const hasHalf = raw - base === 0.5;
    if (hasHalf) {
      setScore(critere, base);
    } else if (base < max) {
      setScore(critere, base + 0.5);
    }
  }

  function setCommentaire(texte: string) {
    setEvaluations((prev) =>
      prev.map((e) => (e.groupId === activeGroupId ? { ...e, commentaire: texte } : e))
    );
  }

  function updateStudent(studentName: string, patch: Partial<PartielStudentEval>) {
    setEvaluations((prev) =>
      prev.map((e) => {
        if (e.groupId !== activeGroupId) return e;
        const existing = e.etudiants ?? [];
        const idx = existing.findIndex((s) => s.name === studentName);
        const etudiants =
          idx >= 0
            ? existing.map((s, i) => (i === idx ? { ...s, ...patch } : s))
            : [...existing, { ...defaultPartielStudent(studentName), ...patch }];
        return { ...e, etudiants };
      })
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
              const active = isGroupActive(g);
              return (
                <button
                  key={g.id}
                  onClick={() => setActiveGroupId(g.id)}
                  className={cn(
                    "flex shrink-0 items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left text-sm font-medium transition lg:shrink",
                    activeGroupId === g.id
                      ? "border-accent bg-accent/15 text-accent"
                      : "border-border bg-surface text-foreground hover:border-accent/50",
                    !active && "opacity-40"
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
              {(() => {
                const g = groups.find((g) => g.id === activeGroupId);
                return g && !isGroupActive(g) ? (
                  <p className="rounded-xl border border-border bg-foreground/5 px-3 py-2 text-xs text-muted">
                    Ce groupe n&apos;existe plus — conservé pour l&apos;historique.
                  </p>
                ) : null;
              })()}

              <div className="space-y-4">
                {PARTIEL_CRITERES.map((c) => {
                  const value = active.scores[c.key] ?? 0;
                  const base = Math.floor(value);
                  const hasHalf = value - base === 0.5;
                  return (
                    <div key={c.key}>
                      <div className="mb-1.5 flex items-center justify-between text-sm">
                        <span className="text-foreground">{c.label}</span>
                        <span className="text-xs font-medium text-muted">
                          {formatScore(value)} / {c.max}
                        </span>
                      </div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {Array.from({ length: c.max + 1 }, (_, n) => n).map((n) => (
                          <button
                            key={n}
                            onClick={() => setScore(c.key, hasHalf && n < c.max ? n + 0.5 : n)}
                            aria-label={`${n}/${c.max}`}
                            className={cn(
                              "h-9 flex-1 rounded-lg border text-sm font-medium transition",
                              base === n
                                ? "border-accent bg-accent text-ink"
                                : "border-border bg-surface text-foreground/70 hover:border-accent/50"
                            )}
                          >
                            {n}
                          </button>
                        ))}
                        <button
                          onClick={() => toggleHalf(c.key, c.max)}
                          disabled={base >= c.max && !hasHalf}
                          aria-label="Ajouter un demi-point"
                          className={cn(
                            "h-9 shrink-0 rounded-lg border px-3 text-sm font-medium transition",
                            hasHalf
                              ? "border-accent bg-accent text-ink"
                              : "border-border bg-surface text-foreground/70 hover:border-accent/50 disabled:cursor-not-allowed disabled:opacity-40"
                          )}
                        >
                          + ½
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center justify-between rounded-xl border border-accent bg-accent/10 px-4 py-3">
                <span className="text-sm font-medium text-foreground">Total</span>
                <span className="text-2xl font-semibold text-accent">
                  {formatScore(partielTotal(active.scores))} / {PARTIEL_MAX_TOTAL}
                </span>
              </div>

              {(() => {
                const g = groups.find((g) => g.id === activeGroupId);
                if (!g) return null;
                const commonTotal = partielTotal(active.scores);
                return (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-foreground">
                      Présences &amp; notes individuelles
                    </h3>
                    <p className="mb-3 text-xs text-muted">
                      Décoché = absent, note forcée à 0. Coché sans note individuelle = note
                      commune ci-dessus.
                    </p>
                    <ul className="space-y-2.5">
                      {g.students.map((s) => {
                        const se =
                          (active.etudiants ?? []).find((x) => x.name === s.name) ??
                          defaultPartielStudent(s.name);
                        const finalNote = studentFinalNote(commonTotal, se);
                        return (
                          <li key={s.name} className="rounded-xl border border-border px-3 py-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <label className="flex items-center gap-2 text-sm">
                                <input
                                  type="checkbox"
                                  checked={se.present}
                                  onChange={(ev) =>
                                    updateStudent(s.name, { present: ev.target.checked })
                                  }
                                  className="h-4 w-4 accent-accent"
                                />
                                <span className="text-foreground">{s.name}</span>
                                <Badge tone={specialtyTone(s.specialty)}>{s.specialty}</Badge>
                              </label>
                              <span
                                className={cn(
                                  "text-sm font-semibold",
                                  se.present ? "text-accent" : "text-muted"
                                )}
                              >
                                {formatScore(finalNote)} / 20
                              </span>
                            </div>
                            {se.present && (
                              <div className="mt-2 flex items-center gap-2">
                                <label className="text-xs text-muted">Note individuelle</label>
                                <input
                                  type="number"
                                  min={0}
                                  max={20}
                                  step={0.5}
                                  value={se.noteOverride ?? ""}
                                  placeholder={formatScore(commonTotal)}
                                  onChange={(ev) =>
                                    updateStudent(s.name, {
                                      noteOverride:
                                        ev.target.value === "" ? null : Number(ev.target.value),
                                    })
                                  }
                                  className="w-20 rounded-lg border border-border bg-surface px-2 py-1 text-center text-sm outline-none focus:border-accent"
                                />
                              </div>
                            )}
                            <input
                              type="text"
                              value={se.commentaire}
                              onChange={(ev) =>
                                updateStudent(s.name, { commentaire: ev.target.value })
                              }
                              placeholder="Commentaire individuel..."
                              className="mt-2 w-full rounded-lg border border-border bg-surface px-2 py-1.5 text-xs outline-none focus:border-accent"
                            />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                );
              })()}

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
              {synthese.map((s, i) => {
                const active = !s.group || isGroupActive(s.group);
                return (
                <tr
                  key={s.groupId}
                  onClick={() => {
                    setActiveGroupId(s.groupId);
                    setTab("Saisie");
                  }}
                  className={cn(
                    "cursor-pointer border-t border-border transition hover:bg-accent/5",
                    i % 2 === 1 && "bg-foreground/[0.02]",
                    !active && "opacity-40"
                  )}
                >
                  <td className="px-4 py-2.5 font-medium text-foreground">
                    {s.group?.name ?? s.groupId}
                    {!active && (
                      <Badge tone="neutral" className="ml-2 align-middle">
                        Fermé
                      </Badge>
                    )}
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
                        {formatScore(s.total)} / 20
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-foreground/80">
                    {s.commentaire || "—"}
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {tab === "Planning" && <SoutenancePlanning soutenance={soutenance} groups={groups} />}
    </div>
  );
}
