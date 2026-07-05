"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";
import { useSubmitQuery } from "@/lib/query/hooks/useQueryMutations";
import { ContactInfoPanel } from "./ContactInfoPanel";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const inputStyle = { background: "#F0F9FF", border: "1.5px solid transparent" };
const inputClass =
  "w-full px-4 py-3.5 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]";
const labelClass = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider";

const EMPTY_FORM = { name: "", phone: "", email: "", city: "", requirement: "", message: "" };

export function ContactSection() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const submit = useSubmitQuery();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, phone, email, city, requirement, message } = form;
    if (!name || !phone || !email || !city || !requirement || !message) {
      setError("Please fill in all fields.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    submit.mutate(
      { fullName: name, mobileNumber: phone, email, city, requirement, message },
      {
        onSuccess: () => {
          setSent(true);
          setTimeout(() => setSent(false), 3500);
          setForm(EMPTY_FORM);
        },
        onError: (err) =>
          setError((err as Error)?.message ?? "Something went wrong. Please try again."),
      },
    );
  };

  return (
    <section id="contact" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <FadeIn className="text-center mb-16">
          <span className="text-xs font-bold tracking-widest text-[#00B4D8] uppercase">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mt-3 mb-4">
            We Are Here to Help
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm">
            Reach out for bookings, bulk orders, dealership enquiries, or any questions. Our team
            responds within 2 hours.
          </p>
        </FadeIn>

        <div className="grid lg:grid-cols-5 gap-10">
          <ContactInfoPanel />

          <FadeIn className="lg:col-span-3" delay={0.15}>
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl p-8"
              style={{
                background: "white",
                boxShadow: "0 20px 60px rgba(13,110,253,0.08)",
                border: "1px solid rgba(13,110,253,0.08)",
              }}
            >
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelClass}>Phone Number</label>
                  <input
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={form.phone}
                    onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label className={labelClass}>Email Address</label>
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
                <div>
                  <label className={labelClass}>City</label>
                  <input
                    type="text"
                    placeholder="Your city"
                    value={form.city}
                    onChange={(e) => setForm((p) => ({ ...p, city: e.target.value }))}
                    className={inputClass}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div className="mb-5">
                <label className={labelClass}>Requirement</label>
                <input
                  type="text"
                  placeholder="e.g. 50 bottles/month, dealership, bulk order"
                  value={form.requirement}
                  onChange={(e) => setForm((p) => ({ ...p, requirement: e.target.value }))}
                  className={inputClass}
                  style={inputStyle}
                />
              </div>
              <div className="mb-6">
                <label className={labelClass}>Message</label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your water requirements..."
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  className={`${inputClass} resize-none`}
                  style={inputStyle}
                />
              </div>
              {error && <p className="text-xs text-red-500 mb-3">{error}</p>}
              <button
                type="submit"
                disabled={submit.isPending}
                className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] disabled:opacity-70"
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
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
