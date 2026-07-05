import Image from "next/image";

/** The product bottle image, sized to a fixed height with the brand drop-shadow. */
export function WaterBottle({ size, height = 220 }: { size: string; height?: number }) {
  return (
    <div className="relative mx-auto flex flex-col items-center" style={{ height }}>
      <Image
        src="/bottle.png"
        alt={`GANNET ${size} Premium Natural Water Bottle`}
        width={629}
        height={1477}
        priority
        style={{
          height: "100%",
          width: "auto",
          objectFit: "contain",
          filter:
            "drop-shadow(0 12px 28px rgba(13,71,161,0.28)) drop-shadow(0 4px 8px rgba(0,0,0,0.12))",
        }}
      />
    </div>
  );
}
