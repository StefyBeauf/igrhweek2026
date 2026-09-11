import Card from "@/components/Card";
import { cn } from "@/lib/utils";
import { documents } from "@/lib/data";
import type { Document, DocumentAudience, Specialty } from "@/lib/data";

const SPECIALTY_ORDER: Specialty[] = ["RH", "CACG", "FI"];

const SPECIALTY_STYLE: Record<Specialty, { text: string; dot: string; border: string }> = {
  RH: { text: "text-success", dot: "bg-success", border: "border-success/25" },
  CACG: { text: "text-accent", dot: "bg-accent", border: "border-accent/25" },
  FI: { text: "text-info", dot: "bg-info", border: "border-info/25" },
};

const AUDIENCES: { key: DocumentAudience; label: string }[] = [
  { key: "formateurs", label: "Formateurs" },
  { key: "etudiants", label: "Étudiants" },
];

function DocumentCard({ doc }: { doc: Document }) {
  return (
    <a href={doc.url} target="_blank" rel="noopener noreferrer">
      <Card
        className={cn(
          "h-full border-l-4 transition hover:shadow-md",
          SPECIALTY_STYLE[doc.specialty].border
        )}
      >
        <p className="text-sm font-medium text-foreground">{doc.titre}</p>
        <p className="mt-2 truncate text-xs text-muted">{doc.url}</p>
      </Card>
    </a>
  );
}

export default function DocumentsPage() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Documents
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-serif font-normal text-foreground after:mt-3 after:block after:h-px after:w-10 after:bg-accent after:content-['']">
          Ressources utiles du séminaire
        </h1>
      </div>

      {AUDIENCES.map(({ key, label }) => {
        const audienceDocs = documents.filter((d) => d.audience === key);
        return (
          <div key={key} className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.15em] text-foreground">
              {label}
            </h2>

            {audienceDocs.length === 0 ? (
              <p className="text-sm text-muted">
                Aucun document pour le moment. Ils seront ajoutés au fil du séminaire.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {SPECIALTY_ORDER.map((sp) => {
                  const docs = audienceDocs.filter((d) => d.specialty === sp);
                  return (
                    <div key={sp} className="space-y-2.5">
                      <p
                        className={cn(
                          "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide",
                          SPECIALTY_STYLE[sp].text
                        )}
                      >
                        <span className={cn("h-1.5 w-1.5 rounded-full", SPECIALTY_STYLE[sp].dot)} />
                        {sp}
                      </p>
                      {docs.length === 0 ? (
                        <p className="text-xs text-muted">—</p>
                      ) : (
                        <div className="space-y-2.5">
                          {docs.map((doc) => (
                            <DocumentCard key={doc.id} doc={doc} />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
