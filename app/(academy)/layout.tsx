//app/%28academy%29/layout.tsx

import { AuthProvider } from "@/context/AuthContext";

export default function AcademyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthProvider>{children}</AuthProvider>;
}
