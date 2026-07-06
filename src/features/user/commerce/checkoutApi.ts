/**
 * Checkout data access: the saved-address list, saving a new address, and
 * placing an order. Wraps the shared fetch client and the central endpoint
 * paths so the checkout UI stays declarative.
 */
import { apiGetPaged, apiPost } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import type { Address, CartItem } from "@/types";

/** Address as returned by `GET/POST /api/addresses`. */
export type ApiAddress = {
  _id?: string;
  id?: string;
  label: string;
  street: string;
  pinCode: string;
  city: string;
  state: string;
  landmark?: string;
};

/** Map the API address shape onto the app's `Address`. */
export function toAddress(a: ApiAddress): Address {
  return {
    id: a._id ?? a.id ?? "",
    label: a.label,
    street: a.street,
    pinCode: a.pinCode,
    city: a.city,
    state: a.state,
    landmark: a.landmark,
  };
}

/** One line of a formatted address, e.g. "7 Juhu Rd, Mumbai, MH – 400049". */
export function formatAddress(a: Address): string {
  return `${a.street}, ${a.city}, ${a.state} – ${a.pinCode}`;
}

export type NewAddressInput = {
  label: string;
  street: string;
  pinCode: string;
  city: string;
  state: string;
  landmark?: string;
};

/** The current user's saved delivery addresses. */
export async function fetchAddresses(): Promise<Address[]> {
  const { data } = await apiGetPaged<ApiAddress>(endpoints.addresses);
  return data.map(toAddress);
}

/** Persist a new address for the current user and return it (with its id). */
export async function createAddress(input: NewAddressInput): Promise<Address> {
  const data = await apiPost<ApiAddress>(endpoints.addresses, input);
  return toAddress(data);
}

export type CreateOrderInput = {
  customerName: string;
  customerPhone: string;
  cartItems: CartItem[];
  addressId: string;
  /** Optional ISO date; the server defaults to now + 7 days when omitted. */
  estimatedDelivery?: string;
};

export type ApiOrderResult = {
  _id?: string;
  id?: string;
  orderId?: string;
  totalAmount?: number;
};

/** Place an order for the whole cart (one order, many item lines). */
export async function createOrder(input: CreateOrderInput): Promise<ApiOrderResult> {
  const body: Record<string, unknown> = {
    customerName: input.customerName,
    customerPhone: input.customerPhone,
    items: input.cartItems.map((i) => ({
      bottleSize: i.size,
      quantity: i.qty,
      amount: i.price,
    })),
    address: input.addressId,
  };
  if (input.estimatedDelivery) body.estimatedDelivery = input.estimatedDelivery;
  return apiPost<ApiOrderResult>(endpoints.orders, body);
}
