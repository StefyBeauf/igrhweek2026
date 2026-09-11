import { rooms, groups, days, getTodayKey } from "@/lib/data";
import SallesBoard from "./SallesBoard";

export default function SallesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Salles</p>
        <h1 className="mt-1 text-2xl md:text-3xl font-serif font-normal text-foreground after:mt-3 after:block after:h-px after:w-10 after:bg-accent after:content-['']">
          Répartition des groupes
        </h1>
      </div>
      <SallesBoard rooms={rooms} groups={groups} days={days} defaultDay={getTodayKey()} />
    </div>
  );
}
