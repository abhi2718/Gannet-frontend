/** The GANNET brand logo mark. Scales to fill its (usually square) container
 *  while preserving the artwork's aspect ratio. */
import Image from "next/image";
export function GannetBirdIcon() {
  return (
    <Image
      src="/logo.svg"
      alt="GANNET logo"
      width={100}
      height={80}    
    />
  );
}
