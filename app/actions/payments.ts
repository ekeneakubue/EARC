"use server";

import { randomUUID } from "crypto";
import { ServiceStatus } from "../lib/enums";
import { getDbErrorMessage, withDbRetry } from "../lib/db";
import {
  getAppBaseUrl,
  initializePaystackTransaction,
} from "../lib/paystack";
import { prisma } from "../lib/prisma";

export type InitializePaymentState = {
  error?: string;
  authorizationUrl?: string;
};

export async function initializeServicePaymentAction(
  _prevState: InitializePaymentState,
  formData: FormData,
): Promise<InitializePaymentState> {
  const serviceId = String(formData.get("serviceId") ?? "").trim();
  const customerName = String(formData.get("customerName") ?? "").trim();
  const customerEmail = String(formData.get("customerEmail") ?? "")
    .trim()
    .toLowerCase();

  if (!serviceId) {
    return { error: "Service not found." };
  }

  if (!customerName || !customerEmail) {
    return { error: "Name and email are required to continue payment." };
  }

  if (!customerEmail.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  try {
    const service = await withDbRetry(() =>
      prisma.service.findFirst({
        where: {
          id: serviceId,
          status: ServiceStatus.PUBLISHED,
        },
        select: {
          id: true,
          title: true,
          amountNgn: true,
        },
      }),
    );

    if (!service) {
      return { error: "This service is not available for ordering." };
    }

    if (service.amountNgn == null || service.amountNgn <= 0) {
      return {
        error: "This service has no fixed price. Please contact admin for pricing.",
      };
    }

    const reference = `earc_${service.id}_${randomUUID().replace(/-/g, "").slice(0, 16)}`;
    const callbackUrl = `${getAppBaseUrl()}/payment/callback?serviceId=${encodeURIComponent(service.id)}`;

    const payment = await initializePaystackTransaction({
      email: customerEmail,
      amountNgn: service.amountNgn,
      reference,
      callbackUrl,
      metadata: {
        serviceId: service.id,
        serviceTitle: service.title,
        customerName,
      },
    });

    return { authorizationUrl: payment.authorization_url };
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes("PAYSTACK_SECRET_KEY")) {
        return {
          error: "Payment is not configured yet. Please contact admin to complete your order.",
        };
      }

      return { error: error.message };
    }

    return { error: getDbErrorMessage(error) };
  }
}
