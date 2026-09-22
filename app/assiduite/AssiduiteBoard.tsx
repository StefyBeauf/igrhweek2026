"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import Badge, { specialtyTone, statusTone } from "@/components/Badge";
import { cn } from "@/lib/utils";
import {
  alertLevelFor,
  latestCheck,
  type AlertLevel,
  type AttendanceEntry,
  type Day,
  type Group,
  type Specialty,
} from "@/lib/data";

const LEVEL_LABEL: Record<AlertLevel, string> = {
  normal: "Normal",
  vigilance: "Vigilance",
  alerte: "Alerte",
};

const SPECIALTIES: Specialty[] = ["RH", "CACG", "FI"];

const SPECIALTY_STYLE: Record<Specialty, { text: string; border: string; bg: string }> = {
  RH: { text: "text-success", border: "border-success", bg: "bg-success/10" },
  CACG: { text: "text-accent", border: "border-accent", bg: "bg-accent/10" },
  FI: { text: "text-info", border: "border-info", bg: "bg-info/10" },
};

/** Taux de présence cumulé depuis le début de la semaine (lundi) jusqu'à
 * aujourd'hui inclus, sur l'ensemble des pointages QR code déjà enregistrés
 * (jusqu'à 4 par jour) — les jours pas encore arrivés ne comptent pas, ils
 * ne contiennent que des données de gabarit, pas de vrais pointages. */
function presenceRate(
  attendance: Record<string, Record<string, AttendanceEntry[]>>,
  elapsedDays: Day[],
  groupId: string,
  name: string
): number | null {
  let present = 0;
  let total = 0;
  for (const d of elapsedDays) {
    const entry = attendance[d.key]?.[groupId]?.find((r) => r.name === name);
    if (!entry) continue;
    for (const c of entry.checks) {
      total++;
      if (c === "Présent") present++;
    }
  }
  return total > 0 ? Math.round((present / total) * 100) : null;
}

function suggestGroups(specialty: Specialty, groups: Group[]) {
  return groups
    .map((g) => {
      const count = g.students.filter((s) => s.specialty === specialty).length;
      return { group: g, count, total: g.students.length, missing: count === 0 };
    })
    .sort((a, b) => {
      if (a.missing !== b.missing) return a.missing ? -1 : 1;
      if (a.total !== b.total) return a.total - b.total;
      return a.group.id.localeCompare(b.group.id);
    });
}

const LEVEL_DOT: Record<AlertLevel, string> = {
  normal: "bg-success",
  vigilance: "bg-warning",
  alerte: "bg-danger",
};

const LEVEL_ORDER: Record<AlertLevel, number> = {
  alerte: 0,
  vigilance: 1,
  normal: 2,
};

export default function AssiduiteBoard({
  attendance,
  groups,
  days,
  defaultDay,
}: {
  attendance: Record<string, Record<string, AttendanceEntry[]>>;
  groups: Group[];
  days: Day[];
  defaultDay: string;
}) {
  const [activeDay, setActiveDay] = useState(defaultDay);
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null);
  const [lateSpecialty, setLateSpecialty] = useState<Specialty | null>(null);

  // Jours déjà passés (lundi → aujourd'hui inclus) : seuls ceux-ci ont de
  // vrais pointages, les jours à venir ne contiennent qu'un gabarit vide.
  const todayIndex = days.findIndex((d) => d.key === defaultDay);
  const elapsedDays = todayIndex >= 0 ? days.slice(0, todayIndex + 1) : days;

  const suggestions = useMemo(
    () => (lateSpecialty ? suggestGroups(lateSpecialty, groups).slice(0, 3) : []),
    [lateSpecialty, groups]
  );

  const stats = useMemo(() => {
    const dayData = attendance[activeDay] ?? {};
    return groups
      .map((g) => {
        const entries = dayData[g.id] ?? [];
        const present = entries.filter((e) => latestCheck(e) === "Présent").length;
        const absent = entries.filter((e) => latestCheck(e) === "Absent").length;
        const retard = entries.filter((e) => latestCheck(e) === "Retard").length;
        return {
          groupId: g.id,
          groupName: g.name,
          entries,
          present,
          absent,
          retard,
          level: alertLevelFor(absent, retard),
        };
      })
      .sort((a, b) => LEVEL_ORDER[a.level] - LEVEL_ORDER[b.level]);
  }, [attendance, activeDay, groups]);

  const counts = useMemo(() => {
    return stats.reduce(
      (acc, s) => {
        acc[s.level]++;
        return acc;
      },
      { normal: 0, vigilance: 0, alerte: 0 } as Record<AlertLevel, number>
    );
  }, [stats]);

  const selected = stats.find((s) => s.groupId === selectedGroupId) ?? null;
  const selectedGroup = groups.find((g) => g.id === selectedGroupId) ?? null;

  function selectDay(day: string) {
    setActiveDay(day);
    setSelectedGroupId(null);
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => (
          <button
            key={d.key}
            onClick={() => selectDay(d.key)}
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

      {/* Module 2 — Dashboard assiduité : lecture en 5 secondes */}
      <div className="rounded-2xl bg-ink px-5 py-5 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {(["normal", "vigilance", "alerte"] as AlertLevel[]).map((lvl) => (
            <span
              key={lvl}
              className="flex items-center gap-1.5 rounded-full bg-foreground/10 px-3 py-1.5 text-xs font-medium text-foreground"
            >
              <span className={cn("h-2 w-2 rounded-full", LEVEL_DOT[lvl])} />
              {LEVEL_LABEL[lvl]} · {counts[lvl]}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-4 gap-2.5 sm:grid-cols-7">
          {stats.map((s) => (
            <button
              key={s.groupId}
              onClick={() =>
                setSelectedGroupId((prev) => (prev === s.groupId ? null : s.groupId))
              }
              title={`${s.groupName} — ${s.present} présents, ${s.retard} retards, ${s.absent} absents`}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border py-3 transition",
                selectedGroupId === s.groupId
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-foreground/10 bg-foreground/5 text-foreground hover:bg-foreground/10"
              )}
            >
              <span className={cn("h-3 w-3 rounded-full", LEVEL_DOT[s.level])} />
              <span className="text-xs font-medium">{s.groupId}</span>
            </button>
          ))}
        </div>
      </div>

      <Card>
        <h2 className="mb-1 text-sm font-semibold text-foreground">
          Retardataire — où le placer ?
        </h2>
        <p className="mb-3 text-sm text-muted">
          Choisissez la spécialité de l&apos;étudiant en retard : la suggestion privilégie
          d&apos;abord les groupes qui n&apos;ont encore aucun étudiant de cette spécialité (au
          moins 1 RH, 1 CACG, 1 FI par groupe), puis les groupes les plus petits.
        </p>
        <div className="flex gap-2">
          {SPECIALTIES.map((sp) => (
            <button
              key={sp}
              onClick={() => setLateSpecialty((prev) => (prev === sp ? null : sp))}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                lateSpecialty === sp
                  ? cn(SPECIALTY_STYLE[sp].border, SPECIALTY_STYLE[sp].bg, SPECIALTY_STYLE[sp].text)
                  : "border-border bg-surface text-foreground/80 hover:bg-foreground/5"
              )}
            >
              {sp}
            </button>
          ))}
        </div>

        {lateSpecialty && (
          <div className="mt-4 space-y-2">
            {suggestions.map((s, i) => (
              <div
                key={s.group.id}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3",
                  i === 0
                    ? cn("border-accent", SPECIALTY_STYLE[lateSpecialty].bg)
                    : "border-border"
                )}
              >
                <span className="flex items-center gap-2.5">
                  {i === 0 && (
                    <span className="text-[11px] font-bold uppercase tracking-wide text-accent">
                      Recommandé
                    </span>
                  )}
                  <span className="font-medium text-foreground">{s.group.name}</span>
                </span>
                <span className="text-sm text-muted">
                  {s.total} étudiant{s.total > 1 ? "s" : ""} ·{" "}
                  {s.missing ? (
                    <span className={SPECIALTY_STYLE[lateSpecialty].text}>
                      aucun {lateSpecialty} actuellement
                    </span>
                  ) : (
                    `${s.count} ${lateSpecialty}`
                  )}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      {selected ? (
        <Card>
          <div className="mb-3 flex items-center justify-between">
            <p className="font-serif text-lg font-medium text-foreground">
              {selected.groupName}
            </p>
            <button
              onClick={() => setSelectedGroupId(null)}
              className="text-xs font-medium text-muted hover:text-foreground"
            >
              Fermer ✕
            </button>
          </div>
          <ul className="divide-y divide-border">
            {selected.entries.map((e) => {
              const specialty = selectedGroup?.students.find((s) => s.name === e.name)
                ?.specialty;
              const rate = presenceRate(attendance, elapsedDays, selected.groupId, e.name);
              return (
                <li key={e.name} className="flex items-center justify-between py-2 text-sm">
                  <span className="flex items-center gap-2">
                    <span className="text-foreground">{e.name}</span>
                    {specialty && (
                      <Badge tone={specialtyTone(specialty)}>{specialty}</Badge>
                    )}
                    {rate !== null && (
                      <span className="text-xs text-muted">{rate}% présent</span>
                    )}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="text-[11px] text-muted">
                      {e.checks.length}/4 pointages
                    </span>
                    <Badge tone={statusTone(latestCheck(e) ?? "")}>
                      {latestCheck(e) ?? "—"}
                    </Badge>
                  </span>
                </li>
              );
            })}
            {selected.entries.length === 0 && (
              <li className="py-2 text-sm text-muted">Pas de relevé pour ce jour.</li>
            )}
          </ul>
        </Card>
      ) : (
        <p className="text-sm text-muted">
          Cliquez sur un groupe ci-dessus pour voir le détail des présences.
        </p>
      )}
    </div>
  );
}
