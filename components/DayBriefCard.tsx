import Badge from "@/components/Badge";
import Card from "@/components/Card";
import type { Brief } from "@/lib/data";

export default function DayBriefCard({ brief }: { brief: Brief }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-l-4 border-accent bg-ink px-5 py-5 sm:px-7 sm:py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
          Brief du jour · {brief.date}
        </p>
        <h2 className="mt-1 font-serif text-2xl font-semibold text-foreground">
          {brief.titre}
        </h2>

        <div className="mt-5 grid gap-5 sm:grid-cols-2">
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-soft">
              Objectifs
            </h3>
            <ul className="space-y-1.5 text-sm text-foreground/90">
              {brief.objectifs.map((o, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent">•</span>
                  {o}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-accent-soft">
              Consignes particulières
            </h3>
            <ul className="space-y-1.5 text-sm text-foreground/90">
              {brief.livrables.map((l, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-accent">•</span>
                  {l}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {brief.alertes.length > 0 && (
          <div className="mt-5 rounded-xl border border-warning/40 bg-warning/10 px-4 py-3">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-warning">
              Points de vigilance
            </p>
            <ul className="space-y-1 text-sm text-foreground/95">
              {brief.alertes.map((a, i) => (
                <li key={i}>⚠️ {a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Intervenants</h3>
          <div className="flex flex-wrap gap-1.5">
            {brief.intervenants.map((it) => (
              <Badge key={it} tone="accent">
                {it}
              </Badge>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Salles mobilisées</h3>
          <div className="flex flex-wrap gap-1.5">
            {brief.salles.map((s) => (
              <Badge key={s}>{s}</Badge>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
