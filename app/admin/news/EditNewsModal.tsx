"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { updateNewsAction, type UpdateNewsState } from "../../actions/news";
import { ContentStatus, contentStatusLabels } from "../../lib/enums";
import type { AdminNewsItem } from "../../lib/news-data";

type EditNewsModalProps = {
  item: AdminNewsItem | null;
  onClose: () => void;
};

const initialState: UpdateNewsState = {};
const inputClassName =
  "w-full rounded-lg border border-primary/15 bg-background px-4 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20";

export default function EditNewsModal({ item, onClose }: EditNewsModalProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, formAction, pending] = useActionState(updateNewsAction, initialState);

  useEffect(() => {
    if (state.success) {
      onClose();
      router.refresh();
    }
  }, [state.success, onClose, router]);

  useEffect(() => {
    if (!item) {
      return;
    }

    setPreview(null);

    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }

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
  }, [item, onClose, pending]);

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

  if (!item) {
    return null;
  }

  const displayImage = preview ?? item.imageUrl;

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
        aria-labelledby="edit-news-title"
        className="animate-modal-panel relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-primary/20 bg-surface shadow-2xl"
      >
        <div className="shrink-0 bg-linear-to-br from-primary-dark via-primary to-primary-light px-6 py-6 text-white">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                Homepage Feed
              </p>
              <h2 id="edit-news-title" className="mt-1 font-display text-xl font-semibold">
                Edit News
              </h2>
              <p className="mt-2 text-sm text-white/75">
                Update this homepage carousel item and detail page.
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

        <form key={item.id} action={formAction} className="space-y-5 overflow-y-auto px-6 py-6">
          <input type="hidden" name="newsId" value={item.id} />

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
              htmlFor="edit-news-image"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              News image
            </label>
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              className="relative flex h-48 w-full items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-primary/25 bg-primary/5 text-sm text-muted hover:border-primary/50"
            >
              {displayImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={displayImage} alt="News preview" className="h-full w-full object-cover" />
              ) : (
                <span>Choose a JPG, PNG, WebP, or GIF image</span>
              )}
            </button>
            <input
              ref={imageInputRef}
              id="edit-news-image"
              name="image"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              onChange={handleImageChange}
              className="sr-only"
            />
            <p className="mt-1.5 text-xs text-muted">Leave empty to keep the current image.</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="edit-news-category"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Category
              </label>
              <input
                id="edit-news-category"
                name="category"
                type="text"
                required
                defaultValue={item.category}
                className={inputClassName}
              />
            </div>
            <div>
              <label
                htmlFor="edit-news-status"
                className="mb-2 block text-sm font-medium text-foreground"
              >
                Status
              </label>
              <select
                id="edit-news-status"
                name="status"
                defaultValue={item.status}
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
            <label
              htmlFor="edit-news-title"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Headline
            </label>
            <input
              id="edit-news-title"
              name="title"
              type="text"
              required
              defaultValue={item.title}
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="edit-news-description"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Overlay text
            </label>
            <textarea
              id="edit-news-description"
              name="description"
              required
              rows={4}
              defaultValue={item.description}
              className={inputClassName}
            />
          </div>

          <div>
            <label
              htmlFor="edit-news-full-description"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Full News Description
            </label>
            <textarea
              id="edit-news-full-description"
              name="fullDescription"
              required
              rows={6}
              defaultValue={item.fullDescription}
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
              {pending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
