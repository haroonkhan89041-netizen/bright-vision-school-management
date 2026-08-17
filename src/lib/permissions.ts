import type { Role } from "./types";

export type Permission =
  | "dashboard.view"
  | "students.view" | "students.manage"
  | "teachers.view" | "teachers.manage"
  | "classes.view" | "classes.manage"
  | "subjects.view" | "subjects.manage"
  | "attendance.view" | "attendance.manage"
  | "fees.view" | "fees.manage"
  | "exams.view" | "exams.manage"
  | "timetable.view" | "timetable.manage"
  | "notices.view" | "notices.manage"
  | "reports.view"
  | "users.view" | "users.manage"
  | "settings.view" | "settings.manage";

const permissions: Record<Role, Permission[]> = {
  admin: [
    "dashboard.view","students.view","students.manage","teachers.view","teachers.manage",
    "classes.view","classes.manage","subjects.view","subjects.manage","attendance.view","attendance.manage",
    "fees.view","fees.manage","exams.view","exams.manage","timetable.view","timetable.manage",
    "notices.view","notices.manage","reports.view","users.view","users.manage","settings.view","settings.manage",
  ],
  teacher: [
    "dashboard.view","students.view","students.manage","teachers.view","classes.view","subjects.view",
    "attendance.view","attendance.manage","exams.view","exams.manage","timetable.view","notices.view","reports.view",
  ],
  accountant: ["dashboard.view","students.view","fees.view","fees.manage","reports.view"],
  staff: ["dashboard.view","students.view","teachers.view","classes.view","subjects.view","attendance.view","fees.view","exams.view","timetable.view","notices.view","reports.view"],
  student: ["dashboard.view","students.view","subjects.view","attendance.view","fees.view","exams.view","timetable.view","notices.view"],
  parent: ["dashboard.view","students.view","attendance.view","fees.view","exams.view","timetable.view","notices.view"],
};

export function can(role: Role, permission: Permission): boolean {
  return permissions[role]?.includes(permission) ?? false;
}

export function permissionsFor(role: Role): Permission[] {
  return permissions[role] ?? [];
}
