"use client";

import { useState } from "react";
import Card from "@/components/Card";
import { cn } from "@/lib/utils";
import type { Day, Prof, Specialty } from "@/lib/data";

const SPECIALTY_ORDER: Specialty[] = ["RH", "CACG", "FI"];

const SPECIALTY_STYLE: Record<Specialty, { text: string; dot: string }> = {
  RH: { text: "text-success", dot: "bg-success" },
  CACG: { text: "text-accent", dot: "bg-accent" },
  FI: { text: "text-info", dot: "bg-info" },
};

export default function ProfsPresentsBoard({
  profs,
  presence,
  days,
  defaultDay,
}: {
  profs: Prof[];
  presence: Record<string, Record<string, boolean>>;
  days: Day[];
  defaultDay: string;
}) {
  const [activeDay, setActiveDay] = useState(defaultDay);

  const dayPresence = presence[activeDay] ?? {};
  const presentCount = profs.filter((p) => dayPresence[p.name]).length;

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

      <div className="rounded-2xl bg-ink px-5 py-4">
        <p className="text-sm font-medium text-foreground">
          {presentCount} / {profs.length} formateurs présents ce jour
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {SPECIALTY_ORDER.map((sp) => {
          const list = profs.filter((p) => p.specialite === sp);
          return (
            <Card key={sp}>
              <h2
                className={cn(
                  "mb-3 text-xs font-semibold uppercase tracking-[0.2em]",
                  SPECIALTY_STYLE[sp].text
                )}
              >
                {sp}
              </h2>
              <ul className="space-y-2.5">
                {list.map((p) => {
                  const present = !!dayPresence[p.name];
                  return (
                    <li key={p.name} className="flex items-center gap-2.5 text-sm">
                      <span
                        className={cn(
                          "h-2 w-2 shrink-0 rounded-full",
                          present ? SPECIALTY_STYLE[sp].dot : "bg-border"
                        )}
                      />
                      <span
                        className={cn(
                          "flex-1 text-foreground",
                          !present && "text-muted"
                        )}
                      >
                        {p.name}
                      </span>
                      <span className="text-xs text-muted">
                        {present ? "Présent" : "Absent"}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
