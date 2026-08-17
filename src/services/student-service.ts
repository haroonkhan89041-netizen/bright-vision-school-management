import type { Student } from "../lib/types";
import { supabase, supabaseConfigured } from "../lib/supabase";

export type StudentInput = Omit<Student, "id"> & { id?: string };

type StudentRow = {
  id: string;
  student_id: string;
  admission_number: string;
  full_name: string;
  father_name: string;
  mother_name: string;
  date_of_birth: string;
  gender: "male" | "female";
  class_id: string;
  section: string;
  roll_number: string;
  phone: string;
  address: string;
  admission_date: string;
  photo_url: string | null;
  status: "active" | "inactive";
};

const toStudent = (row: StudentRow): Student => ({
  id: row.id,
  studentId: row.student_id,
  admissionNumber: row.admission_number,
  fullName: row.full_name,
  fatherName: row.father_name,
  motherName: row.mother_name,
  dateOfBirth: row.date_of_birth,
  gender: row.gender,
  classId: row.class_id,
  section: row.section,
  rollNumber: row.roll_number,
  phone: row.phone,
  address: row.address,
  admissionDate: row.admission_date,
  photoUrl: row.photo_url ?? undefined,
  status: row.status,
});

const toRow = (input: StudentInput) => ({
  student_id: input.studentId,
  admission_number: input.admissionNumber,
  full_name: input.fullName,
  father_name: input.fatherName,
  mother_name: input.motherName,
  date_of_birth: input.dateOfBirth,
  gender: input.gender,
  class_id: input.classId,
  section: input.section,
  roll_number: input.rollNumber,
  phone: input.phone,
  address: input.address,
  admission_date: input.admissionDate,
  photo_url: input.photoUrl ?? null,
  status: input.status,
});

/** Real Student CRUD. UI can keep using this service while demo data remains available as fallback. */
export async function listStudents(): Promise<Student[]> {
  if (!supabaseConfigured || !supabase) return [];
  const { data, error } = await supabase.from("students").select("*").order("full_name");
  if (error) throw error;
  return (data as StudentRow[]).map(toStudent);
}

export async function createStudent(input: StudentInput): Promise<Student> {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.from("students").insert(toRow(input)).select("*").single();
  if (error) throw error;
  return toStudent(data as StudentRow);
}

export async function updateStudent(id: string, input: StudentInput): Promise<Student> {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.from("students").update(toRow(input)).eq("id", id).select("*").single();
  if (error) throw error;
  return toStudent(data as StudentRow);
}

export async function deleteStudent(id: string): Promise<void> {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { error } = await supabase.from("students").delete().eq("id", id);
  if (error) throw error;
}
