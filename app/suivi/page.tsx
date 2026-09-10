import { comments, groups, days, getTodayKey } from "@/lib/data";
import SuiviBoard from "./SuiviBoard";

export default function SuiviPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          Suivi pédagogique
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">
          Commentaires par jour & spécialité
        </h1>
      </div>
      <SuiviBoard
        initialComments={comments}
        groups={groups}
        days={days}
        defaultDay={getTodayKey()}
      />
    </div>
  );
}
