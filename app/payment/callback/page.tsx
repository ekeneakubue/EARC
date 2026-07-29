import Link from "next/link";
import type { Metadata } from "next";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import { formatNairaAmount } from "../../lib/format";
import { verifyPaystackTransaction } from "../../lib/paystack";

export const metadata: Metadata = {
  title: "Payment Status | EARC",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PaymentCallbackPageProps = {
  searchParams: Promise<{
    reference?: string;
    trxref?: string;
    serviceId?: string;
  }>;
};

export default async function PaymentCallbackPage({
  searchParams,
}: PaymentCallbackPageProps) {
  const params = await searchParams;
  const reference = params.reference || params.trxref;
  const serviceId = params.serviceId;

  let status: "success" | "failed" | "error" = "error";
  let message = "We could not confirm this payment.";
  let amountLabel: string | null = null;
  let serviceTitle: string | null = null;

  if (!reference) {
    message = "Missing payment reference. If you completed payment, contact admin with your receipt.";
  } else {
    try {
      const payment = await verifyPaystackTransaction(reference);
      serviceTitle = payment.metadata?.serviceTitle ?? null;
      amountLabel = formatNairaAmount(Math.round(payment.amount / 100));

      if (payment.status === "success") {
        status = "success";
        message = "Your payment was successful. We will follow up shortly about your order.";
      } else {
        status = "failed";
        message = `Payment status: ${payment.status}. If money was deducted, contact admin with reference ${reference}.`;
      }
    } catch (error) {
      status = "error";
      message =
        error instanceof Error
          ? error.message
          : "Unable to verify payment at this time.";
    }
  }

  const tone =
    status === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : status === "failed"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : "border-red-200 bg-red-50 text-red-700";

  return (
    <>
      <Header />
      <main className="py-16 md:py-24">
        <div className="mx-auto max-w-xl px-6">
          <div className={`rounded-2xl border p-6 md:p-8 ${tone}`}>
            <h1 className="font-display text-2xl font-bold">
              {status === "success" ? "Payment Successful" : "Payment Update"}
            </h1>
            <p className="mt-3 text-sm leading-relaxed">{message}</p>
            {(serviceTitle || amountLabel || reference) && (
              <dl className="mt-6 space-y-2 text-sm">
                {serviceTitle && (
                  <div className="flex justify-between gap-4">
                    <dt className="opacity-70">Service</dt>
                    <dd className="font-medium">{serviceTitle}</dd>
                  </div>
                )}
                {amountLabel && (
                  <div className="flex justify-between gap-4">
                    <dt className="opacity-70">Amount</dt>
                    <dd className="font-medium">{amountLabel}</dd>
                  </div>
                )}
                {reference && (
                  <div className="flex justify-between gap-4">
                    <dt className="opacity-70">Reference</dt>
                    <dd className="font-mono text-xs">{reference}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {serviceId && (
              <Link
                href={`/services/${serviceId}`}
                className="inline-flex rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white hover:bg-primary-light"
              >
                Back to Service
              </Link>
            )}
            <Link
              href="/"
              className="inline-flex rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-semibold text-foreground hover:bg-background"
            >
              Go Home
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
