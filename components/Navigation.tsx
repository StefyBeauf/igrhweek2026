"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/suivi-journalier", label: "Suivi journalier" },
  { href: "/groupes", label: "Équipes" },
  { href: "/assiduite", label: "Assiduité" },
  { href: "/notes-cc", label: "Notes CC" },
  { href: "/partiel", label: "Partiel" },
  { href: "/profs-presents", label: "Profs présents" },
  { href: "/salles", label: "Salles" },
  { href: "/documents", label: "Documents" },
] as const;

function LockIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
      <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

export default function Navigation() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-20 border-b border-accent/15 bg-ink/95 backdrop-blur supports-[backdrop-filter]:bg-ink/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 pt-3 sm:px-6 md:px-8">
        <Link href="/suivi-journalier" className="shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-accent">
            IGRH Week
          </p>
          <p className="font-serif text-[15px] font-medium leading-tight text-foreground">
            Espace Formateurs
          </p>
        </Link>
      </div>

      <nav
        className="mx-auto flex max-w-6xl items-center gap-5 overflow-x-auto px-4 pb-0 pt-3 sm:gap-6 sm:px-6 md:px-8 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        aria-label="Navigation principale"
      >
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "shrink-0 whitespace-nowrap border-b-2 pb-3 text-[13px] font-medium tracking-wide transition-colors",
                active
                  ? "border-accent text-accent"
                  : "border-transparent text-foreground/55 hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href="/admin"
          className={cn(
            "ml-auto flex shrink-0 items-center gap-1.5 whitespace-nowrap border-b-2 pb-3 text-[13px] font-medium tracking-wide transition-colors",
            pathname?.startsWith("/admin")
              ? "border-accent text-accent"
              : "border-transparent text-foreground/55 hover:text-foreground"
          )}
        >
          <LockIcon />
          Administrateur
        </Link>
      </nav>
    </header>
  );
}
