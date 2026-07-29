import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import {
  getAllPublicNewsIds,
  getPublicNewsItemById,
} from "../../lib/news-data";

type NewsDetailPageProps = {
  params: Promise<{ id: string }>;
};

export async function generateStaticParams() {
  const ids = await getAllPublicNewsIds();
  return ids.map((id) => ({ id }));
}

export async function generateMetadata({
  params,
}: NewsDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const item = await getPublicNewsItemById(id);

  if (!item) {
    return { title: "News Not Found | EARC" };
  }

  return {
    title: `${item.title} | EARC News`,
    description: item.description,
  };
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const { id } = await params;
  const item = await getPublicNewsItemById(id);

  if (!item) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <article>
          <section className="bg-primary-dark py-14 text-white md:py-20">
            <div className="mx-auto max-w-4xl px-6">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-sm text-white/65 transition-colors hover:text-white"
              >
                <span aria-hidden="true">←</span>
                Back to Home
              </Link>
              <p className="mt-8 text-xs font-semibold uppercase tracking-widest text-accent-light">
                {item.category}
              </p>
              <h1 className="mt-3 max-w-3xl font-display text-3xl font-bold leading-tight md:text-5xl">
                {item.title}
              </h1>
            </div>
          </section>

          <section className="py-12 md:py-16">
            <div className="mx-auto max-w-4xl px-6">
              <div className="relative aspect-video overflow-hidden rounded-3xl border border-border bg-surface shadow-sm">
                <Image
                  src={item.imageUrl}
                  alt={item.imageAlt}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>

              <div className="mx-auto mt-10 max-w-3xl">
                <div className="space-y-5 text-lg leading-8 text-muted">
                  {(item.fullDescription || item.description)
                    .split(/\n+/)
                    .map((paragraph) => paragraph.trim())
                    .filter(Boolean)
                    .map((paragraph) => (
                      <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                    ))}
                </div>
              </div>
            </div>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
