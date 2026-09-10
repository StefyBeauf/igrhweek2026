"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import SearchBar from "@/components/SearchBar";
import Badge, { statusTone } from "@/components/Badge";
import { cn } from "@/lib/utils";
import {
  alertLevelFor,
  type AlertLevel,
  type AttendanceEntry,
  type Day,
  type Group,
} from "@/lib/data";

const LEVEL_LABEL: Record<AlertLevel, string> = {
  normal: "Normal",
  vigilance: "Vigilance",
  alerte: "Alerte",
};

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
  const [query, setQuery] = useState("");

  const stats = useMemo(() => {
    const dayData = attendance[activeDay] ?? {};
    return groups
      .map((g) => {
        const entries = dayData[g.id] ?? [];
        const present = entries.filter((e) => e.status === "Présent").length;
        const absent = entries.filter((e) => e.status === "Absent").length;
        const retard = entries.filter((e) => e.status === "Retard").length;
        return {
          groupId: g.id,
          groupName: g.name,
          total: entries.length,
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

  const rows = useMemo(() => {
    const dayData = attendance[activeDay] ?? {};
    const q = query.trim().toLowerCase();
    const result: { groupId: string; groupName: string; entries: AttendanceEntry[] }[] = [];
    for (const g of groups) {
      const entries = dayData[g.id] ?? [];
      const matches = q
        ? g.name.toLowerCase().includes(q) ||
          g.id.toLowerCase().includes(q) ||
          entries.some((e) => e.name.toLowerCase().includes(q))
        : true;
      if (!matches) continue;
      result.push({ groupId: g.id, groupName: g.name, entries });
    }
    return result;
  }, [attendance, activeDay, groups, query]);

  return (
    <div className="space-y-6">
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
              onClick={() => setQuery(s.groupId)}
              title={`${s.groupName} — ${s.present} présents, ${s.retard} retards, ${s.absent} absents`}
              className={cn(
                "flex flex-col items-center gap-1.5 rounded-xl border border-foreground/10 bg-foreground/5 py-3 text-foreground transition hover:bg-foreground/10"
              )}
            >
              <span className={cn("h-3 w-3 rounded-full", LEVEL_DOT[s.level])} />
              <span className="text-xs font-medium">{s.groupId}</span>
            </button>
          ))}
        </div>
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Rechercher un nom ou un groupe..."
      />

      <div className="space-y-3">
        {rows.map((row) => (
          <Card key={row.groupId}>
            <p className="mb-2 text-sm font-semibold text-foreground">{row.groupName}</p>
            <ul className="divide-y divide-border">
              {row.entries.map((e) => (
                <li key={e.name} className="flex items-center justify-between py-2 text-sm">
                  <span className="text-foreground">{e.name}</span>
                  <Badge tone={statusTone(e.status)}>{e.status}</Badge>
                </li>
              ))}
              {row.entries.length === 0 && (
                <li className="py-2 text-sm text-muted">Pas de relevé pour ce jour.</li>
              )}
            </ul>
          </Card>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-muted">Aucun résultat pour « {query} ».</p>
        )}
      </div>
    </div>
  );
}
