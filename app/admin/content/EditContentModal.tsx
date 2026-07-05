"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateContentSectionAction, type UpdateContentState } from "../../actions/content";
import type { ContentSectionRow } from "../../lib/content-data";
import {
  type AboutContent,
  type ContactContent,
  type HeroContent,
  type StoryChapterContent,
  type StoryContent,
} from "../../lib/content-sections";
import { ContentStatus, contentStatusLabels } from "../../lib/enums";
import ListItemsField from "./ListItemsField";
import StoryChaptersField from "./StoryChaptersField";

type EditContentModalProps = {
  section: ContentSectionRow | null;
  onClose: () => void;
};

const initialState: UpdateContentState = {};

const inputClassName =
  "w-full rounded-lg border border-primary/15 bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

type EditContentFormProps = {
  section: ContentSectionRow;
  onClose: () => void;
};

function EditContentForm({ section, onClose }: EditContentFormProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateContentSectionAction, initialState);

  useEffect(() => {
    if (state.success) {
      router.refresh();
      onClose();
    }
  }, [state.success, onClose, router]);

  const hero = section.data as HeroContent;
  const about = section.data as AboutContent;
  const story = section.data as StoryContent;
  const contact = section.data as ContactContent;
  const chapters = (story.chapters ?? []) as StoryChapterContent[];
  const listResetKey = `${section.id}-${section.updatedAt.toISOString()}`;

  return (
    <form action={formAction} className="flex min-h-0 flex-1 flex-col">
      <input type="hidden" name="id" value={section.id} />

      <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="content-title" className="mb-1.5 block text-sm font-medium text-foreground">
              Card title
            </label>
            <input
              id="content-title"
              name="cardTitle"
              type="text"
              defaultValue={section.title}
              required
              className={inputClassName}
            />
          </div>
          <div>
            <label htmlFor="content-section" className="mb-1.5 block text-sm font-medium text-foreground">
              Section label
            </label>
            <input
              id="content-section"
              name="sectionLabel"
              type="text"
              defaultValue={section.section}
              required
              className={inputClassName}
            />
          </div>
        </div>

        <div>
          <label htmlFor="content-status" className="mb-1.5 block text-sm font-medium text-foreground">
            Status
          </label>
          <select
            id="content-status"
            name="status"
            defaultValue={section.status}
            className={inputClassName}
          >
            {Object.values(ContentStatus).map((status) => (
              <option key={status} value={status}>
                {contentStatusLabels[status]}
              </option>
            ))}
          </select>
          <p className="mt-1.5 text-xs text-muted">
            Set to Published for changes to appear on the homepage.
          </p>
        </div>

        {section.id === "hero" && (
          <>
            <div>
              <label htmlFor="hero-eyebrow" className="mb-1.5 block text-sm font-medium text-foreground">
                Eyebrow text
              </label>
              <input
                id="hero-eyebrow"
                name="eyebrow"
                type="text"
                defaultValue={hero.eyebrow ?? ""}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="hero-name" className="mb-1.5 block text-sm font-medium text-foreground">
                Organization name
              </label>
              <input
                id="hero-name"
                name="name"
                type="text"
                defaultValue={hero.name ?? ""}
                required
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="hero-tagline" className="mb-1.5 block text-sm font-medium text-foreground">
                Tagline
              </label>
              <input
                id="hero-tagline"
                name="tagline"
                type="text"
                defaultValue={hero.tagline ?? ""}
                required
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="hero-intro" className="mb-1.5 block text-sm font-medium text-foreground">
                Intro paragraph
              </label>
              <textarea
                id="hero-intro"
                name="intro"
                rows={4}
                defaultValue={hero.intro ?? ""}
                required
                className={`${inputClassName} resize-y`}
              />
            </div>
          </>
        )}

        {section.id === "about" && (
          <>
            <div>
              <label htmlFor="about-title" className="mb-1.5 block text-sm font-medium text-foreground">
                Section title
              </label>
              <input
                id="about-title"
                name="contentTitle"
                type="text"
                defaultValue={about.title ?? ""}
                required
                className={inputClassName}
              />
            </div>
            <ListItemsField
              resetKey={listResetKey}
              name="paragraphs"
              label="Paragraphs"
              initialItems={about.paragraphs ?? []}
              placeholder="Paragraph"
              inputClassName={inputClassName}
            />
          </>
        )}

        {section.id === "story" && (
          <>
            <div>
              <label htmlFor="story-title" className="mb-1.5 block text-sm font-medium text-foreground">
                Section title
              </label>
              <input
                id="story-title"
                name="contentTitle"
                type="text"
                defaultValue={story.title ?? ""}
                required
                className={inputClassName}
              />
            </div>
            <StoryChaptersField
              resetKey={listResetKey}
              initialChapters={chapters}
              inputClassName={inputClassName}
            />
          </>
        )}

        {section.id === "contact" && (
          <>
            <div>
              <label htmlFor="contact-eyebrow" className="mb-1.5 block text-sm font-medium text-foreground">
                Eyebrow text
              </label>
              <input
                id="contact-eyebrow"
                name="eyebrow"
                type="text"
                defaultValue={contact.eyebrow ?? ""}
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="contact-title" className="mb-1.5 block text-sm font-medium text-foreground">
                Heading
              </label>
              <input
                id="contact-title"
                name="contentTitle"
                type="text"
                defaultValue={contact.title ?? ""}
                required
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="contact-description" className="mb-1.5 block text-sm font-medium text-foreground">
                Description
              </label>
              <textarea
                id="contact-description"
                name="description"
                rows={4}
                defaultValue={contact.description ?? ""}
                required
                className={`${inputClassName} resize-y`}
              />
            </div>
            <div>
              <label
                htmlFor="contact-collaboration-title"
                className="mb-1.5 block text-sm font-medium text-foreground"
              >
                Collaboration heading
              </label>
              <input
                id="contact-collaboration-title"
                name="collaborationTitle"
                type="text"
                defaultValue={contact.collaborationTitle ?? ""}
                className={inputClassName}
              />
            </div>
            <ListItemsField
              resetKey={listResetKey}
              name="collaborationItems"
              label="Collaboration items"
              initialItems={contact.collaborationItems ?? []}
              placeholder="Collaboration item"
              inputClassName={inputClassName}
            />
          </>
        )}

        {state.error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {state.error}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
        <button
          type="button"
          onClick={onClose}
          disabled={pending}
          className="rounded-lg border border-border px-4 py-2 text-sm font-medium hover:bg-background disabled:opacity-60"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-light disabled:opacity-60"
        >
          {pending ? "Saving..." : "Save changes"}
        </button>
      </div>
    </form>
  );
}

export default function EditContentModal({ section, onClose }: EditContentModalProps) {
  useEffect(() => {
    if (!section) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [section, onClose]);

  if (!section) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close edit content modal"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
        <div className="border-b border-border px-6 py-4">
          <h2 className="font-display text-xl font-bold text-foreground">Edit {section.title}</h2>
          <p className="mt-1 text-sm text-muted">Update this homepage section and publish when ready.</p>
        </div>

        <EditContentForm
          key={`${section.id}-${section.updatedAt.toISOString()}`}
          section={section}
          onClose={onClose}
        />
      </div>
    </div>
  );
}
