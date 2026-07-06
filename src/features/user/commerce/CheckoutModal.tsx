"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X, CheckCircle, Loader2 } from "lucide-react";
import type { Address, CartItem } from "@/types";
import { useCreateOrder } from "@/lib/query/hooks/useAddresses";
import { FieldError } from "@/components/shared/FieldError";
import { nameError } from "@/lib/validation";
import { AddressStep } from "./AddressStep";
import { CheckoutSuccess } from "./CheckoutSuccess";

type CheckoutModalProps = {
  cartItems: CartItem[];
  userName: string;
  userPhone: string;
  onClose: () => void;
  onDone: () => void;
};

const fieldStyle = { background: "#F0F9FF", border: "1.5px solid transparent" };
const fieldClass =
  "w-full px-4 py-3.5 text-sm rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]";
const labelClass = "block text-xs font-bold text-gray-600 mb-1.5 uppercase tracking-wider";

export function CheckoutModal({
  cartItems,
  userName,
  userPhone,
  onClose,
  onDone,
}: CheckoutModalProps) {
  const [name, setName] = useState(userName);
  const [address, setAddress] = useState<Address | null>(null);
  const [date, setDate] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [nameErr, setNameErr] = useState("");
  const [error, setError] = useState("");
  const createOrder = useCreateOrder();

  const total = cartItems.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cartItems.reduce((s, i) => s + i.qty, 0);

  const placeOrder = async () => {
    setError("");
    const nErr = nameError(name);
    if (nErr) {
      setNameErr(nErr);
      return;
    }
    if (!address) {
      setError("Please select or add a delivery address.");
      return;
    }
    try {
      await createOrder.mutateAsync({
        customerName: name,
        customerPhone: userPhone,
        cartItems,
        addressId: address.id,
        estimatedDelivery: date || undefined,
      });
      setConfirmed(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not place your order. Try again.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.88, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-lg relative overflow-hidden flex flex-col"
        style={{ maxHeight: "90vh" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-7 pt-6 pb-5 border-b flex items-center justify-between shrink-0"
          style={{ borderColor: "rgba(13,110,253,0.08)" }}
        >
          <div>
            <h2 className="text-xl font-extrabold text-gray-900">
              {confirmed ? "Order Confirmed!" : "Delivery Details"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
              <CheckCircle size={11} className="text-green-400" /> Signed in as +91 {userPhone}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-7 py-6">
          {confirmed ? (
            <CheckoutSuccess
              cartItems={cartItems}
              name={name}
              city={address?.city ?? ""}
              date={date}
              count={count}
              total={total}
              onDone={onDone}
            />
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                placeOrder();
              }}
            >
              <div className="rounded-2xl p-4 mb-6" style={{ background: "#F0F9FF" }}>
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  Your Order ({count} items)
                </div>
                <div className="space-y-1.5">
                  {cartItems.map((item) => (
                    <div key={item.size} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.qty}× GANNET {item.size}
                      </span>
                      <span className="font-semibold text-gray-900">₹{item.price * item.qty}</span>
                    </div>
                  ))}
                  <div
                    className="flex justify-between text-sm pt-2 border-t mt-1"
                    style={{ borderColor: "rgba(13,110,253,0.1)" }}
                  >
                    <span className="font-bold text-gray-700">Total</span>
                    <span className="font-extrabold text-[#0D6EFD]">₹{total}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input
                    type="text"
                    aria-label="Full Name"
                    aria-invalid={!!nameErr}
                    placeholder="Your full name"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      setNameErr("");
                    }}
                    className={fieldClass}
                    style={{ ...fieldStyle, border: `1.5px solid ${nameErr ? "#EF4444" : "transparent"}` }}
                  />
                  <FieldError message={nameErr} />
                </div>

                <AddressStep selectedId={address?.id ?? null} onSelect={setAddress} />

                <div>
                  <label className={labelClass}>Preferred Delivery Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={fieldClass}
                    style={fieldStyle}
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500 mt-4">{error}</p>}

              <button
                type="submit"
                disabled={createOrder.isPending || !address}
                className="w-full py-4 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2 transition-all hover:scale-[1.02] mt-6 disabled:opacity-60 disabled:hover:scale-100"
                style={{
                  background: "linear-gradient(135deg, #0D6EFD, #00B4D8)",
                  boxShadow: "0 8px 32px rgba(13,110,253,0.3)",
                }}
              >
                {createOrder.isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Placing Order…
                  </>
                ) : (
                  <>
                    <CheckCircle size={16} /> Place Order
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
