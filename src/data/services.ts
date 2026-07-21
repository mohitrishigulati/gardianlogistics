export interface Service {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  features: string[];
  icon: "international" | "domestic" | "freight" | "document" | "ecommerce" | "customs";
}

export const services: Service[] = [
  {
    id: "international-courier",
    slug: "international-courier",
    title: "International Courier",
    shortDescription: "Door-to-door express delivery to 220+ countries with multi-carrier options.",
    description:
      "Ship parcels and documents worldwide through our aggregator network. We compare rates across leading global carriers to find you the most competitive international courier option for your timeline and budget.",
    features: [
      "Express and economy service levels",
      "Real-time tracking across partner networks",
      "Door pickup and delivery available",
      "Insurance and declared value options",
    ],
    icon: "international",
  },
  {
    id: "domestic-courier",
    slug: "domestic-courier",
    title: "Domestic Courier",
    shortDescription: "Fast, reliable parcel delivery across India and the UK.",
    description:
      "Same-day, next-day, and standard domestic shipping for businesses and individuals. Our local partner network ensures coverage in metro areas and tier-2 cities.",
    features: [
      "Pan-India and UK-wide coverage",
      "Cash on delivery options",
      "Bulk and recurring shipment plans",
      "Proof of delivery on every order",
    ],
    icon: "domestic",
  },
  {
    id: "freight-cargo",
    slug: "freight-cargo",
    title: "Freight & Cargo",
    shortDescription: "Air, sea, and road freight for commercial and industrial shipments.",
    description:
      "Move pallets, containers, and heavy cargo with end-to-end freight forwarding. We handle documentation, carrier booking, and milestone tracking for import and export cargo.",
    features: [
      "Air freight for time-critical cargo",
      "Sea freight for cost-effective bulk moves",
      "FCL and LCL container options",
      "Project cargo and oversized handling",
    ],
    icon: "freight",
  },
  {
    id: "document-express",
    slug: "document-express",
    title: "Document Express",
    shortDescription: "Secure, priority delivery for legal, visa, and business documents.",
    description:
      "When documents cannot wait, our express document service prioritizes speed and chain-of-custody. Ideal for visa applications, contracts, and time-sensitive paperwork.",
    features: [
      "Priority handling and routing",
      "Signature-required delivery",
      "Tamper-evident packaging available",
      "Same-day pickup in major cities",
    ],
    icon: "document",
  },
  {
    id: "ecommerce-shipping",
    slug: "ecommerce-shipping",
    title: "E-commerce Shipping",
    shortDescription: "Cross-border fulfillment and bulk shipping for online sellers.",
    description:
      "Scale your e-commerce business with consolidated rates, bulk label generation, and returns management. We integrate with major marketplaces and shopping platforms.",
    features: [
      "Volume-based discounted rates",
      "Multi-SKU and multi-destination support",
      "Returns and reverse logistics",
      "Customs-ready commercial invoices",
    ],
    icon: "ecommerce",
  },
  {
    id: "customs-clearance",
    slug: "customs-clearance",
    title: "Customs Clearance",
    shortDescription: "Expert support for import/export documentation and customs compliance.",
    description:
      "Navigate customs regulations with confidence. Our team assists with HS codes, duties, restricted goods, and clearance coordination at major ports and airports.",
    features: [
      "Import and export clearance support",
      "Duty and tax estimation",
      "Restricted goods guidance",
      "Coordination with customs brokers",
    ],
    icon: "customs",
  },
];

export function getServiceBySlug(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
