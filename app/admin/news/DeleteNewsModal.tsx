"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteNewsAction } from "../../actions/news";
import type { AdminNewsItem } from "../../lib/news-data";

type DeleteNewsModalProps = {
  item: AdminNewsItem | null;
  onClose: () => void;
};

export default function DeleteNewsModal({ item, onClose }: DeleteNewsModalProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!item) {
      return;
    }

    setError(null);

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

  if (!item) {
    return null;
  }

  const newsId = item.id;

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteNewsAction(newsId);

      if (result.error) {
        setError(result.error);
        return;
      }

      onClose();
      router.refresh();
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        aria-label="Close modal"
        onClick={pending ? undefined : onClose}
        disabled={pending}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-news-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface shadow-xl"
      >
        <div className="border-b border-border px-6 py-5">
          <h2 id="delete-news-title" className="font-display text-xl font-semibold text-foreground">
            Delete News
          </h2>
          <p className="mt-2 text-sm text-muted">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">{item.title}</span>? This removes it
            from the homepage carousel and cannot be undone.
          </p>
        </div>

        <div className="px-6 py-5">
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <div className="rounded-lg bg-background px-4 py-3 text-sm">
            <p className="font-medium text-foreground">{item.title}</p>
            <p className="mt-1 text-muted">{item.category}</p>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-3 border-t border-border px-6 py-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-background disabled:opacity-70"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={pending}
            className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {pending ? "Deleting..." : "Delete News"}
          </button>
        </div>
      </div>
    </div>
  );
}
