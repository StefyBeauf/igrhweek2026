import groupsData from "@/data/groups.json";
import daysData from "@/data/days.json";
import attendanceData from "@/data/attendance.json";
import roomsData from "@/data/rooms.json";
import briefsData from "@/data/briefs.json";
import commentsData from "@/data/comments.json";
import notesData from "@/data/notes.json";
import notesCcData from "@/data/notes-cc.json";
import partielData from "@/data/partiel.json";
import profsData from "@/data/profs.json";
import documentsData from "@/data/documents.json";
import logisticsData from "@/data/logistics.json";
import soutenanceData from "@/data/soutenance.json";

export type Specialty = "RH" | "FI" | "CACG";

export type Student = {
  name: string;
  prenom: string;
  nom: string;
  specialty: Specialty;
};

export type Group = {
  id: string;
  name: string;
  students: Student[];
  /** false = groupe fermé (n'existe plus dans le séminaire), conservé pour
   * l'historique plutôt que supprimé. Absent ou true = groupe actif. */
  actif?: boolean;
};

export function isGroupActive(g: Group): boolean {
  return g.actif !== false;
}

export type Day = {
  key: string;
  label: string;
  date: string;
};

export type AttendanceStatus = "Présent" | "Absent" | "Retard";

/** Un étudiant est pointé jusqu'à 4 fois par jour (4 QR codes Edusign par
 * journée). `checks` garde chaque pointage dans l'ordre chronologique,
 * plutôt qu'un seul statut qui écraserait les pointages précédents. */
export type AttendanceEntry = {
  name: string;
  checks: AttendanceStatus[];
};

export function latestCheck(entry: AttendanceEntry): AttendanceStatus | undefined {
  return entry.checks[entry.checks.length - 1];
}

export type Brief = {
  day: string;
  date: string;
  titre: string;
  general?: string[];
  parSpecialite: Record<Specialty, string[]>;
  salles: string[];
};

export type GroupComment = {
  groupId: string;
  rh: string;
  cacg: string;
  fi: string;
};

export type CommentsByDay = Record<string, GroupComment[]>;

export type NoteEntry = {
  groupId: string;
  etudiant: string;
  note: number;
  commentaire: string;
};

export type DocumentAudience = "formateurs" | "etudiants";

export type Document = {
  id: string;
  titre: string;
  audience: DocumentAudience;
  specialty?: Specialty;
  url: string;
  version?: string;
  featured?: boolean;
};

export type SpecialtyNote = {
  note: number | null;
  commentaire: string;
};

export const FI_LIVRABLE_JOURS = ["lundi", "mardi", "mercredi", "jeudi"] as const;
export type FiLivrableJour = (typeof FI_LIVRABLE_JOURS)[number];
export const FI_LIVRABLE_MAX = 5;

export type FiNoteCC = {
  livrables: Record<FiLivrableJour, number | null>;
  commentaire: string;
};

export function fiTotal(fi: FiNoteCC): number {
  return FI_LIVRABLE_JOURS.reduce((sum, j) => sum + (fi.livrables[j] ?? 0), 0);
}

export const CACG_CHALLENGES = [
  { key: "challenge1", label: "Challenge 1", max: 20 },
  { key: "challenge2", label: "Challenge 2", max: 15 },
  { key: "challenge3", label: "Challenge 3", max: 10 },
] as const;
export type CacgChallengeKey = (typeof CACG_CHALLENGES)[number]["key"];
export const CACG_CHALLENGES_MAX_TOTAL = CACG_CHALLENGES.reduce(
  (sum, c) => sum + c.max,
  0
);

export type CacgNoteCC = {
  scores: Record<CacgChallengeKey, number | null>;
  commentaire: string;
};

/** Les 3 challenges (/20, /15, /10) sont ramenés à une note finale sur 20,
 * au prorata du total obtenu sur le total maximum possible (45). */
export function cacgTotal(cacg: CacgNoteCC): number {
  const raw = CACG_CHALLENGES.reduce((sum, c) => sum + (cacg.scores[c.key] ?? 0), 0);
  return Math.round(((raw / CACG_CHALLENGES_MAX_TOTAL) * 20) * 10) / 10;
}

export type NotesCcEntry = {
  groupId: string;
  fi: FiNoteCC;
  cacg: CacgNoteCC;
  rh: SpecialtyNote;
};

export const PARTIEL_CRITERES = [
  { key: "comprehension", label: "Compréhension des enjeux", max: 4 },
  { key: "coherence", label: "Cohérence interdisciplinaire", max: 4 },
  { key: "recommandations", label: "Pertinence des recommandations", max: 4 },
  { key: "argumentation", label: "Argumentation & prise de décision", max: 3 },
  { key: "presentation", label: "Qualité de la présentation", max: 3 },
  { key: "dynamique", label: "Dynamique collective", max: 2 },
] as const;

export type CritereKey = (typeof PARTIEL_CRITERES)[number]["key"];

export type PartielEvaluation = {
  groupId: string;
  scores: Record<CritereKey, number | null>;
  commentaire: string;
  evalue: boolean;
};

export type Prof = {
  name: string;
  specialite: Specialty;
};

export type DayPeriod = "matin" | "apresmidi";

export type ProfPlanning = Record<
  string,
  Record<DayPeriod, Record<Specialty, string[]>>
>;

export const groups: Group[] = groupsData as Group[];
export const days: Day[] = daysData as Day[];
export const attendance: Record<string, Record<string, AttendanceEntry[]>> =
  attendanceData as Record<string, Record<string, AttendanceEntry[]>>;
export const rooms: Record<string, { groupId: string; room: string }[]> =
  roomsData;
export const briefs: Brief[] = briefsData as Brief[];
export const comments: CommentsByDay = commentsData as CommentsByDay;
export const notes: { cc: NoteEntry[]; partiel: NoteEntry[] } = notesData;
export const notesCc: NotesCcEntry[] = notesCcData as NotesCcEntry[];
export const partiel: { evaluations: PartielEvaluation[] } = partielData as {
  evaluations: PartielEvaluation[];
};
export const profs: Prof[] = (profsData as { profs: Prof[] }).profs;
export const profsPlanning: ProfPlanning = (
  profsData as { planning: ProfPlanning }
).planning;
export const documents: Document[] = documentsData as Document[];

export type Logistics = {
  site: string;
  salles: { groupeDebut: number; groupeFin: number; salle: string }[];
};

export const logistics: Logistics = logisticsData as Logistics;

export function logisticsTranches(groups: Group[]) {
  return logistics.salles.map((s) => ({
    ...s,
    label: `Groupes ${s.groupeDebut} à ${s.groupeFin}`,
    groups: groups.slice(s.groupeDebut - 1, s.groupeFin),
  }));
}

export function partielTotal(scores: Record<CritereKey, number | null>): number {
  return PARTIEL_CRITERES.reduce((sum, c) => sum + (scores[c.key] ?? 0), 0);
}

export const PARTIEL_MAX_TOTAL = PARTIEL_CRITERES.reduce(
  (sum, c) => sum + c.max,
  0
);

export type SoutenanceCreneau = {
  horaire: string;
  jury1: string;
  jury2: string;
  jury3: string | null;
};

export type SoutenancePeriode = {
  periode: string;
  horaire: string;
  creneaux: SoutenanceCreneau[];
};

export type SoutenanceJury = {
  nom: string;
  rh: string;
  cacg: string;
  finance: string;
};

export type Soutenance = {
  planning: SoutenancePeriode[];
  jurys: SoutenanceJury[];
  continuite: string[];
  organisation: {
    groupesEvalues: string;
    finDesPassages: string;
    jurysSimultanes: string;
    harmonisation: string;
    coordination: string;
  };
};

export const soutenance: Soutenance = soutenanceData as Soutenance;

export function getGroupById(id: string): Group | undefined {
  return groups.find((g) => g.id === id);
}

export function getBriefByDay(day: string): Brief | undefined {
  return briefs.find((b) => b.day === day);
}

export function getTodayKey(): string {
  const todayIndex = new Date().getDay(); // 0=dim,1=lun,...5=ven,6=sam
  const map: Record<number, string> = {
    1: "lundi",
    2: "mardi",
    3: "mercredi",
    4: "jeudi",
    5: "vendredi",
  };
  return map[todayIndex] ?? "lundi";
}

export type AlertLevel = "normal" | "vigilance" | "alerte";

export type GroupAttendanceStat = {
  groupId: string;
  groupName: string;
  total: number;
  present: number;
  absent: number;
  retard: number;
  level: AlertLevel;
};

export function alertLevelFor(absent: number, retard: number): AlertLevel {
  if (absent >= 2) return "alerte";
  if (absent >= 1 || retard >= 2) return "vigilance";
  return "normal";
}

export function getAttendanceStatsForDay(day: string): GroupAttendanceStat[] {
  const dayData = attendance[day] ?? {};
  return groups.map((g) => {
    const entries = dayData[g.id] ?? [];
    const present = entries.filter((e) => latestCheck(e) === "Présent").length;
    const absent = entries.filter((e) => latestCheck(e) === "Absent").length;
    const retard = entries.filter((e) => latestCheck(e) === "Retard").length;
    return {
      groupId: g.id,
      groupName: g.name,
      total: entries.length,
      present,
      absent,
      retard,
      level: alertLevelFor(absent, retard),
    };
  });
}

export function searchGroupsAndStudents(query: string): Group[] {
  const q = query.trim().toLowerCase();
  if (!q) return groups;
  return groups.filter((g) => {
    if (g.name.toLowerCase().includes(q) || g.id.toLowerCase().includes(q)) {
      return true;
    }
    return g.students.some((s) => s.name.toLowerCase().includes(q));
  });
}
