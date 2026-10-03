import { useEffect, useState } from "react";
import { Phone, Globe, AlertTriangle } from "lucide-react";
import { fetchEmergencyContacts } from "../lib/services";
import { Container, Card, LoadingSpinner, SectionHeading } from "../components/ui/Primitives";
import type { EmergencyContact } from "../types";

export function Emergency() {
  const [contacts, setContacts] = useState<EmergencyContact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmergencyContacts().then((c) => {
      setContacts(c);
      setLoading(false);
    });
  }, []);

  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Emergency Help"
        title="Emergency contacts"
        description="Maintained by administrators. If you are in immediate danger, call the appropriate number right away."
      />

      <div className="mt-6 flex items-start gap-3 rounded-md bg-danger/10 p-4 text-sm text-danger">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <p>SafeAware does not dispatch emergency services. In an emergency, call directly using the numbers below.</p>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading emergency contacts" />
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {contacts.map((c) => (
            <Card key={c.id}>
              <p className="text-xs uppercase tracking-wide text-slate">{c.category}</p>
              <h3 className="font-display mt-2 text-lg text-navy">{c.name}</h3>
              <p className="mt-1 text-sm text-slate">{c.description}</p>
              <p className="mt-1 text-xs text-slate">{c.jurisdiction}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <a href={`tel:${c.phone}`} className="inline-flex items-center gap-1.5 rounded-md bg-navy px-3 py-2 text-sm font-medium text-paper">
                  <Phone className="h-3.5 w-3.5" /> {c.phone}
                </a>
                {c.website && (
                  <a href={c.website} target="_blank" rel="noreferrer" className="hairline inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium text-navy">
                    <Globe className="h-3.5 w-3.5" /> Website
                  </a>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </Container>
  );
}
