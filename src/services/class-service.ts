import type { SchoolClass } from "../lib/types";
import { supabase, supabaseConfigured } from "../lib/supabase";

export type ClassInput = Omit<SchoolClass, "id"> & { id?: string };

type ClassRow = {
  id: string;
  name: string;
  sections: string[] | null;
  class_teacher_id: string | null;
  student_count: number | null;
};

const toClass = (row: ClassRow): SchoolClass => ({
  id: row.id,
  name: row.name,
  sections: row.sections ?? [],
  classTeacherId: row.class_teacher_id,
  studentCount: row.student_count ?? 0,
});

const toRow = (input: ClassInput) => ({
  name: input.name,
  sections: input.sections,
  class_teacher_id: input.classTeacherId,
  student_count: input.studentCount,
});

export async function listClasses(): Promise<SchoolClass[]> {
  if (!supabaseConfigured || !supabase) return [];
  const { data, error } = await supabase.from("classes").select("*").order("name");
  if (error) throw error;
  return (data as ClassRow[]).map(toClass);
}

export async function createClass(input: ClassInput): Promise<SchoolClass> {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.from("classes").insert(toRow(input)).select("*").single();
  if (error) throw error;
  return toClass(data as ClassRow);
}

export async function updateClass(id: string, input: ClassInput): Promise<SchoolClass> {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.from("classes").update(toRow(input)).eq("id", id).select("*").single();
  if (error) throw error;
  return toClass(data as ClassRow);
}

export async function deleteClass(id: string): Promise<void> {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("classes").delete().eq("id", id);
  if (error) throw error;
}
