import { QuoteForm } from "@/components/forms/QuoteForm";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Get a Quote",
  description:
    "Request a competitive international shipping quote from Gardian Logistics. Our team confirms the best rate across our global carrier network.",
  path: "/quote",
});

export default function QuotePage() {
  return (
    <div className="container-site section-padding">
      <div className="mx-auto max-w-3xl">
        <SectionHeading
          eyebrow="Pricing"
          title="Get a Quote"
          description="Fill in your shipment details and receive an estimated price range instantly. Our team will confirm the best available rate within 2 business hours."
          align="center"
          className="mb-10"
        />
        <div className="rounded-2xl border border-navy-100 bg-white p-6 shadow-card md:p-8">
          <QuoteForm />
        </div>
      </div>
    </div>
  );
}
