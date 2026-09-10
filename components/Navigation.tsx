"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/aujourd-hui", label: "Aujourd'hui", icon: "home" },
  { href: "/groupes", label: "Groupes", icon: "users" },
  { href: "/suivi", label: "Suivi", icon: "message" },
  { href: "/presences", label: "Présences", icon: "check" },
  { href: "/notes", label: "Notes", icon: "star" },
  { href: "/documents", label: "Documents", icon: "file" },
  { href: "/salles", label: "Salles", icon: "map" },
] as const;

function Icon({ name, className }: { name: string; className?: string }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
  };
  switch (name) {
    case "home":
      return (
        <svg {...common}>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
        </svg>
      );
    case "users":
      return (
        <svg {...common}>
          <circle cx="9" cy="8" r="3.2" />
          <path d="M2.5 20c.6-3.6 3.3-5.5 6.5-5.5s5.9 1.9 6.5 5.5" />
          <circle cx="17.5" cy="8.5" r="2.5" />
          <path d="M15.5 14.6c2.6.4 4.5 2.1 5 5.4" />
        </svg>
      );
    case "message":
      return (
        <svg {...common}>
          <path d="M4 5h16v11H8l-4 4z" />
        </svg>
      );
    case "check":
      return (
        <svg {...common}>
          <rect x="3.5" y="4" width="17" height="16" rx="2.5" />
          <path d="M8 12.5 11 15.5 16.5 9" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="M12 3.5 14.6 9l6 .9-4.3 4.2 1 6-5.3-2.8-5.3 2.8 1-6L3.4 9.9l6-.9z" />
        </svg>
      );
    case "file":
      return (
        <svg {...common}>
          <path d="M7 3h7l4 4v14H7z" />
          <path d="M14 3v4h4" />
        </svg>
      );
    case "map":
      return (
        <svg {...common}>
          <path d="M9 4 3.5 6v14L9 18l6 2 5.5-2V4L15 6 9 4Z" />
          <path d="M9 4v14M15 6v14" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="5" y="10.5" width="14" height="9.5" rx="2" />
          <path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" />
        </svg>
      );
    default:
      return null;
  }
}

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:border-r md:border-border md:bg-surface">
        <div className="px-6 py-6">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">
            IGRH Week
          </p>
          <h1 className="mt-1 text-lg font-semibold text-foreground">
            Espace Formateurs
          </h1>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground/80 hover:bg-black/5"
                )}
              >
                <Icon name={item.icon} />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <Link
            href="/admin"
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition",
              pathname?.startsWith("/admin")
                ? "bg-primary text-primary-foreground"
                : "text-muted hover:bg-black/5"
            )}
          >
            <Icon name="lock" />
            Admin
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 md:hidden">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
            IGRH Week
          </p>
          <h1 className="text-base font-semibold text-foreground">
            Espace Formateurs
          </h1>
        </div>
        <Link
          href="/admin"
          className="rounded-full p-2 text-muted hover:bg-black/5"
          aria-label="Admin"
        >
          <Icon name="lock" />
        </Link>
      </header>

      {/* Mobile bottom tab bar */}
      <nav className="fixed inset-x-0 bottom-0 z-20 flex justify-between border-t border-border bg-surface px-1 pb-[env(safe-area-inset-bottom)] md:hidden">
        {NAV_ITEMS.map((item) => {
          const active = pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-0.5 py-2 text-[10px] font-medium",
                active ? "text-primary" : "text-muted"
              )}
            >
              <Icon name={item.icon} />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
