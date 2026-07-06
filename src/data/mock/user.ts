import type { UserOrder } from "@/types";

// Compact rows; each single-line order's `items[]` is derived below.
const RAW_USER_ORDERS = [
  {
    id: "ORD-2419",
    size: "500 ml",
    qty: 12,
    date: "2024-01-18",
    delivery: "2024-01-19",
    address: "7 Juhu Beach Road, Mumbai",
    status: "out-for-delivery",
    total: 216,
  },
  {
    id: "ORD-2403",
    size: "2 Litre",
    qty: 6,
    date: "2024-01-17",
    delivery: "2024-01-20",
    address: "7 Juhu Beach Road, Mumbai",
    status: "confirmed",
    total: 330,
  },
  {
    id: "ORD-2414",
    size: "500 ml",
    qty: 24,
    date: "2024-01-10",
    delivery: "2024-01-12",
    address: "7 Juhu Beach Road, Mumbai",
    status: "delivered",
    total: 432,
  },
  {
    id: "ORD-2398",
    size: "1 Litre",
    qty: 12,
    date: "2023-12-28",
    delivery: "2023-12-30",
    address: "7 Juhu Beach Road, Mumbai",
    status: "delivered",
    total: 384,
  },
  {
    id: "ORD-2381",
    size: "250 ml",
    qty: 48,
    date: "2023-12-15",
    delivery: "2023-12-17",
    address: "7 Juhu Beach Road, Mumbai",
    status: "delivered",
    total: 480,
  },
  {
    id: "ORD-2365",
    size: "2 Litre",
    qty: 4,
    date: "2023-11-30",
    delivery: "2023-12-02",
    address: "7 Juhu Beach Road, Mumbai",
    status: "delivered",
    total: 220,
  },
  {
    id: "ORD-2350",
    size: "500 ml",
    qty: 18,
    date: "2023-11-18",
    delivery: "2023-11-20",
    address: "7 Juhu Beach Road, Mumbai",
    status: "delivered",
    total: 324,
  },
  {
    id: "ORD-2334",
    size: "1 Litre",
    qty: 6,
    date: "2023-11-05",
    delivery: "2023-11-07",
    address: "7 Juhu Beach Road, Mumbai",
    status: "cancelled",
    total: 192,
  },
  {
    id: "ORD-2318",
    size: "250 ml",
    qty: 24,
    date: "2023-10-22",
    delivery: "2023-10-24",
    address: "7 Juhu Beach Road, Mumbai",
    status: "delivered",
    total: 240,
  },
  {
    id: "ORD-2301",
    size: "500 ml",
    qty: 12,
    date: "2023-10-08",
    delivery: "2023-10-10",
    address: "7 Juhu Beach Road, Mumbai",
    status: "delivered",
    total: 216,
  },
];

export const USER_ORDERS: UserOrder[] = RAW_USER_ORDERS.map((o) => ({
  ...o,
  items: [{ size: o.size, qty: o.qty, amount: o.total / o.qty }],
}));

export const TRACK_STEPS = ["Order Placed", "Confirmed", "Out for Delivery", "Delivered"];

export const statusToStep: Record<string, number> = {
  pending: 0,
  confirmed: 1,
  "out-for-delivery": 2,
  delivered: 3,
  cancelled: -1,
};

export const ORDERS_PER_PAGE = 4;
