"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteUserAction } from "../../actions/users";
import type { UserRow } from "./UsersManager";

type DeleteUserModalProps = {
  user: UserRow | null;
  onClose: () => void;
};

export default function DeleteUserModal({ user, onClose }: DeleteUserModalProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (!user) {
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
  }, [user, onClose, pending]);

  if (!user) {
    return null;
  }

  function handleDelete() {
    startTransition(async () => {
      const result = await deleteUserAction(user.id);

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
        aria-labelledby="delete-user-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface shadow-xl"
      >
        <div className="border-b border-border px-6 py-5">
          <h2 id="delete-user-title" className="font-display text-xl font-semibold text-foreground">
            Delete User
          </h2>
          <p className="mt-2 text-sm text-muted">
            Are you sure you want to delete{" "}
            <span className="font-medium text-foreground">{user.name}</span>? This action
            cannot be undone.
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
            <p className="font-medium text-foreground">{user.email}</p>
            <p className="mt-1 text-muted">{user.name}</p>
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
            {pending ? "Deleting..." : "Delete User"}
          </button>
        </div>
      </div>
    </div>
  );
}
