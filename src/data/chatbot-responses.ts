/** Extra bot responses beyond FAQ entries. */
export const chatbotResponses = [
  {
    keywords: ["hello", "hi", "hey", "start", "help"],
    answer:
      "Hello! 👋 I'm the Gardian Logistics assistant. Ask about tracking, customs, delivery times, payments, or type your question. Need a person? Tap **Chat on WhatsApp** anytime.",
  },
  {
    keywords: ["review", "rating", "feedback", "rate order"],
    answer:
      "After your order is processed, go to **My Bookings** in your customer portal and leave a star rating + comment. Your review helps us and your pickup agent improve service.",
  },
  {
    keywords: ["whatsapp", "human", "agent", "support", "call", "talk"],
    answer:
      "For live assistance, tap **Chat on WhatsApp** below. Our team responds on WhatsApp during business hours. Include your AWB or booking ID for faster help.",
  },
  {
    keywords: ["book", "booking", "ship", "order", "send parcel"],
    answer:
      "To book a shipment: Sign in → Customer Portal → **Book Shipment** → choose a nearby agent → fill pickup & destination details. You can track from **My Bookings** once approved.",
  },
  {
    keywords: ["price", "cost", "quote", "rate", "charges"],
    answer:
      "Rates depend on destination, weight, and service. Use **Get a Quote** on our website or ask your pickup agent for slab-based pricing. Agents can share exact charges on your receipt.",
  },
  {
    keywords: ["thanks", "thank you", "bye", "goodbye"],
    answer: "You're welcome! Safe shipping with Gardian Logistics. 🌍",
  },
];

export const chatbotWelcome =
  "Hi! I'm Gardian Assistant. I can answer questions about tracking, shipping, customs, and bookings. How can I help you today?";

export const chatbotFallback =
  "I'm not sure about that. Try asking about tracking, delivery time, customs, or payments — or tap **Chat on WhatsApp** to speak with our team.";
