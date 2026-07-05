"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MapPin, Edit2, Trash2 } from "lucide-react";

type Address = {
  id: number;
  label: string;
  line: string;
  city: string;
  state: string;
  pin: string;
  default: boolean;
};

const ADDR_FIELDS = [
  { label: "Label", key: "label", placeholder: "Home / Office", col: 1 },
  { label: "Pin Code", key: "pin", placeholder: "400001", col: 1 },
  { label: "Street Address", key: "line", placeholder: "Building, street, area", col: 2 },
  { label: "City", key: "city", placeholder: "City", col: 1 },
  { label: "State", key: "state", placeholder: "State", col: 1 },
];

const INITIAL: Address[] = [
  {
    id: 1,
    label: "Home",
    line: "7 Juhu Beach Road",
    city: "Mumbai",
    state: "Maharashtra",
    pin: "400049",
    default: true,
  },
  {
    id: 2,
    label: "Office",
    line: "42 Nariman Point, Floor 8",
    city: "Mumbai",
    state: "Maharashtra",
    pin: "400021",
    default: false,
  },
];

export function ProfileAddresses() {
  const [addresses, setAddresses] = useState<Address[]>(INITIAL);
  const [editAddr, setEditAddr] = useState<Address | null>(null);
  const [addNew, setAddNew] = useState(false);
  const [newAddr, setNewAddr] = useState({ label: "", line: "", city: "", state: "", pin: "" });

  const saveAddress = () => {
    if (editAddr) {
      setAddresses((a) => a.map((x) => (x.id === editAddr.id ? editAddr : x)));
      setEditAddr(null);
    } else if (addNew) {
      setAddresses((a) => [...a, { ...newAddr, id: Date.now(), default: false }]);
      setNewAddr({ label: "", line: "", city: "", state: "", pin: "" });
      setAddNew(false);
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
          onClick={() => {
            setAddNew(true);
            setEditAddr(null);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#0D6EFD] transition-all hover:bg-blue-50"
          style={{ border: "1.5px solid rgba(13,110,253,0.2)" }}
        >
          + Add Address
        </button>
      </div>

      <div className="space-y-3">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className="flex items-start justify-between p-4 rounded-2xl group"
            style={{
              background: "#F0F9FF",
              border: addr.default ? "1.5px solid #0D6EFD" : "1.5px solid transparent",
            }}
          >
            <div className="flex items-start gap-3">
              <MapPin size={16} className="text-[#0D6EFD] mt-0.5 shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-bold text-gray-900 text-sm">{addr.label}</span>
                  {addr.default && (
                    <span className="text-xs font-bold text-[#0D6EFD] bg-blue-50 px-2 py-0.5 rounded-full">
                      Default
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {addr.line}, {addr.city}, {addr.state} – {addr.pin}
                </p>
              </div>
            </div>
            <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => {
                  setEditAddr({ ...addr });
                  setAddNew(false);
                }}
                aria-label="Edit address"
                className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-blue-100 transition-colors"
              >
                <Edit2 size={13} className="text-[#0D6EFD]" />
              </button>
              {!addr.default && (
                <button
                  onClick={() => setAddresses((a) => a.filter((x) => x.id !== addr.id))}
                  aria-label="Delete address"
                  className="w-8 h-8 rounded-lg bg-white flex items-center justify-center hover:bg-red-50 transition-colors"
                >
                  <Trash2 size={13} className="text-red-400" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {(editAddr || addNew) && (
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
                {editAddr ? "Edit Address" : "New Address"}
              </h4>
              <div className="grid grid-cols-2 gap-3">
                {ADDR_FIELDS.map((f) => (
                  <div key={f.key} className={f.col === 2 ? "col-span-2" : ""}>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">
                      {f.label}
                    </label>
                    <input
                      type="text"
                      placeholder={f.placeholder}
                      value={
                        editAddr
                          ? (editAddr as unknown as Record<string, string>)[f.key]
                          : (newAddr as Record<string, string>)[f.key]
                      }
                      onChange={(e) =>
                        editAddr
                          ? setEditAddr((a) => (a ? { ...a, [f.key]: e.target.value } : a))
                          : setNewAddr((a) => ({ ...a, [f.key]: e.target.value }))
                      }
                      className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
                      style={{ background: "white", border: "1.5px solid rgba(13,110,253,0.12)" }}
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={saveAddress}
                  className="flex-1 py-2.5 rounded-xl bg-[#0D6EFD] text-white text-sm font-bold hover:bg-blue-600 transition-colors"
                >
                  Save Address
                </button>
                <button
                  onClick={() => {
                    setEditAddr(null);
                    setAddNew(false);
                  }}
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
