"use client";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Auth is handled by middleware in development
  // In production, middleware will redirect unauthenticated users
  return <>{children}</>;
}
