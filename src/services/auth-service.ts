import { supabase, supabaseConfigured } from "../lib/supabase";

export type AppRole = "admin" | "teacher" | "accountant" | "student" | "parent";

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: AppRole;
};

/**
 * Production authentication entry point.
 * Demo login remains in the UI until Supabase environment variables are configured.
 */
export async function signIn(email: string, password: string): Promise<SessionUser> {
  if (!supabaseConfigured || !supabase) {
    throw new Error("Supabase authentication is not configured");
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error || !data.user) throw error ?? new Error("Unable to sign in");

  const { data: account, error: accountError } = await supabase
    .from("user_accounts")
    .select("id, name, email, role, status")
    .eq("id", data.user.id)
    .single();

  if (accountError) throw accountError;
  if (account.status !== "active") {
    await supabase.auth.signOut();
    throw new Error("This account is inactive");
  }

  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role as AppRole,
  };
}

export async function signOut(): Promise<void> {
  if (supabaseConfigured && supabase) await supabase.auth.signOut();
}
