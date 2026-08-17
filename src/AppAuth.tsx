import { useEffect, useState } from "react";
import App from "./App";
import { AuthStatus } from "./components/AuthStatus";
import { SupabaseLogin } from "./components/SupabaseLogin";
import { supabaseConfigured, supabase } from "./lib/supabase";

function AuthenticatedApp() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    void supabase?.auth.getUser().then(({ data }) => {
      if (!active) return;
      if (data.user) {
        const role = String(data.user.user_metadata?.role || "admin");
        const allowed = ["admin", "teacher", "accountant", "student", "parent"].includes(role) ? role : "admin";
        localStorage.setItem("bv_user", JSON.stringify({
          email: data.user.email || "",
          password: "",
          name: data.user.user_metadata?.name || data.user.email || "School User",
          role: allowed,
        }));
      }
      setReady(true);
    });
    return () => { active = false; };
  }, []);

  if (!ready) return <div className="min-h-screen grid place-items-center">Loading...</div>;
  return <App />;
}

export default function AppAuth() {
  if (!supabaseConfigured) return <App />;
  return <AuthStatus fallback={<SupabaseLogin />}><AuthenticatedApp /></AuthStatus>;
}
