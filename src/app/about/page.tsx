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
            title="A Decade of Getting Shipments There"
            light
            align="center"
          />
        </div>
      </section>

      <div className="container-site section-padding">
        <div className="mx-auto max-w-3xl">
          <p className="leading-relaxed text-navy-600">
            Gardian Logistics was founded in {siteConfig.founded} with a simple idea: international
            shipping shouldn&apos;t mean choosing between speed, reliability, and price. Instead of
            operating as a single carrier, we built a network — working with established global
            courier and freight partners to compare rates and routes for every shipment, then
            passing the savings and speed on to you.
          </p>
          <p className="mt-4 leading-relaxed text-navy-600">
            Today we operate from two hubs: our headquarters in New Delhi, India, and our UK office
            in London — giving us on-the-ground coordination for one of the world&apos;s busiest
            India–UK–Europe trade corridors, plus the reach to ship almost anywhere else through
            our partner network.
          </p>

          <blockquote className="mt-8 border-l-4 border-accent-400 pl-6 italic text-navy-700">
            To make international shipping simple, transparent, and affordable — without you ever
            having to manage five carrier relationships yourself.
          </blockquote>
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
              <Link
                href="/contact"
                className="mt-4 inline-block text-sm font-semibold text-accent-600 hover:text-accent-500"
              >
                Contact this office →
              </Link>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
