import { ReactNode } from "react";

type SectionProps = {
  id: string;
  eyebrow?: string;
  title: string;
  children: ReactNode;
  variant?: "default" | "muted" | "dark";
  className?: string;
};

const variantStyles = {
  default: "bg-background",
  muted: "bg-surface border-y border-border",
  dark: "bg-primary text-white",
};

export default function Section({
  id,
  eyebrow,
  title,
  children,
  variant = "default",
  className = "",
}: SectionProps) {
  const isDark = variant === "dark";

  return (
    <section id={id} className={`py-20 md:py-28 ${variantStyles[variant]} ${className}`}>
      <div className="mx-auto max-w-6xl px-6">
        {eyebrow && (
          <p
            className={`mb-3 text-sm font-semibold uppercase tracking-widest ${
              isDark ? "text-accent-light" : "text-primary"
            }`}
          >
            {eyebrow}
          </p>
        )}
        <h2
          className={`font-display text-3xl font-bold tracking-tight md:text-4xl ${
            isDark ? "text-white" : "text-foreground"
          }`}
        >
          {title}
        </h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

export function Prose({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-5 text-base leading-relaxed text-muted md:text-lg">
      {children}
    </div>
  );
}

export function ProseParagraph({ children }: { children: ReactNode }) {
  return <p>{children}</p>;
}
