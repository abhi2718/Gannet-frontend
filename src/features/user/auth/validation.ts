/**
 * Shared field validators for the sign-in / sign-up forms. Each `*Error` helper
 * returns a human-readable message when the value is invalid, or `null` when it
 * passes — so the forms can show the message under the matching field.
 */

/** Basic email shape: something@something.tld. */
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** At least one letter and one number, minimum six characters. */
export const PASSWORD_RE = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;

/** Indian mobile number: 10 digits starting 6–9. */
export const PHONE_RE = /^[6-9]\d{9}$/;

export const emailError = (email: string): string | null =>
  EMAIL_RE.test(email.trim()) ? null : "Enter a valid email address.";

export const passwordError = (password: string): string | null =>
  PASSWORD_RE.test(password)
    ? null
    : "Password must be at least 6 characters and include letters and numbers.";

export const phoneError = (phone: string): string | null =>
  PHONE_RE.test(phone) ? null : "Enter a valid 10-digit Indian mobile number.";

export const nameError = (name: string): string | null =>
  name.trim().length >= 3 ? null : "Enter your name (at least 3 characters).";
