import Badge from "@/components/Badge";
import Card from "@/components/Card";
import { cn } from "@/lib/utils";
import type { Brief, Specialty } from "@/lib/data";

const SPECIALTY_ORDER: Specialty[] = ["RH", "CACG", "FI"];

const SPECIALTY_STYLE: Record<Specialty, { text: string; dot: string; border: string }> = {
  RH: { text: "text-success", dot: "bg-success", border: "border-success/25" },
  CACG: { text: "text-accent", dot: "bg-accent", border: "border-accent/25" },
  FI: { text: "text-info", dot: "bg-info", border: "border-info/25" },
};

export default function DayBriefCard({ brief }: { brief: Brief }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border-l-4 border-accent bg-ink px-5 py-5 sm:px-7 sm:py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-accent">
          Brief du jour · {brief.date}
        </p>
        <h2 className="mt-1 font-serif text-2xl font-normal text-foreground">
          {brief.titre}
        </h2>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {SPECIALTY_ORDER.map((sp) => {
            const items = brief.parSpecialite[sp];
            return (
              <div
                key={sp}
                className={cn(
                  "rounded-xl border bg-foreground/[0.03] px-4 py-3.5",
                  SPECIALTY_STYLE[sp].border
                )}
              >
                <h3
                  className={cn(
                    "mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.15em]",
                    SPECIALTY_STYLE[sp].text
                  )}
                >
                  <span className={cn("h-1.5 w-1.5 rounded-full", SPECIALTY_STYLE[sp].dot)} />
                  {sp}
                </h3>
                {items.length > 0 ? (
                  <ul className="space-y-1.5 text-sm text-foreground/90">
                    {items.map((o, i) => (
                      <li key={i} className="flex gap-2">
                        <span className={SPECIALTY_STYLE[sp].text}>•</span>
                        {o}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted">—</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Card>
        <h3 className="mb-2 text-sm font-semibold text-foreground">Salles mobilisées</h3>
        <div className="flex flex-wrap gap-1.5">
          {brief.salles.map((s) => (
            <Badge key={s}>{s}</Badge>
          ))}
        </div>
      </Card>
    </div>
  );
}
