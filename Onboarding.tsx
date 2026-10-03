import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Card } from "../ui/Primitives";
import { useAuth } from "../../contexts/AuthContext";

const INTERESTS = [
  "Personal safety",
  "Cyber safety",
  "Road safety",
  "Campus safety",
  "Women's safety",
  "Child safety",
  "Public-place safety",
  "Emergency preparedness",
];

export function Onboarding({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(1);
  const [interests, setInterests] = useState<string[]>([]);
  const [wantsSurvey, setWantsSurvey] = useState(true);
  const { completeOnboarding } = useAuth();
  const navigate = useNavigate();

  function toggle(interest: string) {
    setInterests((prev) => (prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]));
  }

  function finish() {
    completeOnboarding(interests, wantsSurvey);
    onDone();
    if (wantsSurvey) navigate("/survey");
  }

  return (
    <Card className="mx-auto max-w-xl">
      <div className="mb-6 flex gap-1.5">
        {[1, 2, 3, 4].map((s) => (
          <span key={s} className={`h-1 flex-1 rounded-full ${s <= step ? "bg-teal" : "bg-line"}`} />
        ))}
      </div>

      {step === 1 && (
        <div>
          <h2 className="font-display text-2xl text-navy">Welcome to SafeAware</h2>
          <p className="mt-3 text-slate">
            A few quick steps to set up your experience — this takes about a minute. You can skip ahead any time.
          </p>
          <Button className="mt-6" onClick={() => setStep(2)}>Continue</Button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="font-display text-2xl text-navy">What would you like to focus on?</h2>
          <p className="mt-2 text-sm text-slate">Pick as many as apply. This only shapes what we highlight for you.</p>
          <div className="mt-5 grid grid-cols-2 gap-2">
            {INTERESTS.map((interest) => (
              <button
                key={interest}
                onClick={() => toggle(interest)}
                className={`rounded-md border px-3 py-2.5 text-left text-sm transition-colors ${
                  interests.includes(interest) ? "border-teal bg-teal/10 text-teal-dark" : "border-line text-slate hover:border-navy/30"
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(1)}>Back</Button>
            <Button onClick={() => setStep(3)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="font-display text-2xl text-navy">How SafeAware works</h2>
          <ul className="mt-4 space-y-3 text-sm text-slate">
            <li>• Browse awareness campaigns and short, practical resource guides.</li>
            <li>• Take the community safety survey — anonymously if you prefer.</li>
            <li>• Look up emergency contacts and general legal-awareness information.</li>
            <li>• Report a non-emergency safety concern for the admin team to review.</li>
          </ul>
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(2)}>Back</Button>
            <Button onClick={() => setStep(4)}>Continue</Button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 className="font-display text-2xl text-navy">Before you go on</h2>
          <p className="mt-3 rounded-md bg-amber/10 p-4 text-sm text-amber-dark">
            SafeAware is an awareness and information platform. It is not a replacement for police, ambulance, fire,
            or other official emergency services. In an emergency, contact those services directly.
          </p>
          <label className="mt-5 flex items-center gap-2 text-sm text-slate">
            <input
              type="checkbox"
              checked={wantsSurvey}
              onChange={(e) => setWantsSurvey(e.target.checked)}
              className="h-4 w-4 rounded border-line accent-teal"
            />
            Take me to the safety survey after this
          </label>
          <div className="mt-6 flex justify-between">
            <Button variant="ghost" onClick={() => setStep(3)}>Back</Button>
            <Button onClick={finish}>Finish</Button>
          </div>
        </div>
      )}
    </Card>
  );
}
