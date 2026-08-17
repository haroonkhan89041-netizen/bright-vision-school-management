import type { AttendanceRecord } from "../lib/types";
import { supabase, supabaseConfigured } from "../lib/supabase";
export type AttendanceInput=Omit<AttendanceRecord,"id">&{id?:string};
type AttendanceRow={id:string;student_id:string;date:string;class_id:string;section:string;status:AttendanceRecord["status"]};
const toAttendance=(r:AttendanceRow):AttendanceRecord=>({id:r.id,studentId:r.student_id,date:r.date,classId:r.class_id,section:r.section,status:r.status});
const toRow=(i:AttendanceInput)=>({student_id:i.studentId,date:i.date,class_id:i.classId,section:i.section,status:i.status});
export async function listAttendance(date?:string):Promise<AttendanceRecord[]>{
 if(!supabaseConfigured||!supabase)return[]; let q=supabase.from("attendance").select("*").order("date",{ascending:false}); if(date)q=q.eq("date",date); const {data,error}=await q; if(error)throw error; return(data as AttendanceRow[]).map(toAttendance);
}
export async function createAttendance(input:AttendanceInput):Promise<AttendanceRecord>{if(!supabaseConfigured||!supabase)throw new Error("Supabase is not configured");const {data,error}=await supabase.from("attendance").insert(toRow(input)).select("*").single();if(error)throw error;return toAttendance(data as AttendanceRow)}
export async function updateAttendance(id:string,input:AttendanceInput):Promise<AttendanceRecord>{if(!supabaseConfigured||!supabase)throw new Error("Supabase is not configured");const {data,error}=await supabase.from("attendance").update(toRow(input)).eq("id",id).select("*").single();if(error)throw error;return toAttendance(data as AttendanceRow)}
export async function deleteAttendance(id:string):Promise<void>{if(!supabaseConfigured||!supabase)throw new Error("Supabase is not configured");const {error}=await supabase.from("attendance").delete().eq("id",id);if(error)throw error}
