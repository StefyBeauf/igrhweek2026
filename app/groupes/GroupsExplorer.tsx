"use client";

import { useMemo, useState } from "react";
import SearchBar from "@/components/SearchBar";
import GroupCard from "@/components/GroupCard";
import type { Group } from "@/lib/data";

export default function GroupsExplorer({ groups }: { groups: Group[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return groups;
    return groups.filter((g) => {
      if (g.name.toLowerCase().includes(q) || g.id.toLowerCase().includes(q)) {
        return true;
      }
      return g.students.some((s) => s.name.toLowerCase().includes(q));
    });
  }, [groups, query]);

  return (
    <div className="space-y-5">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Rechercher un groupe ou un étudiant..."
      />
      {filtered.length === 0 ? (
        <p className="text-sm text-muted">Aucun résultat pour « {query} ».</p>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((g) => (
            <GroupCard key={g.id} group={g} />
          ))}
        </div>
      )}
    </div>
  );
}
