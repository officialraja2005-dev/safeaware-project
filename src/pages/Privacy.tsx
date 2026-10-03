import { Container } from "../components/ui/Primitives";

export function Privacy() {
  return (
    <Container className="max-w-2xl py-14">
      <h1 className="font-display text-3xl text-navy">Privacy</h1>
      <div className="mt-6 space-y-6 text-sm text-slate">
        <section>
          <h2 className="font-display text-lg text-navy">What we collect</h2>
          <p className="mt-2">Account details (name, email) if you register, survey answers, and safety reports you choose to submit. Surveys and reports can be submitted anonymously.</p>
        </section>
        <section>
          <h2 className="font-display text-lg text-navy">Why we collect it</h2>
          <p className="mt-2">To operate the survey and reporting features, personalise onboarding, and let administrators review reports and campaign performance.</p>
        </section>
        <section>
          <h2 className="font-display text-lg text-navy">Anonymous reporting</h2>
          <p className="mt-2">When you choose the anonymous option, no user identifier is stored alongside your submission.</p>
        </section>
        <section>
          <h2 className="font-display text-lg text-navy">Data retention</h2>
          <p className="mt-2">Data is retained for the duration of the academic project demonstration and can be deleted by an administrator on request.</p>
        </section>
        <section>
          <h2 className="font-display text-lg text-navy">Your rights</h2>
          <p className="mt-2">You can request access to, correction of, or deletion of your data by contacting the project administrator.</p>
        </section>
        <p className="text-xs text-slate/80">This project does not claim any formal data-protection certification.</p>
      </div>
    </Container>
  );
}
