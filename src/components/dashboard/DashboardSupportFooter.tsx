import Link from "next/link";
import { offices } from "@/data/offices";
import { siteConfig } from "@/data/site";
import { buildWhatsAppUrl } from "@/lib/chat/chatbot";
import { WhatsAppIcon } from "@/components/ui/WhatsAppButton";

export function DashboardSupportFooter() {
  const delhi = offices.find((o) => o.id === "delhi")!;
  const london = offices.find((o) => o.id === "london")!;

  return (
    <footer className="mt-10 border-t border-navy-100 pt-6 print:hidden">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-navy-500">
          Contact &amp; Support
        </h2>
        <a
          href={buildWhatsAppUrl(
            delhi.whatsapp ?? siteConfig.whatsapp,
            "Hi Gardian Logistics, I need assistance from the customer portal."
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-green-700"
        >
          <WhatsAppIcon className="h-4 w-4" />
          WhatsApp Support
        </a>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {[delhi, london].map((office) => (
          <div
            key={office.id}
            className="rounded-xl border border-navy-100 bg-white p-4 text-sm shadow-card"
          >
            <p className="font-semibold text-navy-900">
              {office.address[0]}
              {office.isHQ && (
                <span className="ml-2 rounded bg-accent-100 px-1.5 py-0.5 text-xs font-medium text-accent-700">
                  HQ
                </span>
              )}
            </p>
            <address className="mt-2 not-italic leading-relaxed text-navy-600">
              {office.address.slice(1).map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </address>
            <div className="mt-3 space-y-1">
              <p>
                <span className="font-medium text-navy-700">Phone: </span>
                <a
                  href={`tel:${office.phone.replace(/\s/g, "")}`}
                  className="text-accent-600 hover:underline"
                >
                  {office.phone}
                </a>
              </p>
              <p>
                <span className="font-medium text-navy-700">Email: </span>
                <a href={`mailto:${office.email}`} className="text-accent-600 hover:underline">
                  {office.email}
                </a>
              </p>
              {office.cin && (
                <p className="text-xs text-navy-500">
                  <span className="font-medium text-navy-600">CIN: </span>
                  {office.cin}
                </p>
              )}
              <p className="text-xs text-navy-400">{office.hours}</p>
            </div>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs text-navy-400">
        <Link href="/contact" className="font-medium text-accent-600 hover:underline">
          Full contact page &amp; maps
        </Link>
        {" · "}
        <Link href="/faq" className="font-medium text-accent-600 hover:underline">
          FAQs
        </Link>
      </p>
    </footer>
  );
}
