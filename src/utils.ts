/** Format a number as a USD price string, e.g. 12.5 -> "$12.50". */
export function formatPrice(amount: number): string {
  if (!Number.isFinite(amount)) {
    throw new Error("amount must be a finite number");
  }
  return `$${amount.toFixed(2)}`;
}

/** Turn a title into a URL slug, e.g. "Hello, World!" -> "hello-world". */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

/** Basic email shape check (not a full RFC validation). */
export function isValidEmail(email: string): boolean {
  if (typeof email !== "string" || email.length === 0) return false;
  if (email.includes(" ")) return false;
  const parts = email.split("@");
  if (parts.length !== 2) return false;
  const [local, domain] = parts;
  if (!local || !domain) return false;
  if (!domain.includes(".")) return false;
  if (domain.startsWith(".") || domain.endsWith(".")) return false;
  return true;
}

/**
 * Apply a percentage discount to a price.
 * percent must be between 0 and 100. Result is rounded to 2 decimals.
 */
export function calculateDiscount(price: number, percent: number): number {
  if (!Number.isFinite(price) || price < 0) {
    throw new Error("price must be a finite number >= 0");
  }
  if (!Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new Error("percent must be between 0 and 100");
  }
  const discounted = price * (1 - percent / 100);
  return Math.round(discounted * 100) / 100;
}

/** Split an array into chunks of the given size. */
export function chunkArray<T>(items: T[], size: number): T[][] {
  if (!Number.isInteger(size) || size <= 0) {
    throw new Error("size must be a positive integer");
  }
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
}
