import Link from "next/link";
import { partners } from "@/data/partners";
import { companyStats, siteConfig, trackingSteps } from "@/data/site";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function HowTrackingWorks() {
  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <SectionHeading
          eyebrow="Tracking"
          title="How Tracking Works"
          description="Follow your shipment from booking to delivery with real-time updates across our partner carrier networks."
          align="center"
          className="mb-12"
        />
        <ol className="grid gap-8 md:grid-cols-3">
          {trackingSteps.map((step) => (
            <li
              key={step.step}
              className="relative rounded-xl border border-navy-100 bg-surface p-6 text-center"
            >
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-navy-900 text-lg font-bold text-accent-400">
                {step.step}
              </span>
              <h3 className="mt-4 text-lg font-semibold text-navy-900">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-navy-600">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function PartnerStrip() {
  return (
    <section className="border-y border-navy-100 bg-surface py-10" aria-label="Global delivery partners">
      <div className="container-site">
        <p className="mb-6 text-center text-sm font-semibold uppercase tracking-wider text-navy-500">
          Our Global Delivery Partners
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-4 md:gap-8">
          {partners.map((partner) => (
            <li key={partner.id}>
              <div
                className="flex h-14 w-28 items-center justify-center rounded-lg border border-navy-200 bg-white px-3 shadow-sm"
                title={partner.name}
              >
                <span className="text-sm font-bold tracking-wide text-navy-600">{partner.initials}</span>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function CompanyStats() {
  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <SectionHeading
          eyebrow="Why Gardian"
          title="Trusted Since 2015"
          description="Real numbers from a decade of international shipping — no invented reviews, just the facts."
          align="center"
          className="mb-12"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {companyStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-navy-100 bg-surface p-8 text-center"
            >
              <p className="text-3xl font-bold text-navy-900">{stat.label}</p>
              <p className="mt-3 text-sm leading-relaxed text-navy-600">{stat.description}</p>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-navy-500">
          Have you shipped with us? We&apos;d love a one-line quote for our website —{" "}
          <Link href="/contact" className="font-medium text-accent-600 hover:underline">
            get in touch
          </Link>
          .
        </p>
      </div>
    </section>
  );
}

export function CTASection() {
  return (
    <section className="section-padding bg-navy-900">
      <div className="container-site text-center">
        <h2 className="text-3xl font-bold text-white md:text-4xl">
          Ready to Ship? Get Your Best Rate Today.
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-navy-200">
          Tell us about your shipment and our team will find the most competitive rate across our
          carrier network — usually within {siteConfig.quoteResponseTime}.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <Link href="/quote" className="btn-primary px-8 py-3 text-base">
            Get a Quote
          </Link>
          <Link
            href="/contact"
            className="btn-secondary border-navy-600 bg-transparent text-white hover:bg-navy-800"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
