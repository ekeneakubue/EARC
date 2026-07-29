const PAYSTACK_BASE_URL = "https://api.paystack.co";

export function getPaystackSecretKey() {
  const key = process.env.PAYSTACK_SECRET_KEY?.trim();

  if (!key) {
    throw new Error("PAYSTACK_SECRET_KEY is not configured.");
  }

  return key;
}

export function getAppBaseUrl() {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
}

type PaystackInitializeResponse = {
  status: boolean;
  message: string;
  data?: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
};

type PaystackVerifyResponse = {
  status: boolean;
  message: string;
  data?: {
    status: string;
    reference: string;
    amount: number;
    currency: string;
    paid_at?: string;
    customer?: {
      email?: string;
    };
    metadata?: {
      serviceId?: string;
      serviceTitle?: string;
      customerName?: string;
    };
  };
};

export async function initializePaystackTransaction(input: {
  email: string;
  amountNgn: number;
  reference: string;
  callbackUrl: string;
  metadata: Record<string, string>;
}) {
  const response = await fetch(`${PAYSTACK_BASE_URL}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getPaystackSecretKey()}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email,
      amount: Math.round(input.amountNgn * 100),
      currency: "NGN",
      reference: input.reference,
      callback_url: input.callbackUrl,
      metadata: input.metadata,
    }),
  });

  const payload = (await response.json()) as PaystackInitializeResponse;

  if (!response.ok || !payload.status || !payload.data?.authorization_url) {
    throw new Error(payload.message || "Unable to start Paystack payment.");
  }

  return payload.data;
}

export async function verifyPaystackTransaction(reference: string) {
  const response = await fetch(
    `${PAYSTACK_BASE_URL}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: {
        Authorization: `Bearer ${getPaystackSecretKey()}`,
      },
      cache: "no-store",
    },
  );

  const payload = (await response.json()) as PaystackVerifyResponse;

  if (!response.ok || !payload.status || !payload.data) {
    throw new Error(payload.message || "Unable to verify Paystack payment.");
  }

  return payload.data;
}
