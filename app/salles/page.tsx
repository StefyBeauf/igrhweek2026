import { rooms, groups, days, getTodayKey } from "@/lib/data";
import SallesBoard from "./SallesBoard";

export default function SallesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Salles</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">
          Répartition des groupes
        </h1>
      </div>
      <SallesBoard rooms={rooms} groups={groups} days={days} defaultDay={getTodayKey()} />
    </div>
  );
}
