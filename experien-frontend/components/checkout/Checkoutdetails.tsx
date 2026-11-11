"use client";

import { useState } from "react";
import Link from "next/link";
import type { Course } from "@/types/Course";
import { useAuth } from "@/components/auth/AuthProvider";
import { ApiError } from "@/lib/api/client";
import { initiatePayment } from "@/lib/api/payments";

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

export default function CheckoutDetails({ course }: { course: Course }) {
  const { user, status } = useAuth();
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const discount = 0;
  const total = course.price - discount;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user) {
      setPayError("Please sign in before continuing to payment.");
      return;
    }

    setPayError("");
    setPaying(true);

    try {
      // The backend identifies the learner from the authenticated session.
      // It also initializes Paystack using its own secret key.
      const payment = await initiatePayment(course.slug);

      if (!payment.authorizationUrl) {
        throw new Error("The payment service did not return a checkout link. Please try again.");
      }

      const checkoutUrl = new URL(payment.authorizationUrl);
      if (checkoutUrl.protocol !== "https:") {
        throw new Error("The payment service returned an invalid checkout link.");
      }

      window.location.assign(checkoutUrl.toString());
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        setPayError("Your session has expired. Please sign in again.");
      } else {
        setPayError(
          error instanceof Error
            ? error.message
            : "We could not start your payment. Please try again."
        );
      }
      setPaying(false);
    }
  }

  return (
    <section className="bg-[#EAF1E8] text-ink">
      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-[1400px] items-start gap-6 px-6 py-10 md:px-16 md:py-12 lg:grid-cols-[1.5fr_1fr]"
      >
        {/* Learner account */}
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider">Learner details</p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight">Who is enrolling?</h2>
          <p className="mt-2 text-xs text-muted">
            This payment and the resulting course access will be linked to your signed-in Experien account.
          </p>

          <div className="mt-5 rounded-lg bg-[#EAF1E8] p-4">
            {status === "loading" ? (
              <p className="text-sm text-muted">Checking your learner account...</p>
            ) : user ? (
              <>
                <p className="text-sm font-medium">{user.fullName}</p>
                <p className="mt-1 text-xs text-muted">{user.email}</p>
              </>
            ) : (
              <>
                <p className="text-sm font-medium">You need to sign in first.</p>
                <p className="mt-1 text-xs text-muted">
                  Sign in so the backend can associate your payment with the correct learner account.
                </p>
              </>
            )}
          </div>

          {!user && status !== "loading" && (
            <Link
              href={`/login?redirect=${encodeURIComponent(`/checkout/${course.slug}`)}`}
              className="mt-4 inline-block rounded-lg border border-ink px-4 py-2 text-xs font-medium hover:bg-[#F6F8F3]"
            >
              Sign in
            </Link>
          )}
        </div>

        {/* Order summary */}
        <aside className="rounded-2xl border border-line bg-white p-6 lg:sticky lg:top-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider">Order summary</p>
          <h2 className="mt-3 text-xl font-medium tracking-tight">{course.title}</h2>

          <div className="mt-4 rounded-lg bg-[#EAF1E8] p-3">
            <p className="text-xs text-muted">
              {course.industry} · {course.title}
            </p>
            <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px]">
              <span>{course.duration}</span>
              <span>Self-paced</span>
              <span>{course.modules.length} modules</span>
            </div>
          </div>

          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Course price</dt>
              <dd>{naira(course.price)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Discount</dt>
              <dd>{naira(discount)}</dd>
            </div>
            <div className="flex justify-between pt-1 text-base font-medium">
              <dt>Total</dt>
              <dd>{naira(total)}</dd>
            </div>
          </dl>

          <div className="mt-5 rounded-lg bg-ink p-4 text-[#F5F2E9]">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-lime">Secure payment</p>
            <p className="mt-1.5 text-xs text-[#F5F2E9]/80">
              Payment is initialized and verified securely by Experien's payment backend. Course access is granted only after confirmation.
            </p>
          </div>

          <button
            type="submit"
            disabled={paying || status === "loading" || !user}
            className="mt-5 rounded-lg bg-lime px-5 py-2.5 text-sm font-medium text-ink hover:brightness-95 disabled:opacity-60"
          >
            {paying ? "Preparing payment..." : "Continue to payment"}
          </button>
          {payError && <p role="alert" className="mt-2 text-[11px] text-red-600">{payError}</p>}
          <p className="mt-3 text-[11px] text-muted">
            By continuing, you confirm that the course and order information are correct.
          </p>
        </aside>
      </form>
    </section>
  );
}
