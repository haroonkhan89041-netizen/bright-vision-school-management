import type { SchoolSettings } from "../lib/types";
import { supabase, supabaseConfigured } from "../lib/supabase";

export async function getSchoolSettings(): Promise<SchoolSettings | null> {
  if (!supabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.from("school_settings").select("*").limit(1).maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    schoolName: data.school_name,
    logoUrl: data.logo_url ?? "",
    address: data.address ?? "",
    phone: data.phone ?? "",
    email: data.email ?? "",
    academicSession: data.academic_session ?? "",
    principalName: data.principal_name ?? "",
    currency: data.currency ?? "PKR",
    dateFormat: data.date_format ?? "dd/MM/yyyy",
  };
}

export async function saveSchoolSettings(settings: SchoolSettings) {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { data: existing } = await supabase.from("school_settings").select("id").limit(1).maybeSingle();
  const payload = {
    school_name: settings.schoolName,
    logo_url: settings.logoUrl,
    address: settings.address,
    phone: settings.phone,
    email: settings.email,
    academic_session: settings.academicSession,
    principal_name: settings.principalName,
    currency: settings.currency,
    date_format: settings.dateFormat,
  };
  const query = existing?.id
    ? supabase.from("school_settings").update(payload).eq("id", existing.id).select("*").single()
    : supabase.from("school_settings").insert(payload).select("*").single();
  const { data, error } = await query;
  if (error) throw error;
  return data;
}
