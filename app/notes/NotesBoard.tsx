"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import SearchBar from "@/components/SearchBar";
import { cn } from "@/lib/utils";
import type { Group, NoteEntry } from "@/lib/data";

export default function NotesBoard({
  cc,
  partiel,
  groups,
}: {
  cc: NoteEntry[];
  partiel: NoteEntry[];
  groups: Group[];
}) {
  const [tab, setTab] = useState<"cc" | "partiel">("cc");
  const [query, setQuery] = useState("");

  const rows = tab === "cc" ? cc : partiel;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.etudiant.toLowerCase().includes(q) ||
        r.groupId.toLowerCase().includes(q)
    );
  }, [rows, query]);

  function groupName(id: string) {
    return groups.find((g) => g.id === id)?.name ?? id;
  }

  return (
    <div className="space-y-5">
      <div className="flex gap-2">
        <button
          onClick={() => setTab("cc")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            tab === "cc"
              ? "bg-primary text-primary-foreground"
              : "bg-surface text-foreground/80 border border-border hover:bg-black/5"
          )}
        >
          Contrôle continu
        </button>
        <button
          onClick={() => setTab("partiel")}
          className={cn(
            "rounded-full px-4 py-2 text-sm font-medium transition",
            tab === "partiel"
              ? "bg-primary text-primary-foreground"
              : "bg-surface text-foreground/80 border border-border hover:bg-black/5"
          )}
        >
          Partiel
        </button>
      </div>

      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Rechercher un étudiant ou un groupe..."
      />

      <Card className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted">
                <th className="px-4 py-3 font-medium">Étudiant</th>
                <th className="px-4 py-3 font-medium">Groupe</th>
                <th className="px-4 py-3 font-medium">Note</th>
                <th className="px-4 py-3 font-medium">Commentaire</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={`${r.groupId}-${r.etudiant}-${i}`} className="border-b border-border last:border-0">
                  <td className="px-4 py-2.5 text-foreground">{r.etudiant}</td>
                  <td className="px-4 py-2.5 text-muted">{groupName(r.groupId)}</td>
                  <td className="px-4 py-2.5 font-semibold text-foreground">
                    {r.note}/20
                  </td>
                  <td className="px-4 py-2.5 text-muted">{r.commentaire || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="px-4 py-6 text-center text-sm text-muted">
            Aucun résultat pour « {query} ».
          </p>
        )}
      </Card>
    </div>
  );
}
