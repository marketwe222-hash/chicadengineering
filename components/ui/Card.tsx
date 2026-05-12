import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: "default" | "strong" | "subtle";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const variants = {
  default: "glass",
  strong: "glass-strong",
  subtle: "glass-sm",
};

const paddings = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-8",
};

export function Card({
  children,
  className = "",
  variant = "default",
  padding = "md",
  hover = false,
}: CardProps) {
  return (
    <div
      className={`
        ${variants[variant]}
        ${paddings[padding]}
        ${hover ? "cursor-pointer hover:scale-[1.01] transition-transform duration-300" : ""}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
