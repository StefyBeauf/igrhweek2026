import { partiel, groups } from "@/lib/data";
import PartielBoard from "./PartielBoard";

export default function PartielPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Partiel
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-serif font-semibold text-foreground">
          Évaluation des soutenances
        </h1>
      </div>
      <PartielBoard evaluations={partiel.evaluations} groups={groups} />
    </div>
  );
}
