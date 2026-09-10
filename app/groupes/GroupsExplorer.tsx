"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import Card from "@/components/Card";
import { cn } from "@/lib/utils";
import type { Group, Specialty, Student } from "@/lib/data";

const SPECIALTY_STYLE: Record<Specialty, { text: string; dot: string; border: string }> = {
  RH: { text: "text-success", dot: "bg-success", border: "border-success/30" },
  CACG: { text: "text-accent", dot: "bg-accent", border: "border-accent/30" },
  FI: { text: "text-info", dot: "bg-info", border: "border-info/30" },
};

function bySpecialty(students: Student[], specialty: Specialty) {
  return students.filter((s) => s.specialty === specialty);
}

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

      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        {(Object.keys(SPECIALTY_STYLE) as Specialty[]).map((sp) => (
          <span key={sp} className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", SPECIALTY_STYLE[sp].dot)} />
            {sp}
          </span>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">Aucun résultat pour « {query} ».</p>
      ) : (
        <>
          {/* Desktop : une ligne = un groupe, étudiants classés par colonne */}
          <div className="hidden overflow-x-auto rounded-2xl border border-border md:block">
            <table className="w-full min-w-[900px] border-collapse text-sm">
              <thead>
                <tr className="bg-ink text-foreground">
                  <th rowSpan={2} className="px-4 py-3 text-left align-bottom font-semibold">
                    Équipe
                  </th>
                  <th
                    colSpan={3}
                    className="border-l border-border/50 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.15em] text-success"
                  >
                    RH
                  </th>
                  <th
                    colSpan={2}
                    className="border-l border-border/50 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.15em] text-accent"
                  >
                    CACG
                  </th>
                  <th
                    colSpan={1}
                    className="border-l border-border/50 px-4 py-2 text-center text-xs font-semibold uppercase tracking-[0.15em] text-info"
                  >
                    FI
                  </th>
                </tr>
                <tr className="bg-ink text-foreground/60">
                  {["1", "2", "3"].map((n) => (
                    <th key={`rh-${n}`} className="border-l border-border/50 px-4 pb-3 text-left text-[11px] font-medium">
                      Étudiant {n}
                    </th>
                  ))}
                  {["1", "2"].map((n) => (
                    <th key={`cacg-${n}`} className="border-l border-border/50 px-4 pb-3 text-left text-[11px] font-medium">
                      Étudiant {n}
                    </th>
                  ))}
                  <th className="border-l border-border/50 px-4 pb-3 text-left text-[11px] font-medium">
                    Étudiant
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, gi) => {
                  const rh = bySpecialty(g.students, "RH");
                  const cacg = bySpecialty(g.students, "CACG");
                  const fi = bySpecialty(g.students, "FI");
                  const row = [...rh, ...cacg, ...fi];
                  return (
                    <tr
                      key={g.id}
                      className={cn(
                        "border-t border-border transition hover:bg-accent/5",
                        gi % 2 === 1 && "bg-foreground/[0.02]"
                      )}
                    >
                      <td className="px-4 py-3 align-middle">
                        <Link
                          href={`/groupes/${g.id}`}
                          className="font-serif text-[15px] font-semibold text-foreground hover:text-accent"
                        >
                          {g.name}
                        </Link>
                      </td>
                      {row.map((s) => (
                        <td
                          key={s.name}
                          className={cn(
                            "border-l border-border/30 px-4 py-3 align-middle text-foreground/90",
                            SPECIALTY_STYLE[s.specialty].text
                          )}
                        >
                          {s.prenom} <span className="text-foreground">{s.nom}</span>
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Mobile : une carte par groupe */}
          <div className="space-y-3 md:hidden">
            {filtered.map((g) => (
              <Card key={g.id}>
                <Link
                  href={`/groupes/${g.id}`}
                  className="font-serif text-[15px] font-semibold text-foreground hover:text-accent"
                >
                  {g.name}
                </Link>
                <ul className="mt-3 space-y-2">
                  {g.students.map((s) => (
                    <li key={s.name} className="flex items-center gap-2.5 text-sm">
                      <span
                        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", SPECIALTY_STYLE[s.specialty].dot)}
                      />
                      <span className="flex-1 text-foreground">
                        {s.prenom} {s.nom}
                      </span>
                      <span className={cn("text-xs font-medium", SPECIALTY_STYLE[s.specialty].text)}>
                        {s.specialty}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
