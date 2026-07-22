export interface FAQ {
  id: string;
  category: "tracking" | "customs" | "delivery" | "payment" | "general";
  question: string;
  answer: string;
}

export const faqs: FAQ[] = [
  {
    id: "track-1",
    category: "tracking",
    question: "Where can I find my tracking number?",
    answer:
      "Your tracking number (AWB) is provided in your booking confirmation email and on your shipping label. It typically starts with carrier-specific prefixes. If you booked through Gardian Logistics, check your receipt or contact our support team.",
  },
  {
    id: "track-2",
    category: "tracking",
    question: "Why is my tracking not updating?",
    answer:
      "Tracking updates depend on carrier scan events. During transit between hubs or customs, there may be gaps of 24–48 hours. If no update appears for more than 72 hours, contact us with your AWB number.",
  },
  {
    id: "customs-1",
    category: "customs",
    question: "Do I need to pay customs duties?",
    answer:
      "Import duties and taxes are determined by the destination country's customs authority based on declared value, HS code, and local regulations. We can provide estimates but final charges are assessed at clearance.",
  },
  {
    id: "customs-2",
    category: "customs",
    question: "What documents are required for international shipping?",
    answer:
      "Typically you need a commercial invoice, packing list, and accurate description of goods. Restricted items may require additional permits. Our team guides you through documentation for each destination.",
  },
  {
    id: "delivery-1",
    category: "delivery",
    question: "How long does international delivery take?",
    answer:
      "Express services typically deliver in 2–5 business days to major destinations. Economy services may take 7–14 business days. Customs clearance can add 1–3 days depending on the country.",
  },
  {
    id: "delivery-2",
    category: "delivery",
    question: "Can I schedule a pickup?",
    answer:
      "Yes. When you book through Gardian Logistics, we arrange carrier pickup from your address. Pickup windows vary by location — contact your nearest office to schedule.",
  },
  {
    id: "payment-1",
    category: "payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept bank transfer, UPI, credit/debit cards, and corporate invoicing for registered business accounts. Payment terms are confirmed at the time of booking.",
  },
  {
    id: "general-1",
    category: "general",
    question: "How does Gardian Logistics work with carriers like DHL and FedEx?",
    answer:
      "Gardian Logistics acts as an authorized aggregator and shipping agent. We maintain partnerships with leading global carriers and local postal services, allowing us to offer competitive rates and unified tracking while the actual delivery is performed by the selected carrier network.",
  },
  {
    id: "general-2",
    category: "general",
    question: "Is my shipment insured?",
    answer:
      "Basic carrier liability applies by default. Additional declared-value insurance is available at booking. We recommend insurance for high-value shipments.",
  },
  {
    id: "general-3",
    category: "general",
    question: "Is Gardian Logistics a carrier itself, or do you use other couriers?",
    answer:
      "We're a logistics partner and aggregator. We work with established global carriers to move your shipment, which means we can compare rates and routing options rather than being limited to one network's pricing.",
  },
  {
    id: "track-3",
    category: "tracking",
    question: "My tracking number isn't showing results — what do I do?",
    answer:
      "Double-check the number for typos first. If it's a recent booking, allow up to 24 hours for the carrier to register the first scan. Still stuck? Contact us with your AWB number and we'll look it up directly.",
  },
  {
    id: "customs-3",
    category: "customs",
    question: "Do you handle customs clearance?",
    answer:
      "Yes — our team prepares and reviews customs documentation for international shipments to reduce the chance of delays at the border.",
  },
];

export const faqCategories = [
  { id: "tracking", label: "Tracking" },
  { id: "customs", label: "Customs" },
  { id: "delivery", label: "Delivery" },
  { id: "payment", label: "Payment" },
  { id: "general", label: "General" },
] as const;
