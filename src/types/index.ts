import type { LucideIcon } from "lucide-react";

/** A single line item in the shopping cart. */
export type CartItem = {
  size: string;
  label: string;
  price: number;
  qty: number;
};

/** Hero carousel slide. */
export type Slide = {
  tag: string;
  h1: string;
  h2: string;
  sub: string;
  theme: SlideTheme;
  bg: string;
  overlay: string;
};

export type SlideTheme = "deep" | "ocean" | "sky";

/** A purchasable bottle size shown on the landing page (static fallback data). */
export type Product = {
  size: string;
  label: string;
  desc: string;
};

/**
 * A product for the "Choose Your Perfect Size" grid, normalised from the API
 * (`GET /api/products`) or from the static fallback lineup.
 */
export type CatalogProduct = {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  /** Optional badge (e.g. the static lineup's "Classic"); absent for API rows. */
  tag?: string;
};

/** Marketing feature / "why us" tile. */
export type Feature = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

/** "How it works" step. */
export type Step = {
  icon: LucideIcon;
  step: string;
  title: string;
  desc: string;
};

/** Customer testimonial. */
export type Testimonial = {
  name: string;
  location: string;
  rating: number;
  review: string;
  photo: string;
};

/** Inbound sales enquiry shown in the admin dashboard. */
export type Query = {
  id: string;
  name: string;
  mobile: string;
  email: string;
  city: string;
  requirement: string;
  status: string;
  date: string;
  /** Full enquiry message (from the API; not shown in the summary table). */
  message?: string;
};

/** Order record shown in the admin dashboard. */
export type AdminOrder = {
  id: string;
  customer: string;
  phone: string;
  address: string;
  size: string;
  qty: number;
  date: string;
  status: string;
};

/** Registered customer shown in the admin dashboard. */
export type User = {
  id: string;
  name: string;
  email: string;
  city: string;
  phone: string;
  joined: string;
  orders: number;
  status: string;
};

/** A single point in the admin analytics charts. */
export type ChartPoint = {
  month: string;
  orders: number;
  queries: number;
};

/** An order shown in the customer's own dashboard. */
export type UserOrder = {
  id: string;
  size: string;
  qty: number;
  date: string;
  delivery: string;
  address: string;
  status: string;
  total: number;
};

/** Tabs available in the admin dashboard. */
export type DashTab = "overview" | "queries" | "orders" | "users";

/** Views available in the customer's own dashboard. */
export type UserDashView = "home" | "profile" | "order-history";
