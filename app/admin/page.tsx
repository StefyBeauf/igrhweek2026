import {
  groups,
  attendance,
  comments,
  notes,
  rooms,
  briefs,
  documents,
} from "@/lib/data";
import AdminPanel from "./AdminPanel";

export default function AdminPage() {
  const data = { groups, attendance, comments, notes, rooms, briefs, documents };
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Admin</p>
        <h1 className="mt-1 text-2xl font-semibold text-foreground">
          Gestion des données
        </h1>
      </div>
      <AdminPanel data={data} />
    </div>
  );
}
