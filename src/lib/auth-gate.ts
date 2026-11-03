/** Common disposable / throwaway email domains we reject on signup. */
const DISPOSABLE = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "guerrillamail.net",
  "10minutemail.com",
  "tempmail.com",
  "temp-mail.org",
  "yopmail.com",
  "trashmail.com",
  "sharklasers.com",
  "getnada.com",
  "fakeinbox.com",
  "discard.email",
  "maildrop.cc",
  "throwaway.email",
]);

export function isValidEmailFormat(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim().toLowerCase());
}

export function isDisposableEmail(email: string): boolean {
  const domain = email.trim().toLowerCase().split("@")[1] ?? "";
  return DISPOSABLE.has(domain);
}

export function validateSignupEmail(email: string): string | null {
  const clean = email.trim().toLowerCase();
  if (!isValidEmailFormat(clean)) return "Enter a real email address.";
  if (isDisposableEmail(clean)) {
    return "Temporary or disposable emails are not allowed. Use Google or a permanent email.";
  }
  return null;
}

export const COUNTRY_OPTIONS = [
  "Nigeria",
  "Ghana",
  "Kenya",
  "South Africa",
  "United Kingdom",
  "United States",
  "Canada",
  "Ireland",
  "Germany",
  "France",
  "United Arab Emirates",
  "Other",
] as const;
