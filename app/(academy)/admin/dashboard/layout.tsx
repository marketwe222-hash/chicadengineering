// app/(academy)/admin/dashboard/layout.tsx
"use client";
export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-[var(--bg-base)]">
      {children}
    </div>
  );
}
