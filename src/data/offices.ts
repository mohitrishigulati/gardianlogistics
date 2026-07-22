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
  whatsapp?: string;
  /** Company Identification Number (India) — add your verified MCA registration */
  cin?: string;
  /** GST Identification Number (India) */
  gstin?: string;
  /** Companies House registration number (UK) */
  companiesHouseNumber?: string;
}

export const offices: Office[] = [
  {
    id: "delhi",
    city: "Delhi",
    country: "India",
    isHQ: true,
    address: [
      "Gardian Logistics Private Limited",
      "A 2, IInd Floor",
      "West Delhi, Rajouri Garden",
      "Delhi, India, 110027",
    ],
    phone: "+91 11 4567 8900",
    email: "contact@gardianlogistics.in",
    whatsapp: "+919876543210",
    cin: "U74999DL2015PTC288810",
    hours: "Mon–Sat: 9:00 AM – 7:00 PM IST",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=A+2+IInd+Floor+Rajouri+Garden+West+Delhi+110027&output=embed",
  },
  {
    id: "london",
    city: "London",
    country: "United Kingdom",
    address: [
      "ALLTIME EXPRESS LIMITED",
      "Unit 13, Worton Court, Worton Road",
      "Isleworth, London TW7 6ER",
      "United Kingdom",
    ],
    phone: "+44 7847 307527",
    email: "info@alltimeexpress.co.uk",
    hours: "Mon–Fri: 9:00 AM – 6:00 PM GMT",
    mapEmbedUrl:
      "https://maps.google.com/maps?q=Unit+13+Worton+Court+Worton+Road+Isleworth+TW7+6ER&output=embed",
  },
];
