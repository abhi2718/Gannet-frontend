import {
  Mountain,
  Shield,
  Droplets,
  Package,
  Recycle,
  Truck,
  Award,
  Users,
  ClipboardList,
  CheckCircle,
  Home,
  Instagram,
  Facebook,
  Twitter,
} from "lucide-react";
import type { Feature, Slide, Step, Testimonial } from "@/types";

export const NAV = ["Home", "Products", "Why GANNET", "How It Works", "Testimonials", "Contact"];

export const SOCIALS = [
  { icon: Instagram, label: "Instagram", href: "https://www.instagram.com/mygannet2301/" },
  { icon: Facebook, label: "Facebook", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

export const SLIDES: Slide[] = [
  {
    tag: "Mountain Spring Water",
    h1: "Pure Refreshment.",
    h2: "Naturally.",
    sub: "Pure natural drinking water sourced from pristine mountain springs, purified to deliver freshness in every sip.",
    theme: "deep",
    bg: "https://images.unsplash.com/photo-1777362994269-ccee365fe653?w=1600&h=900&fit=crop&auto=format",
    overlay:
      "linear-gradient(135deg, rgba(6,14,36,0.72) 0%, rgba(13,43,110,0.55) 50%, rgba(0,100,180,0.3) 100%)",
  },
  {
    tag: "Crystal Clear Purity",
    h1: "Nature's Finest",
    h2: "In Every Drop.",
    sub: "Multi-stage purification ensures every bottle meets the highest standards of mineral balance and taste.",
    theme: "ocean",
    bg: "https://images.unsplash.com/photo-1484291470158-b8f8d608850d?w=1600&h=900&fit=crop&auto=format",
    overlay:
      "linear-gradient(135deg, rgba(0,30,80,0.75) 0%, rgba(13,110,253,0.45) 55%, rgba(0,180,216,0.25) 100%)",
  },
  {
    tag: "Pure from Nature",
    h1: "Hydrate Your",
    h2: "Best Life.",
    sub: "Sourced from lush natural springs, every drop of GANNET water carries the freshness of untouched wilderness.",
    theme: "sky",
    bg: "https://images.unsplash.com/photo-1771223832337-0773a7d7f34a?w=1600&h=900&fit=crop&auto=format",
    overlay:
      "linear-gradient(135deg, rgba(5,25,50,0.7) 0%, rgba(13,80,140,0.5) 50%, rgba(0,150,100,0.25) 100%)",
  },
];

export const FEATURES: Feature[] = [
  {
    icon: Mountain,
    title: "Naturally Sourced",
    desc: "Drawn from pristine mountain springs at peak purity.",
  },
  {
    icon: Shield,
    title: "Multi-Stage Purification",
    desc: "Advanced filtration removes all impurities safely.",
  },
  {
    icon: Droplets,
    title: "Mineral Balanced",
    desc: "Optimal mineral content for health and taste.",
  },
  {
    icon: Package,
    title: "Hygienic Packaging",
    desc: "Sealed in sterile conditions for maximum safety.",
  },
  {
    icon: Recycle,
    title: "Recyclable Bottles",
    desc: "Eco-conscious packaging for a greener future.",
  },
  {
    icon: Truck,
    title: "Fast Home Delivery",
    desc: "Quick and reliable delivery to your doorstep.",
  },
  { icon: Award, title: "Premium Quality", desc: "Internationally certified quality standards." },
  {
    icon: Users,
    title: "Trusted by Hotels",
    desc: "Preferred partner of leading hospitality brands.",
  },
];

export const STEPS: Step[] = [
  {
    icon: Package,
    step: "01",
    title: "Choose Bottle Size",
    desc: "Select from 250 ml, 500 ml, 1 L, or 2 L to match your needs.",
  },
  {
    icon: ClipboardList,
    step: "02",
    title: "Fill Booking Details",
    desc: "Enter your name, address, and delivery preferences.",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Confirm Order",
    desc: "Review your selection and confirm with a single click.",
  },
  {
    icon: Home,
    step: "04",
    title: "Home Delivery",
    desc: "Fresh GANNET water delivered right to your door.",
  },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Sonu",
    location: "Ramnagar Varansi",
    rating: 5,
    review:
      "Every drop reflects our commitment to purity, quality, and trust. Stay refreshed. Stay naturally better.",
    photo:
      "sonu-review.jpeg",
  },
  {
    name: "Priya Sharma",
    location: "Delhi",
    rating: 5,
    review:
      "We switched our entire office to GANNET and the team absolutely loves it. Quality is outstanding and packaging feels genuinely premium.",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&h=120&fit=crop&auto=format",
  },
  {
    name: "Rohan Kapoor",
    location: "Bangalore",
    rating: 5,
    review:
      "As a hotel manager I need the best for our guests. GANNET delivers exactly that — premium water, elegant packaging, and reliable service.",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&h=120&fit=crop&auto=format",
  },
  {
    name: "Sneha Iyer",
    location: "Chennai",
    rating: 5,
    review:
      "My nutritionist recommended GANNET for its perfect mineral balance. I can genuinely feel the difference in my energy levels and skin.",
    photo:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&h=120&fit=crop&auto=format",
  },
];
