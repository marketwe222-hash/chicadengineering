import type { CSSProperties } from "react";

const SIZE_MAP = {
  sm: 32,
  md: 40,
  lg: 48,
  xl: 56,
};

export interface CourseLogoProps {
  logoImage?: string | null;
  icon?: string | null;
  label?: string;
  alt?: string;
  size?: keyof typeof SIZE_MAP | number;
  className?: string;
  style?: CSSProperties;
  fallbackIcon?: string;
}

export function CourseLogo({
  logoImage,
  icon,
  label,
  alt,
  size = "md",
  className,
  style,
  fallbackIcon = "📐",
}: CourseLogoProps) {
  const imageSrc = logoImage?.trim() || undefined;
  const sizePx = typeof size === "number" ? size : SIZE_MAP[size];
  const fontSize = Math.max(16, Math.round(sizePx * 0.55));

  const baseStyle: CSSProperties = {
    width: sizePx,
    height: sizePx,
    minWidth: sizePx,
    minHeight: sizePx,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "0.85rem",
    overflow: "hidden",
    background: "rgba(148,163,184,0.12)",
    color: "inherit",
    fontSize,
    lineHeight: 1,
    ...style,
  };

  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt={alt ?? label ?? "Course logo"}
        className={className}
        style={{
          ...baseStyle,
          objectFit: "cover",
        }}
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <span className={className} style={baseStyle}>
      {icon ?? fallbackIcon}
    </span>
  );
}
