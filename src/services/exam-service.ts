import type { Exam, ExamType, Mark } from "../lib/types";
import { supabase, supabaseConfigured } from "../lib/supabase";
type ExamRow={id:string;name:string;exam_type_id:string;class_id:string;start_date:string;end_date:string;status:Exam["status"]};
type TypeRow={id:string;name:string;weight:number};
type MarkRow={id:string;exam_id:string;student_id:string;subject_id:string;obtained:number;total:number};
const ex=(r:ExamRow):Exam=>({id:r.id,name:r.name,examTypeId:r.exam_type_id,classId:r.class_id,startDate:r.start_date,endDate:r.end_date,status:r.status});
const et=(r:TypeRow):ExamType=>({id:r.id,name:r.name,weight:r.weight});
const mk=(r:MarkRow):Mark=>({id:r.id,examId:r.exam_id,studentId:r.student_id,subjectId:r.subject_id,obtained:r.obtained,total:r.total});
export async function listExamTypes(){if(!supabaseConfigured||!supabase)return[];const{data,error}=await supabase.from("exam_types").select("*").order("name");if(error)throw error;return(data as TypeRow[]).map(et)}
export async function listExams(){if(!supabaseConfigured||!supabase)return[];const{data,error}=await supabase.from("exams").select("*").order("start_date",{ascending:false});if(error)throw error;return(data as ExamRow[]).map(ex)}
export async function listMarks(examId?:string){if(!supabaseConfigured||!supabase)return[];let q=supabase.from("marks").select("*");if(examId)q=q.eq("exam_id",examId);const{data,error}=await q;if(error)throw error;return(data as MarkRow[]).map(mk)}
export async function createExam(input:Omit<Exam,"id">){if(!supabaseConfigured||!supabase)throw new Error("Supabase is not configured");const{data,error}=await supabase.from("exams").insert({name:input.name,exam_type_id:input.examTypeId,class_id:input.classId,start_date:input.startDate,end_date:input.endDate,status:input.status}).select("*").single();if(error)throw error;return ex(data as ExamRow)}
export async function updateExam(id:string,input:Omit<Exam,"id">){if(!supabaseConfigured||!supabase)throw new Error("Supabase is not configured");const{data,error}=await supabase.from("exams").update({name:input.name,exam_type_id:input.examTypeId,class_id:input.classId,start_date:input.startDate,end_date:input.endDate,status:input.status}).eq("id",id).select("*").single();if(error)throw error;return ex(data as ExamRow)}
export async function deleteExam(id:string){if(!supabaseConfigured||!supabase)throw new Error("Supabase is not configured");const{error}=await supabase.from("exams").delete().eq("id",id);if(error)throw error}
