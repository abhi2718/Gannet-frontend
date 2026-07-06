/**
 * Up-to-two-letter avatar initials from a display name.
 * "Arjun Mehta" → "AM", "Priya" → "PR", "" → "?".
 */
export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.trim().slice(0, 2).toUpperCase() || "?";
}
