"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import Badge, { specialtyTone } from "@/components/Badge";
import DayBriefCard from "@/components/DayBriefCard";
import { cn } from "@/lib/utils";
import type {
  Brief,
  Comment,
  Day,
  Document,
  Group,
  Specialty,
} from "@/lib/data";

const SPECIALTIES: Specialty[] = ["RH", "CACG", "FI"];
const TABS = ["Brief du jour", "Commentaires", "Salles", "Documents"] as const;
type Tab = (typeof TABS)[number];

const CATEGORY_ORDER = [
  "Sujet",
  "Consignes",
  "Planning",
  "Grilles",
  "Supports",
  "Fiches",
  "Autres",
];

export default function SuiviJournalierBoard({
  briefs,
  initialComments,
  rooms,
  documents,
  groups,
  days,
  defaultDay,
}: {
  briefs: Brief[];
  initialComments: Comment[];
  rooms: Record<string, { groupId: string; room: string }[]>;
  documents: Document[];
  groups: Group[];
  days: Day[];
  defaultDay: string;
}) {
  const [activeDay, setActiveDay] = useState(defaultDay);
  const [activeTab, setActiveTab] = useState<Tab>("Brief du jour");
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [activeSpecialty, setActiveSpecialty] = useState<Specialty | "Toutes">(
    "Toutes"
  );
  const [formOpen, setFormOpen] = useState(false);
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");
  const [specialty, setSpecialty] = useState<Specialty>("RH");
  const [texte, setTexte] = useState("");
  const [auteur, setAuteur] = useState("");

  const brief = briefs.find((b) => b.day === activeDay);

  const filteredComments = useMemo(() => {
    return comments
      .filter((c) => c.day === activeDay)
      .filter((c) => activeSpecialty === "Toutes" || c.specialty === activeSpecialty)
      .slice()
      .reverse();
  }, [comments, activeDay, activeSpecialty]);

  const roomRows = useMemo(() => {
    const dayRooms = rooms[activeDay] ?? [];
    return dayRooms
      .map((r) => ({
        ...r,
        groupName: groups.find((g) => g.id === r.groupId)?.name ?? r.groupId,
      }))
      .sort((a, b) => a.room.localeCompare(b.room));
  }, [rooms, activeDay, groups]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!texte.trim() || !groupId) return;
    const newComment: Comment = {
      id: `TMP${Date.now()}`,
      groupId,
      day: activeDay,
      specialty,
      auteur: auteur.trim() || "Formateur",
      texte: texte.trim(),
      date: days.find((d) => d.key === activeDay)?.date ?? "",
    };
    setComments((prev) => [...prev, newComment]);
    setTexte("");
    setFormOpen(false);
  }

  const documentCategories = CATEGORY_ORDER.filter((cat) =>
    documents.some((d) => d.categorie === cat)
  );

  return (
    <div className="space-y-5">
      <div className="flex gap-2 overflow-x-auto pb-1">
        {days.map((d) => (
          <button
            key={d.key}
            onClick={() => setActiveDay(d.key)}
            className={cn(
              "shrink-0 rounded-full px-4 py-2 text-sm font-medium transition",
              activeDay === d.key
                ? "bg-accent text-ink"
                : "border border-border bg-surface text-foreground/80 hover:bg-foreground/5"
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="flex gap-1 overflow-x-auto border-b border-border pb-px">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition",
              activeTab === tab
                ? "border-accent text-foreground"
                : "border-transparent text-muted hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "Brief du jour" &&
        (brief ? (
          <DayBriefCard brief={brief} />
        ) : (
          <p className="text-sm text-muted">Aucun brief pour ce jour.</p>
        ))}

      {activeTab === "Commentaires" && (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              {(["Toutes", ...SPECIALTIES] as const).map((sp) => (
                <button
                  key={sp}
                  onClick={() => setActiveSpecialty(sp)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium transition",
                    activeSpecialty === sp
                      ? "bg-accent text-ink"
                      : "bg-foreground/5 text-foreground/80 hover:bg-foreground/10"
                  )}
                >
                  {sp}
                </button>
              ))}
            </div>
            <button
              onClick={() => setFormOpen((v) => !v)}
              className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-ink hover:opacity-90"
            >
              + Ajouter un commentaire
            </button>
          </div>

          {formOpen && (
            <Card>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">
                      Groupe
                    </label>
                    <select
                      value={groupId}
                      onChange={(e) => setGroupId(e.target.value)}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                    >
                      {groups.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-muted">
                      Spécialité
                    </label>
                    <select
                      value={specialty}
                      onChange={(e) => setSpecialty(e.target.value as Specialty)}
                      className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                    >
                      {SPECIALTIES.map((sp) => (
                        <option key={sp} value={sp}>
                          {sp}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">
                    Votre nom
                  </label>
                  <input
                    type="text"
                    value={auteur}
                    onChange={(e) => setAuteur(e.target.value)}
                    placeholder="Prénom Nom"
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted">
                    Commentaire
                  </label>
                  <textarea
                    value={texte}
                    onChange={(e) => setTexte(e.target.value)}
                    rows={3}
                    placeholder="Observation sur le groupe..."
                    className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-accent"
                  />
                </div>
                <button
                  type="submit"
                  className="rounded-xl bg-accent px-4 py-2 text-sm font-medium text-ink hover:opacity-90"
                >
                  Publier
                </button>
                <p className="text-xs text-muted">
                  Ce commentaire est ajouté pour la session en cours uniquement.
                  Pour le conserver, reportez-le dans{" "}
                  <code className="rounded bg-foreground/5 px-1 py-0.5">
                    data/comments.json
                  </code>
                  .
                </p>
              </form>
            </Card>
          )}

          {filteredComments.length === 0 ? (
            <p className="text-sm text-muted">Aucun commentaire pour ce filtre.</p>
          ) : (
            <div className="space-y-3">
              {filteredComments.map((c) => {
                const group = groups.find((g) => g.id === c.groupId);
                return (
                  <Card key={c.id}>
                    <div className="mb-1.5 flex flex-wrap items-center gap-2 text-xs text-muted">
                      <span className="font-medium text-foreground">
                        {group?.name ?? c.groupId}
                      </span>
                      <span>·</span>
                      <Badge tone={specialtyTone(c.specialty)}>{c.specialty}</Badge>
                      <span>·</span>
                      <span>{c.auteur}</span>
                    </div>
                    <p className="text-sm text-foreground">{c.texte}</p>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeTab === "Salles" && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {roomRows.map((r) => (
            <Card key={r.groupId} className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-muted">
                  {r.groupId}
                </p>
                <p className="text-sm font-semibold text-foreground">{r.groupName}</p>
              </div>
              <span className="rounded-xl bg-accent/15 px-3 py-1.5 text-sm font-semibold text-accent">
                Salle {r.room}
              </span>
            </Card>
          ))}
          {roomRows.length === 0 && (
            <p className="text-sm text-muted">Pas de répartition pour ce jour.</p>
          )}
        </div>
      )}

      {activeTab === "Documents" && (
        <div className="space-y-6">
          {documentCategories.map((cat) => (
            <div key={cat}>
              <h2 className="mb-2 text-sm font-semibold text-foreground">{cat}</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {documents
                  .filter((d) => d.categorie === cat)
                  .map((d) => (
                    <a
                      key={d.id}
                      href={d.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Card className="h-full transition hover:border-accent/50 hover:shadow-md">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-foreground">
                            {d.titre}
                          </p>
                          <Badge>{d.categorie}</Badge>
                        </div>
                        <p className="mt-2 truncate text-xs text-muted">{d.url}</p>
                      </Card>
                    </a>
                  ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
