"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import SearchBar from "@/components/SearchBar";
import Badge, { statusTone } from "@/components/Badge";
import { cn } from "@/lib/utils";
import type { AttendanceEntry, Day, Group } from "@/lib/data";

export default function PresencesBoard({
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
      const filteredEntries = q
        ? entries.filter(
            (e) =>
              e.name.toLowerCase().includes(q) ||
              g.name.toLowerCase().includes(q) ||
              g.id.toLowerCase().includes(q)
          )
        : entries;
      result.push({ groupId: g.id, groupName: g.name, entries: filteredEntries });
    }
    return result;
  }, [attendance, activeDay, groups, query]);

  const summary = useMemo(() => {
    const dayData = attendance[activeDay] ?? {};
    let present = 0,
      absent = 0,
      retard = 0;
    Object.values(dayData).forEach((entries) => {
      entries.forEach((e) => {
        if (e.status === "Présent") present++;
        else if (e.status === "Absent") absent++;
        else retard++;
      });
    });
    return { present, absent, retard };
  }, [attendance, activeDay]);

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => (
          <button
            key={d.key}
            onClick={() => setActiveDay(d.key)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
              activeDay === d.key
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-foreground/80 border border-border hover:bg-black/5"
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <p className="text-xl font-semibold text-success">{summary.present}</p>
          <p className="text-xs text-muted">Présents</p>
        </Card>
        <Card className="text-center">
          <p className="text-xl font-semibold text-warning">{summary.retard}</p>
          <p className="text-xs text-muted">Retards</p>
        </Card>
        <Card className="text-center">
          <p className="text-xl font-semibold text-danger">{summary.absent}</p>
          <p className="text-xs text-muted">Absents</p>
        </Card>
      </div>

      <SearchBar value={query} onChange={setQuery} placeholder="Rechercher un nom ou un groupe..." />

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
