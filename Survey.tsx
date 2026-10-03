import { useEffect, useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { fetchSurveyQuestions, submitSurvey } from "../lib/services";
import { useAuth } from "../contexts/AuthContext";
import { Container, Button, Card, LoadingSpinner, SectionHeading } from "../components/ui/Primitives";
import type { SurveyQuestion } from "../types";

export function Survey() {
  const { profile } = useAuth();
  const [questions, setQuestions] = useState<SurveyQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isAnonymous, setIsAnonymous] = useState(!profile);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchSurveyQuestions().then((qs) => {
      setQuestions(qs);
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner label="Loading the survey" />;

  if (submitted) {
    return (
      <Container className="flex min-h-[60vh] items-center justify-center py-16">
        <Card className="max-w-md text-center">
          <CheckCircle2 className="mx-auto h-10 w-10 text-teal-dark" />
          <h1 className="font-display mt-4 text-2xl text-navy">Thank you for contributing to the SafeAware community safety survey.</h1>
          <p className="mt-2 text-sm text-slate">Your response helps shape which resources and campaigns we prioritise next.</p>
        </Card>
      </Container>
    );
  }

  const current = questions[step];
  const progress = ((step) / questions.length) * 100;

  function setAnswer(value: string) {
    setAnswers((prev) => ({ ...prev, [current.id]: value }));
  }

  function toggleCheckbox(value: string) {
    const existing = answers[current.id] ? answers[current.id].split("||") : [];
    const next = existing.includes(value) ? existing.filter((v) => v !== value) : [...existing, value];
    setAnswers((prev) => ({ ...prev, [current.id]: next.join("||") }));
  }

  function canGoNext() {
    if (!current.is_required) return true;
    return Boolean(answers[current.id]?.trim());
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    const res = await submitSurvey({ isAnonymous, userId: profile?.id ?? null, answers });
    setSubmitting(false);
    if (res.success) setSubmitted(true);
    else setError(res.error ?? "Something went wrong. Please try again.");
  }

  return (
    <Container className="py-14">
      <SectionHeading
        eyebrow="Community Safety Survey"
        title="Tell us about your safety concerns"
        description="Your answers help SafeAware prioritise the right resources and campaigns. Takes about four minutes."
      />

      <div className="mt-8 max-w-2xl">
        <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-line">
          <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${progress}%` }} />
        </div>

        <Card>
          <p className="text-xs text-slate">Question {step + 1} of {questions.length}{current.is_required ? " · Required" : " · Optional"}</p>
          <h2 className="font-display mt-2 text-xl text-navy">{current.prompt}</h2>

          <div className="mt-5 space-y-2">
            {current.question_type === "multiple_choice" &&
              current.options?.map((opt) => (
                <label key={opt.id} className="flex cursor-pointer items-center gap-3 rounded-md border border-line px-4 py-3 text-sm hover:border-teal">
                  <input
                    type="radio"
                    name={current.id}
                    checked={answers[current.id] === opt.label}
                    onChange={() => setAnswer(opt.label)}
                  />
                  {opt.label}
                </label>
              ))}

            {current.question_type === "checkbox" &&
              current.options?.map((opt) => (
                <label key={opt.id} className="flex cursor-pointer items-center gap-3 rounded-md border border-line px-4 py-3 text-sm hover:border-teal">
                  <input
                    type="checkbox"
                    checked={(answers[current.id] ?? "").split("||").includes(opt.label)}
                    onChange={() => toggleCheckbox(opt.label)}
                  />
                  {opt.label}
                </label>
              ))}

            {current.question_type === "yes_no" && (
              <div className="flex gap-3">
                {["Yes", "No"].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setAnswer(v)}
                    className={`flex-1 rounded-md border px-4 py-3 text-sm ${answers[current.id] === v ? "border-teal bg-teal/10 text-teal-dark" : "border-line"}`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            )}

            {current.question_type === "rating" && (
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setAnswer(String(n))}
                    className={`h-11 flex-1 rounded-md border text-sm font-medium ${answers[current.id] === String(n) ? "border-teal bg-teal/10 text-teal-dark" : "border-line"}`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            )}

            {current.question_type === "text" && (
              <textarea
                value={answers[current.id] ?? ""}
                onChange={(e) => setAnswer(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-teal"
                placeholder="Type your answer…"
              />
            )}
          </div>

          {step === questions.length - 1 && (
            <label className="mt-5 flex items-center gap-2 text-sm text-slate">
              <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} />
              Submit this response anonymously
            </label>
          )}

          {error && <p className="mt-3 text-sm text-danger">{error}</p>}

          <div className="mt-6 flex justify-between">
            <Button variant="ghost" disabled={step === 0} onClick={() => setStep((s) => s - 1)}>
              Back
            </Button>
            {step < questions.length - 1 ? (
              <Button disabled={!canGoNext()} onClick={() => setStep((s) => s + 1)}>
                Next
              </Button>
            ) : (
              <Button disabled={!canGoNext() || submitting} onClick={handleSubmit}>
                {submitting ? "Submitting…" : "Submit survey"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </Container>
  );
}
