"use client";

import Card from "@/components/Card";
import { useSharedData } from "@/lib/useSharedData";

export default function EdusignImport() {
  const [raw, setRaw] = useSharedData<string>("edusign", "");

  function download() {
    const blob = new Blob([raw], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "edusign-brut.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <Card>
      <div className="mb-1 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-foreground">Données Edusign (brutes)</h2>
        {raw && (
          <button
            onClick={download}
            className="text-xs font-medium text-accent hover:underline"
          >
            Télécharger
          </button>
        )}
      </div>
      <p className="mb-3 text-sm text-muted">
        Collez ici l&apos;export brut d&apos;Edusign (CSV ou texte tel quel) — pas de mise
        en forme automatique, juste un endroit commun pour le conserver et le
        retrouver.
      </p>
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder="Collez l'export Edusign ici..."
        rows={12}
        className="w-full resize-y rounded-xl border border-border bg-surface px-3 py-2.5 font-mono text-xs outline-none focus:border-accent"
      />
      <p className="mt-2 text-xs text-muted">
        Sauvegarde automatique, partagée avec toute l&apos;équipe.
      </p>
    </Card>
  );
}
