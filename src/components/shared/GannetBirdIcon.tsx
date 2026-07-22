/** The GANNET brand logo mark. Scales to fill its (usually square) container
 *  while preserving the artwork's aspect ratio. */
import Image from "next/image";

type GannetBirdIconProps = {
  width?: number;
  height?: number;
};

export function GannetBirdIcon({ width = 100, height = 80 }: GannetBirdIconProps) {
  return <Image src="/logo.svg" alt="GANNET logo" width={width} height={height} />;
}
