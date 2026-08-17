import { supabase, supabaseConfigured } from "../lib/supabase";

export async function signIn(email: string, password: string) {
  if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured");
  const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim().toLowerCase(), password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  if (!supabaseConfigured || !supabase) return;
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  if (!supabaseConfigured || !supabase) return null;
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export function onAuthStateChange(callback: Parameters<NonNullable<typeof supabase>["auth"]["onAuthStateChange"]>[0]) {
  if (!supabaseConfigured || !supabase) return { unsubscribe: () => {} };
  const { data } = supabase.auth.onAuthStateChange(callback);
  return data.subscription;
}
