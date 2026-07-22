import Link from "next/link";
import { services } from "@/data/services";
import { SectionHeading } from "@/components/ui/SectionHeading";

const iconMap = {
  international: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  ),
  domestic: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  ),
  freight: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  ),
  document: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  ),
  ecommerce: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  ),
  customs: (
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  ),
};

export function ServiceCard({
  title,
  description,
  slug,
  icon,
}: {
  title: string;
  description: string;
  slug: string;
  icon: keyof typeof iconMap;
}) {
  return (
    <Link
      href={`/services#${slug}`}
      className="group flex flex-col rounded-xl border border-navy-100 bg-white p-6 shadow-card transition hover:border-accent-200 hover:shadow-elevated"
    >
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-navy-50 text-navy-700 transition group-hover:bg-accent-100 group-hover:text-accent-700">
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          {iconMap[icon]}
        </svg>
      </div>
      <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-navy-600">{description}</p>
      <span className="mt-4 text-sm font-semibold text-accent-600 group-hover:text-accent-500">
        Learn more →
      </span>
    </Link>
  );
}

export function ServicesOverview() {
  const featured = services.filter((s) => s.id !== "customs-clearance");

  return (
    <section className="section-padding bg-surface">
      <div className="container-site">
        <SectionHeading
          eyebrow="Our Services"
          title="Shipping Solutions for Every Need"
          description="From urgent documents to full container loads, Gardian Logistics compares rates across our partner carrier network to find the fastest, most cost-effective option for every shipment — big or small."
          align="center"
          className="mb-12"
        />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((service) => (
            <ServiceCard
              key={service.id}
              title={service.title}
              description={service.shortDescription}
              slug={service.slug}
              icon={service.icon}
            />
          ))}
        </div>
        <div className="mt-10 text-center">
          <Link href="/services" className="btn-secondary">
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
