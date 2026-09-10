import { notes, groups } from "@/lib/data";
import NotesBoard from "./NotesBoard";

export default function NotesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Notes</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">
          Contrôle continu & partiel
        </h1>
      </div>
      <NotesBoard cc={notes.cc} partiel={notes.partiel} groups={groups} />
    </div>
  );
}
