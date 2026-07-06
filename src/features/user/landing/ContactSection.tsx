"use client";

import { FadeIn } from "@/components/shared/FadeIn";
import { ContactInfoPanel } from "./ContactInfoPanel";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
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
            <ContactForm />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
