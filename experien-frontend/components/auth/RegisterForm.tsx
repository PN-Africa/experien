"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useSlowHint } from "@/hooks/useSlowHint";
import { ApiError } from "@/lib/api/client";
import { REQUIRE_EMAIL_VERIFICATION, isEmail, isStrongPassword } from "@/lib/utils/auth";
import AuthField from "./AuthField";

type Errors = Partial<Record<"fullName" | "email" | "password" | "confirmPassword" | "terms", string>>;

export default function RegisterForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const { register } = useAuth();
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const slow = useSlowHint(submitting);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const fullName = String(data.get("fullName") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const confirmPassword = String(data.get("confirmPassword") ?? "");
    const terms = data.get("terms") === "on";

    const next: Errors = {};
    if (!fullName) next.fullName = "Enter your full name";
    if (!isEmail(email)) next.email = "Enter a valid email address";
    if (!isStrongPassword(password)) {
      next.password = "Use 8 or more characters with letters and numbers";
    }
    if (confirmPassword !== password) next.confirmPassword = "Passwords do not match";
    if (!terms) next.terms = "Please accept the terms to continue";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await register({ fullName, email, password });
      router.push(
        REQUIRE_EMAIL_VERIFICATION
          ? `/verify-email?email=${encodeURIComponent(email)}&redirect=${encodeURIComponent(redirectTo)}`
          : redirectTo
      );
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) {
          const fe = { ...err.fieldErrors };
          if (fe.name) fe.fullName = fe.name; 
          setErrors(fe as Errors);
        } else {
          setFormError(err.message); // e.g. 409: email already registered
        }
      } else {
        setFormError("Something went wrong. Please try again.");
      }
      setSubmitting(false);
    }
  }

  const loginHref =
    redirectTo === "/dashboard" ? "/login" : `/login?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {formError}
        </p>
      )}

      <AuthField
        label="Full name"
        name="fullName"
        placeholder="Amaka Chukwu"
        autoComplete="name"
        error={errors.fullName}
      />
      <AuthField
        label="Email address"
        name="email"
        type="email"
        placeholder="name@example.com"
        autoComplete="email"
        error={errors.email}
      />
      <AuthField
        label="Password"
        name="password"
        type="password"
        placeholder="Enter password"
        autoComplete="new-password"
        hint="Use 8 or more characters with a mix of letters and numbers"
        error={errors.password}
      />
      <AuthField
        label="Confirm password"
        name="confirmPassword"
        type="password"
        placeholder="Re-enter password"
        autoComplete="new-password"
        error={errors.confirmPassword}
      />

      <div>
        <label className="flex items-center gap-2 text-xs">
          <input type="checkbox" name="terms" className="accent-ink" />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="underline">
              Terms of Use
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.terms && <p className="mt-1 text-[11px] text-red-600">{errors.terms}</p>}
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-lime px-6 py-2.5 text-sm font-medium text-ink hover:brightness-95 disabled:opacity-60"
      >
        {submitting ? "Creating account..." : "Create account"}
      </button>
      {slow && (
        <p className="text-xs text-muted">Waking up the server, this can take a moment...</p>
      )}

      <p className="text-xs text-muted">
        Already have an account?{" "}
        <Link href={loginHref} className="font-medium text-ink underline">
          Log in
        </Link>
      </p>
    </form>
  );
}
