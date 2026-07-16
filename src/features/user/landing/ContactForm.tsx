"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { useSubmitQuery } from "@/lib/query/hooks/useQueryMutations";
import { FieldError } from "@/components/shared/FieldError";
import {
  emailError,
  phoneError,
  fullNameError,
  messageError,
  requirementError,
  letterTextError,
  sanitizeText,
  sanitizePhone,
} from "@/lib/validation";

const inputClass =
  "w-full px-4 py-3.5 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]";
const labelClass = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider";
const fieldStyle = (err?: string) => ({
  background: "#F0F9FF",
  border: `1.5px solid ${err ? "#EF4444" : "transparent"}`,
});

type FieldKey = "name" | "phone" | "email" | "city" | "requirement" | "message";

const FIELDS: {
  key: FieldKey;
  label: string;
  type: "text" | "email" | "tel" | "textarea";
  placeholder: string;
  full: boolean;
  validate: (v: string) => string | null;
  /** Optional input filter applied as the user types (e.g. letters only). */
  sanitize?: (v: string) => string;
}[] = [
  { key: "name", label: "Full Name", type: "text", placeholder: "Your full name", full: false, validate: fullNameError, sanitize: sanitizeText }, // prettier-ignore
  { key: "phone", label: "Phone Number", type: "tel", placeholder: "+91 XXXXX XXXXX", full: false, validate: phoneError, sanitize: sanitizePhone }, // prettier-ignore
  { key: "email", label: "Email Address", type: "email", placeholder: "you@example.com", full: false, validate: emailError }, // prettier-ignore
  { key: "city", label: "City", type: "text", placeholder: "Your city", full: false, validate: (v) => letterTextError(v, "City"), sanitize: sanitizeText }, // prettier-ignore
  { key: "requirement", label: "Requirement", type: "text", placeholder: "e.g. 50 bottles/month, dealership, bulk order", full: true, validate: requirementError }, // prettier-ignore
  { key: "message", label: "Message", type: "textarea", placeholder: "Tell us about your water requirements...", full: true, validate: messageError }, // prettier-ignore
];

const EMPTY: Record<FieldKey, string> = {
  name: "",
  phone: "",
  email: "",
  city: "",
  requirement: "",
  message: "",
};

type Errors = Partial<Record<FieldKey, string>> & { form?: string };

/** The dealership-inquiry form, with per-field validation shown under each input. */
export function ContactForm() {
  const [form, setForm] = useState<Record<FieldKey, string>>(EMPTY);
  const [errors, setErrors] = useState<Errors>({});
  const [sent, setSent] = useState(false);
  const submit = useSubmitQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    for (const f of FIELDS) {
      const msg = f.validate(form[f.key]);
      if (msg) next[f.key] = msg;
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    submit.mutate(
      {
        fullName: form.name,
        mobileNumber: form.phone,
        email: form.email,
        city: form.city,
        requirement: form.requirement,
        message: form.message,
        type: "dealership",
      },
      {
        onSuccess: () => {
          setSent(true);
          setTimeout(() => setSent(false), 3500);
          setForm(EMPTY);
        },
        onError: (err) =>
          setErrors({ form: (err as Error)?.message ?? "Something went wrong. Please try again." }),
      },
    );
  };

  const change = (key: FieldKey, value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setErrors((p) => ({ ...p, [key]: undefined, form: undefined }));
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl p-8"
      style={{
        background: "white",
        boxShadow: "0 20px 60px rgba(13,110,253,0.08)",
        border: "1px solid rgba(13,110,253,0.08)",
      }}
    >
      <div
        className="text-center mb-6 pb-6 border-b"
        style={{ borderColor: "rgba(13,110,253,0.08)" }}
      >
        <span className="text-xs font-bold tracking-widest text-[#00B4D8] uppercase">
          Partner With Us
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-gray-900 mt-2">
          Inquiry for Dealership
        </h3>
        <p className="text-sm text-gray-500 mt-2 max-w-sm mx-auto leading-relaxed">
          Interested in a GANNET™ dealership or bulk supply? Fill in your details and our team will
          get back to you.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-5 gap-y-4">
        {FIELDS.map((f) => (
          <div key={f.key} className={f.full ? "sm:col-span-2" : ""}>
            <label htmlFor={`contact-${f.key}`} className={labelClass}>
              {f.label}
            </label>
            {f.type === "textarea" ? (
              <textarea
                id={`contact-${f.key}`}
                rows={4}
                aria-label={f.label}
                aria-invalid={!!errors[f.key]}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={(e) => change(f.key, e.target.value)}
                className={`${inputClass} resize-none`}
                style={fieldStyle(errors[f.key])}
              />
            ) : (
              <input
                id={`contact-${f.key}`}
                type={f.type}
                aria-label={f.label}
                aria-invalid={!!errors[f.key]}
                placeholder={f.placeholder}
                value={form[f.key]}
                onChange={(e) => change(f.key, f.sanitize ? f.sanitize(e.target.value) : e.target.value)}
                className={inputClass}
                style={fieldStyle(errors[f.key])}
              />
            )}
            <FieldError message={errors[f.key]} />
          </div>
        ))}
      </div>

      {errors.form && <p className="text-xs text-red-500 mt-3">{errors.form}</p>}
      <button
        type="submit"
        disabled={submit.isPending}
        className="w-full mt-6 py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-70"
        style={{
          background: "linear-gradient(135deg, #0D6EFD 0%, #00B4D8 100%)",
          boxShadow: "0 8px 32px rgba(13,110,253,0.3)",
        }}
      >
        {submit.isPending ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : sent ? (
          <>
            <CheckCircle size={17} /> Message Sent!
          </>
        ) : (
          <>
            <Send size={15} /> Send Message
          </>
        )}
      </button>
    </form>
  );
}
