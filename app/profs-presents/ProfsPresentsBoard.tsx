import Card from "@/components/Card";
import { cn } from "@/lib/utils";
import type { Day, ProfPlanning, Specialty } from "@/lib/data";

const SPECIALTY_ORDER: Specialty[] = ["RH", "CACG", "FI"];

const SPECIALTY_STYLE: Record<Specialty, { text: string; dot: string }> = {
  RH: { text: "text-success", dot: "bg-success" },
  CACG: { text: "text-accent", dot: "bg-accent" },
  FI: { text: "text-info", dot: "bg-info" },
};

function PeriodColumn({
  label,
  bySpecialty,
}: {
  label: string;
  bySpecialty: Record<Specialty, string[]>;
}) {
  return (
    <div className="flex-1 min-w-[220px]">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-muted">
        {label}
      </p>
      <div className="space-y-2.5">
        {SPECIALTY_ORDER.map((sp) => {
          const names = bySpecialty[sp] ?? [];
          return (
            <div key={sp} className="flex items-start gap-2 text-sm">
              <span
                className={cn("mt-1 h-1.5 w-1.5 shrink-0 rounded-full", SPECIALTY_STYLE[sp].dot)}
              />
              <div>
                <span className={cn("mr-1.5 text-xs font-semibold", SPECIALTY_STYLE[sp].text)}>
                  {sp}
                </span>
                <span className="text-foreground">
                  {names.length > 0 ? names.join(", ") : "—"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ProfsPresentsBoard({
  planning,
  days,
}: {
  planning: ProfPlanning;
  days: Day[];
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        {SPECIALTY_ORDER.map((sp) => (
          <span key={sp} className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", SPECIALTY_STYLE[sp].dot)} />
            {sp}
          </span>
        ))}
      </div>

      {days.map((d) => (
        <Card key={d.key}>
          <p className="mb-3 font-serif text-base font-semibold text-foreground">
            {d.label}
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <PeriodColumn label="Matin" bySpecialty={planning[d.key]?.matin} />
            <PeriodColumn label="Après-midi" bySpecialty={planning[d.key]?.apresmidi} />
          </div>
        </Card>
      ))}
    </div>
  );
}
