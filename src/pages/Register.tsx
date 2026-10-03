import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Container, Button, Card } from "../components/ui/Primitives";

export function Register() {
  const { signUp, isDemoMode } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signUp(email, password, fullName);
    setLoading(false);
    if (res.error) setError(res.error);
    else navigate("/onboarding");
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <Card className="w-full max-w-md">
        <h1 className="font-display text-2xl text-navy">Create an account</h1>
        <p className="mt-1 text-sm text-slate">Join SafeAware to save your survey and profile.</p>
        {isDemoMode && (
          <p className="mt-3 rounded-md bg-amber/10 p-3 text-xs text-amber-dark">
            Demo mode: accounts are stored in this browser only. Use an email starting with <code>admin@</code> for admin access.
          </p>
        )}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-sm font-medium text-navy">Full name</label>
            <input
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </div>
          {error && <p className="text-sm text-danger">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating account…" : "Sign up"}
          </Button>
        </form>
        <p className="mt-6 text-center text-sm text-slate">
          Already have an account? <Link to="/login" className="font-medium text-teal-dark">Log in</Link>
        </p>
      </Card>
    </Container>
  );
}
