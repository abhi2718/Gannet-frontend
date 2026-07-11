/**
 * Shared, humane field validators used by every form in the app. Each `*Error`
 * helper returns a friendly message when the value is invalid, or `null` when it
 * passes — so a form can render the message directly under the matching field.
 * Messages are plain sentences (no quoted field names, no Joi-style text).
 */

/** Basic email shape: something@something.tld. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** At least one letter and one number, minimum six characters. */
export const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

/** Indian PIN code: six digits, not starting with 0. */
export const PIN_RE = /^[1-9]\d{5}$/;

/** True for a 10-digit Indian mobile (optionally written with +91 / 91 / spaces). */
export function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits;
  return /^[6-9]\d{9}$/.test(local);
}

/**
 * Strips anything that can't appear in a phone number so the field accepts
 * digits only (plus the usual `+`, spaces and hyphens used for formatting).
 * Letters and other symbols are dropped as the user types.
 */
export const sanitizePhone = (v: string): string => v.replace(/[^\d+\s-]/g, "");

export const emailError = (v: string): string | null =>
  EMAIL_RE.test(v.trim()) ? null : "Please enter a valid email address.";

export const phoneError = (v: string): string | null =>
  isValidPhone(v) ? null : "Please enter a valid 10-digit phone number.";

export const passwordError = (v: string): string | null =>
  PASSWORD_RE.test(v)
    ? null
    : "Password must be at least 6 characters and include letters and numbers.";

export const nameError = (v: string): string | null =>
  v.trim().length >= 3 ? null : "Please enter your name (at least 3 characters).";

export const pinCodeError = (v: string): string | null =>
  PIN_RE.test(v.trim()) ? null : "Please enter a valid 6-digit PIN code.";

/** Generic non-empty check. `label` is woven into the message, e.g. "City is required." */
export const requiredError = (v: string, label: string): string | null =>
  v.trim() ? null : `${label} is required.`;

/**
 * Runs a map of per-field validators over a values object and returns only the
 * fields that failed. Lets form components validate in one call.
 */
export function collectErrors<K extends string>(
  values: Record<K, string>,
  validators: Partial<Record<K, (v: string) => string | null>>,
): Partial<Record<K, string>> {
  const errors: Partial<Record<K, string>> = {};
  (Object.keys(validators) as K[]).forEach((key) => {
    const fn = validators[key];
    const msg = fn?.(values[key] ?? "");
    if (msg) errors[key] = msg;
  });
  return errors;
}
