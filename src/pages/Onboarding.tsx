import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Container, Button, Card, Badge } from "../components/ui/Primitives";

const interestOptions = [
  "Personal safety",
  "Cyber safety",
  "Road safety",
  "Campus safety",
  "Women's safety",
  "Child safety",
  "Public-place safety",
  "Emergency preparedness",
];

export function Onboarding() {
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [wantsSurvey, setWantsSurvey] = useState<boolean | null>(null);

  function toggleInterest(i: string) {
    setInterests((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]));
  }

  function finish() {
    completeOnboarding(interests, wantsSurvey ?? false);
    if (wantsSurvey) navigate("/survey");
    else navigate("/");
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-16">
      <Card className="w-full max-w-xl">
        <div className="mb-6 flex gap-1.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <div key={s} className={`h-1 flex-1 rounded-full ${s <= step ? "bg-teal" : "bg-line"}`} />
          ))}
        </div>

        {step === 1 && (
          <div>
            <h1 className="font-display text-2xl text-navy">Welcome to SafeAware</h1>
            <p className="mt-3 text-slate">
              This short orientation takes about a minute. It helps us understand what matters to you and gives you
              a quick overview of how the platform works.
            </p>
            <Button className="mt-6" onClick={() => setStep(2)}>Continue</Button>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="font-display text-2xl text-navy">What are you interested in?</h1>
            <p className="mt-2 text-sm text-slate">Select any topics you'd like to see more of. You can change this later.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {interestOptions.map((i) => (
                <button key={i} type="button" onClick={() => toggleInterest(i)}>
                  <Badge tone={interests.includes(i) ? "teal" : "neutral"}>{i}</Badge>
                </button>
              ))}
            </div>
            <div className="mt-6 flex gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
              <Button onClick={() => setStep(3)}>Continue</Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h1 className="font-display text-2xl text-navy">How SafeAware works</h1>
            <ul className="mt-4 space-y-3 text-sm text-slate">
              <li>• Browse safety resources and awareness campaigns anytime.</li>
              <li>• Take the community safety survey to help shape what we focus on.</li>
              <li>• Report a non-emergency concern, anonymously if you prefer.</li>
              <li>• Find emergency contacts and legal-awareness information quickly.</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
              <Button onClick={() => setStep(4)}>Continue</Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h1 className="font-display text-2xl text-navy">Before you continue</h1>
            <p className="mt-3 rounded-md bg-amber/10 p-4 text-sm text-amber-dark">
              SafeAware is an awareness and information platform. It is not a substitute for police, ambulance,
              fire, or other emergency services. In an emergency, always contact official emergency services
              directly.
            </p>
            <div className="mt-6 flex gap-3">
              <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
              <Button onClick={() => setStep(5)}>I understand</Button>
            </div>
          </div>
        )}

        {step === 5 && (
          <div>
            <h1 className="font-display text-2xl text-navy">One last thing</h1>
            <p className="mt-2 text-sm text-slate">Would you like to take the community safety survey now? It takes about four minutes.</p>
            <div className="mt-5 flex gap-3">
              <Button variant={wantsSurvey === true ? "secondary" : "ghost"} onClick={() => setWantsSurvey(true)}>Yes, let's do it</Button>
              <Button variant={wantsSurvey === false ? "secondary" : "ghost"} onClick={() => setWantsSurvey(false)}>Maybe later</Button>
            </div>
            <Button className="mt-8 w-full" onClick={finish} disabled={wantsSurvey === null}>
              Finish
            </Button>
          </div>
        )}
      </Card>
    </Container>
  );
}
