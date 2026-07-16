import type { Product } from "@/types";

export const PRODUCTS: Product[] = [
  {
    size: "250 ml",
    label: "On-The-Go",
    desc: "Perfect for travel, offices, and personal use. Stay hydrated anywhere.",
  },
  {
    size: "500 ml",
    label: "Classic",
    desc: "Our best-selling size — ideal for daily hydration at home or on the move.",
  },
  {
    size: "1 Litre",
    label: "Family",
    desc: "Great for family meals, fitness sessions, and long days outdoors.",
  },
  {
    size: "2 Litre",
    label: "Premium",
    desc: "Maximum value for households, events, and bulk requirements.",
  },
];

export const BOTTLE_PRICES: Record<string, number> = {
  "250 ml": 8,
  "500 ml": 10,
  "1 Litre": 20,
  "2 Litre": 30,
};
