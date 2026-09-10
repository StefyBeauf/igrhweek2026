import groupsData from "@/data/groups.json";
import daysData from "@/data/days.json";
import attendanceData from "@/data/attendance.json";
import roomsData from "@/data/rooms.json";
import briefsData from "@/data/briefs.json";
import commentsData from "@/data/comments.json";
import notesData from "@/data/notes.json";
import documentsData from "@/data/documents.json";

export type Specialty = "RH" | "Finance" | "CACG";

export type Student = {
  name: string;
  specialty: Specialty;
};

export type Group = {
  id: string;
  name: string;
  students: Student[];
};

export type Day = {
  key: string;
  label: string;
  date: string;
};

export type AttendanceStatus = "Présent" | "Absent" | "Retard";

export type AttendanceEntry = {
  name: string;
  status: AttendanceStatus;
};

export type Brief = {
  day: string;
  date: string;
  titre: string;
  objectifs: string[];
  livrables: string[];
  intervenants: string[];
  salles: string[];
  alertes: string[];
};

export type Comment = {
  id: string;
  groupId: string;
  day: string;
  specialty: Specialty;
  auteur: string;
  texte: string;
  date: string;
};

export type NoteEntry = {
  groupId: string;
  etudiant: string;
  note: number;
  commentaire: string;
};

export type Document = {
  id: string;
  titre: string;
  categorie: string;
  url: string;
};

export const groups: Group[] = groupsData as Group[];
export const days: Day[] = daysData as Day[];
export const attendance: Record<string, Record<string, AttendanceEntry[]>> =
  attendanceData as Record<string, Record<string, AttendanceEntry[]>>;
export const rooms: Record<string, { groupId: string; room: string }[]> =
  roomsData;
export const briefs: Brief[] = briefsData as Brief[];
export const comments: Comment[] = commentsData as Comment[];
export const notes: { cc: NoteEntry[]; partiel: NoteEntry[] } = notesData;
export const documents: Document[] = documentsData as Document[];

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

export function findRoomForGroup(day: string, groupId: string): string | undefined {
  return rooms[day]?.find((r) => r.groupId === groupId)?.room;
}
