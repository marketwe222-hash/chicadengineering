type BadgeVariant =
  | "sky"
  | "orange"
  | "dark"
  | "light"
  | "success"
  | "error"
  | "warning";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: "sm" | "md";
  dot?: boolean;
}

const variantStyles: Record<BadgeVariant, string> = {
  sky: "badge-sky",
  orange: "badge-orange",
  dark: "badge-dark",
  light: "badge-light",
  success: "bg-[var(--success-bg)] text-[var(--success-text)]",
  error: "bg-[var(--error-bg)] text-[var(--error-text)]",
  warning: "bg-[var(--warning-bg)] text-[var(--warning-text)]",
};

const dotColors: Record<BadgeVariant, string> = {
  sky: "bg-sky-400",
  orange: "bg-orange-400",
  dark: "bg-slate-400",
  light: "bg-slate-300",
  success: "bg-emerald-400",
  error: "bg-red-400",
  warning: "bg-orange-400",
};

const sizeStyles = {
  sm: "text-xs px-2 py-0.5",
  md: "text-xs px-2.5 py-1",
};

export function Badge({
  children,
  variant = "sky",
  size = "md",
  dot = false,
}: BadgeProps) {
  return (
    <span
      className={`
        inline-flex items-center gap-1.5
        font-semibold rounded-full
        ${variantStyles[variant]}
        ${sizeStyles[size]}
      `}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[variant]}`}
        />
      )}
      {children}
    </span>
  );
}
