"use client";

import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Instagram,
  Facebook,
  Twitter,
  Send,
  CheckCircle,
} from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";

const CONTACT_INFO = [
  { icon: MapPin, label: "Address", value: "24 Spring Lane, Shimla, Himachal Pradesh 171001" },
  { icon: Phone, label: "Phone", value: "+91 98765 43210" },
  { icon: Mail, label: "Email", value: "hello@gannetwater.com" },
  { icon: Clock, label: "Office Hours", value: "10:00 AM – 6:00 PM · 7 Days a Week" },
];

const SOCIALS = [
  { icon: Instagram, label: "Instagram" },
  { icon: Facebook, label: "Facebook" },
  { icon: Twitter, label: "Twitter" },
];

const inputStyle = { background: "#F0F9FF", border: "1.5px solid transparent" };
const inputClass =
  "w-full px-4 py-3.5 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]";
const labelClass = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider";

export function ContactSection() {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3500);
    setForm({ name: "", phone: "", email: "", message: "" });
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
          <FadeIn className="lg:col-span-2 flex flex-col gap-5">
            {CONTACT_INFO.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 p-5 rounded-2xl"
                style={{ background: "#F0F9FF" }}
              >
                <div className="w-11 h-11 rounded-xl bg-[#0D6EFD] flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-white" />
                </div>
                <div>
                  <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-0.5">
                    {item.label}
                  </div>
                  <div className="text-gray-800 font-semibold text-sm">{item.value}</div>
                </div>
              </div>
            ))}

            <div
              className="rounded-2xl overflow-hidden h-40 relative"
              style={{ background: "linear-gradient(135deg, #EAF6FF, #DBEAFE)" }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center text-[#0D6EFD]">
                <MapPin size={28} className="mb-2 opacity-60" />
                <span className="text-xs font-semibold opacity-60">Shimla, Himachal Pradesh</span>
              </div>
            </div>

            <div className="flex gap-3">
              {SOCIALS.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  aria-label={label}
                  className="w-11 h-11 rounded-xl bg-[#0D6EFD] flex items-center justify-center text-white hover:bg-blue-600 hover:scale-110 transition-all"
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </FadeIn>

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
              <div className="mb-5">
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
              <button
                type="submit"
                className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(135deg, #0D6EFD 0%, #00B4D8 100%)",
                  boxShadow: "0 8px 32px rgba(13,110,253,0.3)",
                }}
              >
                {sent ? (
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
