"use client";

import { useActionState, useEffect, useState } from "react";
import {
  initializeServicePaymentAction,
  type InitializePaymentState,
} from "../../actions/payments";
import { formatNairaAmount } from "../../lib/format";

type OrderServiceCTAProps = {
  serviceId: string;
  serviceTitle: string;
  amountNgn?: number | null;
  contactEmail: string;
};

const initialPaymentState: InitializePaymentState = {};

export default function OrderServiceCTA({
  serviceId,
  serviceTitle,
  amountNgn,
  contactEmail,
}: OrderServiceCTAProps) {
  const hasPayableAmount = typeof amountNgn === "number" && amountNgn > 0;
  const [pricingOpen, setPricingOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [paymentState, paymentAction, paymentPending] = useActionState(
    initializeServicePaymentAction,
    initialPaymentState,
  );

  useEffect(() => {
    if (paymentState.authorizationUrl) {
      window.location.assign(paymentState.authorizationUrl);
    }
  }, [paymentState.authorizationUrl]);

  useEffect(() => {
    if (!pricingOpen && !checkoutOpen) {
      return;
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !paymentPending) {
        setPricingOpen(false);
        setCheckoutOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [pricingOpen, checkoutOpen, paymentPending]);

  function handleOrderClick() {
    if (hasPayableAmount) {
      setCheckoutOpen(true);
      return;
    }

    setPricingOpen(true);
  }

  return (
    <>
      <button
        type="button"
        onClick={handleOrderClick}
        className="inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold text-primary-dark transition-colors hover:bg-accent-light"
      >
        Order Service
      </button>

      {pricingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close modal"
            onClick={() => setPricingOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-pricing-title"
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-xl"
          >
            <h2
              id="order-pricing-title"
              className="font-display text-xl font-semibold text-foreground"
            >
              Order Service
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Thank you for showing interest in this service. Please contact admin:{" "}
              <a
                href={`mailto:${contactEmail}`}
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {contactEmail}
              </a>{" "}
              for Pricing and other Order Information.
            </p>
            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setPricingOpen(false)}
                className="rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-light"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {checkoutOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <button
            type="button"
            className="absolute inset-0 bg-black/50"
            aria-label="Close modal"
            onClick={paymentPending ? undefined : () => setCheckoutOpen(false)}
            disabled={paymentPending}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="order-checkout-title"
            className="relative z-10 w-full max-w-md rounded-2xl border border-border bg-surface shadow-xl"
          >
            <div className="border-b border-border px-6 py-5">
              <h2
                id="order-checkout-title"
                className="font-display text-xl font-semibold text-foreground"
              >
                Order Service
              </h2>
              <p className="mt-1 text-sm text-muted">
                Pay securely with Paystack for {serviceTitle}.
              </p>
            </div>

            <form action={paymentAction} className="space-y-4 px-6 py-6">
              <input type="hidden" name="serviceId" value={serviceId} />

              {paymentState.error && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                  {paymentState.error}
                </div>
              )}

              <div className="rounded-xl border border-border bg-background px-4 py-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted">
                  Amount due
                </p>
                <p className="mt-1 font-display text-2xl font-bold text-foreground">
                  {formatNairaAmount(amountNgn!)}
                </p>
              </div>

              <div>
                <label
                  htmlFor="customerName"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Full name
                </label>
                <input
                  id="customerName"
                  name="customerName"
                  type="text"
                  required
                  placeholder="Your full name"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div>
                <label
                  htmlFor="customerEmail"
                  className="mb-1.5 block text-sm font-medium text-foreground"
                >
                  Email address
                </label>
                <input
                  id="customerEmail"
                  name="customerEmail"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm text-foreground outline-none placeholder:text-muted focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>

              <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={() => setCheckoutOpen(false)}
                  disabled={paymentPending}
                  className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground hover:bg-background disabled:opacity-70"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={paymentPending}
                  className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-primary-dark hover:bg-accent-light disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {paymentPending ? "Redirecting..." : "Pay with Paystack"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
