"use client";

import { useCallback, useEffect, useState } from "react";
import { ApiError } from "@/lib/api/client";
import { verifyPayment, type VerifyPaymentResponse } from "@/lib/api/payments";
import { getCourseBySlug } from "@/lib/mock/Courses";
import SuccessHero from "./Successhero";
import SuccessDetails from "./Successdetails";
import PaymentNotConfirmed from "./Paymentnotconfirmed";

export default function PaymentResult({
  courseSlug,
  reference,
}: {
  courseSlug?: string;
  reference: string;
}) {
  const [result, setResult] = useState<VerifyPaymentResponse | null>(null);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(true);

  const checkPayment = useCallback(async () => {
    if (!reference) {
      setError("The payment reference is missing. Please return to checkout or contact support.");
      setChecking(false);
      return;
    }

    setChecking(true);
    setError("");
    try {
      const verification = await verifyPayment(reference);
      setResult(verification);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : "We could not verify this payment. Please try again."
      );
    } finally {
      setChecking(false);
    }
  }, [reference]);

  useEffect(() => {
    void checkPayment();
  }, [checkPayment]);

  // Paystack may return only a reference. The verification response also supplies the course slug.
  const course = getCourseBySlug(courseSlug || result?.course?.slug || "");
  const enrolled = result?.status === "successful" && result.enrolled === true;

  if (checking) {
    return (
      <section className="bg-[#EAF1E8] text-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-16 md:px-16">
          <p className="text-[11px] font-semibold uppercase tracking-wider">Payment status</p>
          <h1 className="mt-3 text-3xl font-medium tracking-tight">Verifying your payment...</h1>
          <p className="mt-3 text-sm text-muted">
            Please wait while Experien confirms your transaction and course enrolment. Do not make another payment while this check is running.
          </p>
        </div>
      </section>
    );
  }

  if (enrolled && course) {
    return (
      <>
        <SuccessHero course={course} paymentRef={reference} />
        <section className="bg-[#EAF1E8] text-ink">
          <div className="mx-auto max-w-[1400px] space-y-6 px-6 py-10 md:px-16 md:py-12">
            <SuccessDetails course={course} orderRef={result?.reference || reference} />
          </div>
        </section>
      </>
    );
  }

  const status = result?.status;
  const heading = enrolled
    ? "Your payment is confirmed and enrolment is complete."
    : status === "pending"
      ? "Your payment is still being processed."
      : status === "successful"
        ? "Payment received; enrolment is not confirmed yet."
        : status === "failed"
          ? "Your payment was not successful."
          : "We couldn't confirm your payment.";

  const description = enrolled
    ? "Your course access has been activated. Open My learning to get started."
    : status === "pending"
      ? "The payment provider has not confirmed the transaction yet. You can check again shortly."
      : status === "successful"
        ? "The backend reports a successful payment, but has not confirmed course enrolment yet. Check the status again before trying another payment."
        : status === "failed"
          ? "The backend reports that this transaction failed. If you believe you were charged, contact support before making another payment."
          : error || "Please check the payment status again. If the problem continues, contact support with your payment reference.";

  return (
    <section className="bg-[#EAF1E8] text-ink">
      <div className="mx-auto max-w-[1400px] space-y-6 px-6 py-10 md:px-16 md:py-12">
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider">Payment status</p>
          <h1 className="mt-3 text-2xl font-medium tracking-tight md:text-3xl">{heading}</h1>
          <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p>
          <p className="mt-4 text-xs text-muted">Payment reference: {reference || "Not provided"}</p>
          <button
            type="button"
            onClick={checkPayment}
            className="mt-6 rounded-lg bg-ink px-4 py-2.5 text-xs font-medium text-white hover:bg-ink/90"
          >
            Check payment again
          </button>
          {enrolled && (
            <a href="/dashboard" className="ml-3 inline-block rounded-lg border border-ink px-4 py-2.5 text-xs font-medium">
              Go to my learning
            </a>
          )}
        </div>
        {status === "failed" && course && (
          <PaymentNotConfirmed slug={course.slug} paymentRef={reference} />
        )}
      </div>
    </section>
  );
}
