"use client";

import { useEffect, useState } from "react";
import { MapPin, Plus, Check, Loader2 } from "lucide-react";
import { useAddresses, useCreateAddress } from "@/lib/query/hooks/useAddresses";
import { FieldError } from "@/components/shared/FieldError";
import { collectErrors, pinCodeError, requiredError } from "@/lib/validation";
import { formatAddress } from "./checkoutApi";
import type { Address } from "@/types";

type AddrErrors = Record<string, string | undefined>;

type AddressStepProps = {
  selectedId: string | null;
  onSelect: (address: Address) => void;
};

const FIELDS = [
  { key: "label", label: "Label", placeholder: "Home / Office", col: 1, required: true },
  { key: "pinCode", label: "PIN Code", placeholder: "400001", col: 1, required: true },
  {
    key: "street",
    label: "Street Address",
    placeholder: "Building, street, area",
    col: 2,
    required: true,
  },
  { key: "city", label: "City", placeholder: "City", col: 1, required: true },
  { key: "state", label: "State", placeholder: "State", col: 1, required: true },
  { key: "landmark", label: "Landmark (optional)", placeholder: "Near…", col: 2, required: false },
] as const;

const EMPTY = { label: "", street: "", pinCode: "", city: "", state: "", landmark: "" };

/** Saved-address selector with an inline "add new address" form. */
export function AddressStep({ selectedId, onSelect }: AddressStepProps) {
  const { data: addresses = [], isLoading } = useAddresses();
  const createAddress = useCreateAddress();
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState<AddrErrors>({});
  const [formError, setFormError] = useState("");

  // Pre-select the first saved address once they load and nothing is chosen yet.
  useEffect(() => {
    if (!selectedId && addresses.length > 0) onSelect(addresses[0]);
  }, [addresses, selectedId, onSelect]);

  const saveNew = async () => {
    setFormError("");
    const next = collectErrors(form as Record<string, string>, {
      label: (v) => requiredError(v, "Label"),
      pinCode: pinCodeError,
      street: (v) => requiredError(v, "Street address"),
      city: (v) => requiredError(v, "City"),
      state: (v) => requiredError(v, "State"),
    });
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    try {
      const created = await createAddress.mutateAsync(form);
      onSelect(created);
      setForm(EMPTY);
      setAdding(false);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "Could not save address");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label className="block text-xs font-bold text-gray-600 uppercase tracking-wider">
          Delivery Address
        </label>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1 text-xs font-bold text-[#0D6EFD] hover:underline"
          >
            <Plus size={13} /> Add new
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
          <Loader2 size={15} className="animate-spin" /> Loading addresses…
        </div>
      ) : (
        <div className="space-y-2">
          {addresses.map((addr) => {
            const active = addr.id === selectedId;
            return (
              <button
                type="button"
                key={addr.id}
                onClick={() => onSelect(addr)}
                aria-pressed={active}
                className="w-full flex items-start gap-3 p-3.5 rounded-2xl text-left transition-all"
                style={{
                  background: "#F0F9FF",
                  border: active ? "1.5px solid #0D6EFD" : "1.5px solid transparent",
                }}
              >
                <MapPin size={16} className="text-[#0D6EFD] mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-gray-900 text-sm">{addr.label}</span>
                    {active && (
                      <span className="flex items-center gap-0.5 text-[10px] font-bold text-[#0D6EFD]">
                        <Check size={11} /> Selected
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">{formatAddress(addr)}</p>
                </div>
              </button>
            );
          })}
          {addresses.length === 0 && !adding && (
            <p className="text-sm text-gray-400 py-2">
              No saved addresses yet — add one to continue.
            </p>
          )}
        </div>
      )}

      {adding && (
        <div
          className="mt-3 p-4 rounded-2xl border"
          style={{ background: "#F8FAFC", borderColor: "rgba(13,110,253,0.12)" }}
        >
          <h4 className="font-bold text-gray-800 text-sm mb-3">New Address</h4>
          <div className="grid grid-cols-2 gap-3">
            {FIELDS.map((f) => (
              <div key={f.key} className={f.col === 2 ? "col-span-2" : ""}>
                <input
                  type="text"
                  aria-label={f.label}
                  aria-invalid={!!errors[f.key]}
                  placeholder={f.placeholder}
                  value={(form as Record<string, string>)[f.key]}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, [f.key]: e.target.value }));
                    setErrors((p) => ({ ...p, [f.key]: undefined }));
                    setFormError("");
                  }}
                  className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
                  style={{ background: "white", border: `1.5px solid ${errors[f.key] ? "#EF4444" : "rgba(13,110,253,0.12)"}` }}
                />
                <FieldError message={errors[f.key]} />
              </div>
            ))}
          </div>
          {formError && <p className="text-xs text-red-500 mt-2">{formError}</p>}
          <div className="flex gap-2 mt-3">
            <button
              type="button"
              onClick={saveNew}
              disabled={createAddress.isPending}
              className="flex-1 py-2.5 rounded-xl bg-[#0D6EFD] text-white text-sm font-bold hover:bg-blue-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {createAddress.isPending && <Loader2 size={14} className="animate-spin" />}
              Save Address
            </button>
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setErrors({});
                setFormError("");
              }}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
