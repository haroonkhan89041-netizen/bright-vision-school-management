import { supabase, supabaseConfigured } from "../lib/supabase";

export type ExamRecord = { id:string; name:string; exam_type:string|null; start_date:string|null; end_date:string|null; status:string };
export type MarkRecord = { id:string; exam_id:string; student_id:string; subject_id:string; max_marks:number; obtained_marks:number; grade:string|null; remarks:string|null };
function client(){ if(!supabaseConfigured||!supabase) throw new Error("Supabase is not configured"); return supabase; }
export async function listExams(){ const {data,error}=await client().from("exams").select("id,name,exam_type,start_date,end_date,status").order("start_date",{ascending:false}); if(error)throw error; return data as ExamRecord[]; }
export async function createExam(exam:Omit<ExamRecord,"id">){ const {data,error}=await client().from("exams").insert(exam).select().single(); if(error)throw error; return data as ExamRecord; }
export async function updateExam(id:string,changes:Partial<Omit<ExamRecord,"id">>){ const {data,error}=await client().from("exams").update(changes).eq("id",id).select().single(); if(error)throw error; return data as ExamRecord; }
export async function deleteExam(id:string){ const {error}=await client().from("exams").delete().eq("id",id); if(error)throw error; }
export async function listMarks(examId:string,studentId?:string){ let q=client().from("marks").select("id,exam_id,student_id,subject_id,max_marks,obtained_marks,grade,remarks").eq("exam_id",examId); if(studentId)q=q.eq("student_id",studentId); const {data,error}=await q; if(error)throw error; return data as MarkRecord[]; }
export async function upsertMark(mark:Omit<MarkRecord,"id">){ const {data,error}=await client().from("marks").upsert(mark,{onConflict:"exam_id,student_id,subject_id"}).select().single(); if(error)throw error; return data as MarkRecord; }
export async function deleteMark(id:string){ const {error}=await client().from("marks").delete().eq("id",id); if(error)throw error; }
