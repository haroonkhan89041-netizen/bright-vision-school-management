import { supabase, supabaseConfigured } from "../lib/supabase";

function client(){ if(!supabaseConfigured||!supabase) throw new Error("Supabase is not configured"); return supabase; }
export type ClassRecord={id:string; name:string; grade:string|null; section:string|null; academic_year:string|null; class_teacher_id:string|null; status:string};
export type SubjectRecord={id:string; name:string; code:string|null; class_id:string|null; teacher_id:string|null; status:string};
export type NoticeRecord={id:string; title:string; content:string; notice_type:string|null; published_at:string|null; expires_at:string|null; status:string};
export async function listClasses(){const {data,error}=await client().from("classes").select("id,name,grade,section,academic_year,class_teacher_id,status").order("name");if(error)throw error;return data as ClassRecord[];}
export async function createClass(row:Omit<ClassRecord,"id">){const {data,error}=await client().from("classes").insert(row).select().single();if(error)throw error;return data as ClassRecord;}
export async function updateClass(id:string,changes:Partial<Omit<ClassRecord,"id">>){const {data,error}=await client().from("classes").update(changes).eq("id",id).select().single();if(error)throw error;return data as ClassRecord;}
export async function deleteClass(id:string){const {error}=await client().from("classes").delete().eq("id",id);if(error)throw error;}
export async function listSubjects(classId?:string){let q=client().from("subjects").select("id,name,code,class_id,teacher_id,status").order("name");if(classId)q=q.eq("class_id",classId);const {data,error}=await q;if(error)throw error;return data as SubjectRecord[];}
export async function createSubject(row:Omit<SubjectRecord,"id">){const {data,error}=await client().from("subjects").insert(row).select().single();if(error)throw error;return data as SubjectRecord;}
export async function updateSubject(id:string,changes:Partial<Omit<SubjectRecord,"id">>){const {data,error}=await client().from("subjects").update(changes).eq("id",id).select().single();if(error)throw error;return data as SubjectRecord;}
export async function deleteSubject(id:string){const {error}=await client().from("subjects").delete().eq("id",id);if(error)throw error;}
export async function listNotices(){const {data,error}=await client().from("notices").select("id,title,content,notice_type,published_at,expires_at,status").order("published_at",{ascending:false});if(error)throw error;return data as NoticeRecord[];}
export async function createNotice(row:Omit<NoticeRecord,"id">){const {data,error}=await client().from("notices").insert(row).select().single();if(error)throw error;return data as NoticeRecord;}
export async function updateNotice(id:string,changes:Partial<Omit<NoticeRecord,"id">>){const {data,error}=await client().from("notices").update(changes).eq("id",id).select().single();if(error)throw error;return data as NoticeRecord;}
export async function deleteNotice(id:string){const {error}=await client().from("notices").delete().eq("id",id);if(error)throw error;}
