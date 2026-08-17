import type { Notice } from "../lib/types";
import { supabase, supabaseConfigured } from "../lib/supabase";

type NoticeRow = { id:string; title:string; description:string; date:string; audience:Notice["audience"]; status:Notice["status"] };
const mapNotice=(r:NoticeRow):Notice=>({id:r.id,title:r.title,description:r.description,date:r.date,audience:r.audience,status:r.status});
const ready=()=>{if(!supabaseConfigured||!supabase)throw new Error("Supabase is not configured")};
export async function listNotices(){if(!supabaseConfigured||!supabase)return[];const{data,error}=await supabase.from("notices").select("*").order("date",{ascending:false});if(error)throw error;return(data as NoticeRow[]).map(mapNotice)}
export async function createNotice(input:Omit<Notice,"id">){ready();const{data,error}=await supabase!.from("notices").insert({title:input.title,description:input.description,date:input.date,audience:input.audience,status:input.status}).select("*").single();if(error)throw error;return mapNotice(data as NoticeRow)}
export async function updateNotice(id:string,input:Omit<Notice,"id">){ready();const{data,error}=await supabase!.from("notices").update({title:input.title,description:input.description,date:input.date,audience:input.audience,status:input.status}).eq("id",id).select("*").single();if(error)throw error;return mapNotice(data as NoticeRow)}
export async function deleteNotice(id:string){ready();const{error}=await supabase!.from("notices").delete().eq("id",id);if(error)throw error}
