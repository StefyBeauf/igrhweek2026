"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";
import EdusignImport from "./EdusignImport";
import {
  defaultPartielStudent,
  partielTotal,
  studentFinalNote,
  type Group,
  type PartielEvaluation,
  type Specialty,
} from "@/lib/data";

const PASSWORD_HASH =
  "57998cce0b646fe6228ae6c63ec0333bf0fe130f5d4df8230e2f524ae0495c9c";
const SESSION_KEY = "igrh-week-admin";

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Ces jeux de données sont saisis en direct par les formateurs et vivent sur
// le Google Sheets partagé — il faut toujours aller chercher la version la
// plus fraîche au moment de l'export, jamais la version de démarrage.
const LIVE_KEYS = ["notes-cc", "partiel", "comments", "edusign"] as const;
type LiveKey = (typeof LIVE_KEYS)[number];

function isLiveKey(key: string): key is LiveKey {
  return (LIVE_KEYS as readonly string[]).includes(key);
}

async function fetchLive(key: LiveKey): Promise<unknown> {
  try {
    const res = await fetch(`/api/store/${key}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

const DATASETS = [
  { key: "groups", label: "groups.json", desc: "26 groupes et composition" },
  { key: "attendance", label: "attendance.json", desc: "Présences par jour" },
  { key: "comments", label: "comments.json", desc: "Commentaires de suivi (en direct)" },
  { key: "notes-cc", label: "notes-cc.json", desc: "Notes CC — FI, CACG, RH (en direct)" },
  { key: "partiel", label: "partiel.json", desc: "Évaluations du partiel (en direct)" },
  { key: "edusign", label: "edusign.txt", desc: "Export brut Edusign collé en Admin (en direct)" },
  { key: "profs", label: "profs.json", desc: "Formateurs et planning" },
  { key: "logistics", label: "logistics.json", desc: "Site & salles" },
  { key: "briefs", label: "briefs.json", desc: "Briefs des 5 jours" },
  { key: "documents", label: "documents.json", desc: "Documents utiles" },
  { key: "soutenance", label: "soutenance.json", desc: "Planning des soutenances" },
] as const;

function downloadBlob(content: string, filename: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function timestamp() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}h${pad(d.getMinutes())}`;
}

const SPECIALTY_ORDER: Specialty[] = ["RH", "CACG", "FI"];

function csvField(value: string): string {
  return `"${value.replace(/"/g, '""')}"`;
}

function formatNoteCsv(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(1).replace(".", ",");
}

export default function AdminPanel({
  data,
}: {
  data: Record<string, unknown>;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [exportingKey, setExportingKey] = useState<string | null>(null);
  const [backingUp, setBackingUp] = useState(false);
  const [backupDone, setBackupDone] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") {
      setUnlocked(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError("");
    const hash = await sha256(password);
    if (hash === PASSWORD_HASH) {
      sessionStorage.setItem(SESSION_KEY, "1");
      setUnlocked(true);
    } else {
      setError("Mot de passe incorrect.");
    }
    setChecking(false);
  }

  function handleLogout() {
    sessionStorage.removeItem(SESSION_KEY);
    setUnlocked(false);
    setPassword("");
  }

  async function downloadJson(key: string, label: string) {
    setExportingKey(key);
    try {
      let payload: unknown = data[key];
      if (isLiveKey(key)) {
        const live = await fetchLive(key);
        if (live !== null && live !== undefined) payload = live;
      }
      if (key === "edusign") {
        downloadBlob(typeof payload === "string" ? payload : "", label, "text/plain");
      } else {
        downloadBlob(JSON.stringify(payload, null, 2), label, "application/json");
      }
    } finally {
      setExportingKey(null);
    }
  }

  async function downloadPartielIndividuel() {
    setExportingKey("partiel-individuel");
    try {
      const groups = (data.groups as Group[]) ?? [];
      const live = (await fetchLive("partiel")) as { evaluations: PartielEvaluation[] } | null;
      const evaluations = live?.evaluations ?? [];

      type Row = {
        specialty: Specialty;
        nom: string;
        prenom: string;
        groupName: string;
        present: boolean;
        note: number;
        commentaire: string;
      };
      const rows: Row[] = [];

      for (const g of groups) {
        const ev = evaluations.find((e) => e.groupId === g.id);
        const commonTotal = ev ? partielTotal(ev.scores) : 0;
        for (const s of g.students) {
          const se =
            ev?.etudiants?.find((x) => x.name === s.name) ?? defaultPartielStudent(s.name);
          rows.push({
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

      rows.sort((a, b) => {
        const spDiff = SPECIALTY_ORDER.indexOf(a.specialty) - SPECIALTY_ORDER.indexOf(b.specialty);
        if (spDiff !== 0) return spDiff;
        return a.nom.localeCompare(b.nom, "fr");
      });

      const header = ["Spécialité", "Nom", "Prénom", "Groupe", "Présent", "Note /20", "Commentaire"];
      const lines = [header.map(csvField).join(";")];
      for (const r of rows) {
        lines.push(
          [
            r.specialty,
            r.nom,
            r.prenom,
            r.groupName,
            r.present ? "Oui" : "Non",
            formatNoteCsv(r.note),
            r.commentaire,
          ]
            .map((v) => csvField(String(v)))
            .join(";")
        );
      }
      // BOM pour qu'Excel affiche correctement les accents
      downloadBlob(
        "﻿" + lines.join("\r\n"),
        `partiel-notes-individuelles-${timestamp()}.csv`,
        "text/csv;charset=utf-8"
      );
    } finally {
      setExportingKey(null);
    }
  }

  async function downloadFullBackup() {
    setBackingUp(true);
    setBackupDone(false);
    try {
      const liveEntries = await Promise.all(
        LIVE_KEYS.map(async (key) => [key, await fetchLive(key)] as const)
      );
      const live = Object.fromEntries(liveEntries);
      const backup = {
        generatedAt: new Date().toISOString(),
        // Données saisies en direct (Google Sheets) — la partie la plus
        // importante à sauvegarder, elle ne vit qu'à un seul endroit.
        live,
        // Données de référence, déjà versionnées dans le repo mais incluses
        // ici pour avoir un instantané complet en un seul fichier.
        reference: data,
      };
      downloadBlob(
        JSON.stringify(backup, null, 2),
        `sauvegarde-igrhweek-${timestamp()}.json`,
        "application/json"
      );
      setBackupDone(true);
      setTimeout(() => setBackupDone(false), 2500);
    } finally {
      setBackingUp(false);
    }
  }

  if (!unlocked) {
    return (
      <div className="mx-auto max-w-sm">
        <Card>
          <h1 className="mb-1 text-lg font-semibold text-foreground">
            Accès administrateur
          </h1>
          <p className="mb-4 text-sm text-muted">
            Zone réservée aux formateurs pour consulter et exporter les données.
          </p>
          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              autoFocus
              className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-accent"
            />
            {error && <p className="text-sm text-danger">{error}</p>}
            <button
              type="submit"
              disabled={checking}
              className="w-full rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-60"
            >
              {checking ? "Vérification..." : "Se connecter"}
            </button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted">Session administrateur active</p>
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-danger hover:underline"
        >
          Se déconnecter
        </button>
      </div>

      <Card className="border-l-4 border-accent">
        <h2 className="mb-1 text-sm font-semibold text-foreground">
          Sauvegarde complète
        </h2>
        <p className="mb-3 text-sm text-muted">
          Télécharge en un seul fichier tout ce qui est saisi en direct
          (Notes CC, Partiel, Commentaires, Edusign brut) ainsi que les
          données de référence (groupes, présences, briefs, etc.). À faire
          régulièrement pendant le séminaire, par précaution.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadFullBackup}
            disabled={backingUp}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-ink hover:opacity-90 disabled:opacity-60"
          >
            {backingUp ? "Préparation..." : "Télécharger la sauvegarde complète"}
          </button>
          {backupDone && (
            <span className="text-sm font-medium text-success">Téléchargé ✓</span>
          )}
        </div>
      </Card>

      <Card>
        <h2 className="mb-1 text-sm font-semibold text-foreground">
          Modifier les données
        </h2>
        <p className="text-sm text-muted">
          Les données de référence (groupes, briefs, plannings...) se
          modifient en éditant les fichiers dans{" "}
          <code className="rounded bg-foreground/5 px-1 py-0.5">/data</code>, puis en
          redéployant le site. « Notes CC », « Partiel », « Commentaires » et
          « Edusign brut » sont saisis en direct par les formateurs et n&apos;ont
          pas besoin de redéploiement — les exports ci-dessous récupèrent
          toujours leur toute dernière version.
        </p>
      </Card>

      <Card>
        <h2 className="mb-1 text-sm font-semibold text-foreground">
          Notes individuelles du partiel
        </h2>
        <p className="mb-3 text-sm text-muted">
          Un fichier avec un étudiant par ligne (nom, prénom, groupe, présence,
          note finale, commentaire individuel), trié par spécialité puis par
          ordre alphabétique. Ouvrable directement dans Excel.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={downloadPartielIndividuel}
            disabled={exportingKey === "partiel-individuel"}
            className="rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-ink hover:opacity-90 disabled:opacity-60"
          >
            {exportingKey === "partiel-individuel" ? "Préparation..." : "Exporter les notes individuelles"}
          </button>
        </div>
      </Card>

      <EdusignImport />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DATASETS.map((d) => (
          <Card key={d.key} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{d.label}</p>
              <p className="text-xs text-muted">{d.desc}</p>
            </div>
            <button
              onClick={() => downloadJson(d.key, d.label)}
              disabled={exportingKey === d.key}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-foreground/5 disabled:opacity-60"
            >
              {exportingKey === d.key ? "..." : "Exporter"}
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
