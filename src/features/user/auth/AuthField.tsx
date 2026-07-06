"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type AuthFieldProps = {
  id: string;
  label: string;
  icon: LucideIcon;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "tel";
  placeholder?: string;
  autoComplete?: string;
  inputMode?: "text" | "email" | "tel" | "numeric";
  maxLength?: number;
  /** Fixed content rendered before the input, e.g. a "+91" dial code. */
  prefix?: string;
  onEnter?: () => void;
  /** Validation message shown under this field (red). */
  error?: string;
};

/**
 * Labeled input used across the login and registration forms. Renders a leading
 * icon, an optional prefix, and a show/hide toggle for password fields.
 */
export function AuthField({
  id,
  label,
  icon: Icon,
  value,
  onChange,
  type = "text",
  placeholder,
  autoComplete,
  inputMode,
  maxLength,
  prefix,
  onEnter,
  error,
}: AuthFieldProps) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && show ? "text" : type;

  return (
    <div className="mb-4">
      <label
        htmlFor={id}
        className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider"
      >
        {label}
      </label>
      <div
        className="flex items-center gap-2 px-4 rounded-2xl focus-within:ring-2 focus-within:ring-[#0D6EFD] transition-shadow"
        style={{ background: "#F0F9FF", border: `1.5px solid ${error ? "#EF4444" : "transparent"}` }}
      >
        <Icon size={18} className="text-gray-400 shrink-0" />
        {prefix && <span className="text-sm font-semibold text-gray-500 shrink-0">{prefix}</span>}
        <input
          id={id}
          aria-label={label}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          type={inputType}
          value={value}
          placeholder={placeholder}
          autoComplete={autoComplete}
          inputMode={inputMode}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onEnter?.()}
          className="flex-1 min-w-0 py-3.5 bg-transparent text-sm text-gray-900 focus:outline-none"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label={show ? "Hide password" : "Show password"}
            className="text-gray-400 hover:text-gray-600 transition-colors shrink-0"
          >
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-xs text-red-500 mt-1.5">
          {error}
        </p>
      )}
    </div>
  );
}
