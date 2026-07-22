"use client";

import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { FadeIn } from "@/components/shared/FadeIn";
import { SOCIALS } from "@/data/content";

const CONTACT_INFO = [
  { icon: MapPin, label: "Address", value: "Tengra Mod , RamNagar , Varanasi , Uttar Pradesh , 221110" },
  { icon: Phone, label: "Phone", value: "+91 9110066913" },
  { icon: Mail, label: "Email", value: "atulvitrified091zi@gmail.com" },
  { icon: Clock, label: "Office Hours", value: "10:00 AM – 6:00 PM · 7 Days a Week" },
];

/** The static contact-details column of the contact section. */
export function ContactInfoPanel() {
  return (
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
          <span className="text-xs font-semibold opacity-60">Tengra Mod , RamNagar , Varanasi , Uttar Pradesh</span>
        </div>
      </div>

      <div className="flex gap-3">
        {SOCIALS.map(({ icon: Icon, label, href }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="w-11 h-11 rounded-xl bg-[#0D6EFD] flex items-center justify-center text-white hover:bg-blue-600 hover:scale-110 transition-all"
          >
            <Icon size={18} />
          </a>
        ))}
      </div>
    </FadeIn>
  );
}
