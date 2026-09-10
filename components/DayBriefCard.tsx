import Card from "@/components/Card";
import Badge from "@/components/Badge";
import type { Brief } from "@/lib/data";

export default function DayBriefCard({ brief }: { brief: Brief }) {
  return (
    <div className="space-y-4">
      {brief.alertes.length > 0 && (
        <Card className="border-warning/30 bg-warning/5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-warning">
            Alertes du jour
          </p>
          <ul className="space-y-1 text-sm text-foreground">
            {brief.alertes.map((a, i) => (
              <li key={i}>⚠️ {a}</li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {brief.date}
        </p>
        <h2 className="mt-1 text-xl font-semibold text-foreground">
          {brief.titre}
        </h2>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Objectifs</h3>
          <ul className="space-y-1.5 text-sm text-foreground/90">
            {brief.objectifs.map((o, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">•</span>
                {o}
              </li>
            ))}
          </ul>
        </Card>

        <Card>
          <h3 className="mb-2 text-sm font-semibold text-foreground">Livrables attendus</h3>
          <ul className="space-y-1.5 text-sm text-foreground/90">
            {brief.livrables.map((l, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-primary">•</span>
                {l}
              </li>
            ))}
          </ul>
        </Card>

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
