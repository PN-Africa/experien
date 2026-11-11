import { apiFetch, isMockApi } from "./client";

export type InitiatePaymentResponse = {
  reference: string;
  authorizationUrl: string;
  accessCode: string;
  price?: {
    amountKobo: number;
    amount: number;
    currency: string;
  };
  course?: {
    slug: string;
    title: string;
  };
};

export type VerifyPaymentResponse = {
  reference: string;
  status: "pending" | "successful" | "failed" | string;
  enrolled: boolean;
  paidAt?: string | null;
  course?: {
    slug: string;
    title: string;
  };
};

export async function initiatePayment(courseSlug: string) {
  if (isMockApi) {
    throw new Error("Payments are unavailable while the app is in mock mode.");
  }

  return apiFetch<InitiatePaymentResponse>("/payments/initiate", {
    method: "POST",
    json: { courseSlug },
  });
}

export async function verifyPayment(reference: string) {
  if (isMockApi) {
    throw new Error("Payment verification is unavailable while the app is in mock mode.");
  }

  return apiFetch<VerifyPaymentResponse>(
    `/payments/${encodeURIComponent(reference)}/verify`,
    { method: "GET" }
  );
}
