import Card from "@/components/Card";
import Badge from "@/components/Badge";
import { documents } from "@/lib/data";

const CATEGORY_ORDER = [
  "Sujet",
  "Consignes",
  "Planning",
  "Grilles",
  "Supports",
  "Fiches",
  "Autres",
];

export default function DocumentsPage() {
  const categories = CATEGORY_ORDER.filter((cat) =>
    documents.some((d) => d.categorie === cat)
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
          Documents
        </p>
        <h1 className="mt-1 text-2xl md:text-3xl font-serif font-semibold text-foreground">
          Ressources utiles du séminaire
        </h1>
      </div>

      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat}>
            <h2 className="mb-2 text-sm font-semibold text-foreground">{cat}</h2>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {documents
                .filter((d) => d.categorie === cat)
                .map((d) => (
                  <a key={d.id} href={d.url} target="_blank" rel="noopener noreferrer">
                    <Card className="h-full transition hover:border-primary/40 hover:shadow-md">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-medium text-foreground">{d.titre}</p>
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
    </div>
  );
}
