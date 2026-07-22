import { LegalDocumentPage, createLegalMetadata } from "@/components/legal/LegalDocumentPage";
import { termsOfService } from "@/data/legal";

export const metadata = createLegalMetadata("Terms of Service", "/terms");

export default function TermsPage() {
  return (
    <LegalDocumentPage
      title={termsOfService.title}
      lastUpdated={termsOfService.lastUpdated}
      sections={termsOfService.sections}
      disclaimer={termsOfService.disclaimer}
    />
  );
}
