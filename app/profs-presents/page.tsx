import { profs, profsPresence, days, getTodayKey } from "@/lib/data";
import ProfsPresentsBoard from "./ProfsPresentsBoard";

export default function ProfsPresentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Profs présents
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-serif font-semibold text-foreground">
          Qui est présent aujourd&apos;hui
        </h1>
      </div>
      <ProfsPresentsBoard
        profs={profs}
        presence={profsPresence}
        days={days}
        defaultDay={getTodayKey()}
      />
    </div>
  );
}
