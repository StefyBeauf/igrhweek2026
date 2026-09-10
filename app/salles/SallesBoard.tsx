"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import SearchBar from "@/components/SearchBar";
import { cn } from "@/lib/utils";
import type { Day, Group } from "@/lib/data";

export default function SallesBoard({
  rooms,
  groups,
  days,
  defaultDay,
}: {
  rooms: Record<string, { groupId: string; room: string }[]>;
  groups: Group[];
  days: Day[];
  defaultDay: string;
}) {
  const [activeDay, setActiveDay] = useState(defaultDay);
  const [query, setQuery] = useState("");

  const rows = useMemo(() => {
    const dayRooms = rooms[activeDay] ?? [];
    const q = query.trim().toLowerCase();
    return dayRooms
      .map((r) => ({
        ...r,
        groupName: groups.find((g) => g.id === r.groupId)?.name ?? r.groupId,
      }))
      .filter(
        (r) =>
          !q ||
          r.groupId.toLowerCase().includes(q) ||
          r.groupName.toLowerCase().includes(q) ||
          r.room.toLowerCase().includes(q)
      )
      .sort((a, b) => a.room.localeCompare(b.room));
  }, [rooms, activeDay, groups, query]);

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

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Où est mon groupe ? (n° groupe ou salle)"
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {rows.map((r) => (
          <Card key={r.groupId} className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted">
                {r.groupId}
              </p>
              <p className="text-sm font-semibold text-foreground">{r.groupName}</p>
            </div>
            <span className="rounded-xl bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
              Salle {r.room}
            </span>
          </Card>
        ))}
        {rows.length === 0 && (
          <p className="text-sm text-muted">Aucun résultat pour « {query} ».</p>
        )}
      </div>
    </div>
  );
}
