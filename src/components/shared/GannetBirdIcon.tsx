/** The GANNET brand logo mark. Scales to fill its (usually square) container
 *  while preserving the artwork's aspect ratio. */
import Image from "next/image";
export function GannetBirdIcon() {
  return (
    <Image
      src="/logo.svg"
      alt="GANNET logo"
      width={80}
      height={60}
      className="w-4/5 h-4/5 object-contain"
    />
  );
}
