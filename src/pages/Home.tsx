import { Link } from "react-router-dom";
import { ArrowUpRight, MapPin, ShieldCheck, Siren, Users } from "lucide-react";
import { Container, Button, SectionHeading, Card } from "../components/ui/Primitives";

const stats = [
  { label: "Safety topics covered", value: "8" },
  { label: "Community resources", value: "10+" },
  { label: "Emergency categories", value: "7" },
  { label: "Minutes to complete the survey", value: "~4" },
];

const features = [
  {
    icon: Users,
    title: "Community safety survey",
    text: "Share your safety concerns — anonymously or with an account — and help shape what the campus focuses on next.",
    to: "/survey",
  },
  {
    icon: ShieldCheck,
    title: "Practical resources",
    text: "Short, actionable guides on personal, cyber, road, and campus safety you can actually use.",
    to: "/resources",
  },
  {
    icon: Siren,
    title: "Emergency directory",
    text: "A clear, jurisdiction-labelled list of emergency numbers — police, ambulance, women's and child helplines, and more.",
    to: "/emergency",
  },
  {
    icon: MapPin,
    title: "Report a concern",
    text: "A structured way to flag a non-emergency safety concern, with an anonymous option built in.",
    to: "/report",
  },
];

export function Home() {
  return (
    <div>
      <section className="border-b border-line bg-navy text-paper">
        <Container className="grid gap-10 py-20 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:py-28">
          <div>
            <p className="text-sm font-medium text-amber">Community Safety Awareness & Emergency Support</p>
            <h1 className="font-display mt-4 text-4xl leading-[1.1] sm:text-5xl lg:text-6xl">
              Know. Prepare. Respond.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-paper/80">
              SafeAware helps students and community members understand everyday safety concerns, learn practical
              habits, and reach the right resource quickly — whether that's an emergency number, a support helpline,
              or a place to report a concern.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/survey">
                <Button variant="secondary">Take the safety survey</Button>
              </Link>
              <Link to="/emergency">
                <Button variant="ghost" className="border-paper/30 text-paper hover:bg-white/10">
                  Emergency numbers
                </Button>
              </Link>
            </div>
            <p className="mt-6 text-xs text-paper/60">
              SafeAware is an awareness and information platform. In an emergency, always contact official emergency
              services directly.
            </p>
          </div>

          <div className="hairline rounded-lg border-paper/15 bg-white/5 p-6">
            <div className="grid grid-cols-2 gap-6">
              {stats.map((s) => (
                <div key={s.label}>
                  <p className="font-display text-3xl text-amber">{s.value}</p>
                  <p className="mt-1 text-sm text-paper/70">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container>
          <SectionHeading
            eyebrow="What's here"
            title="A single, calm place to find what you need"
            description="Four connected modules, each addressing a different part of staying informed and prepared."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <Link key={f.title} to={f.to} className="group">
                <Card className="h-full transition-shadow hover:shadow-[0_2px_0_0_var(--color-teal)]">
                  <f.icon className="h-6 w-6 text-teal-dark" strokeWidth={1.75} />
                  <p className="mt-4 font-display text-lg text-navy">{f.title}</p>
                  <p className="mt-2 text-sm text-slate">{f.text}</p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-teal-dark">
                    Explore <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </span>
                </Card>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      <section className="border-y border-line bg-paper-dim py-20">
        <Container className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Awareness campaigns"
              title="Running now and in the weeks ahead"
              description="Campus Safety Week, Cyber Safety Awareness, and more — each with focused topics you can work through in minutes."
            />
            <Link to="/campaigns" className="mt-6 inline-block">
              <Button>See all campaigns</Button>
            </Link>
          </div>
          <div className="hairline rounded-lg bg-white p-6">
            <p className="text-xs uppercase tracking-wide text-slate">This month</p>
            <ul className="mt-4 space-y-4">
              <li className="border-b border-line pb-4">
                <p className="font-display text-navy">Campus Safety Week</p>
                <p className="text-sm text-slate">Safe travel, reporting, and anti-bullying awareness</p>
              </li>
              <li className="border-b border-line pb-4">
                <p className="font-display text-navy">Cyber Safety Awareness</p>
                <p className="text-sm text-slate">Passwords, phishing, and account security</p>
              </li>
              <li>
                <p className="font-display text-navy">Road Safety Drive</p>
                <p className="text-sm text-slate">Helmets, seat belts, and distracted driving</p>
              </li>
            </ul>
          </div>
        </Container>
      </section>

      <section className="py-20">
        <Container className="hairline flex flex-col items-start justify-between gap-6 rounded-lg bg-white p-8 lg:flex-row lg:items-center">
          <div>
            <h3 className="font-display text-2xl text-navy">Have a safety concern to raise?</h3>
            <p className="mt-2 max-w-xl text-slate">
              Reporting takes a couple of minutes, and you can choose to stay anonymous. This form is not monitored
              in real time — for emergencies, contact official services directly.
            </p>
          </div>
          <Link to="/report">
            <Button variant="secondary">Report a concern</Button>
          </Link>
        </Container>
      </section>
    </div>
  );
}
