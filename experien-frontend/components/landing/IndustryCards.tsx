
import Image from "next/image";
import Link from "next/link";
import { industries } from "@/lib/mock-data";

const labels: Record<string, string> = {
  technology: "Technology delivery teams",
  construction: "Construction project sites",
  manufacturing: "Manufacturing operations",
};

const images: Record<string, string> = {
  technology: "/Technology.png",
  construction: "/Construction.png",
  manufacturing: "/Manufacturing.png",
};

export default function IndustryCards() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-[1400px] px-6 py-14 md:px-16">
        <h2 className="text-3xl font-medium tracking-tight md:text-4xl">
          Choose your industry
        </h2>

        <p className="mt-4 text-lg text-muted">
          Explore project management courses grounded in your field.
        </p>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {industries.map((i) => (
            <Link
              key={i.id}
              href={`/industries/${i.id}`}
              className="group rounded-3xl border border-line bg-white p-6 shadow-[0_12px_32px_rgba(18,60,53,0.10)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(18,60,53,0.14)]"
            >
              <div className="relative aspect-[355/120] overflow-hidden rounded-xl border border-line bg-[#EDF4EC]">
                <Image
                  src={images[i.id]}
                  alt={`${i.name} industry`}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <p className="mt-4 text-sm">{labels[i.id]}</p>

              <h3 className="mt-3 text-2xl font-medium">
                {i.name}
              </h3>

              <p className="mt-3 text-base">
                {i.subIndustry.replace(
                  "Project Management",
                  "project management"
                )}
              </p>

              <p className="mt-4 text-sm font-medium">
                Explore courses →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
