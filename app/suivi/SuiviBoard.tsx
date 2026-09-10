"use client";

import { useMemo, useState } from "react";
import Card from "@/components/Card";
import Badge, { specialtyTone } from "@/components/Badge";
import { cn } from "@/lib/utils";
import type { Comment, Day, Group, Specialty } from "@/lib/data";

const SPECIALTIES: Specialty[] = ["RH", "Finance", "CACG"];

export default function SuiviBoard({
  initialComments,
  groups,
  days,
  defaultDay,
}: {
  initialComments: Comment[];
  groups: Group[];
  days: Day[];
  defaultDay: string;
}) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [activeDay, setActiveDay] = useState(defaultDay);
  const [activeSpecialty, setActiveSpecialty] = useState<Specialty | "Toutes">("Toutes");
  const [formOpen, setFormOpen] = useState(false);
  const [groupId, setGroupId] = useState(groups[0]?.id ?? "");
  const [specialty, setSpecialty] = useState<Specialty>("RH");
  const [texte, setTexte] = useState("");
  const [auteur, setAuteur] = useState("");

  const filtered = useMemo(() => {
    return comments
      .filter((c) => c.day === activeDay)
      .filter((c) => activeSpecialty === "Toutes" || c.specialty === activeSpecialty)
      .slice()
      .reverse();
  }, [comments, activeDay, activeSpecialty]);

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
                ? "bg-primary text-primary-foreground"
                : "bg-surface text-foreground/80 border border-border hover:bg-black/5"
            )}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex gap-2">
          {(["Toutes", ...SPECIALTIES] as const).map((sp) => (
            <button
              key={sp}
              onClick={() => setActiveSpecialty(sp)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-medium transition",
                activeSpecialty === sp
                  ? "bg-foreground text-background"
                  : "bg-black/5 text-foreground/80 hover:bg-black/10"
              )}
            >
              {sp}
            </button>
          ))}
        </div>
        <button
          onClick={() => setFormOpen((v) => !v)}
          className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          + Ajouter un commentaire
        </button>
      </div>

      {formOpen && (
        <Card>
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-muted">Groupe</label>
                <select
                  value={groupId}
                  onChange={(e) => setGroupId(e.target.value)}
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
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
                  className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
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
              <label className="mb-1 block text-xs font-medium text-muted">Votre nom</label>
              <input
                type="text"
                value={auteur}
                onChange={(e) => setAuteur(e.target.value)}
                placeholder="Prénom Nom"
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted">Commentaire</label>
              <textarea
                value={texte}
                onChange={(e) => setTexte(e.target.value)}
                rows={3}
                placeholder="Observation sur le groupe..."
                className="w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              type="submit"
              className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              Publier
            </button>
            <p className="text-xs text-muted">
              Ce commentaire est ajouté pour la session en cours uniquement. Pour le
              conserver, reportez-le dans <code>data/comments.json</code>.
            </p>
          </form>
        </Card>
      )}

      {filtered.length === 0 ? (
        <p className="text-sm text-muted">Aucun commentaire pour ce filtre.</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((c) => {
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
  );
}
