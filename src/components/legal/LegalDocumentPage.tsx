import Link from "next/link";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/metadata";

interface LegalSection {
  heading: string;
  body: string;
}

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  intro?: string;
  sections: LegalSection[];
  disclaimer?: string;
}

export function createLegalMetadata(title: string, path: string) {
  return createMetadata({
    title,
    description: `${title} for Gardian Logistics — international courier and freight services in India and the UK.`,
    path,
  });
}

export function LegalDocumentPage({ title, lastUpdated, intro, sections, disclaimer }: LegalPageProps) {
  return (
    <>
      <section className="bg-navy-900 py-14 text-white md:py-16">
        <div className="container-site">
          <SectionHeading title={title} light align="center" />
          <p className="mt-4 text-center text-sm text-navy-300">Last updated: {lastUpdated}</p>
        </div>
      </section>

      <div className="container-site section-padding">
        <div className="mx-auto max-w-3xl">
          {intro && <p className="mb-8 leading-relaxed text-navy-600">{intro}</p>}

          <div className="space-y-8">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold text-navy-900">{section.heading}</h2>
                <div className="mt-3 whitespace-pre-line leading-relaxed text-navy-600">
                  {section.body}
                </div>
              </section>
            ))}
          </div>

          {disclaimer && (
            <p className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              {disclaimer}
            </p>
          )}

          <p className="mt-8 text-sm text-navy-500">
            <Link href="/contact" className="font-medium text-accent-600 hover:underline">
              Contact us
            </Link>{" "}
            if you have questions about this document.
          </p>
        </div>
      </div>
    </>
  );
}
