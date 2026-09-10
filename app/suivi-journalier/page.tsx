import { briefs, comments, rooms, documents, groups, days, getTodayKey } from "@/lib/data";
import SuiviJournalierBoard from "./SuiviJournalierBoard";

export default function SuiviJournalierPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Suivi journalier
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-serif font-semibold text-foreground">
          Le point sur la journée
        </h1>
      </div>
      <SuiviJournalierBoard
        briefs={briefs}
        initialComments={comments}
        rooms={rooms}
        documents={documents}
        groups={groups}
        days={days}
        defaultDay={getTodayKey()}
      />
    </div>
  );
}
