import type { MutableRefObject } from "react";

type OtpBoxesProps = {
  otp: string[];
  refs: MutableRefObject<(HTMLInputElement | null)[]>;
  onChange: (idx: number, val: string) => void;
  onKeyDown: (idx: number, e: React.KeyboardEvent) => void;
};

/** Presentational row of six single-digit OTP inputs. */
export function OtpBoxes({ otp, refs, onChange, onKeyDown }: OtpBoxesProps) {
  return (
    <div className="flex gap-2 justify-between mb-2">
      {otp.map((digit, idx) => (
        <input
          key={idx}
          ref={(el) => {
            refs.current[idx] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          aria-label={`OTP digit ${idx + 1}`}
          value={digit}
          onChange={(e) => onChange(idx, e.target.value)}
          onKeyDown={(e) => onKeyDown(idx, e)}
          className="w-12 h-14 text-center text-xl font-extrabold rounded-2xl focus:outline-none transition-all"
          style={{
            background: digit ? "#EFF6FF" : "#F9FAFB",
            border: `2px solid ${digit ? "#0D6EFD" : "#E5E7EB"}`,
          }}
        />
      ))}
    </div>
  );
}
