import Link from "next/link";
import Card from "@/components/Card";
import Badge, { specialtyTone } from "@/components/Badge";
import type { Group } from "@/lib/data";

export default function GroupCard({ group }: { group: Group }) {
  const specialties = Array.from(new Set(group.students.map((s) => s.specialty)));
  return (
    <Link href={`/groupes/${group.id}`}>
      <Card className="h-full transition hover:border-primary/40 hover:shadow-md">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted">
              {group.id}
            </p>
            <h3 className="mt-0.5 text-base font-semibold text-foreground">
              {group.name}
            </h3>
          </div>
          <span className="rounded-full bg-black/5 px-2.5 py-1 text-xs font-medium text-muted">
            {group.students.length} étud.
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {specialties.map((sp) => (
            <Badge key={sp} tone={specialtyTone(sp)}>
              {sp}
            </Badge>
          ))}
        </div>
      </Card>
    </Link>
  );
}
