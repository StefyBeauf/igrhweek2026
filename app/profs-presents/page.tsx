import { profsPlanning, days } from "@/lib/data";
import ProfsPresentsBoard from "./ProfsPresentsBoard";

export default function ProfsPresentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Profs présents
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-serif font-semibold text-foreground">
          Planning des intervenants
        </h1>
      </div>
      <ProfsPresentsBoard planning={profsPlanning} days={days} />
    </div>
  );
}
