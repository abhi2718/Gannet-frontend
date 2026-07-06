"use client";

import { useState } from "react";
import { AnimatePresence } from "motion/react";
import { MapPin, Edit2, Trash2, Loader2 } from "lucide-react";
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
} from "@/lib/query/hooks/useAddresses";
import { formatAddress } from "@/features/user/commerce/checkoutApi";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import type { Address } from "@/types";
import { AddressForm, type AddressFormValues } from "./AddressForm";

const EMPTY: AddressFormValues = {
  label: "",
  street: "",
  pinCode: "",
  city: "",
  state: "",
  landmark: "",
};

export function ProfileAddresses() {
  const { data: addresses = [], isLoading } = useAddresses();
  const createAddr = useCreateAddress();
  const updateAddr = useUpdateAddress();
  const deleteAddr = useDeleteAddress();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<AddressFormValues>(EMPTY);
  const [error, setError] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<Address | null>(null);

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

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    await deleteAddr.mutateAsync(deleteTarget.id);
    setDeleteTarget(null);
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
                  onClick={() => setDeleteTarget(addr)}
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
          <AddressForm
            editing={editingId !== null}
            values={form}
            onChange={(key, value) => setForm((a) => ({ ...a, [key]: value }))}
            error={error}
            saving={saving}
            onSave={save}
            onCancel={closeForm}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <ConfirmDialog
            title="Delete address"
            message={`Remove the "${deleteTarget.label}" address? This can't be undone.`}
            loading={deleteAddr.isPending}
            onConfirm={confirmDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
