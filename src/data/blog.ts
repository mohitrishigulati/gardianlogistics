export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  author: string;
  category: string;
  readTime: string;
  content: string[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "international-shipping-documents-checklist",
    title: "International Shipping Documents: A Complete Checklist",
    excerpt:
      "Avoid customs delays with this essential document checklist for cross-border shipments from India and the UK.",
    date: "2026-03-15",
    author: "Gardian Logistics Team",
    category: "Guides",
    readTime: "6 min read",
    content: [
      "Shipping internationally requires more than just a label. Customs authorities in every country require specific documentation to clear your goods. Missing or incorrect paperwork is the number one cause of shipment delays.",
      "At minimum, you will need a commercial invoice listing each item, its HS code, declared value, and country of origin. A packing list detailing weights and dimensions helps customs verify contents. For certain goods, certificates of origin or import licenses may be required.",
      "Gardian Logistics reviews your documentation before dispatch and flags common issues — vague product descriptions, undervalued declarations, and restricted item categories. Our India and UK teams are familiar with regulations on both sides of major trade lanes.",
      "Pro tip: keep digital copies of all documents accessible. Many carriers and customs portals now accept electronic submission, speeding up clearance at destination.",
    ],
  },
  {
    slug: "how-to-reduce-international-shipping-costs",
    title: "5 Ways to Reduce Your International Shipping Costs",
    excerpt:
      "Practical strategies for businesses and individuals to lower cross-border shipping expenses without sacrificing reliability.",
    date: "2026-02-28",
    author: "Gardian Logistics Team",
    category: "Tips",
    readTime: "5 min read",
    content: [
      "International shipping costs add up quickly, especially for growing e-commerce businesses. The good news: there are proven ways to optimize spend without cutting corners on delivery quality.",
      "First, compare service levels. Express delivery is convenient but economy services can save 40–60% on non-urgent shipments. Second, optimize packaging — dimensional weight pricing means smaller boxes often mean lower bills.",
      "Third, consolidate shipments when possible. Sending one larger parcel instead of several small ones reduces per-piece surcharges. Fourth, work with an aggregator like Gardian Logistics that compares rates across multiple carrier networks.",
      "Finally, maintain accurate customs declarations. Under-declaring value may seem cheaper upfront but leads to penalties, holds, and re-routing fees that far exceed any initial savings.",
    ],
  },
  {
    slug: "understanding-customs-clearance-india-uk",
    title: "Understanding Customs Clearance: India ↔ UK Trade Lane",
    excerpt:
      "A practical overview of customs processes, timelines, and common pitfalls on the India-UK shipping corridor.",
    date: "2026-01-10",
    author: "Gardian Logistics Team",
    category: "Customs",
    readTime: "7 min read",
    content: [
      "The India-UK corridor is one of the busiest trade routes Gardian Logistics serves. Understanding customs on both ends helps you plan delivery timelines and manage recipient expectations.",
      "Exports from India require an shipping bill and GST compliance documentation. Imports into the UK need an EORI number for commercial recipients and accurate commodity codes under the UK Global Tariff.",
      "Clearance typically takes 1–3 business days for standard goods. Items requiring inspection, restricted categories, or incomplete paperwork can extend this significantly.",
      "Gardian Logistics coordinates with licensed customs brokers at major ports and airports. We pre-screen documentation and communicate proactively when additional information is needed — reducing the risk of unexpected holds.",
    ],
  },
];

export function getBlogPost(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}
