"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import SearchBar from "@/components/SearchBar";
import { logistics, logisticsTranches } from "@/lib/data";
import type { Group } from "@/lib/data";

export default function SallesBoard({ groups }: { groups: Group[] }) {
  const [query, setQuery] = useState("");

  const tranches = useMemo(() => {
    const q = query.trim().toLowerCase();
    return logisticsTranches(groups)
      .map((t) => ({
        ...t,
        groups: t.groups.filter(
          (g) => !q || g.id.toLowerCase().includes(q) || g.name.toLowerCase().includes(q)
        ),
      }))
      .filter((t) => !query.trim() || t.groups.length > 0);
  }, [groups, query]);

  return (
    <div className="space-y-5">
      <p className="text-sm text-foreground/90">
        Site : <span className="font-medium text-accent">{logistics.site}</span>
      </p>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Où est mon groupe ? (n° ou nom de groupe)"
      />

      {tranches.map((t) => (
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

      {tranches.length === 0 && (
        <p className="text-sm text-muted">Aucun résultat pour « {query} ».</p>
      )}
    </div>
  );
}
