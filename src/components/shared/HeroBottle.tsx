import Image from "next/image";

/** The large hero bottle image with a dramatic glow shadow. */
export function HeroBottle() {
  return (
    <Image
      src="/bottle.png"
      alt="GANNET Premium Natural Water Bottle"
      width={629}
      height={1477}
      priority
      style={{
        height: "100%",
        width: "auto",
        objectFit: "contain",
        filter:
          "drop-shadow(0 40px 80px rgba(0,0,0,0.45)) drop-shadow(0 0 60px rgba(13,110,253,0.25))",
      }}
    />
  );
}
