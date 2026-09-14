"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import DayBriefCard from "@/components/DayBriefCard";
import CommentsBoard from "./CommentsBoard";
import { cn } from "@/lib/utils";
import type { Brief, CommentsByDay, Day, Group } from "@/lib/data";

const TABS = ["Brief du jour", "Commentaires", "Salles"] as const;
type Tab = (typeof TABS)[number];

export default function SuiviJournalierBoard({
  briefs,
  rooms,
  groups,
  days,
  defaultDay,
  comments,
}: {
  briefs: Brief[];
  rooms: Record<string, { groupId: string; room: string }[]>;
  groups: Group[];
  days: Day[];
  defaultDay: string;
  comments: CommentsByDay;
}) {
  const [activeDay, setActiveDay] = useState(defaultDay);
  const [activeTab, setActiveTab] = useState<Tab>("Brief du jour");

  const brief = briefs.find((b) => b.day === activeDay);
  const commentDays = days.filter((d) => d.key !== "vendredi");

  const roomRows = useMemo(() => {
    const dayRooms = rooms[activeDay] ?? [];
    return dayRooms
      .map((r) => ({
        ...r,
        groupName: groups.find((g) => g.id === r.groupId)?.name ?? r.groupId,
      }))
      .sort((a, b) => a.room.localeCompare(b.room));
  }, [rooms, activeDay, groups]);

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
                ? "bg-accent text-ink"
                : "border border-border bg-surface text-foreground/80 hover:bg-foreground/5"
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border pb-px">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition",
              activeTab === tab
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Brief du jour" &&
        (brief ? (
          <DayBriefCard brief={brief} />
        ) : (
          <p className="text-sm text-muted">Aucun brief pour ce jour.</p>
        ))}

      {activeTab === "Commentaires" && (
        <CommentsBoard initialComments={comments} groups={groups} days={commentDays} />
      )}

      {activeTab === "Salles" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roomRows.map((r) => (
            <Card key={r.groupId} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {r.groupId}
                </p>
                <p className="text-sm font-semibold text-foreground">{r.groupName}</p>
              </div>
              <span className="rounded-xl bg-accent/15 px-3 py-1.5 text-sm font-semibold text-accent">
                Salle {r.room}
              </span>
            </Card>
          ))}
          {roomRows.length === 0 && (
            <p className="text-sm text-muted">Pas de répartition pour ce jour.</p>
          )}
        </div>
      )}
    </div>
  );
}
