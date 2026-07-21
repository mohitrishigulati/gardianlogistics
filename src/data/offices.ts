export interface Office {
  id: string;
  city: string;
  country: string;
  isHQ?: boolean;
  address: string[];
  phone: string;
  email: string;
  hours: string;
  mapEmbedUrl: string;
}

export const offices: Office[] = [
  {
    id: "delhi",
    city: "New Delhi",
    country: "India",
    isHQ: true,
    address: [
      "Gardian Logistics Pvt. Ltd.",
      "Level 4, Connaught Place Business Centre",
      "Block A, Connaught Place",
      "New Delhi 110001, India",
    ],
    phone: "+91 11 4567 8900",
    email: "delhi@gardianlogistics.in",
    hours: "Mon–Sat: 9:00 AM – 7:00 PM IST",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.842489842!2d77.216721!3d28.6315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjjCsDM3JzUzLjQiTiA3N8KwMTMnMDAuMiJF!5e0!3m2!1sen!2sin!4v1",
  },
  {
    id: "london",
    city: "London",
    country: "United Kingdom",
    address: [
      "Gardian Logistics UK Ltd.",
      "Suite 12, Canary Wharf Business Park",
      "25 Canada Square",
      "London E14 5LQ, United Kingdom",
    ],
    phone: "+44 20 7946 0958",
    email: "london@gardianlogistics.in",
    hours: "Mon–Fri: 9:00 AM – 6:00 PM GMT",
    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2483.0!2d-0.0195!3d51.5054!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNTEuNTA1NCAtMC4wMTk1!5e0!3m2!1sen!2suk!4v1",
  },
];
