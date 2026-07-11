"use client";

import { Loader2 } from "lucide-react";

/**
 * Centered loading indicator shown while an admin view fetches its data. Sized
 * to fill the tab body so the spinner sits in the middle of the screen.
 */
export function Loader({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-32 text-center">
      <Loader2 size={32} className="animate-spin text-[#0D6EFD]" />
      <p className="text-sm font-semibold text-gray-400">{label}</p>
    </div>
  );
}
