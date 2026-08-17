import { supabase, supabaseConfigured } from "../lib/supabase";

export type TeacherRecord = {
  id: string;
  employee_no: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  designation: string | null;
  department: string | null;
  status: string;
};

function client() {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  return supabase;
}

export async function listTeachers() {
  const { data, error } = await client().from("teachers").select("id, employee_no, full_name, email, phone, designation, department, status").order("created_at", { ascending: false });
  if (error) throw error;
  return data as TeacherRecord[];
}

export async function createTeacher(teacher: Omit<TeacherRecord, "id">) {
  const { data, error } = await client().from("teachers").insert(teacher).select().single();
  if (error) throw error;
  return data as TeacherRecord;
}

export async function updateTeacher(id: string, changes: Partial<Omit<TeacherRecord, "id">>) {
  const { data, error } = await client().from("teachers").update(changes).eq("id", id).select().single();
  if (error) throw error;
  return data as TeacherRecord;
}

export async function deleteTeacher(id: string) {
  const { error } = await client().from("teachers").delete().eq("id", id);
  if (error) throw error;
}
