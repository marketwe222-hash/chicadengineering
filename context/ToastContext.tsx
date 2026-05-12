"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type ToastType = "success" | "error" | "info" | "warning";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: Toast[];
  toast: (options: Omit<Toast, "id">) => void;
  success: (title: string, message?: string) => void;
  error: (title: string, message?: string) => void;
  info: (title: string, message?: string) => void;
  warning: (title: string, message?: string) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, message, duration = 4000 }: Omit<Toast, "id">) => {
      const id = crypto.randomUUID();
      setToasts((prev) => [...prev, { id, type, title, message, duration }]);
      setTimeout(() => dismiss(id), duration);
    },
    [dismiss],
  );

  const success = useCallback(
    (title: string, message?: string) =>
      toast({ type: "success", title, message }),
    [toast],
  );
  const error = useCallback(
    (title: string, message?: string) =>
      toast({ type: "error", title, message }),
    [toast],
  );
  const info = useCallback(
    (title: string, message?: string) =>
      toast({ type: "info", title, message }),
    [toast],
  );
  const warning = useCallback(
    (title: string, message?: string) =>
      toast({ type: "warning", title, message }),
    [toast],
  );

  return (
    <ToastContext.Provider
      value={{ toasts, toast, success, error, info, warning, dismiss }}
    >
      {children}
      <ToastContainer toasts={toasts} dismiss={dismiss} />
    </ToastContext.Provider>
  );
}

// ── Toast Container UI ──────────────────────────────────
function ToastContainer({
  toasts,
  dismiss,
}: {
  toasts: Toast[];
  dismiss: (id: string) => void;
}) {
  const icons: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    warning: "⚠",
    info: "ℹ",
  };

  const styles: Record<ToastType, string> = {
    success:
      "border-l-4 border-emerald-400 bg-[var(--success-bg)] text-[var(--success-text)]",
    error:
      "border-l-4 border-red-400 bg-[var(--error-bg)] text-[var(--error-text)]",
    warning:
      "border-l-4 border-orange-400 bg-[var(--warning-bg)] text-[var(--warning-text)]",
    info: "border-l-4 border-sky-400 bg-[var(--info-bg)] text-[var(--info-text)]",
  };

  const iconStyles: Record<ToastType, string> = {
    success: "bg-emerald-400 text-white",
    error: "bg-red-400 text-white",
    warning: "bg-orange-400 text-white",
    info: "bg-sky-400 text-white",
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`
            pointer-events-auto flex items-start gap-3 p-4 rounded-xl
            backdrop-blur-xl shadow-lg
            ${styles[t.type]}
            animate-in slide-in-from-right-full duration-300
          `}
        >
          {/* Icon */}
          <span
            className={`
              flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
              text-xs font-bold ${iconStyles[t.type]}
            `}
          >
            {icons[t.type]}
          </span>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight">{t.title}</p>
            {t.message && (
              <p className="text-xs mt-0.5 opacity-80 leading-snug">
                {t.message}
              </p>
            )}
          </div>

          {/* Dismiss */}
          <button
            onClick={() => dismiss(t.id)}
            className="flex-shrink-0 opacity-50 hover:opacity-100 transition-opacity text-sm leading-none mt-0.5"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

export function useToastContext() {
  const ctx = useContext(ToastContext);
  if (!ctx)
    throw new Error("useToastContext must be used within ToastProvider");
  return ctx;
}
