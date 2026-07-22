import Link from "next/link";
import { siteConfig, trustSignals } from "@/data/site";
import { TrackingWidget } from "@/components/tracking/TrackingWidget";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-navy-900 text-white">
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 50%, #4338ca 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f59e0b 0%, transparent 40%)",
        }}
        aria-hidden="true"
      />
      <div className="container-site relative section-padding">
        <div className="mx-auto max-w-3xl text-center">
          <p className="mb-4 inline-flex items-center rounded-full border border-navy-600 bg-navy-800/50 px-4 py-1.5 text-sm font-medium text-accent-400">
            Trusted since {siteConfig.founded} · India & UK
          </p>
          <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
            {siteConfig.tagline}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-navy-200">
            {siteConfig.heroSubhead}
          </p>
          <div className="mx-auto mt-10 max-w-xl">
            <TrackingWidget />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link href="/track" className="btn-primary px-8 py-3 text-base">
              Track Shipment
            </Link>
            <Link
              href="/quote"
              className="btn-secondary border-navy-600 bg-transparent text-white hover:bg-navy-800"
            >
              Get a Quote
            </Link>
          </div>
          <p className="mt-4 text-sm text-navy-400">
            Try demo:{" "}
            <Link href="/track?awb=GL1234567890" className="text-accent-400 underline hover:text-accent-300">
              GL1234567890
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export function TrustBar() {
  return (
    <section className="border-b border-navy-100 bg-white py-8" aria-label="Trust signals">
      <div className="container-site">
        <ul className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {trustSignals.map((signal) => (
            <li key={signal.label} className="text-center">
              <p className="text-lg font-bold text-navy-900 md:text-xl">{signal.label}</p>
              <p className="mt-1 text-sm text-navy-500">{signal.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
