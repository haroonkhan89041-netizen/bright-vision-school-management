import { supabase, supabaseConfigured } from "./supabase";

const STATE_KEY = "bv_cloud_state_v1";
const HYDRATED_KEY = "bv_cloud_hydrated_v1";
const CLOUD_ROW_ID = "bright-vision-school";
const DATA_KEYS = [
  "bv_students",
  "bv_teachers",
  "bv_classes",
  "bv_subjects",
  "bv_attendance",
  "bv_fees",
  "bv_exams",
  "bv_notices",
  "bv_timetable",
];

/**
 * Cloud bridge for the current app architecture.
 *
 * The UI already persists every mutation through localStorage. This bridge
 * mirrors those mutations to Supabase when a signed-in Supabase session is
 * available, and hydrates localStorage from the cloud on the first load.
 * The local fallback remains intact when Supabase is unavailable.
 */
if (supabaseConfigured && supabase) {
  const originalSetItem = Storage.prototype.setItem;
  let syncing = false;

  const collectState = () => {
    const state: Record<string, unknown> = {};
    for (const key of DATA_KEYS) {
      const raw = localStorage.getItem(key);
      if (raw) {
        try {
          state[key] = JSON.parse(raw);
        } catch {
          state[key] = raw;
        }
      }
    }
    return state;
  };

  const sync = async () => {
    if (syncing) return;
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return;

    syncing = true;
    try {
      await supabase.from("school_app_state").upsert({
        id: CLOUD_ROW_ID,
        data: collectState(),
        updated_at: new Date().toISOString(),
      });
    } finally {
      syncing = false;
    }
  };

  Storage.prototype.setItem = function (key: string, value: string) {
    originalSetItem.call(this, key, value);
    if (key.startsWith("bv_") && key !== STATE_KEY && !syncing) {
      void sync();
    }
  };

  const hydrate = async () => {
    if (sessionStorage.getItem(HYDRATED_KEY)) return;
    const { data: sessionData } = await supabase.auth.getSession();
    if (!sessionData.session) return;

    const { data } = await supabase
      .from("school_app_state")
      .select("data")
      .eq("id", CLOUD_ROW_ID)
      .maybeSingle();

    if (data?.data && typeof data.data === "object") {
      syncing = true;
      try {
        for (const key of DATA_KEYS) {
          const value = (data.data as Record<string, unknown>)[key];
          if (value !== undefined) {
            originalSetItem.call(localStorage, key, JSON.stringify(value));
          }
        }
        sessionStorage.setItem(HYDRATED_KEY, "1");
        window.location.reload();
      } finally {
        syncing = false;
      }
    }
  };

  void hydrate();
}
