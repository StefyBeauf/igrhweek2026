import {
  groups,
  attendance,
  comments,
  notes,
  notesCc,
  partiel,
  profs,
  profsPlanning,
  rooms,
  briefs,
  documents,
  logistics,
  soutenance,
} from "@/lib/data";
import AdminPanel from "./AdminPanel";

export default function AdminPage() {
  const data = {
    groups,
    attendance,
    comments,
    notes,
    "notes-cc": notesCc,
    partiel,
    edusign: "",
    profs: { profs, planning: profsPlanning },
    rooms,
    briefs,
    documents,
    logistics,
    soutenance,
  };
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Admin</p>
        <h1 className="mt-1 text-2xl md:text-3xl font-serif font-normal text-foreground after:mt-3 after:block after:h-px after:w-10 after:bg-accent after:content-['']">
          Gestion des données
        </h1>
      </div>
      <AdminPanel data={data} />
    </div>
  );
}
