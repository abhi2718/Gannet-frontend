import type { LucideIcon } from "lucide-react";

/** A single line item in the shopping cart. */
export type CartItem = {
  size: string;
  label: string;
  price: number;
  qty: number;
};

/** One product line within a placed order (mirrors the API `items[]`). */
export type OrderItem = {
  size: string;
  qty: number;
  /** Per-unit price (optional on legacy/mock rows). */
  amount?: number;
};

/** A saved delivery address (`GET /api/addresses`). */
export type Address = {
  id: string;
  label: string;
  street: string;
  pinCode: string;
  city: string;
  state: string;
  landmark?: string;
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
  /** All product lines in the order (an order may hold several bottle sizes). */
  items: OrderItem[];
  /** Summary of `items`: first size (+ "N more") and total quantity. */
  size: string;
  qty: number;
  /** Order total (Σ item qty × amount). */
  total: number;
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

/** Platform totals for the admin overview stat tiles (`GET /api/analytics/summary`). */
export type AdminSummary = {
  totalOrders: number;
  pendingOrders: number;
  deliveredOrders: number;
  totalUsers: number;
};

/**
 * Order counts keyed by status (`GET /api/analytics/order-status`); every
 * status is present, missing ones reported as `0`.
 */
export type OrderStatusCounts = Record<string, number>;

/** An order shown in the customer's own dashboard. */
export type UserOrder = {
  id: string;
  /** All product lines in the order. */
  items: OrderItem[];
  /** Summary of `items`: first size (+ "N more") and total quantity. */
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
