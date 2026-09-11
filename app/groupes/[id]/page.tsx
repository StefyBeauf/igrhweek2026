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
  findRoomForGroup,
  getTodayKey,
} from "@/lib/data";

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
  const todayRoom = findRoomForGroup(today, group.id);
  const todayAttendance = attendance[today]?.[group.id] ?? [];
  const groupComments = comments.filter((c) => c.groupId === group.id);

  return (
    <div className="space-y-6">
      <div>
        <Link href="/groupes" className="text-sm text-muted hover:text-foreground">
          ← Retour aux groupes
        </Link>
        <h1 className="mt-2 text-2xl md:text-3xl font-serif font-bold uppercase tracking-wide text-foreground after:mt-3 after:block after:h-px after:w-10 after:bg-accent after:content-['']">{group.name}</h1>
        <p className="text-sm text-muted">{group.students.length} étudiants</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-foreground">
            Salle aujourd&apos;hui
          </h2>
          <p className="text-2xl font-semibold text-primary">
            {todayRoom ?? "—"}
          </p>
        </Card>
        <Card>
          <h2 className="mb-2 text-sm font-semibold text-foreground">
            Présences aujourd&apos;hui
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {todayAttendance.map((a) => (
              <Badge key={a.name} tone={statusTone(a.status)}>
                {a.status}
              </Badge>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <h2 className="mb-3 text-sm font-semibold text-foreground">Composition</h2>
        <ul className="divide-y divide-border">
          {group.students.map((s) => (
            <li key={s.name} className="flex items-center justify-between py-2.5">
              <span className="text-sm text-foreground">{s.name}</span>
              <Badge tone={specialtyTone(s.specialty)}>{s.specialty}</Badge>
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
            {groupComments.map((c) => {
              const day = days.find((d) => d.key === c.day);
              return (
                <li key={c.id} className="text-sm">
                  <div className="mb-1 flex items-center gap-2 text-xs text-muted">
                    <span>{day?.label ?? c.day}</span>
                    <span>·</span>
                    <Badge tone={specialtyTone(c.specialty)}>{c.specialty}</Badge>
                    <span>·</span>
                    <span>{c.auteur}</span>
                  </div>
                  <p className="text-foreground">{c.texte}</p>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
