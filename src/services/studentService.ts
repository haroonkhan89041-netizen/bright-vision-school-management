import { supabase, supabaseConfigured } from "../lib/supabase";

export type StudentRecord = {
  id: string;
  admission_no: string;
  full_name: string;
  father_name: string | null;
  class_id: string | null;
  section: string | null;
  roll_no: string | null;
  phone: string | null;
  status: string;
};

export async function listStudents() {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase
    .from("students")
    .select("id, admission_no, full_name, father_name, class_id, section, roll_no, phone, status")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data as StudentRecord[];
}

export async function createStudent(student: Omit<StudentRecord, "id">) {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.from("students").insert(student).select().single();
  if (error) throw error;
  return data as StudentRecord;
}

export async function updateStudent(id: string, changes: Partial<Omit<StudentRecord, "id">>) {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.from("students").update(changes).eq("id", id).select().single();
  if (error) throw error;
  return data as StudentRecord;
}

export async function deleteStudent(id: string) {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
}
