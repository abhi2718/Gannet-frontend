import Image from "next/image";

export function XIcon({ size = 16, className }: { size?: number; className?: string }) {
  return <Image src="/twitter-x.png" alt="X" width={size} height={size} className={className} />;
}
