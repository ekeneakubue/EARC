"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createServiceAction, type CreateServiceState } from "../../actions/services";
import { ServiceStatus, serviceStatusLabels } from "../../lib/enums";
import { slugify } from "../../lib/slugify";
import ServiceImageUpload from "./ServiceImageUpload";
import ServiceItemsField from "./ServiceItemsField";

type AddServiceModalProps = {
  open: boolean;
  onClose: () => void;
};

const initialState: CreateServiceState = {};

const inputClassName =
  "w-full rounded-lg border border-primary/15 bg-background px-4 py-2.5 text-sm outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20";

const readOnlyClassName =
  "w-full cursor-not-allowed rounded-lg border border-primary/10 bg-primary/5 px-4 py-2.5 text-sm text-muted outline-none";

export default function AddServiceModal({ open, onClose }: AddServiceModalProps) {
  const router = useRouter();
  const [state, formAction, pending] = useActionState(createServiceAction, initialState);
  const [title, setTitle] = useState("");
  const serviceId = slugify(title);

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

    setTitle("");

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
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <button
        type="button"
        className="animate-modal-backdrop absolute inset-0 bg-linear-to-br from-primary-dark/80 via-primary/70 to-primary-light/60 backdrop-blur-sm"
        aria-label="Close modal"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-service-title"
        className="animate-modal-panel relative z-10 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-primary/20 bg-surface shadow-2xl shadow-primary/20"
      >
        <div className="animate-green-gradient relative shrink-0 bg-linear-to-br from-primary-dark via-primary to-primary-light px-6 py-6 text-white">
          <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
            <div className="animate-green-glow absolute -right-8 -top-8 h-32 w-32 rounded-full bg-primary-light/40 blur-2xl" />
            <div
              className="animate-green-glow absolute -bottom-10 left-1/4 h-24 w-24 rounded-full bg-primary-dark/50 blur-2xl"
              style={{ animationDelay: "1.5s" }}
            />
          </div>

          <div className="relative z-10 flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60">
                New Offering
              </p>
              <h2
                id="add-service-title"
                className="mt-1 font-display text-xl font-semibold leading-snug"
              >
                Add New Service
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/75">
                Create a new service offering for the website.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="shrink-0 rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white"
              aria-label="Close"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form
          action={formAction}
          className="space-y-5 overflow-y-auto bg-linear-to-b from-primary/5 to-surface px-6 py-6"
        >
          {state.error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {state.error}
            </div>
          )}

          <ServiceImageUpload resetKey={open} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="title" className="mb-2 block text-sm font-medium text-foreground">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Educational Research and Consultancy"
                className={inputClassName}
              />
            </div>

            <div>
              <label htmlFor="id-display" className="mb-2 block text-sm font-medium text-foreground">
                Service ID (URL slug)
              </label>
              <input type="hidden" name="id" value={serviceId} />
              <input
                id="id-display"
                type="text"
                readOnly
                tabIndex={-1}
                value={serviceId}
                placeholder="Generated from title"
                className={readOnlyClassName}
                aria-readonly="true"
              />
              <p className="mt-1.5 text-xs text-muted">Auto-generated from the service title.</p>
            </div>
          </div>

          <div>
            <label htmlFor="description" className="mb-2 block text-sm font-medium text-foreground">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows={3}
              placeholder="Brief overview of the service..."
              className={inputClassName}
            />
          </div>

          <ServiceItemsField resetKey={open} inputClassName={inputClassName} />

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="amount" className="mb-2 block text-sm font-medium text-foreground">
                Amount (NGN)
              </label>
              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-sm font-semibold text-primary">
                  ₦
                </span>
                <input
                  id="amount"
                  name="amount"
                  type="number"
                  min="0"
                  step="1"
                  required
                  placeholder="250000"
                  className={`${inputClassName} pl-9`}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted">Enter the price in Nigerian Naira.</p>
            </div>

            <div>
              <label htmlFor="duration" className="mb-2 block text-sm font-medium text-foreground">
                Service duration
              </label>
              <input
                id="duration"
                name="duration"
                type="text"
                required
                placeholder="4–8 Weeks"
                className={inputClassName}
              />
              <p className="mt-1.5 text-xs text-muted">e.g. 2 Weeks, 4–8 Weeks, 3 Months</p>
            </div>
          </div>

          <div>
            <label htmlFor="note" className="mb-2 block text-sm font-medium text-foreground">
              Our approach
            </label>
            <textarea
              id="note"
              name="note"
              required
              rows={3}
              placeholder="How EARC delivers this service..."
              className={inputClassName}
            />
          </div>

          <div>
            <label htmlFor="status" className="mb-2 block text-sm font-medium text-foreground">
              Status
            </label>
            <select
              id="status"
              name="status"
              defaultValue={ServiceStatus.DRAFT}
              className={inputClassName}
            >
              {Object.values(ServiceStatus).map((status) => (
                <option key={status} value={status}>
                  {serviceStatusLabels[status]}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col-reverse gap-3 border-t border-primary/10 pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-primary/20 px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-primary/5"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="rounded-lg bg-linear-to-r from-primary-dark via-primary to-primary-light px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/25 transition-all hover:shadow-lg hover:shadow-primary/30 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {pending ? "Adding service..." : "Add Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
