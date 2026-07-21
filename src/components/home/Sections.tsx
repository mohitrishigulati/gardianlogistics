import Link from "next/link";
import { clientLogos, partners, testimonials } from "@/data/partners";
import { trackingSteps } from "@/data/site";
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

export function Testimonials() {
  return (
    <section className="section-padding bg-white">
      <div className="container-site">
        <SectionHeading
          eyebrow="Testimonials"
          title="Trusted by Businesses Worldwide"
          align="center"
          className="mb-12"
        />
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <blockquote
              key={t.id}
              className="rounded-xl border border-navy-100 bg-surface p-6"
            >
              <p className="text-sm leading-relaxed text-navy-700">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 border-t border-navy-100 pt-4">
                <cite className="not-italic">
                  <span className="block text-sm font-semibold text-navy-900">{t.author}</span>
                  <span className="text-xs text-navy-500">
                    {t.role}, {t.company}
                  </span>
                </cite>
              </footer>
            </blockquote>
          ))}
        </div>
        <div className="mt-12">
          <p className="mb-4 text-center text-xs font-semibold uppercase tracking-wider text-navy-400">
            Clients We Serve
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-4">
            {clientLogos.map((logo) => (
              <li
                key={logo.id}
                className="flex h-10 w-16 items-center justify-center rounded bg-navy-50 text-xs font-bold text-navy-500"
                title={logo.name}
              >
                {logo.initials}
              </li>
            ))}
          </ul>
        </div>
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
          Tell us about your shipment and our team will find the most competitive rate across
          our global carrier network — usually within 2 business hours.
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
