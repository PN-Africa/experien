import type { Metadata } from "next";
import { courses, getCourseBySlug } from "@/lib/mock/Courses";
import SuccessHero from "@/components/checkout/Successhero";
import SuccessDetails from "@/components/checkout/Successdetails";
import PaymentNotConfirmed from "@/components/checkout/Paymentnotconfirmed";

export const metadata: Metadata = { title: "Payment status | Experien" };

type Props = { searchParams: Promise<{ course?: string; reference?: string }> };

export default async function CheckoutSuccessPage({ searchParams }: Props) {
  const { course: slug, reference } = await searchParams;


  // Only show "confirmed" when the backend says so, never because of the URL alone.

  const course = (slug && getCourseBySlug(slug)) || courses[0];
  const paymentRef = reference ?? "PAY-240927-8KAM";
  const orderRef = "EXP-ORD-240927-184";

  return (
    <div>
      <SuccessHero course={course} paymentRef={paymentRef} />
      <section className="bg-[#EAF1E8] text-ink">
        <div className="mx-auto max-w-[1400px] space-y-6 px-6 py-10 md:px-16 md:py-12">
          <SuccessDetails course={course} orderRef={orderRef} />
          <PaymentNotConfirmed slug={course.slug} paymentRef={paymentRef} />
        </div>
      </section>
    </div>
  );
}