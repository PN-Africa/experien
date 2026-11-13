import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getCourse } from "@/lib/api/catalogue-server";
import CheckoutHero from "@/components/checkout/Checkouthero";
import CheckoutDetails from "@/components/checkout/Checkoutdetails";
import AfterPayment from "@/components/checkout/Afterpayment";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  return { title: course ? `Checkout: ${course.title} | Experien` : "Course not found" };
}

export default async function CheckoutPage({ params }: Props) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  return (
    <div>
      <CheckoutHero course={course} />
      <CheckoutDetails course={course} />
      <AfterPayment />
    </div>
  );
}
