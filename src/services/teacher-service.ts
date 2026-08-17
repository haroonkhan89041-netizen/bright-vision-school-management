import type { Teacher } from "../lib/types";
import { supabase, supabaseConfigured } from "../lib/supabase";

export type TeacherInput = Omit<Teacher, "id"> & { id?: string };

type TeacherRow = {
  id: string;
  teacher_id: string;
  full_name: string;
  email: string;
  phone: string;
  subject: string;
  assigned_classes: string[] | null;
  joining_date: string;
  status: "active" | "inactive";
};

const toTeacher = (row: TeacherRow): Teacher => ({
  id: row.id,
  teacherId: row.teacher_id,
  fullName: row.full_name,
  email: row.email,
  phone: row.phone,
  subject: row.subject,
  assignedClasses: row.assigned_classes ?? [],
  joiningDate: row.joining_date,
  status: row.status,
});

const toRow = (input: TeacherInput) => ({
  teacher_id: input.teacherId,
  full_name: input.fullName,
  email: input.email,
  phone: input.phone,
  subject: input.subject,
  assigned_classes: input.assignedClasses,
  joining_date: input.joiningDate,
  status: input.status,
});

export async function listTeachers(): Promise<Teacher[]> {
  if (!supabaseConfigured || !supabase) return [];
  const { data, error } = await supabase.from("teachers").select("*").order("full_name");
  if (error) throw error;
  return (data as TeacherRow[]).map(toTeacher);
}

export async function createTeacher(input: TeacherInput): Promise<Teacher> {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.from("teachers").insert(toRow(input)).select("*").single();
  if (error) throw error;
  return toTeacher(data as TeacherRow);
}

export async function updateTeacher(id: string, input: TeacherInput): Promise<Teacher> {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.from("teachers").update(toRow(input)).eq("id", id).select("*").single();
  if (error) throw error;
  return toTeacher(data as TeacherRow);
}

export async function deleteTeacher(id: string): Promise<void> {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("teachers").delete().eq("id", id);
  if (error) throw error;
}
