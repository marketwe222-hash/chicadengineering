import { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        fontSize: "0.56rem",
        fontWeight: 700,
        color: "var(--text3)",
        letterSpacing: "0.14em",
        textTransform: "uppercase",
        marginBottom: "0.55rem",
      }}
    >
      {children}
    </div>
  );
}
