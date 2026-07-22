import { offices } from "@/data/offices";
import { ContactForm } from "@/components/forms/ContactForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Contact & Offices",
  description:
    "Contact Gardian Logistics offices in New Delhi (HQ) and London. Phone, email, maps, and contact form for shipping inquiries.",
  path: "/contact",
});

function RegistrationDetails({ office }: { office: (typeof offices)[number] }) {
  if (office.id === "delhi") {
    return (
      <div className="mt-4 space-y-1 border-t border-navy-100 pt-4 text-sm text-navy-500">
        {office.whatsapp && (
          <p>
            <span className="font-medium text-navy-700">WhatsApp: </span>
            <a
              href={`https://wa.me/${office.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline"
            >
              {office.whatsapp}
            </a>
          </p>
        )}
        {office.cin ? (
          <p>
            <span className="font-medium text-navy-700">CIN: </span>
            {office.cin}
          </p>
        ) : (
          <p>CIN: [Your Company Identification Number]</p>
        )}
        {office.gstin ? (
          <p>
            <span className="font-medium text-navy-700">GSTIN: </span>
            {office.gstin}
          </p>
        ) : (
          <p>GSTIN: [Your GST number]</p>
        )}
      </div>
    );
  }

  if (office.id === "london") {
    return (
      <div className="mt-4 space-y-1 border-t border-navy-100 pt-4 text-sm text-navy-500">
        {office.companiesHouseNumber ? (
          <p>
            <span className="font-medium text-navy-700">Companies House Registration No.: </span>
            {office.companiesHouseNumber}
          </p>
        ) : (
          <p>Companies House Registration No.: [Your CRN]</p>
        )}
      </div>
    );
  }

  return null;
}

export default function ContactPage() {
  return (
    <div className="container-site section-padding">
      <SectionHeading
        eyebrow="Contact"
        title="Our Offices"
        description="Reach our teams in New Delhi and London for shipping quotes, tracking support, and partnership inquiries."
        align="center"
        className="mb-12"
      />

      <div className="grid gap-8 lg:grid-cols-2">
        {offices.map((office) => (
          <article
            key={office.id}
            className="overflow-hidden rounded-2xl border border-navy-100 bg-white shadow-card"
          >
            <div className="p-6">
              <h2 className="text-xl font-bold text-navy-900">
                {office.city}, {office.country}
                {office.isHQ && (
                  <span className="ml-2 text-sm font-normal text-accent-600">(Headquarters)</span>
                )}
              </h2>
              <address className="mt-3 not-italic text-sm leading-relaxed text-navy-600">
                {office.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <div className="mt-4 space-y-1 text-sm">
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
                <p className="text-navy-500">{office.hours}</p>
              </div>
              <RegistrationDetails office={office} />
            </div>
            <div className="aspect-video w-full bg-navy-100">
              <iframe
                title={`Map of ${office.city} office`}
                src={office.mapEmbedUrl}
                className="h-full w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                allowFullScreen
              />
            </div>
          </article>
        ))}
      </div>

      <p className="mx-auto mt-8 max-w-3xl text-center text-xs text-navy-500">
        Registration numbers shown in brackets are placeholders — replace with your verified CIN,
        GSTIN, and Companies House details before go-live. Questions:{" "}
        <a href="mailto:privacy@gardianlogistics.in" className="text-accent-600 hover:underline">
          privacy@gardianlogistics.in
        </a>
        ,{" "}
        <a href="mailto:legal@gardianlogistics.in" className="text-accent-600 hover:underline">
          legal@gardianlogistics.in
        </a>
        .
      </p>

      <section className="mx-auto mt-16 max-w-2xl">
        <h2 className="mb-6 text-2xl font-bold text-navy-900">Send Us a Message</h2>
        <ContactForm />
      </section>
    </div>
  );
}
