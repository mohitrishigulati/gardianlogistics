export const siteConfig = {
  name: "Gardian Logistics",
  domain: "gardianlogistics.in",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://gardianlogistics.in",
  tagline: "Global Shipping. Best Rates. Trusted Since 2015.",
  description:
    "Gardian Logistics connects you to leading global carrier partners, so your international shipments move faster and cost less — with real-time tracking and a team that actually picks up the phone.",
  heroSubhead:
    "Gardian Logistics connects you to leading global carrier partners, so your international shipments move faster and cost less — with real-time tracking and a team that actually picks up the phone.",
  quoteResponseTime: "2 business hours",
  founded: 2015,
  email: "contact@gardianlogistics.in",
  phone: {
    india: "+91 11 4567 8900",
    uk: "+44 7847 307527",
  },
  whatsapp: "+919876543210",
  social: {
    linkedin: "https://linkedin.com/company/gardian-logistics",
    twitter: "https://twitter.com/gardianlogistics",
    facebook: "https://facebook.com/gardianlogistics",
  },
  partnerDisclaimer:
    "Gardian Logistics works with leading global carriers to deliver your shipments worldwide. Carrier names and logos are used for identification purposes only.",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/track", label: "Track Shipment" },
  { href: "/quote", label: "Get a Quote" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
  { href: "/faq", label: "FAQs" },
  { href: "/blog", label: "Blog" },
];

export const trustSignals = [
  { label: "10+ Years", description: "In business since 2015" },
  { label: "India & UK Offices", description: "Dual presence for global reach" },
  { label: "Global Partner Network", description: "Multi-carrier delivery options" },
  { label: "Best Rates", description: "Competitive international pricing" },
];

export const trackingSteps = [
  {
    step: 1,
    title: "Enter Your AWB",
    description: "Type or paste your tracking number in the search box on any page.",
  },
  {
    step: 2,
    title: "We Query the Carrier",
    description:
      "We identify the carrier handling your shipment and pull its live status.",
  },
  {
    step: 3,
    title: "Track Every Milestone",
    description:
      "See pickup, transit, customs, and delivery progress in one timeline.",
  },
];

export const companyStats = [
  { label: "10+ Years", description: "Shipping internationally since 2015" },
  { label: "220+ Countries", description: "Reach through our carrier network" },
  { label: "India & UK Hubs", description: "On-the-ground coordination" },
];
