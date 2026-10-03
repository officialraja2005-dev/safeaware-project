import { Link } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { Container } from "../ui/Primitives";

export function Footer() {
  return (
    <footer className="border-t border-line bg-navy text-paper/80">
      <Container className="grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg text-paper">
            <ShieldAlert className="h-5 w-5 text-amber" />
            SafeAware
          </div>
          <p className="font-display mt-3 text-paper/90">Know. Prepare. Respond.</p>
          <p className="mt-3 max-w-xs text-sm">
            A safety awareness platform built for educational and community-awareness purposes as a BCA minor
            project.
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-paper">Explore</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/survey" className="hover:text-paper">Safety Survey</Link></li>
            <li><Link to="/campaigns" className="hover:text-paper">Campaigns</Link></li>
            <li><Link to="/resources" className="hover:text-paper">Resources</Link></li>
            <li><Link to="/legal-awareness" className="hover:text-paper">Legal Awareness</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-paper">Support</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/emergency" className="hover:text-paper">Emergency Help</Link></li>
            <li><Link to="/report" className="hover:text-paper">Report a Concern</Link></li>
            <li><Link to="/contact" className="hover:text-paper">Contact</Link></li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-medium text-paper">About</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-paper">About this project</Link></li>
            <li><Link to="/privacy" className="hover:text-paper">Privacy</Link></li>
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10 py-5 text-center text-xs text-paper/60">
        © {new Date().getFullYear()} SafeAware — a BCA minor project. Not a substitute for emergency services.
      </div>
    </footer>
  );
}
