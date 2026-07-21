import { Hero, TrustBar } from "@/components/home/Hero";
import {
  CTASection,
  HowTrackingWorks,
  PartnerStrip,
  Testimonials,
} from "@/components/home/Sections";
import { ServicesOverview } from "@/components/services/ServiceCard";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "International Courier & Logistics",
  description:
    "Gardian Logistics — international courier, freight forwarding, and parcel delivery with offices in New Delhi and London. Best rates via global carrier partnerships.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ServicesOverview />
      <HowTrackingWorks />
      <PartnerStrip />
      <Testimonials />
      <CTASection />
    </>
  );
}
