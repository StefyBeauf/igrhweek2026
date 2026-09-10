import Link from "next/link";
import Card from "@/components/Card";
import DayBriefCard from "@/components/DayBriefCard";
import { days, getBriefByDay, getTodayKey } from "@/lib/data";
import { cn } from "@/lib/utils";

const QUICK_LINKS = [
  { href: "/groupes", label: "Groupes", desc: "Voir les 21 groupes" },
  { href: "/presences", label: "Présences", desc: "Absents & retards" },
  { href: "/notes", label: "Notes", desc: "CC & partiel" },
  { href: "/salles", label: "Salles", desc: "Où est mon groupe ?" },
];

export default async function AujourdHuiPage({
  searchParams,
}: {
  searchParams: Promise<{ jour?: string }>;
}) {
  const { jour } = await searchParams;
  const activeDay = jour && days.some((d) => d.key === jour) ? jour : getTodayKey();
  const brief = getBriefByDay(activeDay);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Toutes les infos du séminaire, en 2 clics
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">
          Brief du jour
        </h1>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => (
          <Link
            key={d.key}
            href={`/aujourd-hui?jour=${d.key}`}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
              activeDay === d.key
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-foreground/80 border border-border hover:bg-black/5"
            )}
          >
            {d.label}
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {QUICK_LINKS.map((q) => (
          <Link key={q.href} href={q.href}>
            <Card className="h-full text-center transition hover:border-primary/40 hover:shadow-md">
              <p className="text-sm font-semibold text-foreground">{q.label}</p>
              <p className="mt-0.5 text-xs text-muted">{q.desc}</p>
            </Card>
          </Link>
        ))}
      </div>

      {brief ? (
        <DayBriefCard brief={brief} />
      ) : (
        <Card>
          <p className="text-sm text-muted">Aucun brief disponible pour ce jour.</p>
        </Card>
      )}
    </div>
  );
}
