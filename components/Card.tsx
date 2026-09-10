import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-border bg-surface p-5 shadow-[0_1px_0_0_rgba(242,236,224,0.03)_inset,0_12px_24px_-16px_rgba(0,0,0,0.6)]",
        className
      )}
    >
      {children}
    </div>
  );
}
