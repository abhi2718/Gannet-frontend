"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X, CheckCircle, Droplets, Send } from "lucide-react";
import { useSubmitQuery } from "@/lib/query/hooks/useQueryMutations";

const FIELDS = [
  { label: "Full Name", key: "name", type: "text", placeholder: "Your name", col: 2 },
  { label: "Mobile Number", key: "mobile", type: "tel", placeholder: "+91 XXXXX XXXXX", col: 1 },
  { label: "Email", key: "email", type: "email", placeholder: "you@example.com", col: 1 },
  { label: "City", key: "city", type: "text", placeholder: "Your city", col: 1 },
  { label: "Requirement", key: "req", type: "text", placeholder: "e.g. 50 bottles/month", col: 1 },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function InquiryPopup({ onClose }: { onClose: () => void }) {
  const [form, setForm] = useState({ name: "", mobile: "", email: "", city: "", req: "", msg: "" });
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const submit = useSubmitQuery();

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, mobile, email, city, req, msg } = form;
    if (!name || !mobile || !email || !city || !req) {
      setError("Please fill in all fields.");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setError("");
    submit.mutate(
      {
        fullName: name,
        mobileNumber: mobile,
        email,
        city,
        requirement: req,
        message: msg.trim() || req,
      },
      {
        onSuccess: () => setSent(true),
        onError: (err) =>
          setError((err as Error)?.message ?? "Something went wrong. Please try again."),
      },
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
        >
          <X size={16} className="text-gray-500" />
        </button>
        {sent ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-500" />
            </div>
            <h3 className="text-xl font-extrabold text-gray-900 mb-2">Inquiry Received!</h3>
            <p className="text-gray-500 text-sm mb-6">Our team will contact you within 2 hours.</p>
            <button
              onClick={onClose}
              className="px-8 py-3 rounded-2xl bg-[#0D6EFD] text-white font-bold text-sm"
            >
              Close
            </button>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 flex items-center justify-center">
                <Droplets size={20} className="text-[#0D6EFD]" />
              </div>
              <span className="text-xs font-bold text-[#00B4D8] uppercase tracking-widest">
                Fresh Water Awaits
              </span>
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 mb-1">
              Need Fresh Natural Drinking Water?
            </h2>
            <p className="text-sm text-gray-500 mb-5">
              Fill out the inquiry form and our team will contact you shortly.
            </p>
            <form onSubmit={handle}>
              <div className="grid grid-cols-2 gap-3 mb-3">
                {FIELDS.map((f) => (
                  <div key={f.key} className={f.col === 2 ? "col-span-2" : ""}>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">
                      {f.label}
                    </label>
                    <input
                      type={f.type}
                      placeholder={f.placeholder}
                      value={(form as Record<string, string>)[f.key]}
                      onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm rounded-xl bg-blue-50 border border-transparent focus:border-[#0D6EFD] focus:outline-none transition-colors"
                    />
                  </div>
                ))}
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Message</label>
                  <textarea
                    placeholder="Anything else?"
                    rows={2}
                    value={form.msg}
                    onChange={(e) => setForm((p) => ({ ...p, msg: e.target.value }))}
                    className="w-full px-3 py-2.5 text-sm rounded-xl bg-blue-50 border border-transparent focus:border-[#0D6EFD] focus:outline-none transition-colors resize-none"
                  />
                </div>
              </div>
              {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
              <button
                type="submit"
                disabled={submit.isPending}
                className="w-full py-3 rounded-2xl bg-[#0D6EFD] text-white font-bold text-sm hover:bg-blue-600 transition-colors mb-2 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {submit.isPending ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={15} /> Submit Inquiry
                  </>
                )}
              </button>
            </form>
            <button
              onClick={onClose}
              className="w-full py-2.5 rounded-2xl text-gray-400 text-sm hover:text-gray-600 transition-colors"
            >
              Maybe Later
            </button>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
