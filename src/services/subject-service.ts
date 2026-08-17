import type { Subject } from "../lib/types";
import { supabase, supabaseConfigured } from "../lib/supabase";

export type SubjectInput = Omit<Subject, "id"> & { id?: string };

type SubjectRow = { id: string; name: string; code: string; class_id: string; teacher_id: string | null };
const toSubject = (r: SubjectRow): Subject => ({ id:r.id, name:r.name, code:r.code, classId:r.class_id, teacherId:r.teacher_id });
const toRow = (i: SubjectInput) => ({ name:i.name, code:i.code, class_id:i.classId, teacher_id:i.teacherId ?? null });

export async function listSubjects(): Promise<Subject[]> {
  if (!supabaseConfigured || !supabase) return [];
  const { data, error } = await supabase.from("subjects").select("*").order("name");
  if (error) throw error; return (data as SubjectRow[]).map(toSubject);
}
export async function createSubject(input: SubjectInput): Promise<Subject> {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { data,error } = await supabase.from("subjects").insert(toRow(input)).select("*").single();
  if(error) throw error; return toSubject(data as SubjectRow);
}
export async function updateSubject(id:string,input:SubjectInput):Promise<Subject>{
  if(!supabaseConfigured||!supabase) throw new Error("Supabase is not configured");
  const {data,error}=await supabase.from("subjects").update(toRow(input)).eq("id",id).select("*").single();
  if(error) throw error; return toSubject(data as SubjectRow);
}
export async function deleteSubject(id:string):Promise<void>{
  if(!supabaseConfigured||!supabase) throw new Error("Supabase is not configured");
  const {error}=await supabase.from("subjects").delete().eq("id",id); if(error) throw error;
}
