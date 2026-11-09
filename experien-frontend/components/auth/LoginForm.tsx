"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";
import { useSlowHint } from "@/hooks/useSlowHint";
import { ApiError } from "@/lib/api/client";
import { isEmail } from "@/lib/utils/auth";
import AuthField from "./AuthField";

type Errors = Partial<Record<"email" | "password", string>>;

export default function LoginForm({ redirectTo }: { redirectTo: string }) {
  const router = useRouter();
  const { login } = useAuth();
  const [errors, setErrors] = useState<Errors>({});
  const [formError, setFormError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const slow = useSlowHint(submitting);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const email = String(data.get("email") ?? "").trim();
    const password = String(data.get("password") ?? "");
    const remember = data.get("remember") === "on";

    const next: Errors = {};
    if (!isEmail(email)) next.email = "Enter a valid email address";
    if (!password) next.password = "Enter your password";
    setErrors(next);
    setFormError("");
    if (Object.keys(next).length > 0) return;

    setSubmitting(true);
    try {
      await login({ email, password, remember });
      router.push(redirectTo);
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.fieldErrors) setErrors(err.fieldErrors as Errors);
        else setFormError(err.message); // invalid email or password
      } else {
        setFormError("Something went wrong. Please try again.");
      }
      setSubmitting(false);
    }
  }

  const registerHref =
    redirectTo === "/dashboard" ? "/register" : `/register?redirect=${encodeURIComponent(redirectTo)}`;

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      {formError && (
        <p role="alert" className="rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700">
          {formError}
        </p>
      )}

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
        autoComplete="current-password"
        error={errors.password}
      />

      <div className="flex items-center justify-between text-xs">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="remember" className="accent-ink" />
          Remember me
        </label>
        <Link href="/forgot-password" className="underline">
          Forgot password?
        </Link>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="rounded-lg bg-lime px-6 py-2.5 text-sm font-medium text-ink hover:brightness-95 disabled:opacity-60"
      >
        {submitting ? "Logging in..." : "Log in"}
      </button>
      {slow && (
        <p className="text-xs text-muted">Waking up the server, this can take a moment...</p>
      )}

      <p className="text-xs text-muted">
        New to Experien?{" "}
        <Link href={registerHref} className="font-medium text-ink underline">
          Create account
        </Link>
      </p>
    </form>
  );
}
