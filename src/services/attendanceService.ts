import { supabase, supabaseConfigured } from "../lib/supabase";

export type AttendanceRecord = {
  id: string;
  student_id: string;
  attendance_date: string;
  status: string;
  remarks: string | null;
};

function client() { if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured"); return supabase; }

export async function listAttendance(date?: string) {
  let query = client().from("attendance").select("id, student_id, attendance_date, status, remarks").order("attendance_date", { ascending: false });
  if (date) query = query.eq("attendance_date", date);
  const { data, error } = await query;
  if (error) throw error;
  return data as AttendanceRecord[];
}

export async function upsertAttendance(record: Omit<AttendanceRecord, "id">) {
  const { data, error } = await client().from("attendance").upsert(record, { onConflict: "student_id,attendance_date" }).select().single();
  if (error) throw error;
  return data as AttendanceRecord;
}

export async function deleteAttendance(id: string) {
  const { error } = await client().from("attendance").delete().eq("id", id);
  if (error) throw error;
}
