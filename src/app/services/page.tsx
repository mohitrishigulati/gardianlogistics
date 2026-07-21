import Link from "next/link";
import { services } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Services",
  description:
    "International courier, domestic delivery, freight forwarding, document express, e-commerce shipping, and customs clearance — Gardian Logistics services.",
  path: "/services",
});

const iconMap = {
  international: "🌍",
  domestic: "📦",
  freight: "🚢",
  document: "📄",
  ecommerce: "🛒",
  customs: "🛃",
};

export default function ServicesPage() {
  return (
    <div className="container-site section-padding">
      <SectionHeading
        eyebrow="Services"
        title="Comprehensive Logistics Solutions"
        description="Gardian Logistics aggregates rates across leading global carriers so you get the best price without sacrificing reliability or tracking visibility."
        align="center"
        className="mb-14"
      />

      <div className="space-y-16">
        {services.map((service) => (
          <article
            key={service.id}
            id={service.slug}
            className="scroll-mt-28 rounded-2xl border border-navy-100 bg-white p-8 shadow-card md:p-10"
          >
            <div className="flex flex-wrap items-start gap-4">
              <span className="text-4xl" aria-hidden="true">
                {iconMap[service.icon]}
              </span>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-navy-900">{service.title}</h2>
                <p className="mt-3 text-navy-600 leading-relaxed">{service.description}</p>
                <ul className="mt-6 grid gap-2 sm:grid-cols-2">
                  {service.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm text-navy-700">
                      <span className="mt-0.5 text-accent-500" aria-hidden="true">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link href="/quote" className="btn-primary mt-8 inline-flex">
                  Get a Quote for {service.title}
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
