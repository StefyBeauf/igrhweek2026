import { groups } from "@/lib/data";
import GroupsExplorer from "./GroupsExplorer";

export default function GroupesPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">
          21 groupes · {groups.reduce((a, g) => a + g.students.length, 0)} étudiants
        </p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">Groupes</h1>
      </div>
      <GroupsExplorer groups={groups} />
    </div>
  );
}
