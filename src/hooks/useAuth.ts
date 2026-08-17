import { useCallback, useEffect, useState } from "react";
import { getSession, onAuthStateChange, signIn, signOut } from "../services/authService";

export function useAuth() {
  const [session, setSession] = useState<Awaited<ReturnType<typeof getSession>>>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    void getSession().then((value) => {
      if (mounted) {
        setSession(value);
        setLoading(false);
      }
    }).catch(() => {
      if (mounted) setLoading(false);
    });

    const subscription = onAuthStateChange(async (_event, nextSession) => {
      if (mounted) setSession(nextSession);
    });
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback((email: string, password: string) => signIn(email, password), []);
  const logout = useCallback(async () => {
    await signOut();
    setSession(null);
  }, []);

  return { session, loading, isAuthenticated: Boolean(session), login, logout };
}
