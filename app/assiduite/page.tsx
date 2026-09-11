import { attendance, groups, days, getTodayKey } from "@/lib/data";
import AssiduiteBoard from "./AssiduiteBoard";

export default function AssiduitePage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Assiduité
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-serif font-bold uppercase tracking-wide text-foreground after:mt-3 after:block after:h-px after:w-10 after:bg-accent after:content-['']">
          Groupes à risque, présences, retards
        </h1>
      </div>
      <AssiduiteBoard
        attendance={attendance}
        groups={groups}
        days={days}
        defaultDay={getTodayKey()}
      />
    </div>
  );
}
