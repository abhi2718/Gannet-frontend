"use client";

import { motion } from "motion/react";
import { Loader2 } from "lucide-react";
import { FieldError } from "@/components/shared/FieldError";
import { pinCodeError, requiredError } from "@/lib/validation";

export type AddressFormValues = {
  label: string;
  street: string;
  pinCode: string;
  city: string;
  state: string;
  landmark: string;
};

export type AddressErrors = Partial<Record<keyof AddressFormValues, string>>;

const FIELDS: {
  key: keyof AddressFormValues;
  label: string;
  placeholder: string;
  col: number;
  validate?: (v: string) => string | null;
}[] = [
  { key: "label", label: "Label", placeholder: "Home / Office", col: 1, validate: (v) => requiredError(v, "Label") }, // prettier-ignore
  { key: "pinCode", label: "Pin Code", placeholder: "400001", col: 1, validate: pinCodeError },
  { key: "street", label: "Street Address", placeholder: "Building, street, area", col: 2, validate: (v) => requiredError(v, "Street address") }, // prettier-ignore
  { key: "city", label: "City", placeholder: "City", col: 1, validate: (v) => requiredError(v, "City") }, // prettier-ignore
  { key: "state", label: "State", placeholder: "State", col: 1, validate: (v) => requiredError(v, "State") }, // prettier-ignore
  { key: "landmark", label: "Landmark (optional)", placeholder: "Near…", col: 2 },
];

/** Validates the address form, returning only the fields that failed. */
export function validateAddress(values: AddressFormValues): AddressErrors {
  const errors: AddressErrors = {};
  for (const f of FIELDS) {
    const msg = f.validate?.(values[f.key]);
    if (msg) errors[f.key] = msg;
  }
  return errors;
}

/** The add/edit address form body — presentational; ProfileAddresses owns state. */
export function AddressForm({
  editing,
  values,
  errors,
  formError,
  onChange,
  saving,
  onSave,
  onCancel,
}: {
  editing: boolean;
  values: AddressFormValues;
  errors: AddressErrors;
  formError?: string;
  onChange: (key: keyof AddressFormValues, value: string) => void;
  saving: boolean;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
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
          {editing ? "Edit Address" : "New Address"}
        </h4>
        <div className="grid grid-cols-2 gap-3">
          {FIELDS.map((f) => (
            <div key={f.key} className={f.col === 2 ? "col-span-2" : ""}>
              <label className="block text-xs font-semibold text-gray-500 mb-1">{f.label}</label>
              <input
                type="text"
                aria-label={f.label}
                aria-invalid={!!errors[f.key]}
                placeholder={f.placeholder}
                value={values[f.key]}
                onChange={(e) => onChange(f.key, e.target.value)}
                className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
                style={{ background: "white", border: `1.5px solid ${errors[f.key] ? "#EF4444" : "rgba(13,110,253,0.12)"}` }}
              />
              <FieldError message={errors[f.key]} />
            </div>
          ))}
        </div>
        {formError && <p className="text-xs text-red-500 mt-2">{formError}</p>}
        <div className="flex gap-2 mt-4">
          <button
            onClick={onSave}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-[#0D6EFD] text-white text-sm font-bold hover:bg-blue-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {saving && <Loader2 size={14} className="animate-spin" />} Save Address
          </button>
          <button
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </motion.div>
  );
}
