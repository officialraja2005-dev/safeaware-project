import { Outlet } from "react-router-dom";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { useAuth } from "../../contexts/AuthContext";
import { Container } from "../ui/Primitives";

export function AppLayout() {
  const { isDemoMode } = useAuth();
  return (
    <div className="flex min-h-screen flex-col">
      {isDemoMode && (
        <div className="bg-amber/15 text-amber-dark">
          <Container className="py-1.5 text-center text-xs">
            Demo mode — Supabase isn't configured yet, so data is stored locally in this browser. See{" "}
            <code className="rounded bg-white/60 px-1">SUPABASE_SETUP.md</code> to connect a real database.
          </Container>
        </div>
      )}
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
