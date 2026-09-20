"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import Card from "@/components/Card";
import Badge, { specialtyTone } from "@/components/Badge";
import { cn } from "@/lib/utils";
import type { Group, Specialty, Student } from "@/lib/data";

const SPECIALTY_STYLE: Record<Specialty, { text: string; dot: string; wash: string; head: string }> = {
  RH: { text: "text-success", dot: "bg-success", wash: "bg-success/[0.06]", head: "bg-success/10" },
  CACG: { text: "text-accent", dot: "bg-accent", wash: "bg-accent/[0.06]", head: "bg-accent/10" },
  FI: { text: "text-info", dot: "bg-info", wash: "bg-info/[0.06]", head: "bg-info/10" },
};

function bySpecialty(students: Student[], specialty: Specialty) {
  return students.filter((s) => s.specialty === specialty);
}

/** Pads a specialty's students to a fixed slot count so every row lines up
 * under the same columns, even when a group is missing a member. */
function toSlots(students: Student[], count: number): (Student | null)[] {
  const slots: (Student | null)[] = [...students];
  while (slots.length < count) slots.push(null);
  return slots.slice(0, count);
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

  const studentMatches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const results: { student: Student; group: Group }[] = [];
    for (const g of groups) {
      for (const s of g.students) {
        if (s.name.toLowerCase().includes(q)) {
          results.push({ student: s, group: g });
        }
      }
    }
    return results;
  }, [groups, query]);

  return (
    <div className="space-y-5">
      <SearchBar
        value={query}
        onChange={setQuery}
        placeholder="Rechercher un groupe ou un étudiant..."
      />

      {studentMatches.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">
            Résultat{studentMatches.length > 1 ? "s" : ""}
          </p>
          {studentMatches.map(({ student, group }) => (
            <Link
              key={`${group.id}-${student.name}`}
              href={`/groupes/${group.id}`}
              className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-4 py-3 transition hover:border-accent/50"
            >
              <span className="flex items-center gap-2.5">
                <span
                  className={cn("h-2 w-2 shrink-0 rounded-full", SPECIALTY_STYLE[student.specialty].dot)}
                />
                <span className="font-medium text-foreground">
                  {student.prenom} {student.nom}
                </span>
                <Badge tone={specialtyTone(student.specialty)}>{student.specialty}</Badge>
              </span>
              <span className="whitespace-nowrap text-sm font-semibold text-accent">
                {group.name} →
              </span>
            </Link>
          ))}
        </div>
      )}

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
                    className={cn(
                      "border-l border-border/50 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.15em]",
                      SPECIALTY_STYLE.RH.head,
                      SPECIALTY_STYLE.RH.text
                    )}
                  >
                    RH
                  </th>
                  <th
                    colSpan={2}
                    className={cn(
                      "border-l border-border/50 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.15em]",
                      SPECIALTY_STYLE.CACG.head,
                      SPECIALTY_STYLE.CACG.text
                    )}
                  >
                    CACG
                  </th>
                  <th
                    colSpan={1}
                    className={cn(
                      "border-l border-border/50 px-4 py-2 text-center text-xs font-bold uppercase tracking-[0.15em]",
                      SPECIALTY_STYLE.FI.head,
                      SPECIALTY_STYLE.FI.text
                    )}
                  >
                    FI
                  </th>
                </tr>
                <tr className="bg-ink text-foreground/60">
                  {["1", "2", "3"].map((n) => (
                    <th key={`rh-${n}`} className={cn("border-l border-border/50 px-4 pb-3 text-left text-[11px] font-medium", SPECIALTY_STYLE.RH.wash)}>
                      Étudiant {n}
                    </th>
                  ))}
                  {["1", "2"].map((n) => (
                    <th key={`cacg-${n}`} className={cn("border-l border-border/50 px-4 pb-3 text-left text-[11px] font-medium", SPECIALTY_STYLE.CACG.wash)}>
                      Étudiant {n}
                    </th>
                  ))}
                  <th className={cn("border-l border-border/50 px-4 pb-3 text-left text-[11px] font-medium", SPECIALTY_STYLE.FI.wash)}>
                    Étudiant
                  </th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, gi) => {
                  const rh = toSlots(bySpecialty(g.students, "RH"), 3);
                  const cacg = toSlots(bySpecialty(g.students, "CACG"), 2);
                  const fi = toSlots(bySpecialty(g.students, "FI"), 1);
                  const row: { student: Student | null; specialty: Specialty }[] = [
                    ...rh.map((student) => ({ student, specialty: "RH" as const })),
                    ...cacg.map((student) => ({ student, specialty: "CACG" as const })),
                    ...fi.map((student) => ({ student, specialty: "FI" as const })),
                  ];
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
                          className="font-serif text-[15px] font-medium text-foreground hover:text-accent"
                        >
                          {g.name}
                        </Link>
                      </td>
                      {row.map(({ student: s, specialty }, i) => (
                        <td
                          key={s?.name ?? `${specialty}-empty-${i}`}
                          className={cn(
                            "border-l border-border/30 px-4 py-3 align-middle",
                            SPECIALTY_STYLE[specialty].wash
                          )}
                        >
                          {s ? (
                            <>
                              <span className={cn("font-medium", SPECIALTY_STYLE[specialty].text)}>
                                {s.prenom}
                              </span>{" "}
                              <span className="text-foreground">{s.nom}</span>
                            </>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
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
                  className="font-serif text-[15px] font-medium text-foreground hover:text-accent"
                >
                  {g.name}
                </Link>
                <ul className="mt-3 space-y-1.5">
                  {g.students.map((s) => (
                    <li
                      key={s.name}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm",
                        SPECIALTY_STYLE[s.specialty].wash
                      )}
                    >
                      <span
                        className={cn("h-1.5 w-1.5 shrink-0 rounded-full", SPECIALTY_STYLE[s.specialty].dot)}
                      />
                      <span className="flex-1 text-foreground">
                        {s.prenom} {s.nom}
                      </span>
                      <span className={cn("text-xs font-semibold", SPECIALTY_STYLE[s.specialty].text)}>
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
