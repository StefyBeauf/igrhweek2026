import { cn } from "@/lib/utils";

type Tone = "neutral" | "success" | "warning" | "danger" | "accent" | "info";

const tones: Record<Tone, string> = {
  neutral: "border-foreground/15 bg-foreground/5 text-foreground/80",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  danger: "border-danger/30 bg-danger/10 text-danger",
  accent: "border-accent/30 bg-accent/10 text-accent",
  info: "border-info/30 bg-info/10 text-info",
};

export default function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function statusTone(status: string): Tone {
  if (status === "Présent") return "success";
  if (status === "Retard") return "warning";
  if (status === "Absent") return "danger";
  return "neutral";
}

export function specialtyTone(specialty: string): Tone {
  if (specialty === "RH") return "success";
  if (specialty === "CACG") return "accent";
  if (specialty === "FI") return "info";
  return "neutral";
}
