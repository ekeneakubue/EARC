"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { PublicNewsItem } from "../lib/news-data";

export default function NewsFeedCarousel({
  newsItems,
}: {
  newsItems: PublicNewsItem[];
}) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || newsItems.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % newsItems.length);
    }, 6000);

    return () => window.clearInterval(timer);
  }, [paused, newsItems.length]);

  useEffect(() => {
    if (activeIndex >= newsItems.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, newsItems.length]);

  const activeItem = newsItems[activeIndex];

  function showPrevious() {
    if (newsItems.length === 0) {
      return;
    }

    setActiveIndex((current) => (current - 1 + newsItems.length) % newsItems.length);
  }

  function showNext() {
    if (newsItems.length === 0) {
      return;
    }

    setActiveIndex((current) => (current + 1) % newsItems.length);
  }

  if (!activeItem) {
    return null;
  }

  return (
    <aside
      aria-label="Latest updates"
      className="animate-fade-up-delay-2 w-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className="overflow-hidden rounded-3xl border border-white/15 bg-white/[0.07] shadow-2xl shadow-black/20 backdrop-blur-md">
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
              Latest Updates
            </p>
          </div>
          <span className="text-xs tabular-nums text-white/40">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(newsItems.length).padStart(2, "0")}
          </span>
        </div>

        <div
          key={activeItem.id}
          aria-live="polite"
          className="relative h-[50vh] max-h-104 overflow-hidden"
        >
          <Image
            src={activeItem.imageUrl}
            alt={activeItem.imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 420px"
          />
          <div
            className="absolute inset-0 bg-linear-to-t from-primary-dark via-primary-dark/75 to-black/10"
            aria-hidden="true"
          />

          <div className="absolute inset-x-0 bottom-0 p-6 md:p-7">
            <p className="text-xs font-semibold uppercase tracking-widest text-accent-light">
              {activeItem.category}
            </p>
            <h2 className="mt-3 font-display text-2xl font-bold leading-tight text-white md:text-3xl">
              {activeItem.title}
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/75">
              {activeItem.description}
            </p>
            <Link
              href={`/news/${activeItem.id}`}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-2.5 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-light"
            >
              Read More
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-white/10 px-5 py-4">
          <div className="flex gap-2" aria-label="Choose update">
            {newsItems.map((item, index) => (
              <button
                key={item.title}
                type="button"
                onClick={() => setActiveIndex(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeIndex
                    ? "w-8 bg-accent"
                    : "w-3 bg-white/25 hover:bg-white/50"
                }`}
                aria-label={`Show update ${index + 1}: ${item.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
              />
            ))}
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={showPrevious}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
              aria-label="Previous update"
            >
              <span aria-hidden="true">←</span>
            </button>
            <button
              type="button"
              onClick={showNext}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/70 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
              aria-label="Next update"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
