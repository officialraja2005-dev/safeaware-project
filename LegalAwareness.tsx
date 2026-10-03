import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { fetchLegalResources } from "../lib/services";
import { Container, Card, Badge, LoadingSpinner, SectionHeading } from "../components/ui/Primitives";
import type { LegalResource } from "../types";

export function LegalAwareness() {
  const [items, setItems] = useState<LegalResource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLegalResources().then((r) => {
      setItems(r);
      setLoading(false);
    });
  }, []);

  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Legal Awareness"
        title="General educational information about rights and reporting"
        description="Plain-language overviews of reporting mechanisms, sourced from official channels where possible."
      />

      <div className="mt-6 flex items-start gap-3 rounded-md bg-amber/10 p-4 text-sm text-amber-dark">
        <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
        <p>
          This section provides general educational information and is not legal advice. Laws and procedures may
          change. Please verify information through official sources or a qualified professional.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading legal resources" />
      ) : (
        <div className="mt-8 grid gap-5">
          {items.map((item) => (
            <Card key={item.id}>
              <Badge>{item.topic}</Badge>
              <h3 className="font-display mt-3 text-lg text-navy">{item.title}</h3>
              <p className="mt-2 text-sm text-slate">{item.general_information}</p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate">
                <span>Jurisdiction: {item.jurisdiction}</span>
                <span>Last verified: {new Date(item.last_verified).toLocaleDateString()}</span>
                {item.official_source_url && (
                  <a href={item.official_source_url} target="_blank" rel="noreferrer" className="font-medium text-teal-dark">
                    Official source ↗
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
