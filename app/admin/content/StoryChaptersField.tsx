"use client";

import { useEffect, useState } from "react";
import type { StoryChapterContent } from "../../lib/content-sections";

type StoryChaptersFieldProps = {
  resetKey: string | boolean;
  initialChapters?: StoryChapterContent[];
  inputClassName: string;
};

type ChapterDraft = StoryChapterContent;

export default function StoryChaptersField({
  resetKey,
  initialChapters,
  inputClassName,
}: StoryChaptersFieldProps) {
  const [chapters, setChapters] = useState<ChapterDraft[]>([
    { chapter: 1, title: "", paragraph: "", image: "", alt: "" },
  ]);

  useEffect(() => {
    setChapters(
      initialChapters?.length
        ? initialChapters.map((chapter, index) => ({
            ...chapter,
            chapter: index + 1,
          }))
        : [{ chapter: 1, title: "", paragraph: "", image: "", alt: "" }],
    );
  }, [resetKey, initialChapters]);

  function addChapter() {
    setChapters((current) => [
      ...current,
      {
        chapter: current.length + 1,
        title: "",
        paragraph: "",
        image: "",
        alt: "",
      },
    ]);
  }

  function removeChapter(index: number) {
    setChapters((current) => {
      if (current.length === 1) {
        return [{ chapter: 1, title: "", paragraph: "", image: "", alt: "" }];
      }

      return current
        .filter((_, chapterIndex) => chapterIndex !== index)
        .map((chapter, chapterIndex) => ({ ...chapter, chapter: chapterIndex + 1 }));
    });
  }

  function updateChapter(index: number, field: keyof ChapterDraft, value: string) {
    setChapters((current) =>
      current.map((chapter, chapterIndex) =>
        chapterIndex === index ? { ...chapter, [field]: value } : chapter,
      ),
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-sm font-medium text-foreground">Story chapters</label>
        <button
          type="button"
          onClick={addChapter}
          className="inline-flex items-center gap-1.5 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 text-xs font-semibold text-primary transition-colors hover:bg-primary/10"
        >
          Add chapter
        </button>
      </div>

      {chapters.map((chapter, index) => (
        <div key={index} className="rounded-xl border border-border bg-background/60 p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-foreground">Chapter {index + 1}</p>
            <button
              type="button"
              onClick={() => removeChapter(index)}
              className="text-xs font-medium text-red-600 hover:text-red-700"
            >
              Remove
            </button>
          </div>

          <div className="space-y-3">
            <input
              name="chapterTitles"
              type="text"
              value={chapter.title}
              onChange={(event) => updateChapter(index, "title", event.target.value)}
              placeholder="Chapter title"
              className={inputClassName}
            />
            <textarea
              name="chapterParagraphs"
              rows={3}
              value={chapter.paragraph}
              onChange={(event) => updateChapter(index, "paragraph", event.target.value)}
              placeholder="Chapter description"
              className={`${inputClassName} resize-y`}
            />
            <input
              name="chapterImages"
              type="text"
              value={chapter.image}
              onChange={(event) => updateChapter(index, "image", event.target.value)}
              placeholder="Image path (e.g. /images/journey/chapter-1.jpg)"
              className={inputClassName}
            />
            <input
              name="chapterAlts"
              type="text"
              value={chapter.alt}
              onChange={(event) => updateChapter(index, "alt", event.target.value)}
              placeholder="Image alt text"
              className={inputClassName}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
