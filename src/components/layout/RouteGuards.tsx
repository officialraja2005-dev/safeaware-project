import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { LoadingSpinner } from "../ui/Primitives";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading) return <LoadingSpinner label="Checking your session" />;
  if (!profile) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function AdminRoute({ children }: { children: ReactNode }) {
  const { profile, loading } = useAuth();
  if (loading) return <LoadingSpinner label="Checking your access" />;
  if (!profile) return <Navigate to="/login" replace />;
  if (profile.role !== "admin") return <Navigate to="/" replace />;
  return <>{children}</>;
}
