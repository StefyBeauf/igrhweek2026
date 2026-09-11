import { cn } from "@/lib/utils";
import type { Day, Prof, Specialty } from "@/lib/data";

const SPECIALTY_ORDER: Specialty[] = ["RH", "CACG", "FI"];

const SPECIALTY_STYLE: Record<Specialty, { text: string; dot: string; wash: string }> = {
  RH: { text: "text-success", dot: "bg-success", wash: "bg-success/[0.06]" },
  CACG: { text: "text-accent", dot: "bg-accent", wash: "bg-accent/[0.06]" },
  FI: { text: "text-info", dot: "bg-info", wash: "bg-info/[0.06]" },
};

export default function ProfsPresentsBoard({
  profs,
  presence,
  days,
}: {
  profs: Prof[];
  presence: Record<string, Record<string, boolean>>;
  days: Day[];
}) {
  const sorted = SPECIALTY_ORDER.flatMap((sp) => profs.filter((p) => p.specialite === sp));

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted">
        {SPECIALTY_ORDER.map((sp) => (
          <span key={sp} className="flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", SPECIALTY_STYLE[sp].dot)} />
            {sp}
          </span>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-border">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr className="bg-ink text-foreground">
              <th className="px-4 py-3 text-left font-semibold">Formateur</th>
              {days.map((d) => (
                <th
                  key={d.key}
                  className="border-l border-border/50 px-4 py-3 text-center font-semibold"
                >
                  {d.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((p, i) => (
              <tr
                key={p.name}
                className={cn(
                  "border-t border-border",
                  SPECIALTY_STYLE[p.specialite].wash,
                  i % 2 === 1 && "bg-foreground/[0.02]"
                )}
              >
                <td className="px-4 py-2.5 align-middle">
                  <span className="text-foreground">{p.name}</span>{" "}
                  <span className={cn("text-xs font-semibold", SPECIALTY_STYLE[p.specialite].text)}>
                    · {p.specialite}
                  </span>
                </td>
                {days.map((d) => {
                  const present = !!presence[d.key]?.[p.name];
                  return (
                    <td
                      key={d.key}
                      className="border-l border-border/30 px-4 py-2.5 text-center align-middle"
                    >
                      <span
                        className={cn(
                          "inline-flex h-2.5 w-2.5 rounded-full",
                          present ? "bg-success" : "bg-border"
                        )}
                        title={present ? "Présent" : "Absent"}
                      />
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
