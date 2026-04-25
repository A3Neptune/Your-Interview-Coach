import Image from "next/image";
import Link from "next/link";

interface BrandLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  dark?: boolean; // true = on dark background, wraps img in white pill
  className?: string;
}

const sizes = {
  sm: { w: 64, h: 28, cls: "h-7  w-auto" },
  md: { w: 88, h: 38, cls: "h-9  w-auto" },
  lg: { w: 110, h: 48, cls: "h-12 w-auto" },
};

export default function BrandLogo({
  href = "/",
  size = "md",
  dark = false,
  className = "",
}: BrandLogoProps) {
  const s = sizes[size];

  const img = (
    <Image
      src="/yic-logo-sm.png"
      alt="YourInterviewCoach"
      width={s.w}
      height={s.h}
      priority
      className={`${s.cls} object-contain transition-transform duration-200 group-hover:scale-[1.02] ${
        dark ? "rounded-lg" : ""
      }`}
      style={
        dark
          ? { background: "#fff", padding: "3px 6px", borderRadius: 8 }
          : undefined
      }
    />
  );

  return (
    <Link href={href} className={`inline-flex items-center group ${className}`}>
      {img}
    </Link>
  );
}
