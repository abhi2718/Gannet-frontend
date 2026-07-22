import { GannetBirdIcon } from "./GannetBirdIcon";

type BrandLockupSize = "sm" | "lg";

type BrandLockupProps = {
  size?: BrandLockupSize;
  companyColor?: string;
  wordmarkColor?: string;
  taglineColor?: string;
  className?: string;
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
    icon: 92,
    gap: "gap-5",
    company: "text-sm tracking-[0.4em]",
    wordmark: "text-6xl tracking-[0.05em]",
    tm: "text-xl",
    tagline: "text-base tracking-[0.35em]",
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
}: BrandLockupProps) {
  const s = SIZES[size];
  return (
    <div className={`flex items-center ${s.gap} ${className}`}>
      <GannetBirdIcon width={s.icon} height={(s.icon * 4) / 5} />
      <div className="flex flex-col items-start leading-none">
        <span
          className={`font-bold uppercase transition-colors duration-300 ${s.company}`}
          style={{ color: companyColor }}
        >
          Atul Vitrified Company
        </span>
        <div className="flex items-start gap-1 mt-1.5">
          <span
            className={`font-wordmark transition-colors duration-300 ${s.wordmark}`}
            style={{ color: wordmarkColor }}
          >
            GANNET
          </span>
          <span
            className={`font-bold mt-0.5 transition-colors duration-300 ${s.tm}`}
            style={{ color: wordmarkColor }}
          >
            ™
          </span>
        </div>
        <span
          className={`font-semibold uppercase transition-colors duration-300 mt-1.5 ${s.tagline}`}
          style={{ color: taglineColor }}
        >
          PURE · REFRESHING · NATURAL
        </span>
      </div>
    </div>
  );
}
