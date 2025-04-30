"use client";

import ThemeProvider from "@/components/ThemeProvider";
import useRestoreRoleFromToken from "@/hooks/useRestoreRoleFromToken";

export default function DashboardProviders({
  children,
}: {
  children: React.ReactNode;
}) {
  useRestoreRoleFromToken();

  return <ThemeProvider>{children}</ThemeProvider>;
}
 