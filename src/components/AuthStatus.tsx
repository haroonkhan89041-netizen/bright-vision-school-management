import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";

type Props = { children: ReactNode; fallback?: ReactNode };

export function AuthStatus({ children, fallback = null }: Props) {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <div className="min-h-screen grid place-items-center">Loading...</div>;
  if (!isAuthenticated) return <>{fallback}</>;
  return <>{children}</>;
}
