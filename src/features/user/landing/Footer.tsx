"use client";

import { Phone, Mail, MapPin } from "lucide-react";
import { NAV, SOCIALS } from "@/data/content";
import { PRODUCTS } from "@/data/products";
import { GannetBirdIcon } from "@/components/shared/GannetBirdIcon";

const CONTACTS = [
  { icon: Phone, text: "+91 9110066913" },
  { icon: Mail, text: "atulvitrified091zi@gmail.com" },
  { icon: MapPin, text: "Tengra Mod , RamNagar , Varanasi , Uttar Pradesh" },
];

const sectionId = (n: string) => n.toLowerCase().replace(/\s+/g, "-");

export function Footer({ onLogin }: { onLogin: () => void }) {
  const scrollTo = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <footer
      style={{ background: "linear-gradient(135deg, #0A1628 0%, #0D2B6E 60%, #0A3A7A 100%)" }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          <div>
            <div className="flex items-center gap-2.5 mb-5">
              <GannetBirdIcon />
              <div className="flex flex-col items-start leading-none">
                <span className="text-[9px] font-bold uppercase tracking-[0.25em] text-blue-200/60">
                  Atul Vitrified Company
                </span>
                <div className="flex items-start gap-0.5">
                  <span className="text-xl font-extrabold text-white tracking-widest">GANNET</span>
                  <span className="text-xs font-bold text-blue-300 mt-0.5">™</span>
                </div>
              </div>
            </div>
            <p className="text-blue-200/70 text-sm leading-relaxed mb-6">
              Pure natural drinking water sourced from pristine mountain springs, delivered fresh
              to your door.
            </p>
            <div className="flex gap-2.5">
              {SOCIALS.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-[#0D6EFD] transition-all hover:scale-110"
                  style={{ background: "rgba(255,255,255,0.08)" }}
                >
                  <Icon size={16} className="text-blue-200" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-extrabold text-white mb-5 text-sm tracking-wider uppercase">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {NAV.map((n) => (
                <li key={n}>
                  <button
                    onClick={() => scrollTo(sectionId(n))}
                    className="text-blue-200/70 text-sm hover:text-white transition-colors"
                  >
                    {n}
                  </button>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-white mb-5 text-sm tracking-wider uppercase">
              Products
            </h4>
            <ul className="space-y-3">
              {PRODUCTS.map((p) => (
                <li key={p.size} className="text-blue-200/70 text-sm">
                  GANNET {p.size} — {p.label}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-extrabold text-white mb-5 text-sm tracking-wider uppercase">
              Contact
            </h4>
            <ul className="space-y-4">
              {CONTACTS.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-blue-200/70 text-sm">
                  <item.icon size={14} className="mt-0.5 shrink-0 text-[#00B4D8]" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div
          className="border-t pt-8 flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{ borderColor: "rgba(255,255,255,0.08)" }}
        >
          <p className="text-blue-200/50 text-xs">
            © 2024 GANNET™ Natural Water. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy Policy", "Terms & Conditions"].map((t) => (
              <button
                key={t}
                className="text-blue-200/50 text-xs hover:text-blue-200 transition-colors"
              >
                {t}
              </button>
            ))}
            <button
              onClick={onLogin}
              className="text-blue-200/50 text-xs hover:text-blue-200 transition-colors"
            >
              Admin Login
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
