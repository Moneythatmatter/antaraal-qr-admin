"use client";

import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { MobileNav } from "@/components/MobileNav";
import { AdminProvider } from "@/context/AdminContext";
import { AuthGuard } from "@/components/AuthGuard";

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <AuthGuard>
    <AdminProvider>
      <div className="flex flex-col md:flex-row h-screen overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pb-24 md:pb-0">
          <Header />
          <div className="p-4 md:p-8 max-w-7xl mx-auto">{children}</div>
        </main>
        <MobileNav />
      </div>
    </AdminProvider>
    </AuthGuard>
  );
}
