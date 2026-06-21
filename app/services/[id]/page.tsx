import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { site } from "../../lib/content";
import {
  getAllPublicServiceIds,
  getPublicServiceById,
  getRelatedPublicServices,
} from "../../lib/service-data";

type ServicePageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const ids = await getAllPublicServiceIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({ params }: ServicePageProps): Promise<Metadata> {
  const { id } = await params;
  const service = await getPublicServiceById(id);

  if (!service) {
    return { title: "Service Not Found | EARC" };
  }

  return {
    title: `${service.title} | EARC`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const { id } = await params;
  const service = await getPublicServiceById(id);

  if (!service) {
    notFound();
  }

  const relatedServices = await getRelatedPublicServices(id);
  const hasPricing = Boolean(service.amount || service.duration);

  return (
    <>
      <Header />
      <main>
        <section className="bg-primary-dark text-white">
          <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
            <Link
              href="/#services"
              className="inline-flex items-center gap-2 text-sm text-white/70 transition-colors hover:text-white"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Services
            </Link>

            <div className="mt-6 flex flex-col gap-8 md:flex-row md:items-start md:justify-between md:gap-12">
              <div className="min-w-0 flex-1">
                <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
                  {service.title}
                </h1>
                <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
                  {service.description}
                </p>
              </div>

              {hasPricing && (
                <div className="flex w-full shrink-0 flex-col gap-4 sm:flex-row md:w-80 md:flex-col lg:w-96">
                  {service.amount && (
                    <div className="flex-1 rounded-2xl border border-white/20 bg-white/10 px-6 py-5 shadow-lg">
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                        Amount
                      </p>
                      <p className="mt-2 font-display text-2xl font-bold text-accent-light md:text-3xl">
                        {service.amount}
                      </p>
                    </div>
                  )}
                  {service.duration && (
                    <div className="flex-1 rounded-2xl border border-white/20 bg-white/10 px-6 py-5 shadow-lg">
                      <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                        Duration
                      </p>
                      <p className="mt-2 font-display text-2xl font-bold text-accent-light md:text-3xl">
                        {service.duration}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="mx-auto grid max-w-6xl gap-12 px-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <h2 className="font-display text-2xl font-semibold text-foreground">
                What We Offer
              </h2>
              <p className="mt-3 text-muted">
                Comprehensive support tailored to your institution&apos;s needs.
              </p>
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {service.items.map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 shadow-sm"
                  >
                    <svg
                      className="mt-0.5 h-5 w-5 shrink-0 text-accent"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span className="text-sm leading-relaxed text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-10 rounded-2xl border border-border bg-background p-6 md:p-8">
                <h3 className="font-display text-xl font-semibold text-foreground">
                  Our Approach
                </h3>
                <p className="mt-4 text-base leading-relaxed text-muted">{service.note}</p>
              </div>
            </div>

            <aside className="space-y-6">
              {service.imageUrl && (
                <div className="relative mx-auto aspect-square w-full max-w-xs overflow-hidden rounded-2xl border border-border bg-surface shadow-sm lg:max-w-none">
                  <Image
                    src={service.imageUrl}
                    alt={service.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 320px, 384px"
                    priority
                  />
                </div>
              )}

              <div className="rounded-2xl bg-primary p-6 text-white">
                <h3 className="font-display text-lg font-semibold">Request This Service</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/80">
                  Partner with {site.shortName} to access expert support for your project or
                  institution.
                </p>
                <Link
                  href="/#contact"
                  className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-light"
                >
                  Get in Touch
                </Link>
              </div>

              <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
                <h3 className="font-semibold text-foreground">Related Services</h3>
                <ul className="mt-4 space-y-3">
                  {relatedServices.map((related) => (
                    <li key={related.id}>
                      <Link
                        href={`/services/${related.id}`}
                        className="text-sm text-muted transition-colors hover:text-primary"
                      >
                        {related.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </aside>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
