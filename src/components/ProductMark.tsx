import Image from "next/image";

export function ProductMark({ size }: { size: number }) {
  return (
    <Image
      src="/favicon_io/android-chrome-192x192.png"
      alt=""
      width={size}
      height={size}
      className="shrink-0"
      unoptimized
    />
  );
}
