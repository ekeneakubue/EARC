import Image from "next/image";
import { story } from "../lib/content";

export default function StoryTimeline() {
  return (
    <div className="relative">
      <div
        className="absolute left-4 top-0 hidden h-full w-px bg-primary/20 md:block lg:left-1/2 lg:-translate-x-px"
        aria-hidden="true"
      />

      <div className="space-y-16 md:space-y-24">
        {story.chapters.map((chapter, index) => {
          const imageFirst = index % 2 === 1;

          return (
            <article
              key={chapter.chapter}
              className="relative md:grid md:grid-cols-2 md:items-center md:gap-10 lg:gap-16"
            >
              <div
                className={`${imageFirst ? "md:order-2 md:col-start-2" : ""}`}
              >
                <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
                  <div className="relative aspect-4/3">
                    <Image
                      src={chapter.image}
                      alt={chapter.alt}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                </div>
              </div>

              <div
                className={`mt-6 md:mt-0 ${imageFirst ? "md:order-1 md:col-start-1 md:row-start-1" : ""}`}
              >
                <div className="rounded-2xl border border-border bg-surface p-6 md:p-8">
                  <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Chapter {chapter.chapter}
                  </span>
                  <h3 className="font-display text-xl font-semibold text-foreground md:text-2xl">
                    {chapter.title}
                  </h3>
                  <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">
                    {chapter.paragraph}
                  </p>
                </div>
              </div>

              <div
                className="absolute left-4 top-8 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-primary bg-surface md:block lg:left-1/2"
                aria-hidden="true"
              />
            </article>
          );
        })}
      </div>
    </div>
  );
}
