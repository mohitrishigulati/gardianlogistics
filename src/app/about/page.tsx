import Link from "next/link";
import { offices } from "@/data/offices";
import { siteConfig } from "@/data/site";
import { partners } from "@/data/partners";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "About Us",
  description:
    "Founded in 2015, Gardian Logistics is an international courier aggregator with offices in New Delhi and London, partnering with global carriers for best rates.",
  path: "/about",
});

export default function AboutPage() {
  const delhi = offices.find((o) => o.id === "delhi")!;
  const london = offices.find((o) => o.id === "london")!;

  return (
    <>
      <section className="bg-navy-900 py-16 text-white md:py-20">
        <div className="container-site">
          <SectionHeading
            eyebrow="About Gardian Logistics"
            title="Your Global Shipping Partner Since 2015"
            description="For over a decade, we've helped businesses and individuals ship smarter — combining competitive rates, dual India-UK presence, and unified tracking across leading carrier networks."
            light
            align="center"
          />
        </div>
      </section>

      <div className="container-site section-padding">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
          <section>
            <h2 className="text-2xl font-bold text-navy-900">Our Story</h2>
            <p className="mt-4 leading-relaxed text-navy-600">
              Gardian Logistics was founded in {siteConfig.founded} in New Delhi with a simple
              mission: make international shipping accessible and affordable. What started as a
              small courier agency has grown into a trusted aggregator serving exporters, e-commerce
              sellers, and enterprises across India and the United Kingdom.
            </p>
            <p className="mt-4 leading-relaxed text-navy-600">
              Rather than locking customers into a single carrier, we maintain partnerships with
              leading global logistics providers — allowing us to compare routes, service levels,
              and pricing to recommend the best option for each shipment.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-navy-900">Our Mission</h2>
            <p className="mt-4 leading-relaxed text-navy-600">
              To deliver world-class courier and freight services at the most competitive rates,
              backed by transparent tracking and personalized support from real people — not bots.
            </p>
            <ul className="mt-6 space-y-3">
              {[
                "Best international shipping rates via multi-carrier comparison",
                "10+ years of cross-border logistics expertise",
                "Dual presence in India and the UK for seamless coordination",
                "Real-time tracking unified across partner networks",
              ].map((item) => (
                <li key={item} className="flex gap-2 text-sm text-navy-700">
                  <span className="text-accent-500">✓</span> {item}
                </li>
              ))}
            </ul>
          </section>
        </div>

        <section className="mx-auto mt-16 max-w-5xl">
          <h2 className="text-2xl font-bold text-navy-900">Partner Network</h2>
          <p className="mt-4 leading-relaxed text-navy-600">
            Gardian Logistics works as an authorized shipping agent and aggregator. We maintain
            commercial relationships with major international express carriers, freight operators,
            and postal alliances worldwide. When you book with us, we select the optimal carrier
            for your lane, handle documentation, and provide a single point of contact throughout
            the journey.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            {partners.map((p) => (
              <span
                key={p.id}
                className="rounded-lg border border-navy-200 bg-surface px-4 py-2 text-sm font-medium text-navy-700"
              >
                {p.name}
              </span>
            ))}
          </div>
          <p className="mt-4 text-xs text-navy-500">{siteConfig.partnerDisclaimer}</p>
        </section>

        <section className="mx-auto mt-16 grid max-w-5xl gap-8 md:grid-cols-2">
          {[delhi, london].map((office) => (
            <div key={office.id} className="rounded-xl border border-navy-100 bg-surface p-6">
              <h3 className="text-lg font-semibold text-navy-900">
                {office.city}, {office.country}
                {office.isHQ && (
                  <span className="ml-2 rounded bg-accent-100 px-2 py-0.5 text-xs font-medium text-accent-700">
                    HQ
                  </span>
                )}
              </h3>
              <address className="mt-3 not-italic text-sm leading-relaxed text-navy-600">
                {office.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <p className="mt-3 text-sm text-navy-600">{office.hours}</p>
              <Link href="/contact" className="mt-4 inline-block text-sm font-semibold text-accent-600 hover:text-accent-500">
                Contact this office →
              </Link>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
