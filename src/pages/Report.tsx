import { useState } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { submitReport } from "../lib/services";
import { useAuth } from "../contexts/AuthContext";
import { Container, Button, Card, SectionHeading } from "../components/ui/Primitives";

const categories = ["Cyber safety", "Campus safety", "Road safety", "Public safety", "Harassment", "Suspicious activity", "Other"];

export function Report() {
  const { profile } = useAuth();
  const [category, setCategory] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [incidentDate, setIncidentDate] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [contact, setContact] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const res = await submitReport({
      category,
      description,
      approximateLocation: location || undefined,
      incidentDate: incidentDate || undefined,
      isAnonymous,
      contactInformation: contact || undefined,
      userId: profile?.id ?? null,
    });
    setSubmitting(false);
    if (res.success) setSubmitted(true);
    else setError(res.error ?? "Something went wrong. Please try again.");
  }

  if (submitted) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center py-16">
        <Card className="max-w-md text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-teal-dark" />
          <h1 className="font-display mt-4 text-2xl text-navy">Your report has been submitted</h1>
          <p className="mt-2 text-sm text-slate">
            An administrator will review it. Submitting this form does not automatically contact emergency services
            or guarantee an official investigation.
          </p>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-14">
      <SectionHeading eyebrow="Report a Concern" title="Report a non-emergency safety concern" />

      <div className="mt-6 max-w-2xl rounded-md bg-danger/10 p-4 text-sm text-danger">
        <div className="flex items-start gap-3">
          <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0" />
          <p>Do not use this form for an emergency. Contact appropriate emergency services immediately.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 max-w-2xl space-y-5">
        <div>
          <label className="text-sm font-medium text-navy">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-teal"
          >
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium text-navy">What happened?</label>
          <textarea
            required
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-teal"
            placeholder="Describe the concern in your own words…"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-navy">Approximate location (optional)</label>
            <input
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-navy">Incident date (optional)</label>
            <input
              type="date"
              value={incidentDate}
              onChange={(e) => setIncidentDate(e.target.value)}
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate">
          <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
          Submit anonymously
        </label>

        {!isAnonymous && (
          <div>
            <label className="text-sm font-medium text-navy">Contact information (optional)</label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Email or phone, if you'd like a follow-up"
              className="mt-1 w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-teal"
            />
          </div>
        )}

        {error && <p className="text-sm text-danger">{error}</p>}

        <Button type="submit" disabled={submitting}>
          {submitting ? "Submitting…" : "Submit report"}
        </Button>
      </form>
    </Container>
  );
}
