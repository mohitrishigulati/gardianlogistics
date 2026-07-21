export function currencySymbol(currency: string): string {
  if (currency === "INR") return "₹";
  if (currency === "USD") return "$";
  if (currency === "EUR") return "€";
  if (currency === "GBP") return "£";
  return currency;
}

export function formatMoney(amount: number, currency = "INR"): string {
  const symbol = currencySymbol(currency);
  return `${symbol}${amount.toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function calcBoxProfit(customerCharge: number, companyCharge: number | null | undefined): number {
  const company = companyCharge ?? 0;
  return Math.round((customerCharge - company) * 100) / 100;
}

export function calcShipmentTotals(
  boxes: Array<{ boxPrice: number; referenceSlabPrice?: number | null }>
) {
  const totalCustomerCharge = boxes.reduce((sum, box) => sum + box.boxPrice, 0);
  const totalCompanyCharge = boxes.reduce(
    (sum, box) => sum + (box.referenceSlabPrice ?? 0),
    0
  );
  const agentProfit = Math.round((totalCustomerCharge - totalCompanyCharge) * 100) / 100;

  return {
    totalCustomerCharge: Math.round(totalCustomerCharge * 100) / 100,
    totalCompanyCharge: Math.round(totalCompanyCharge * 100) / 100,
    agentProfit,
  };
}
