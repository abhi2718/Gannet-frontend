const DROPS = [
  { x: "8%", d: "4s", s: "1.4rem", del: "0s" },
  { x: "18%", d: "6s", s: "0.8rem", del: "1.2s" },
  { x: "28%", d: "5s", s: "1.1rem", del: "0.5s" },
  { x: "42%", d: "7s", s: "0.6rem", del: "2s" },
  { x: "55%", d: "4.5s", s: "1.6rem", del: "0.8s" },
  { x: "65%", d: "6s", s: "0.9rem", del: "1.8s" },
  { x: "74%", d: "5.5s", s: "1.2rem", del: "0.3s" },
  { x: "85%", d: "4s", s: "0.7rem", del: "1.5s" },
  { x: "92%", d: "6.5s", s: "1rem", del: "0.9s" },
  { x: "33%", d: "7s", s: "1.3rem", del: "2.4s" },
];

/** Decorative water droplets that float upward across a section. */
export function FloatingDroplets() {
  return (
    <>
      {DROPS.map((d, i) => (
        <div
          key={i}
          className="absolute bottom-0 rounded-full pointer-events-none"
          style={{
            left: d.x,
            width: d.s,
            height: d.s,
            background:
              "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.9), rgba(147,197,253,0.5))",
            animation: `floatUp ${d.d} ease-in infinite`,
            animationDelay: d.del,
          }}
        />
      ))}
    </>
  );
}
