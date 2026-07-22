import { GannetBirdIcon } from "./GannetBirdIcon";

type BrandLockupSize = "sm" | "lg";

type BrandLockupProps = {
  size?: BrandLockupSize;
  companyColor?: string;
  wordmarkColor?: string;
  taglineColor?: string;
  className?: string;
  isLoginScreen?: boolean;
};

const SIZES: Record<
  BrandLockupSize,
  {
    icon: number;
    gap: string;
    company: string;
    wordmark: string;
    tm: string;
    tagline: string;
  }
> = {
  sm: {
    icon: 40,
    gap: "gap-2.5",
    company: "text-[8px] tracking-[0.3em]",
    wordmark: "text-lg tracking-[0.05em]",
    tm: "text-[9px]",
    tagline: "text-[7px] tracking-[0.22em]",
  },
  lg: {
    icon: 80,
    gap: "gap-3",
    company: "text-[10px] tracking-[0.22em]",
    wordmark: "text-[26px] tracking-[0.22em]",
    tm: "text-[9px]",
    tagline: "text-[10px] tracking-[0.22em]",
  },
};

/** The GANNET brand lockup: bird mark + "Atul Vitrified Company" / "GANNET" /
 *  "PURE · REFRESHING · NATURAL", used in the navbar, footer, and login panel. */
export function BrandLockup({
  size = "sm",
  companyColor = "rgba(255,255,255,0.65)",
  wordmarkColor = "#ffffff",
  taglineColor = "#60A5FA",
  className = "",
  isLoginScreen,
}: BrandLockupProps) {
  const s = SIZES[size];
  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      <GannetBirdIcon width={100} height={100} />
      <div className="flex flex-col items-start leading-none">
        <span
          className={`font-bold uppercase transition-colors duration-300 ${s.company}`}
          style={{ color: companyColor }}
        >
          Atul Vitrified Company
        </span>
        <div className="flex items-start gap-0.5 mt-0.5">
          <span
            className={`font-wordmark transition-colors duration-300 ${s.wordmark}`}
            style={{ color: wordmarkColor, marginTop: isLoginScreen ? 10 : 0.5 }}
          >
            GANNET<sup>™</sup>
          </span>
        </div>
        <span
          className={`font-semibold uppercase transition-colors duration-300 mt-0.5 ${s.tagline}`}
          style={{ color: taglineColor, marginTop: isLoginScreen ? 10 : 0.5 }}
        >
          PURE · REFRESHING · NATURAL
        </span>
      </div>
    </div>
  );
}
