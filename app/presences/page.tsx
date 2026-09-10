import { attendance, groups, days, getTodayKey } from "@/lib/data";
import PresencesBoard from "./PresencesBoard";

export default function PresencesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Présences
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">
          Présents, absents, retards
        </h1>
      </div>
      <PresencesBoard
        attendance={attendance}
        groups={groups}
        days={days}
        defaultDay={getTodayKey()}
      />
    </div>
  );
}
