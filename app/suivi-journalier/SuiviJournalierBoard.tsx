"use client";

import { useState } from "react";
import Card from "@/components/Card";
import DayBriefCard from "@/components/DayBriefCard";
import CommentsBoard from "./CommentsBoard";
import { cn } from "@/lib/utils";
import { logistics } from "@/lib/data";
import type { Brief, CommentsByDay, Day, Group } from "@/lib/data";

const TABS = ["Brief du jour", "Commentaires", "Salles"] as const;
type Tab = (typeof TABS)[number];

function tranches(groups: Group[]) {
  return logistics.salles.map((s) => ({
    ...s,
    label: `Groupes ${s.groupeDebut} à ${s.groupeFin}`,
    groups: groups.slice(s.groupeDebut - 1, s.groupeFin),
  }));
}

function LogisticsCard({ groups }: { groups: Group[] }) {
  return (
    <Card className="border-l-4 border-accent">
      <h3 className="mb-2 text-sm font-semibold text-foreground">Site & salles</h3>
      <p className="mb-3 text-sm text-foreground/90">
        Site : <span className="font-medium text-accent">{logistics.site}</span>
      </p>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {tranches(groups).map((t) => (
          <div
            key={t.label}
            className="flex items-center justify-between rounded-lg border border-border px-3 py-2 text-sm"
          >
            <span className="text-foreground/80">{t.label}</span>
            <span className="font-medium text-accent">{t.salle}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

export default function SuiviJournalierBoard({
  briefs,
  groups,
  days,
  defaultDay,
  comments,
}: {
  briefs: Brief[];
  groups: Group[];
  days: Day[];
  defaultDay: string;
  comments: CommentsByDay;
}) {
  const [activeDay, setActiveDay] = useState(defaultDay);
  const [activeTab, setActiveTab] = useState<Tab>("Brief du jour");

  const brief = briefs.find((b) => b.day === activeDay);
  const commentDays = days.filter((d) => d.key !== "vendredi");

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

      {activeTab === "Brief du jour" && (
        <div className="space-y-5">
          {brief ? (
            <DayBriefCard brief={brief} />
          ) : (
            <p className="text-sm text-muted">Aucun brief pour ce jour.</p>
          )}
          <LogisticsCard groups={groups} />
        </div>
      )}

      {activeTab === "Commentaires" && (
        <CommentsBoard initialComments={comments} groups={groups} days={commentDays} />
      )}

      {activeTab === "Salles" && (
        <div className="space-y-5">
          <p className="text-sm text-foreground/90">
            Site : <span className="font-medium text-accent">{logistics.site}</span>
          </p>
          {tranches(groups).map((t) => (
            <div key={t.label} className="space-y-2.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-foreground">{t.label}</p>
                <span className="rounded-xl bg-accent/15 px-3 py-1.5 text-xs font-semibold text-accent">
                  Salle {t.salle}
                </span>
              </div>
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {t.groups.map((g) => (
                  <Card key={g.id} className="text-sm font-medium text-foreground">
                    {g.name}
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
