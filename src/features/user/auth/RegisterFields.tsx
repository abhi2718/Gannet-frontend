"use client";

import { User, Phone, Mail, Lock } from "lucide-react";
import { AuthField } from "./AuthField";

export type RegisterValues = {
  name: string;
  phone: string;
  email: string;
  password: string;
  confirm: string;
};

export type RegisterFieldErrors = Partial<Record<keyof RegisterValues, string>>;

/** The five sign-up inputs. Presentational — RegisterPage owns the state. */
export function RegisterFields({
  values,
  errors,
  onChange,
}: {
  values: RegisterValues;
  errors: RegisterFieldErrors;
  onChange: (field: keyof RegisterValues, value: string) => void;
}) {
  return (
    <>
      <AuthField
        id="name"
        label="Full Name"
        icon={User}
        autoComplete="name"
        placeholder="Your name"
        value={values.name}
        error={errors.name}
        onChange={(v) => onChange("name", v)}
      />
      <AuthField
        id="phone"
        label="Phone Number"
        icon={Phone}
        type="tel"
        inputMode="numeric"
        autoComplete="tel"
        prefix="+91"
        maxLength={10}
        placeholder="XXXXX XXXXX"
        value={values.phone}
        error={errors.phone}
        onChange={(v) => onChange("phone", v)}
      />
      <AuthField
        id="email"
        label="Email"
        icon={Mail}
        type="email"
        inputMode="email"
        autoComplete="email"
        placeholder="you@example.com"
        value={values.email}
        error={errors.email}
        onChange={(v) => onChange("email", v)}
      />
      <AuthField
        id="password"
        label="Password"
        icon={Lock}
        type="password"
        autoComplete="new-password"
        placeholder="At least 6 chars, letters & numbers"
        value={values.password}
        error={errors.password}
        onChange={(v) => onChange("password", v)}
      />
      <AuthField
        id="confirm"
        label="Confirm Password"
        icon={Lock}
        type="password"
        autoComplete="new-password"
        placeholder="Re-enter your password"
        value={values.confirm}
        error={errors.confirm}
        onChange={(v) => onChange("confirm", v)}
      />
    </>
  );
}
