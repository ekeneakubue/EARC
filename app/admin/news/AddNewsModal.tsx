"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createNewsAction, type CreateNewsState } from "../../actions/news";
import { ContentStatus, contentStatusLabels } from "../../lib/enums";

type AddNewsModalProps = {
  open: boolean;
  onClose: () => void;
};

const initialState: CreateNewsState = {};
const inputClassName =
  "w-full rounded-lg border border-primary/15 bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function AddNewsModal({ open, onClose }: AddNewsModalProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(createNewsAction, initialState);

  useEffect(() => {
    if (state.success) {
      onClose();
      router.refresh();
    }
  }, [state.success, onClose, router]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setPreview(null);

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !pending) {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [open, onClose, pending]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setPreview((current) => {
      if (current) {
        URL.revokeObjectURL(current);
      }

      return file ? URL.createObjectURL(file) : null;
    });
  }

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="animate-modal-backdrop absolute inset-0 bg-primary-dark/75 backdrop-blur-sm"
        aria-label="Close modal"
        onClick={pending ? undefined : onClose}
        disabled={pending}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-news-title"
        className="animate-modal-panel relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-primary/20 bg-surface shadow-2xl"
      >
        <div className="shrink-0 bg-linear-to-br from-primary-dark via-primary to-primary-light px-6 py-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Homepage Feed
              </p>
              <h2 id="add-news-title" className="mt-1 font-display text-xl font-semibold">
                Add News
              </h2>
              <p className="mt-2 text-sm text-white/75">
                Publish an update to the homepage hero carousel.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form action={formAction} className="space-y-5 overflow-y-auto px-6 py-6">
          {state.error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {state.error}
            </div>
          )}

          <div>
            <label
              htmlFor="news-image"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              News image
            </label>
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-primary/25 bg-primary/5 text-sm text-muted hover:border-primary/50"
            >
              {preview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={preview} alt="News preview" className="h-full w-full object-cover" />
              ) : (
                <span>Choose a JPG, PNG, WebP, or GIF image</span>
              )}
            </button>
            <input
              ref={imageInputRef}
              id="news-image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              required
              onChange={handleImageChange}
              className="sr-only"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="news-category" className="mb-2 block text-sm font-medium text-foreground">
                Category
              </label>
              <input
                id="news-category"
                name="category"
                type="text"
                required
                placeholder="Research"
                className={inputClassName}
              />
            </div>
            <div>
              <label htmlFor="news-status" className="mb-2 block text-sm font-medium text-foreground">
                Status
              </label>
              <select
                id="news-status"
                name="status"
                defaultValue={ContentStatus.PUBLISHED}
                className={inputClassName}
              >
                {Object.values(ContentStatus).map((status) => (
                  <option key={status} value={status}>
                    {contentStatusLabels[status]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="news-title" className="mb-2 block text-sm font-medium text-foreground">
              Headline
            </label>
            <input
              id="news-title"
              name="title"
              type="text"
              required
              placeholder="Enter the news headline"
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="news-description"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Overlay text
            </label>
            <textarea
              id="news-description"
              name="description"
              required
              rows={4}
              placeholder="A short summary shown over the carousel image..."
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="news-full-description"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Full News Description
            </label>
            <textarea
              id="news-full-description"
              name="fullDescription"
              required
              rows={6}
              placeholder="Write the full news story shown on the detail page..."
              className={inputClassName}
            />
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              disabled={pending}
              className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-background disabled:opacity-70"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Adding news..." : "Add News"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
