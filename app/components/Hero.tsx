import { partners, site, stats } from "../lib/content";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-primary-dark text-white">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        aria-hidden="true"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(201, 162, 39, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(26, 107, 107, 0.4) 0%, transparent 40%),
            linear-gradient(135deg, transparent 40%, rgba(255,255,255,0.03) 100%)
          `,
        }}
      />

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        aria-hidden="true"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-16 md:py-20">
        <div className="flex flex-1 flex-col justify-center">
          <div className="max-w-3xl">
          <p className="animate-fade-up mb-4 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-sm font-medium text-accent-light">
            <span className="h-1.5 w-1.5 rounded-full bg-accent" />
            Multidisciplinary Research & Development
          </p>

          <h1 className="animate-fade-up-delay-1 font-display text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
            {site.name}
          </h1>

          <p className="animate-fade-up-delay-2 mt-6 text-lg leading-relaxed text-white/80 md:text-xl">
            {site.tagline} We bridge the knowledge and capacity gap in
            underserved communities through research, training, and evidence-based
            solutions.
          </p>

          <div className="animate-fade-up-delay-2 mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#services"
              className="inline-flex items-center justify-center rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-light"
            >
              Explore Our Services
            </a>
            <a
              href="#about"
              className="inline-flex items-center justify-center rounded-full border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:border-white/60 hover:bg-white/5"
            >
              Learn About EARC
            </a>
          </div>
          </div>
        </div>

        <div className="mt-auto space-y-12 pt-12">
          <div className="grid grid-cols-2 gap-6 border-t border-white/10 pt-12 md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label}>
              <p className="font-display text-3xl font-bold text-accent-light md:text-4xl">
                {stat.value}
              </p>
              <p className="mt-1 text-sm text-white/60">{stat.label}</p>
            </div>
          ))}
          </div>

          <div>
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-white/40">
              We Partner With
            </p>
            <div className="flex flex-wrap gap-3">
              {partners.map((partner) => (
                <span
                  key={partner}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/70"
                >
                  {partner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
