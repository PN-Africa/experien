import Link from "next/link";

export default function PaymentNotConfirmed({ slug, paymentRef }: { slug: string; paymentRef: string }) {
  return (
    <div className="flex flex-col gap-5 rounded-2xl border border-line bg-white p-6 md:flex-row md:items-center md:justify-between">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted">
          Payment not completed
        </p>
        <h2 className="mt-2 text-xl font-medium tracking-tight">
          Your course access remains inactive.
        </h2>
        <p className="mt-2 max-w-xl text-xs text-muted">
          You can return to checkout to try again. If you believe you were charged, contact support and provide your payment reference before making another payment.
        </p>
        <p className="mt-2 break-all text-[11px] text-muted">Reference: {paymentRef}</p>
      </div>
      <div className="flex flex-wrap gap-3 md:flex-col">
        <Link
          href={`/checkout/${slug}`}
          className="rounded-lg bg-lime px-4 py-2 text-center text-xs font-medium text-ink hover:brightness-95"
        >
          Retry payment
        </Link>
      </div>
    </div>
  );
}
