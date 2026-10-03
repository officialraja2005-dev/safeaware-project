import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchCampaigns } from "../lib/services";
import { Container, Card, Badge, LoadingSpinner, SectionHeading, EmptyState } from "../components/ui/Primitives";
import type { Campaign } from "../types";

export function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<string>("All");

  useEffect(() => {
    fetchCampaigns().then((c) => {
      setCampaigns(c);
      setLoading(false);
    });
  }, []);

  const categories = ["All", ...Array.from(new Set(campaigns.map((c) => c.category)))];
  const filtered = category === "All" ? campaigns : campaigns.filter((c) => c.category === category);

  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Awareness Campaigns"
        title="Safety campaigns running this term"
        description="Each campaign groups a few focused topics you can work through in minutes."
      />

      <div className="mt-6 flex flex-wrap gap-2">
        {categories.map((c) => (
          <button key={c} onClick={() => setCategory(c)}>
            <Badge tone={category === c ? "teal" : "neutral"}>{c}</Badge>
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingSpinner label="Loading campaigns" />
      ) : filtered.length === 0 ? (
        <div className="mt-8"><EmptyState title="No campaigns found" description="Try a different category." /></div>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Link key={c.id} to={`/campaigns/${c.slug}`}>
              <Card className="h-full">
                <Badge tone="teal">{c.category}</Badge>
                <h3 className="font-display mt-3 text-lg text-navy">{c.title}</h3>
                <p className="mt-2 text-sm text-slate">{c.description}</p>
                <p className="mt-4 text-xs text-slate">
                  {new Date(c.start_date).toLocaleDateString()} – {new Date(c.end_date).toLocaleDateString()}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
