"use client";

import { useEffect, useState } from "react";
import Card from "@/components/Card";

const PASSWORD_HASH =
  "7d4354b767722e639a0222ce1972f1e1ae52416fa13a752f608d42f0565f1279";
const SESSION_KEY = "igrh-week-admin";

async function sha256(text: string): Promise<string> {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(digest))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

const DATASETS = [
  { key: "groups", label: "groups.json", desc: "21 groupes et composition" },
  { key: "attendance", label: "attendance.json", desc: "Présences par jour" },
  { key: "comments", label: "comments.json", desc: "Commentaires de suivi" },
  { key: "notes", label: "notes.json", desc: "Notes CC et partiel" },
  { key: "rooms", label: "rooms.json", desc: "Salles par jour" },
  { key: "briefs", label: "briefs.json", desc: "Briefs des 5 jours" },
  { key: "documents", label: "documents.json", desc: "Documents utiles" },
] as const;

export default function AdminPanel({
  data,
}: {
  data: Record<string, unknown>;
}) {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

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

  function downloadJson(key: string, label: string) {
    const blob = new Blob([JSON.stringify(data[key], null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = label;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
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
              className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm outline-none focus:border-primary"
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

      <Card>
        <h2 className="mb-1 text-sm font-semibold text-foreground">
          Modifier les données
        </h2>
        <p className="text-sm text-muted">
          Les données se modifient en éditant les fichiers dans{" "}
          <code className="rounded bg-black/5 px-1 py-0.5">/data</code>, puis en
          redéployant le site. Utilisez les exports ci-dessous comme base de travail.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {DATASETS.map((d) => (
          <Card key={d.key} className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">{d.label}</p>
              <p className="text-xs text-muted">{d.desc}</p>
            </div>
            <button
              onClick={() => downloadJson(d.key, d.label)}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-black/5"
            >
              Exporter
            </button>
          </Card>
        ))}
      </div>
    </div>
  );
}
