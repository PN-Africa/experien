import type { Metadata } from "next";
import PaymentResult from "@/components/checkout/Paymentresult";

export const metadata: Metadata = { title: "Payment status | Experien" };

type Props = { searchParams: Promise<{ course?: string; reference?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { course: courseSlug, reference } = await searchParams;

  // Paystack may return only the payment reference. The verification response
  // also contains the course slug, so the page can resolve the course after verification.
  return <PaymentResult courseSlug={courseSlug} reference={reference ?? ""} />;
}
