import { InputHTMLAttributes, ReactNode, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      leftIcon,
      rightIcon,
      fullWidth = true,
      className = "",
      id,
      ...props
    },
    ref,
  ) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

    return (
      <div className={`flex flex-col gap-1.5 ${fullWidth ? "w-full" : ""}`}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-semibold text-[var(--text-secondary)] pl-1"
          >
            {label}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
              {leftIcon}
            </span>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`
              glass-input w-full py-3 text-sm
              text-[var(--text-primary)]
              placeholder:text-[var(--text-disabled)]
              disabled:opacity-50 disabled:cursor-not-allowed
              ${leftIcon ? "pl-10" : "pl-4"}
              ${rightIcon ? "pr-10" : "pr-4"}
              ${error ? "border-red-400" : ""}
              ${className}
            `}
            {...props}
          />

          {rightIcon && (
            <span className="absolute right-3.5 top-1/2 -translate-y-1/2">
              {rightIcon}
            </span>
          )}
        </div>

        {hint && !error && (
          <p className="text-xs text-[var(--text-muted)] pl-1">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-red-400 pl-1 flex items-center gap-1">
            <span>⚠</span> {error}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
