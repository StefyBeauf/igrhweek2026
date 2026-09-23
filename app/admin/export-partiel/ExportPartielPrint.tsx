"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  defaultPartielStudent,
  partielTotal,
  studentFinalNote,
  type Group,
  type PartielEvaluation,
  type Specialty,
} from "@/lib/data";

// Doit correspondre à SESSION_KEY dans app/admin/AdminPanel.tsx.
const SESSION_KEY = "igrh-week-admin";

const SPECIALTY_ORDER: Specialty[] = ["RH", "CACG", "FI"];
const SPECIALTY_LABEL: Record<Specialty, string> = {
  RH: "RH",
  CACG: "CACG",
  FI: "Finance",
};

type Row = {
  specialty: Specialty;
  nom: string;
  prenom: string;
  groupName: string;
  present: boolean;
  note: number;
  commentaire: string;
};

function formatNote(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",");
}

export default function ExportPartielPrint({ groups }: { groups: Group[] }) {
  const [authorized, setAuthorized] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    setAuthorized(sessionStorage.getItem(SESSION_KEY) === "1");
  }, []);

  useEffect(() => {
    if (!authorized) return;
    let cancelled = false;
    fetch("/api/store/partiel", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data: { evaluations: PartielEvaluation[] } | null) => {
        if (cancelled) return;
        const evaluations = data?.evaluations ?? [];
        const built: Row[] = [];
        for (const g of groups) {
          const ev = evaluations.find((e) => e.groupId === g.id);
          const commonTotal = ev ? partielTotal(ev.scores) : 0;
          for (const s of g.students) {
            const se =
              ev?.etudiants?.find((x) => x.name === s.name) ?? defaultPartielStudent(s.name);
            built.push({
              specialty: s.specialty,
              nom: s.nom,
              prenom: s.prenom,
              groupName: g.name,
              present: se.present,
              note: studentFinalNote(commonTotal, se),
              commentaire: se.commentaire,
            });
          }
        }
        built.sort((a, b) => {
          const spDiff =
            SPECIALTY_ORDER.indexOf(a.specialty) - SPECIALTY_ORDER.indexOf(b.specialty);
          if (spDiff !== 0) return spDiff;
          return a.nom.localeCompare(b.nom, "fr");
        });
        setRows(built);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });
    return () => {
      cancelled = true;
    };
  }, [authorized, groups]);

  if (authorized === null) return null;

  if (!authorized) {
    return (
      <div className="mx-auto max-w-sm py-10 text-center">
        <p className="mb-3 text-sm text-foreground">
          Accès réservé à l&apos;administrateur.
        </p>
        <Link href="/admin" className="text-sm font-medium text-accent hover:underline">
          Retour à l&apos;administration
        </Link>
      </div>
    );
  }

  return (
    <div className="export-partiel-print">
      <style>{`
        @media print {
          nav, .no-print { display: none !important; }
          body { background: #fff !important; }
          .export-partiel-print { color: #000 !important; }
          .export-partiel-print table { border-color: #999 !important; }
          .export-partiel-print th, .export-partiel-print td { border-color: #999 !important; }
        }
      `}</style>

      <div className="no-print mb-5 flex items-center justify-between">
        <Link href="/admin" className="text-sm font-medium text-accent hover:underline">
          ← Retour à l&apos;administration
        </Link>
        {rows && (
          <button
            onClick={() => window.print()}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-ink hover:opacity-90"
          >
            Télécharger en PDF
          </button>
        )}
      </div>

      <h1 className="mb-1 text-xl font-semibold text-foreground">
        Notes individuelles — Partiel IGRH Week
      </h1>
      <p className="mb-6 text-sm text-muted">
        Généré le {new Date().toLocaleDateString("fr-FR")} — trié par spécialité puis ordre
        alphabétique.
      </p>

      {error && (
        <p className="text-sm text-danger">
          Impossible de récupérer les notes en direct pour le moment. Réessayez dans un instant.
        </p>
      )}

      {!error && !rows && <p className="text-sm text-muted">Chargement des notes...</p>}

      {rows &&
        SPECIALTY_ORDER.map((sp) => {
          const spRows = rows.filter((r) => r.specialty === sp);
          if (spRows.length === 0) return null;
          return (
            <div key={sp} className="mb-8 break-inside-avoid">
              <h2 className="mb-2 text-base font-semibold text-foreground">
                {SPECIALTY_LABEL[sp]}
              </h2>
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-ink text-foreground">
                    <th className="border border-border px-3 py-2 text-left font-semibold">
                      Nom
                    </th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">
                      Prénom
                    </th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">
                      Groupe
                    </th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">
                      Présent
                    </th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">
                      Note /20
                    </th>
                    <th className="border border-border px-3 py-2 text-left font-semibold">
                      Commentaire
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {spRows.map((r) => (
                    <tr key={`${r.groupName}-${r.nom}-${r.prenom}`}>
                      <td className="border border-border px-3 py-1.5">{r.nom}</td>
                      <td className="border border-border px-3 py-1.5">{r.prenom}</td>
                      <td className="border border-border px-3 py-1.5">{r.groupName}</td>
                      <td className="border border-border px-3 py-1.5">
                        {r.present ? "Oui" : "Non"}
                      </td>
                      <td className="border border-border px-3 py-1.5 font-medium">
                        {formatNote(r.note)}
                      </td>
                      <td className="border border-border px-3 py-1.5">{r.commentaire || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })}
    </div>
  );
}
