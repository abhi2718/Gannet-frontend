import type { SlideTheme } from "@/types";

/** Animated gradient background behind each hero slide, keyed by theme. */
export function SlideScene({ theme }: { theme: SlideTheme }) {
  if (theme === "deep")
    return (
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(150deg, #060E24 0%, #0D2B6E 35%, #1565C0 65%, #0EA5E9 100%)",
        }}
      >
        <svg
          className="absolute bottom-0 left-0 w-full"
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
          fill="none"
        >
          <path
            d="M0,300 L0,220 L180,80 L340,200 L500,60 L680,190 L840,30 L1020,170 L1180,50 L1360,180 L1440,120 L1440,300 Z"
            fill="rgba(5,20,60,0.6)"
          />
          <path
            d="M0,300 L0,260 L200,140 L380,240 L560,120 L760,230 L940,110 L1120,220 L1300,130 L1440,200 L1440,300 Z"
            fill="rgba(8,30,80,0.8)"
          />
        </svg>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full bg-white"
            style={{
              width: 2,
              height: 2,
              top: `${Math.sin(i * 17.3) * 40 + 5}%`,
              left: `${(i * 5.1) % 95}%`,
              opacity: 0.4 + (i % 3) * 0.2,
            }}
          />
        ))}
      </div>
    );

  if (theme === "ocean")
    return (
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #003366 0%, #0066CC 40%, #00B4D8 75%, #7DD3FC 100%)",
        }}
      >
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 1440 900"
          preserveAspectRatio="none"
        >
          {[...Array(8)].map((_, i) => (
            <line
              key={i}
              x1={720 + (i - 3.5) * 60}
              y1="0"
              x2={720 + (i - 3.5) * 300}
              y2="900"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="60"
            />
          ))}
        </svg>
        {[...Array(14)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full border border-white/30"
            style={{
              width: 6 + (i % 4) * 6,
              height: 6 + (i % 4) * 6,
              bottom: `${(i * 7.3) % 60}%`,
              left: `${(i * 6.5 + 5) % 90}%`,
              animation: `floatUp ${4 + (i % 4)}s ease-in infinite`,
              animationDelay: `${(i * 0.7) % 4}s`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>
    );

  return (
    <div
      className="absolute inset-0"
      style={{
        background: "linear-gradient(135deg, #EAF6FF 0%, #DBEAFE 40%, #BAE6FD 70%, #E0F2FE 100%)",
      }}
    >
      <div
        className="absolute top-[-10%] right-[-5%] w-96 h-96 rounded-full opacity-30"
        style={{ background: "radial-gradient(circle, #0D6EFD 0%, transparent 70%)" }}
      />
      <div
        className="absolute bottom-[-10%] left-[-5%] w-80 h-80 rounded-full opacity-20"
        style={{ background: "radial-gradient(circle, #00B4D8 0%, transparent 70%)" }}
      />
      {[120, 200, 280, 360].map((r, i) => (
        <div
          key={i}
          className="absolute left-1/2 top-1/2 rounded-full border border-blue-200/50"
          style={{
            width: r,
            height: r,
            marginLeft: -r / 2,
            marginTop: -r / 2,
            animation: `rippleRing 4s ease-out ${i * 0.8}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
