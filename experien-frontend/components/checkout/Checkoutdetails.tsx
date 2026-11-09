"use client";

import { useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import type { Course } from "@/types/Course";

type Errors = Partial<Record<"fullName" | "email" | "country", string>>;

const naira = (n: number) => `₦${n.toLocaleString("en-NG")}`;

// Paystack inline (v1) popup, loaded with <Script> below
type PaystackOptions = {
  key: string;
  email: string;
  amount: number; // in kobo
  currency: string;
  ref: string;
  metadata?: Record<string, unknown>;
  callback: (response: { reference: string }) => void;
  onClose: () => void;
};

declare global {
  interface Window {
    PaystackPop?: { setup: (options: PaystackOptions) => { openIframe: () => void } };
  }
}

const inputClass =
  "mt-1.5 w-full rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink placeholder:text-muted/60 focus:border-ink focus:outline-none";

function Field({
  label,
  name,
  type = "text",
  placeholder,
  defaultValue,
  error,
  hint,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  defaultValue?: string;
  error?: string;
  hint?: string;
}) {
  return (
    <div>
      <label htmlFor={name} className="text-xs">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        aria-invalid={!!error}
        className={inputClass}
      />
      {error ? (
        <p className="mt-1 text-[11px] text-red-600">{error}</p>
      ) : hint ? (
        <p className="mt-1 text-[11px] text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export default function CheckoutDetails({ course }: { course: Course }) {
  const router = useRouter();
  const [errors, setErrors] = useState<Errors>({});
  const [paying, setPaying] = useState(false);
  const [payError, setPayError] = useState("");
  const discount = 0;
  const total = course.price - discount;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const fullName = String(data.get("fullName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const country = String(data.get("country") ?? "").trim();

    const next: Errors = {};
    if (!fullName) next.fullName = "Enter your full name";
    if (!/^\S+@\S+\.\S+$/.test(email)) next.email = "Enter a valid email address";
    if (!country) next.country = "Enter your country";
    setErrors(next);
    if (Object.keys(next).length > 0) return;

    // TEMPORARY: Paystack popup straight from the browser, for testing.
    
    const publicKey = process.env.NEXT_PUBLIC_PAYMENT_PUBLIC_KEY;
    if (!window.PaystackPop || !publicKey) {
      setPayError("Payment isn't available right now. Please try again in a moment.");
      return;
    }

    setPayError("");
    setPaying(true);

    console.log("key check:", publicKey.slice(0, 8), publicKey.length);

    const handler = window.PaystackPop.setup({
      key: publicKey,
      email,
      amount: total * 100, // Paystack expects kobo
      currency: "NGN",
      ref: `EXP-${Date.now()}`,
      metadata: {
        custom_fields: [
          { display_name: "Full name", variable_name: "full_name", value: fullName },
          { display_name: "Course", variable_name: "course", value: course.slug },
        ],
      },
      callback: (response) => {
        router.push(
          `/checkout/success?course=${course.slug}&reference=${encodeURIComponent(response.reference)}`
        );
      },
      onClose: () => setPaying(false),
    });
    handler.openIframe();
  }

  return (
    <section className="bg-[#EAF1E8] text-ink">
      <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
      <form
        onSubmit={handleSubmit}
        noValidate
        className="mx-auto grid max-w-[1400px] items-start gap-6 px-6 py-10 md:px-16 md:py-12 lg:grid-cols-[1.5fr_1fr]"
      >
        {/* Learner details */}
        <div className="rounded-2xl border border-line bg-white p-6">
          <p className="text-[11px] font-semibold uppercase tracking-wider">Learner details</p>
          <h2 className="mt-3 text-2xl font-medium tracking-tight">Who is enrolling?</h2>
          <p className="mt-2 text-xs text-muted">
            Use the details you want associated with your Experien learner account.
          </p>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field label="Full name" name="fullName" placeholder="Amaka Chukwu" error={errors.fullName} />
            <Field
              label="Email address"
              name="email"
              type="email"
              placeholder="amaka@example.com"
              error={errors.email}
            />
            <Field label="Country" name="country" defaultValue="Nigeria" error={errors.country} />
            <Field label="Phone number" name="phone" type="tel" placeholder="0800 000 0000" hint="Optional" />
          </div>

          <div className="mt-5 rounded-lg bg-[#EAF1E8] p-4">
            <p className="text-sm font-medium">Your learner account</p>
            <p className="mt-1 text-xs text-muted">
              If you already have an account, sign in before payment so your enrolment is linked
              correctly.
            </p>
          </div>

          <Link
            href={`/login?redirect=/checkout/${course.slug}`}
            className="mt-4 inline-block rounded-lg border border-ink px-4 py-2 text-xs font-medium hover:bg-[#F6F8F3]"
          >
            Sign in instead
          </Link>
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
              Payment is processed by the selected payment provider. Course access is granted only
              after confirmation.
            </p>
          </div>

          <button
            type="submit"
            disabled={paying}
            className="mt-5 rounded-lg bg-lime px-5 py-2.5 text-sm font-medium text-ink hover:brightness-95 disabled:opacity-60"
          >
            {paying ? "Opening payment..." : "Continue to payment"}
          </button>
          {payError && <p className="mt-2 text-[11px] text-red-600">{payError}</p>}
          <p className="mt-3 text-[11px] text-muted">
            By continuing, you confirm that the learner details and order information are correct.
          </p>
        </aside>
      </form>
    </section>
  );
}