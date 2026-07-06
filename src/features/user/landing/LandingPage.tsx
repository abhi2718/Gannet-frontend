"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence } from "motion/react";
import { useCart } from "@/features/user/commerce/CartContext";
import { Navbar } from "./Navbar";
import { HeroSection } from "./HeroSection";
import { ProductSection } from "./ProductSection";
import { FeaturesSection } from "./FeaturesSection";
import { BookingSection } from "./BookingSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { ContactSection } from "./ContactSection";
import { Footer } from "./Footer";
import { InquiryPopup } from "./InquiryPopup";

/** The public marketing + e-commerce landing page. */
export function LandingPage() {
  const router = useRouter();
  const { cartCount, addToCart, bookNow, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setShowPopup(true), 45000);
    return () => clearTimeout(t);
  }, []);

  const goLogin = () => router.push("/login");

  // "Book water" CTAs send the visitor to the bottle picker ("Choose Your
  // Perfect Size") so they can select a size, add to cart and check out.
  const goToProducts = () =>
    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });

  // Arriving from the dashboard's "Book Water" button (`/#products`): scroll the
  // picker into view once the section has mounted.
  useEffect(() => {
    if (window.location.hash !== "#products") return;
    const t = setTimeout(goToProducts, 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="min-h-screen bg-white overflow-x-hidden">
      <AnimatePresence>
        {showPopup && <InquiryPopup onClose={() => setShowPopup(false)} />}
      </AnimatePresence>
      <Navbar
        scrolled={scrolled}
        onBook={goToProducts}
        onLogin={goLogin}
        cartCount={cartCount}
        onCartOpen={openCart}
      />
      <HeroSection onBook={goToProducts} />
      <ProductSection onAddToCart={addToCart} onBookNow={bookNow} />
      <FeaturesSection />
      <BookingSection onBook={goToProducts} />
      <TestimonialsSection />
      <ContactSection />
      <Footer onLogin={goLogin} />
    </div>
  );
}
