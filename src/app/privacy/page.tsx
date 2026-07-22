import { LegalDocumentPage, createLegalMetadata } from "@/components/legal/LegalDocumentPage";
import { privacyPolicy } from "@/data/legal";

export const metadata = createLegalMetadata("Privacy Policy", "/privacy");

export default function PrivacyPage() {
  return (
    <LegalDocumentPage
      title={privacyPolicy.title}
      lastUpdated={privacyPolicy.lastUpdated}
      intro={`${privacyPolicy.title} for Gardian Logistics ("we," "us," "our") operating gardianlogistics.in from our offices in New Delhi, India and London, United Kingdom.`}
      sections={privacyPolicy.sections}
      disclaimer={privacyPolicy.disclaimer}
    />
  );
}
