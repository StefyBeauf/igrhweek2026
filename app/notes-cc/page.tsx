import { notesCc, groups } from "@/lib/data";
import NotesCcBoard from "./NotesCcBoard";

export default function NotesCcPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Notes CC
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-serif font-semibold text-foreground">
          Contrôle continu — FI · CACG · RH
        </h1>
      </div>
      <NotesCcBoard entries={notesCc} groups={groups} />
    </div>
  );
}
