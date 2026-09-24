import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "@/components/Card";
import Badge, { specialtyTone, statusTone } from "@/components/Badge";
import {
  getGroupById,
  groups,
  days,
  attendance,
  comments,
  logisticsTranches,
  latestCheck,
  getTodayKey,
  isGroupActive,
  isStudentActive,
} from "@/lib/data";
import { cn } from "@/lib/utils";

export function generateStaticParams() {
  return groups.map((g) => ({ id: g.id }));
}

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const group = getGroupById(id);
  if (!group) notFound();

  const today = getTodayKey();
  const tranche = logisticsTranches(groups).find((t) =>
    t.groups.some((g) => g.id === group.id)
  );
  const todayAttendance = attendance[today]?.[group.id] ?? [];
  const groupComments = days.flatMap((d) => {
    const entry = comments[d.key]?.find((c) => c.groupId === group.id);
    if (!entry) return [];
    return (["rh", "cacg", "fi"] as const)
      .filter((sp) => entry[sp].trim() !== "")
      .map((sp) => ({ day: d, specialty: sp.toUpperCase(), texte: entry[sp] }));
  });

  return (
    <div className="space-y-6">
      <div>
        <Link href="/groupes" className="text-sm text-muted hover:text-foreground">
          ← Retour aux groupes
        </Link>
        <h1 className="mt-2 text-2xl md:text-3xl font-serif font-normal text-foreground after:mt-3 after:block after:h-px after:w-10 after:bg-accent after:content-['']">{group.name}</h1>
        <p className="text-sm text-muted">{group.students.length} étudiants</p>
      </div>

      {!isGroupActive(group) && (
        <div className="rounded-xl border border-border bg-foreground/5 px-4 py-3 text-sm text-muted">
          Ce groupe n&apos;existe plus — conservé pour l&apos;historique, non supprimé.
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-foreground">Salle</h2>
          <p className="text-2xl font-semibold text-accent">{tranche?.salle ?? "—"}</p>
        </Card>
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-foreground">
            Présences aujourd&apos;hui
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {todayAttendance.map((a) => (
              <Badge key={a.name} tone={statusTone(latestCheck(a) ?? "")}>
                {latestCheck(a) ?? "—"}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Composition</h2>
        <ul className="divide-y divide-border">
          {group.students.map((s) => (
            <li
              key={s.name}
              className={cn(
                "flex items-center justify-between py-2.5",
                !isStudentActive(s) && "opacity-40"
              )}
            >
              <span className="text-sm text-foreground">{s.name}</span>
              <span className="flex items-center gap-2">
                {!isStudentActive(s) && <Badge tone="neutral">Parti</Badge>}
                <Badge tone={specialtyTone(s.specialty)}>{s.specialty}</Badge>
              </span>
            </li>
          ))}
        </ul>
      </Card>

      <Card>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-foreground">Commentaires de suivi</h2>
          <Link
            href="/suivi-journalier"
            className="text-xs font-medium text-accent hover:underline"
          >
            Voir tout le suivi →
          </Link>
        </div>
        {groupComments.length === 0 ? (
          <p className="text-sm text-muted">Aucun commentaire pour ce groupe.</p>
        ) : (
          <ul className="space-y-3">
            {groupComments.map((c, i) => (
              <li key={`${c.day.key}-${c.specialty}-${i}`} className="text-sm">
                <div className="mb-1 flex items-center gap-2 text-xs text-muted">
                  <span>{c.day.label}</span>
                  <span>·</span>
                  <Badge tone={specialtyTone(c.specialty)}>{c.specialty}</Badge>
                </div>
                <p className="text-foreground">{c.texte}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
