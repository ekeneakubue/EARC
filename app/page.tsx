import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Section, { Prose, ProseParagraph } from "./components/Section";
import ServiceCard from "./components/ServiceCard";
import StoryTimeline from "./components/StoryTimeline";
import {
  about,
  approach,
  commitment,
  services,
  site,
  story,
} from "./lib/content";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />

        <Section id="about" eyebrow="About EARC" title={about.title}>
          <div className="grid gap-12 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <Prose>
                {about.paragraphs.map((paragraph) => (
                  <ProseParagraph key={paragraph.slice(0, 40)}>
                    {paragraph}
                  </ProseParagraph>
                ))}
              </Prose>
            </div>
            <aside className="lg:col-span-2">
              <div className="sticky top-28 space-y-4">
                <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                  <h3 className="font-display text-lg font-semibold text-primary">
                    Our Mission
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    Bridge the knowledge and capacity gap through affordable,
                    high-quality research, training, and evidence-based services.
                  </p>
                </div>
                <div className="rounded-2xl bg-primary p-6 text-white">
                  <h3 className="font-display text-lg font-semibold">
                    Our Impact Chain
                  </h3>
                  <div className="mt-4 space-y-3">
                    {["Data", "Knowledge", "Action", "Lasting Impact"].map(
                      (step, i) => (
                        <div key={step} className="flex items-center gap-3">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-primary-dark">
                            {i + 1}
                          </span>
                          <span className="text-sm font-medium">{step}</span>
                          {i < 3 && (
                            <svg
                              className="ml-auto h-4 w-4 text-white/30"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          )}
                        </div>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </Section>

        <Section
          id="story"
          eyebrow="Our Journey"
          title={story.title}
          variant="muted"
        >
          <StoryTimeline />
        </Section>

        <Section id="services" eyebrow="What We Do" title="Our Services">
          <p className="-mt-6 mb-10 max-w-2xl text-lg text-muted">
            Comprehensive research, analytics, training, and advisory services
            designed to strengthen institutions and drive sustainable development.
          </p>
          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service, index) => (
              <ServiceCard
                key={service.id}
                index={index}
                title={service.title}
                description={service.description}
                items={service.items}
                note={service.note}
              />
            ))}
          </div>
        </Section>

        <Section
          id="approach"
          eyebrow="How We Work"
          title={approach.title}
          variant="dark"
        >
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-5 text-white/80">
              <p className="text-lg leading-relaxed">{approach.intro}</p>
              <p className="leading-relaxed">{approach.detail}</p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {approach.pillars.map((pillar) => (
                <div
                  key={pillar}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3.5"
                >
                  <span className="flex h-2 w-2 shrink-0 rounded-full bg-accent" />
                  <span className="text-sm font-medium text-white">{pillar}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>

        <Section id="commitment" eyebrow="Our Promise" title={commitment.title}>
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <Prose>
              {commitment.paragraphs.map((paragraph) => (
                <ProseParagraph key={paragraph.slice(0, 40)}>
                  {paragraph}
                </ProseParagraph>
              ))}
            </Prose>
            <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-white md:p-10">
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-40 w-40 rounded-full bg-accent/20"
                aria-hidden="true"
              />
              <blockquote className="relative font-display text-2xl font-medium leading-snug md:text-3xl">
                &ldquo;Knowledge is a powerful tool for transformation.&rdquo;
              </blockquote>
              <p className="relative mt-4 text-sm text-white/70">
                — {site.name}
              </p>
            </div>
          </div>
        </Section>

        <section
          id="contact"
          className="border-t border-border bg-surface py-20 md:py-28"
        >
          <div className="mx-auto max-w-6xl px-6">
            <div className="overflow-hidden rounded-3xl bg-primary-dark">
              <div className="grid lg:grid-cols-2">
                <div className="p-8 md:p-12 lg:p-16">
                  <p className="text-sm font-semibold uppercase tracking-widest text-accent-light">
                    Get in Touch
                  </p>
                  <h2 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">
                    Partner With EARC
                  </h2>
                  <p className="mt-4 max-w-md text-white/75">
                    Ready to strengthen your research capacity, improve your MEL
                    systems, or advance evidence-based decision-making? We would
                    love to hear from you.
                  </p>
                  <div className="mt-8 space-y-4">
                    <a
                      href={`mailto:${site.email}`}
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-3.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-light"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      {site.email}
                    </a>
                  </div>
                </div>
                <div className="flex flex-col justify-center border-t border-white/10 bg-primary/50 p-8 md:p-12 lg:border-l lg:border-t-0">
                  <h3 className="font-display text-xl font-semibold text-white">
                    Areas of Collaboration
                  </h3>
                  <ul className="mt-6 space-y-3">
                    {[
                      "Educational research & institutional reviews",
                      "MEL framework design & evaluations",
                      "Data analytics & research support",
                      "Professional training & capacity building",
                      "Environmental & geospatial analytics",
                      "Policy advisory & strategic planning",
                    ].map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-3 text-sm text-white/80"
                      >
                        <svg
                          className="h-4 w-4 shrink-0 text-accent"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
