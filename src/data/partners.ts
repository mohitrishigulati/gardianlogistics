export interface Partner {
  id: string;
  name: string;
  initials: string;
}

export const partners: Partner[] = [
  { id: "global-express", name: "Global Express Co.", initials: "GE" },
  { id: "swift-parcel", name: "Swift Parcel Network", initials: "SP" },
  { id: "transworld", name: "TransWorld Freight", initials: "TW" },
  { id: "airlink", name: "AirLink Cargo", initials: "AL" },
  { id: "postal-alliance", name: "Postal Alliance", initials: "PA" },
  { id: "oceanbridge", name: "OceanBridge Logistics", initials: "OB" },
];

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    quote:
      "Gardian Logistics consistently beats our previous courier rates on international lanes. Their team handles customs paperwork proactively.",
    author: "Priya Sharma",
    role: "Operations Director",
    company: "NovaTextile Exports",
  },
  {
    id: "2",
    quote:
      "Having offices in both Delhi and London makes cross-border coordination seamless. Tracking is accurate and support is responsive.",
    author: "James Whitfield",
    role: "Supply Chain Manager",
    company: "EuroParts Ltd.",
  },
  {
    id: "3",
    quote:
      "We ship 500+ e-commerce orders monthly through Gardian. Bulk rates and reliable delivery have been a game-changer for our business.",
    author: "Arun Mehta",
    role: "Founder",
    company: "CraftCart India",
  },
];

export const clientLogos = [
  { id: "1", name: "NovaTextile", initials: "NT" },
  { id: "2", name: "EuroParts", initials: "EP" },
  { id: "3", name: "CraftCart", initials: "CC" },
  { id: "4", name: "MedSupply", initials: "MS" },
  { id: "5", name: "TechBridge", initials: "TB" },
];
