"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Edit2, Trash2, Loader2 } from "lucide-react";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/lib/query/hooks/useAddresses";
import { formatAddress } from "@/features/user/commerce/checkoutApi";
import type { Address } from "@/types";

const FIELDS = [
  { key: "label", label: "Label", placeholder: "Home / Office", col: 1, required: true },
  { key: "pinCode", label: "Pin Code", placeholder: "400001", col: 1, required: true },
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
type Form = typeof EMPTY;

export function ProfileAddresses() {
  const { data: addresses = [], isLoading } = useAddresses();
  const createAddr = useCreateAddress();
  const updateAddr = useUpdateAddress();
  const deleteAddr = useDeleteAddress();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<Form>(EMPTY);
  const [error, setError] = useState("");

  const showForm = adding || editingId !== null;
  const saving = createAddr.isPending || updateAddr.isPending;

  const openAdd = () => {
    setEditingId(null);
    setForm(EMPTY);
    setError("");
    setAdding(true);
  };
  const openEdit = (a: Address) => {
    setAdding(false);
    setEditingId(a.id);
    setError("");
    setForm({
      label: a.label,
      street: a.street,
      pinCode: a.pinCode,
      city: a.city,
      state: a.state,
      landmark: a.landmark ?? "",
    });
  };
  const closeForm = () => {
    setAdding(false);
    setEditingId(null);
    setError("");
  };

  const save = async () => {
    setError("");
    if (!form.label || !form.street || !form.pinCode || !form.city || !form.state) {
      setError("Please fill in the label, street, pin code, city and state.");
      return;
    }
    try {
      if (editingId) await updateAddr.mutateAsync({ id: editingId, input: form });
      else await createAddr.mutateAsync(form);
      closeForm();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not save the address. Try again.");
    }
  };

  return (
    <div
      className="bg-white rounded-3xl p-6 border"
      style={{
        borderColor: "rgba(13,110,253,0.08)",
        boxShadow: "0 2px 16px rgba(13,110,253,0.06)",
      }}
    >
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-extrabold text-gray-900">Delivery Addresses</h3>
        <button
          onClick={openAdd}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0D6EFD] transition-all hover:bg-blue-50"
          style={{ border: "1.5px solid rgba(13,110,253,0.2)" }}
        >
          + Add Address
        </button>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400 py-4">
          <Loader2 size={15} className="animate-spin" /> Loading addresses…
        </div>
      ) : (
        <div className="space-y-3">
          {addresses.map((addr) => (
            <div
              key={addr.id}
              className="flex items-start justify-between p-4 rounded-2xl group"
              style={{ background: "#F0F9FF", border: "1.5px solid transparent" }}
            >
              <div className="flex items-start gap-3">
                <MapPin size={16} className="text-[#0D6EFD] mt-0.5 shrink-0" />
                <div>
                  <span className="font-bold text-gray-900 text-sm">{addr.label}</span>
                  <p className="text-xs text-gray-500 leading-relaxed">{formatAddress(addr)}</p>
                </div>
              </div>
              <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => openEdit(addr)}
                  aria-label="Edit address"
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-blue-100 transition-colors"
                >
                  <Edit2 size={13} className="text-[#0D6EFD]" />
                </button>
                <button
                  onClick={() => deleteAddr.mutate(addr.id)}
                  aria-label="Delete address"
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} className="text-red-400" />
                </button>
              </div>
            </div>
          ))}
          {addresses.length === 0 && (
            <p className="text-sm text-gray-400 py-2">No saved addresses yet — add one below.</p>
          )}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div
              className="mt-4 p-4 rounded-2xl border"
              style={{ background: "#F8FAFC", borderColor: "rgba(13,110,253,0.12)" }}
            >
              <h4 className="font-bold text-gray-800 text-sm mb-4">
                {editingId ? "Edit Address" : "New Address"}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {FIELDS.map((f) => (
                  <div key={f.key} className={f.col === 2 ? "col-span-2" : ""}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      {f.label}
                    </label>
                    <input
                      type="text"
                      required={f.required}
                      placeholder={f.placeholder}
                      value={form[f.key]}
                      onChange={(e) => setForm((a) => ({ ...a, [f.key]: e.target.value }))}
                      className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
                      style={{ background: "white", border: "1.5px solid rgba(13,110,253,0.12)" }}
                    />
                  </div>
                ))}
              </div>
              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
              <div className="flex gap-2 mt-4">
                <button
                  onClick={save}
                  disabled={saving}
                  className="flex-1 py-2.5 rounded-xl bg-[#0D6EFD] text-white text-sm font-bold hover:bg-blue-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {saving && <Loader2 size={14} className="animate-spin" />} Save Address
                </button>
                <button
                  onClick={closeForm}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
