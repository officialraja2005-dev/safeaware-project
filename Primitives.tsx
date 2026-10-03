import type { ReactNode } from "react";
import clsx from "clsx";

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("mx-auto w-full max-w-6xl px-5 sm:px-8", className)}>{children}</div>;
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "teal" | "amber" }) {
  const tones: Record<string, string> = {
    neutral: "bg-paper-dim text-slate border-line",
    teal: "bg-teal/10 text-teal-dark border-teal/30",
    amber: "bg-amber/10 text-amber-dark border-amber/30",
  };
  return (
    <span className={clsx("inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium", tones[tone])}>
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "primary",
  className,
  ...props
}: {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost" | "danger";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-md px-5 py-2.5 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-navy text-paper hover:bg-navy-light",
    secondary: "bg-teal text-paper hover:bg-teal-dark",
    ghost: "bg-transparent text-navy hairline hover:bg-paper-dim",
    danger: "bg-danger text-paper hover:opacity-90",
  };
  return (
    <button className={clsx(base, variants[variant], className)} {...props}>
      {children}
    </button>
  );
}

export function Card({
  children,
  className,
  ...props
}: { children: ReactNode; className?: string } & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={clsx("hairline rounded-lg bg-white p-6", className)} {...props}>
      {children}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="hairline rounded-lg bg-white p-10 text-center">
      <p className="font-display text-lg text-navy">{title}</p>
      <p className="mt-2 text-sm text-slate">{description}</p>
    </div>
  );
}

export function LoadingSpinner({ label = "Loading" }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-16 text-slate">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-line border-t-teal" />
      <span className="text-sm">{label}…</span>
    </div>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="max-w-2xl">
      {eyebrow && <p className="text-sm font-medium text-teal-dark">{eyebrow}</p>}
      <h2 className="font-display mt-2 text-3xl text-navy sm:text-4xl">{title}</h2>
      {description && <p className="mt-3 text-slate">{description}</p>}
    </div>
  );
}

export function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <p className="font-display text-3xl text-navy">{value}</p>
      <p className="mt-1 text-sm text-slate">{label}</p>
    </Card>
  );
}
