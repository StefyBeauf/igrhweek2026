import Card from "@/components/Card";
import { cn } from "@/lib/utils";
import type { Group, Soutenance } from "@/lib/data";

const JURY_COLUMNS = ["jury1", "jury2", "jury3"] as const;

function groupIdFromName(groups: Group[], name: string): string | undefined {
  return groups.find((g) => g.name === name)?.id;
}

export default function SoutenancePlanning({
  soutenance,
  groups,
}: {
  soutenance: Soutenance;
  groups: Group[];
}) {
  return (
    <div className="space-y-6">
      {soutenance.confidentialite && (
        <div className="rounded-xl border border-warning/40 bg-warning/10 px-4 py-3 text-sm text-warning">
          <span className="font-semibold uppercase tracking-wide">Usage interne — </span>
          {soutenance.confidentialite}
        </div>
      )}

      <div>
        <h2 className="mb-1 text-base font-semibold text-foreground">{soutenance.titre}</h2>
        <p className="text-sm text-foreground/80">{soutenance.intro}</p>
        <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted">
          <span>
            Début <span className="font-semibold text-foreground">{soutenance.debut}</span>
          </span>
          <span>
            Fin <span className="font-semibold text-foreground">{soutenance.fin}</span>
          </span>
          <span>
            Groupes{" "}
            <span className="font-semibold text-foreground">
              {soutenance.organisation.groupesEvalues}
            </span>
          </span>
          <span>
            Jurys simultanés{" "}
            <span className="font-semibold text-foreground">
              {soutenance.organisation.jurysSimultanes}
            </span>
          </span>
        </div>
        <p className="mt-2 text-xs text-muted">{soutenance.dureePassage}</p>
      </div>

      {soutenance.planning.map((periode) => (
        <div key={periode.periode} className="space-y-2.5">
          <div className="flex items-baseline gap-2">
            <h3 className="text-sm font-semibold text-foreground">{periode.periode}</h3>
            <span className="text-xs text-muted">{periode.horaire}</span>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-border">
            <table className="w-full min-w-[520px] border-collapse text-sm">
              <thead>
                <tr className="bg-ink text-foreground">
                  <th className="px-4 py-2.5 text-left font-semibold">Horaire</th>
                  <th className="border-l border-border/50 px-4 py-2.5 text-left font-semibold">
                    Jury 1
                  </th>
                  <th className="border-l border-border/50 px-4 py-2.5 text-left font-semibold">
                    Jury 2
                  </th>
                  <th className="border-l border-border/50 px-4 py-2.5 text-left font-semibold">
                    Jury 3
                  </th>
                </tr>
              </thead>
              <tbody>
                {periode.creneaux.map((c, i) => (
                  <tr
                    key={c.horaire}
                    className={cn(
                      "border-t border-border",
                      i % 2 === 1 && "bg-foreground/[0.02]"
                    )}
                  >
                    <td className="px-4 py-2.5 font-medium text-foreground">{c.horaire}</td>
                    {JURY_COLUMNS.map((col) => {
                      const value = c[col];
                      return (
                        <td
                          key={col}
                          className="border-l border-border/30 px-4 py-2.5 text-foreground/90"
                        >
                          {!value ? (
                            <span className="text-muted">Libre</span>
                          ) : value === "Battement" ? (
                            <span className="text-xs italic text-muted">Battement</span>
                          ) : (
                            <a
                              href={`/groupes/${groupIdFromName(groups, value) ?? ""}`}
                              className="hover:text-accent hover:underline"
                            >
                              {value}
                            </a>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {periode.note && <p className="text-xs text-muted">{periode.note}</p>}
        </div>
      ))}

      <div className="space-y-2.5">
        <h3 className="text-sm font-semibold text-foreground">Composition des jurys</h3>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[600px] border-collapse text-sm">
            <thead>
              <tr className="bg-ink text-foreground">
                <th className="px-4 py-2.5 text-left font-semibold">Jury</th>
                <th className="border-l border-border/50 px-4 py-2.5 text-left font-semibold text-success">
                  RH
                </th>
                <th className="border-l border-border/50 px-4 py-2.5 text-left font-semibold text-accent">
                  CACG
                </th>
                <th className="border-l border-border/50 px-4 py-2.5 text-left font-semibold text-info">
                  Finance
                </th>
              </tr>
            </thead>
            <tbody>
              {soutenance.jurys.map((j, i) => (
                <tr
                  key={j.nom}
                  className={cn("border-t border-border", i % 2 === 1 && "bg-foreground/[0.02]")}
                >
                  <td className="px-4 py-2.5 font-medium text-foreground">{j.nom}</td>
                  <td className="border-l border-border/30 px-4 py-2.5 text-foreground/90">{j.rh}</td>
                  <td className="border-l border-border/30 px-4 py-2.5 text-foreground/90">{j.cacg}</td>
                  <td className="border-l border-border/30 px-4 py-2.5 text-foreground/90">
                    {j.finance}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {soutenance.continuite.length > 0 && (
        <Card className="border-l-4 border-accent">
          <h3 className="mb-2 text-sm font-semibold text-foreground">
            Continuité CACG garantie
          </h3>
          <ul className="space-y-1.5 text-sm text-foreground/90">
            {soutenance.continuite.map((c, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-accent">•</span>
                {c}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Organisation finale</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          <div>
            <p className="text-xs text-muted">Groupes évalués</p>
            <p className="text-lg font-semibold text-foreground">
              {soutenance.organisation.groupesEvalues}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Fin des passages</p>
            <p className="text-lg font-semibold text-foreground">
              {soutenance.organisation.finDesPassages}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Jurys simultanés</p>
            <p className="text-lg font-semibold text-foreground">
              {soutenance.organisation.jurysSimultanes}
            </p>
          </div>
          <div>
            <p className="text-xs text-muted">Harmonisation des notes</p>
            <p className="text-lg font-semibold text-foreground">
              {soutenance.organisation.harmonisation}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm text-foreground/90">{soutenance.organisation.coordination}</p>
      </Card>
    </div>
  );
}
