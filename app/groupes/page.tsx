import { groups } from "@/lib/data";
import GroupsExplorer from "./GroupsExplorer";

export default function GroupesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          21 groupes · {groups.reduce((a, g) => a + g.students.length, 0)} étudiants
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-serif font-normal text-foreground after:mt-3 after:block after:h-px after:w-10 after:bg-accent after:content-['']">Équipes</h1>
      </div>
      <GroupsExplorer groups={groups} />
    </div>
  );
}
