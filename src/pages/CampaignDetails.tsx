import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { fetchCampaignBySlug } from "../lib/services";
import { Container, Badge, LoadingSpinner, EmptyState } from "../components/ui/Primitives";
import type { Campaign } from "../types";

export function CampaignDetails() {
  const { slug } = useParams();
  const [campaign, setCampaign] = useState<Campaign | null | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    fetchCampaignBySlug(slug).then(setCampaign);
  }, [slug]);

  if (campaign === undefined) return <LoadingSpinner label="Loading campaign" />;
  if (campaign === null) {
    return (
      <Container className="py-14">
        <EmptyState title="Campaign not found" description="This campaign may have ended or the link is incorrect." />
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <Link to="/campaigns" className="inline-flex items-center gap-1.5 text-sm text-teal-dark">
        <ArrowLeft className="h-4 w-4" /> All campaigns
      </Link>
      <Badge tone="teal" >{campaign.category}</Badge>
      <h1 className="font-display mt-3 text-3xl text-navy sm:text-4xl">{campaign.title}</h1>
      <p className="mt-2 text-sm text-slate">
        {new Date(campaign.start_date).toLocaleDateString()} – {new Date(campaign.end_date).toLocaleDateString()}
      </p>
      <p className="mt-5 max-w-2xl text-slate">{campaign.description}</p>

      <div className="mt-8">
        <h2 className="font-display text-lg text-navy">Topics covered</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {campaign.topics.map((t) => (
            <li key={t} className="hairline rounded-md px-4 py-3 text-sm text-slate">{t}</li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
