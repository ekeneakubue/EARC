"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { updateUserAction, type UpdateUserState } from "../../actions/users";
import PasswordInput from "../../components/PasswordInput";
import { UserRole, UserStatus, userRoleLabels, userStatusLabels } from "../../lib/enums";
import type { UserRow } from "./UsersManager";

type EditUserModalProps = {
  user: UserRow | null;
  onClose: () => void;
};

const initialState: UpdateUserState = {};

export default function EditUserModal({ user, onClose }: EditUserModalProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(updateUserAction, initialState);

  useEffect(() => {
    if (state.success) {
      onClose();
      router.refresh();
    }
  }, [state.success, onClose, router]);

  useEffect(() => {
    if (!user) {
      return;
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
  }, [user, onClose, pending]);

  if (!user) {
    return null;
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
        aria-labelledby="edit-user-title"
        className="relative z-10 w-full max-w-lg rounded-2xl border border-border bg-surface shadow-xl"
      >
        <div className="flex items-start justify-between border-b border-border px-6 py-5">
          <div>
            <h2 id="edit-user-title" className="font-display text-xl font-semibold text-foreground">
              Edit User
            </h2>
            <p className="mt-1 text-sm text-muted">
              Update account details, role, or status for {user.name}.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={pending}
            className="rounded-lg p-2 text-muted transition-colors hover:bg-background hover:text-foreground disabled:opacity-70"
            aria-label="Close"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form key={user.id} action={formAction} className="space-y-5 px-6 py-6">
          <input type="hidden" name="userId" value={user.id} />

          {state.error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {state.error}
            </div>
          )}

          <div>
            <label htmlFor="edit-name" className="mb-2 block text-sm font-medium text-foreground">
              Full name
            </label>
            <input
              id="edit-name"
              name="name"
              type="text"
              required
              defaultValue={user.name}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="edit-email" className="mb-2 block text-sm font-medium text-foreground">
              Email address
            </label>
            <input
              id="edit-email"
              name="email"
              type="email"
              required
              defaultValue={user.email}
              className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          <div>
            <label htmlFor="edit-password" className="mb-2 block text-sm font-medium text-foreground">
              New password
            </label>
            <PasswordInput
              id="edit-password"
              name="password"
              minLength={8}
              placeholder="Leave blank to keep current password"
              autoComplete="new-password"
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="edit-role" className="mb-2 block text-sm font-medium text-foreground">
                Role
              </label>
              <select
                id="edit-role"
                name="role"
                defaultValue={user.role}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {Object.values(UserRole).map((role) => (
                  <option key={role} value={role}>
                    {userRoleLabels[role]}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="edit-status" className="mb-2 block text-sm font-medium text-foreground">
                Status
              </label>
              <select
                id="edit-status"
                name="status"
                defaultValue={user.status}
                className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {Object.values(UserStatus).map((status) => (
                  <option key={status} value={status}>
                    {userStatusLabels[status]}
                  </option>
                ))}
              </select>
            </div>
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
              className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
