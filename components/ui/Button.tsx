import { ReactNode, ButtonHTMLAttributes } from "react";
import { Spinner } from "./Spinner";

type Variant = "primary" | "accent" | "secondary" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  children: ReactNode;
}

const variantStyles: Record<Variant, string> = {
  primary: "btn-primary text-white",
  accent: "btn-accent text-white",
  secondary: "btn-secondary",
  ghost: "hover:bg-[var(--btn-ghost-bg-hover)] text-[var(--text-primary)]",
  danger:
    "bg-red-500 hover:bg-red-600 text-white shadow-md hover:shadow-red-500/40",
};

const sizeStyles: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-5 py-2.5 text-sm rounded-xl",
  lg: "px-7 py-3.5 text-base rounded-xl",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  children,
  disabled,
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        font-semibold transition-all duration-200
        disabled:opacity-60 disabled:cursor-not-allowed
        disabled:transform-none active:scale-95
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${fullWidth ? "w-full" : ""}
        ${className}
      `}
      {...props}
    >
      {isLoading ? <Spinner size="sm" color="text-current" /> : leftIcon}
      {children}
      {!isLoading && rightIcon}
    </button>
  );
}
