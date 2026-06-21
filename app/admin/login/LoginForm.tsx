"use client";

import Link from "next/link";
import { useActionState, useEffect } from "react";
import PasswordInput from "../../components/PasswordInput";
import { loginAction, type LoginState } from "../../actions/auth";

const initialState: LoginState = {};

export default function LoginForm() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  useEffect(() => {
    if (state?.success) {
      window.location.assign("/admin");
    }
  }, [state?.success]);

  return (
    <form action={formAction} className="space-y-6">
      {state?.error && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {state.error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="admin@earc.org"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">
          Password
        </label>
        <PasswordInput
          id="password"
          name="password"
          required
          placeholder="Enter your password"
          autoComplete="current-password"
          className="w-full rounded-lg border border-border bg-background px-4 py-3 pr-11 text-sm outline-none transition-colors placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 text-muted">
          <input
            type="checkbox"
            name="remember"
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary"
          />
          Remember me
        </label>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="flex w-full items-center justify-center rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-light disabled:cursor-not-allowed disabled:opacity-70"
      >
        {pending ? "Signing in..." : "Sign In"}
      </button>

      <p className="text-center text-sm text-muted">
        <Link href="/" className="font-medium text-primary hover:text-primary-light">
          ← Back to website
        </Link>
      </p>
    </form>
  );
}
