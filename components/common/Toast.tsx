//app/components/common/Toast.tsx
"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type: "success" | "error" | "info" | "warning";
  duration?: number;
  onClose?: () => void;
}

export function Toast({ message, type, duration = 5000, onClose }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const getToastStyles = () => {
    const baseStyles = {
      padding: "1rem",
      borderRadius: "0.5rem",
      marginBottom: "1rem",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      fontSize: "0.875rem",
      fontWeight: 500,
    };

    switch (type) {
      case "success":
        return {
          ...baseStyles,
          backgroundColor: "#d1fae5",
          color: "#065f46",
          border: "1px solid #a7f3d0",
        };
      case "error":
        return {
          ...baseStyles,
          backgroundColor: "#fee2e2",
          color: "#991b1b",
          border: "1px solid #fca5a5",
        };
      case "warning":
        return {
          ...baseStyles,
          backgroundColor: "#fef3c7",
          color: "#92400e",
          border: "1px solid #fcd34d",
        };
      case "info":
      default:
        return {
          ...baseStyles,
          backgroundColor: "#dbeafe",
          color: "#1e40af",
          border: "1px solid #93c5fd",
        };
    }
  };

  return (
    <div style={getToastStyles()}>
      <span>{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            fontSize: "1.25rem",
            lineHeight: 1,
            color: "inherit",
            opacity: 0.7,
          }}
          aria-label="Close toast"
        >
          ×
        </button>
      )}
    </div>
  );
}
