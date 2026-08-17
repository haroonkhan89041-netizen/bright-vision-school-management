import { supabase, supabaseConfigured } from "../lib/supabase";

export type FeeRecord = {
  id: string;
  student_id: string;
  fee_month: string;
  amount: number;
  paid_amount: number;
  due_amount: number;
  status: string;
  due_date: string | null;
  paid_date: string | null;
};

function client() { if (!supabaseConfigured || !supabase) throw new Error("Supabase is not configured"); return supabase; }

export async function listFees() {
  const { data, error } = await client().from("fees").select("id, student_id, fee_month, amount, paid_amount, due_amount, status, due_date, paid_date").order("due_date", { ascending: false });
  if (error) throw error;
  return data as FeeRecord[];
}

export async function createFee(fee: Omit<FeeRecord, "id">) {
  const { data, error } = await client().from("fees").insert(fee).select().single();
  if (error) throw error;
  return data as FeeRecord;
}

export async function updateFee(id: string, changes: Partial<Omit<FeeRecord, "id">>) {
  const { data, error } = await client().from("fees").update(changes).eq("id", id).select().single();
  if (error) throw error;
  return data as FeeRecord;
}

export async function deleteFee(id: string) {
  const { error } = await client().from("fees").delete().eq("id", id);
  if (error) throw error;
}
