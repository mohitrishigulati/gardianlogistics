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
