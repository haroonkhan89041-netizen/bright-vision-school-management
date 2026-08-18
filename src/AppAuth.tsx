import { useEffect, useState } from "react";
import AppFull from "./AppFull";
import { AuthStatus } from "./components/AuthStatus";
import { SupabaseLogin } from "./components/SupabaseLogin";
import { supabaseConfigured, supabase } from "./lib/supabase";

function AuthenticatedApp() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const loadUser = async () => {
      try {
        const { data, error } = await supabase!.auth.getUser();
        if (!active) return;
        if (!error && data.user) {
          const role = String(data.user.user_metadata?.role || "admin");
          const allowed = ["admin", "teacher", "accountant", "student", "parent"].includes(role) ? role : "admin";
          localStorage.setItem("bv_user", JSON.stringify({
            email: data.user.email || "",
            password: "",
            name: data.user.user_metadata?.name || data.user.email || "School User",
            role: allowed,
          }));
        }
      } catch {
        // Keep the app from getting stuck if Supabase is temporarily unavailable.
      } finally {
        if (active) setReady(true);
      }
    };
    void loadUser();
    return () => { active = false; };
  }, []);

  if (!ready) return <div className="min-h-screen grid place-items-center">Loading...</div>;
  return <AppFull />;
}

export default function AppAuth() {
  if (!supabaseConfigured) return <AppFull />;
  return <AuthStatus fallback={<SupabaseLogin />}><AuthenticatedApp /></AuthStatus>;
}
