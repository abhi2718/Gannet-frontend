"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { X, Loader2 } from "lucide-react";
import { useUpdateUser } from "@/lib/query/hooks/useUserMutations";
import { FieldError } from "@/components/shared/FieldError";
import { nameError, emailError, phoneError, sanitizePhone } from "@/lib/validation";
import type { User } from "@/types";

const STATUS_OPTIONS = ["active", "inactive"];

type Errors = { name?: string; email?: string; phone?: string; form?: string };

/** Admin modal to edit a user's name, email, phone and account status. */
export function UserEditModal({ user, onClose }: { user: User; onClose: () => void }) {
  const updateUser = useUpdateUser();
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone);
  const [status, setStatus] = useState(user.status);
  const [errors, setErrors] = useState<Errors>({});

  const save = async () => {
    const next: Errors = {};
    if (nameError(name)) next.name = nameError(name)!;
    if (emailError(email)) next.email = emailError(email)!;
    if (phoneError(phone)) next.phone = phoneError(phone)!;
    if (next.name || next.email || next.phone) {
      setErrors(next);
      return;
    }
    setErrors({});
    try {
      await updateUser.mutateAsync({
        id: user.id,
        input: {
          username: name.trim(),
          email: email.trim(),
          phoneNumber: phone.trim(),
          status,
        },
      });
      onClose();
    } catch (e) {
      setErrors({ form: e instanceof Error ? e.message : "Could not update the user. Try again." });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 24 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0 }}
        transition={{ type: "spring", stiffness: 320, damping: 28 }}
        className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-6 pt-6 pb-5 border-b flex items-center justify-between"
          style={{ borderColor: "rgba(13,110,253,0.08)" }}
        >
          <div>
            <span className="text-xs font-bold text-[#00B4D8] uppercase tracking-wider">
              Edit User
            </span>
            <h3 className="text-lg font-extrabold text-gray-900">{user.name}</h3>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-6 space-y-4">
          <div>
            <label htmlFor="edit-user-name" className="block text-xs font-semibold text-gray-500 mb-1">
              Name
            </label>
            <input
              id="edit-user-name"
              aria-invalid={!!errors.name}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setErrors((p) => ({ ...p, name: undefined, form: undefined }));
              }}
              className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
              style={{ background: "#F8FAFC", border: `1.5px solid ${errors.name ? "#EF4444" : "rgba(13,110,253,0.12)"}` }}
            />
            <FieldError message={errors.name} />
          </div>
          <div>
            <label htmlFor="edit-user-email" className="block text-xs font-semibold text-gray-500 mb-1">
              Email
            </label>
            <input
              id="edit-user-email"
              type="email"
              aria-invalid={!!errors.email}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setErrors((p) => ({ ...p, email: undefined, form: undefined }));
              }}
              className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
              style={{ background: "#F8FAFC", border: `1.5px solid ${errors.email ? "#EF4444" : "rgba(13,110,253,0.12)"}` }}
            />
            <FieldError message={errors.email} />
          </div>
          <div>
            <label htmlFor="edit-user-phone" className="block text-xs font-semibold text-gray-500 mb-1">
              Phone
            </label>
            <input
              id="edit-user-phone"
              type="tel"
              inputMode="numeric"
              aria-invalid={!!errors.phone}
              value={phone}
              onChange={(e) => {
                setPhone(sanitizePhone(e.target.value));
                setErrors((p) => ({ ...p, phone: undefined, form: undefined }));
              }}
              className="w-full px-3 py-2.5 text-sm rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0D6EFD]"
              style={{ background: "#F8FAFC", border: `1.5px solid ${errors.phone ? "#EF4444" : "rgba(13,110,253,0.12)"}` }}
            />
            <FieldError message={errors.phone} />
          </div>
          <div>
            <label htmlFor="edit-user-status" className="block text-xs font-semibold text-gray-500 mb-1">
              Status
            </label>
            <select
              id="edit-user-status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2.5 text-sm rounded-xl bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#0D6EFD] capitalize"
              style={{ border: "1.5px solid rgba(13,110,253,0.12)" }}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </option>
              ))}
            </select>
          </div>
          {errors.form && <p className="text-xs text-red-500">{errors.form}</p>}
        </div>

        <div className="px-6 pb-6 flex gap-2">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={updateUser.isPending}
            className="flex-1 py-2.5 rounded-xl bg-[#0D6EFD] text-white text-sm font-bold hover:bg-blue-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {updateUser.isPending && <Loader2 size={14} className="animate-spin" />} Save Changes
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
