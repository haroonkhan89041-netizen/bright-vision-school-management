import { supabase, supabaseConfigured } from "./supabase";
import type { Role } from "./types";

export async function signIn(email: string, password: string) {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabaseConfigured || !supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  if (!supabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getUserRole(userId: string): Promise<Role | null> {
  if (!supabaseConfigured || !supabase) return null;
  const { data, error } = await supabase
    .from("user_accounts")
    .select("role")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw error;
  return (data?.role as Role | undefined) ?? null;
}
