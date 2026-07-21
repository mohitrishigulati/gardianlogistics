import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "FAQs",
  description:
    "Frequently asked questions about Gardian Logistics tracking, customs, delivery timelines, payments, and our global carrier partner network.",
  path: "/faq",
});

export default function FAQLayout({ children }: { children: React.ReactNode }) {
  return children;
}
