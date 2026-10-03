import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, ShieldAlert } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import { Container, Button } from "../ui/Primitives";

const links = [
  { to: "/", label: "Home", end: true },
  { to: "/survey", label: "Safety Survey" },
  { to: "/campaigns", label: "Campaigns" },
  { to: "/resources", label: "Resources" },
  { to: "/legal-awareness", label: "Legal Awareness" },
  { to: "/emergency", label: "Emergency Help" },
  { to: "/report", label: "Report Concern" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { profile, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/95 backdrop-blur">
      <Container className="flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-lg text-navy" onClick={() => setOpen(false)}>
          <ShieldAlert className="h-5 w-5 text-teal-dark" strokeWidth={2} />
          SafeAware
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `text-sm transition-colors ${isActive ? "text-navy font-medium" : "text-slate hover:text-navy"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {profile ? (
            <>
              <Link to={profile.role === "admin" ? "/admin" : "/profile"} className="text-sm font-medium text-navy">
                {profile.full_name}
              </Link>
              <Button
                variant="ghost"
                onClick={async () => {
                  await signOut();
                  navigate("/");
                }}
              >
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm font-medium text-navy">
                Log in
              </Link>
              <Button onClick={() => navigate("/register")}>Sign up</Button>
            </>
          )}
        </div>

        <button
          aria-label={open ? "Close menu" : "Open menu"}
          className="rounded-md p-2 text-navy lg:hidden"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </Container>

      {open && (
        <div className="border-t border-line bg-paper lg:hidden">
          <Container className="flex flex-col gap-1 py-4">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-md px-3 py-2.5 text-sm ${isActive ? "bg-paper-dim font-medium text-navy" : "text-slate"}`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <div className="mt-2 flex flex-col gap-2 border-t border-line pt-3">
              {profile ? (
                <>
                  <Link
                    to={profile.role === "admin" ? "/admin" : "/profile"}
                    className="px-3 py-2 text-sm font-medium text-navy"
                    onClick={() => setOpen(false)}
                  >
                    {profile.full_name}
                  </Link>
                  <Button
                    variant="ghost"
                    onClick={async () => {
                      await signOut();
                      setOpen(false);
                      navigate("/");
                    }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/login" className="px-3 py-2 text-sm font-medium text-navy" onClick={() => setOpen(false)}>
                    Log in
                  </Link>
                  <Button
                    onClick={() => {
                      setOpen(false);
                      navigate("/register");
                    }}
                  >
                    Sign up
                  </Button>
                </>
              )}
            </div>
          </Container>
        </div>
      )}
    </header>
  );
}
