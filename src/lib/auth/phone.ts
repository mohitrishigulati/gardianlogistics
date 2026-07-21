/** Normalize to 10-digit Indian mobile (digits only, strip leading 91). */
export function normalizeLoginPhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

export function isValidLoginPhone(phone: string): boolean {
  return /^[6-9]\d{9}$/.test(phone);
}

export function agentEmailFromPhone(phone: string): string {
  return `agent+${phone}@agents.gardianlogistics.in`;
}
