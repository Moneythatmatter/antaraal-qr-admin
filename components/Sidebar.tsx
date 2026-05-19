"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  UtensilsCrossed,
  QrCode,
  LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const Sidebar = () => {
  const pathname = usePathname() || "";

  const getActiveTab = () => {
    if (pathname === "/" || pathname === "/dashboard") return "dashboard";
    if (pathname.startsWith("/categories")) return "categories";
    if (pathname.startsWith("/menu")) return "menu";
    if (pathname.startsWith("/qr")) return "qr";
    return "dashboard";
  };

  const activeTab = getActiveTab();

  return (
    <aside className="hidden md:flex w-72 bg-white border-r border-zinc-100 flex-col flex-shrink-0 animate-in slide-in-from-left duration-700">
      <div className="p-8">
        <Link href="/" className="group flex items-center gap-4">
          <div className="w-14 h-14 bg-zinc-950 rounded-[1.25rem] flex items-center justify-center shadow-2xl transition-all duration-700 overflow-hidden border border-white/20 group-hover:scale-110">
            <Image src="/images/buddha.png" alt="Logo Icon" width={64} height={64} className="object-cover w-full h-full" priority />
          </div>
          <div>
            <h1 className="font-serif font-semibold text-lg tracking-tight leading-none text-zinc-900">Antaraal <span className="text-zinc-500">Resort</span></h1>
            <p className="text-[8px] font-black text-zinc-400 uppercase tracking-[0.4em] leading-none mt-2">A Village Resort</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 px-6 py-0 space-y-4">
        <SidebarLink
          icon={<LayoutDashboard size={22} />}
          label="Dashboard"
          active={activeTab === "dashboard"}
          href="/"
        />
        <SidebarLink
          icon={<Layers size={22} />}
          label="Categories"
          active={activeTab === "categories"}
          href="/categories"
        />
        <SidebarLink
          icon={<UtensilsCrossed size={22} />}
          label="Menu Catalog"
          active={activeTab === "menu"}
          href="/menu"
        />
        <SidebarLink
          icon={<QrCode size={22} />}
          label="QR Generator"
          active={activeTab === "qr"}
          href="/qr"
        />
      </nav>

      <div className="p-8 border-t border-zinc-50">
        <button className="flex items-center gap-4 w-full px-6 py-4 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all duration-300 font-bold text-sm">
          <LogOut size={22} />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

interface SidebarLinkProps {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  href: string;
}

const SidebarLink = ({ icon, label, active, href }: SidebarLinkProps) => {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden",
        active
          ? "bg-[#17281e] text-white shadow-2xl shadow-primary/20 translate-x-1"
          : "text-zinc-400 hover:bg-[#17281e] hover:text-[#17281e]"
      )}
    >
      <span className={cn(
        "transition-transform duration-500 group-hover:scale-110",
        active ? "text-white" : "group-hover:text-primary"
      )}>
        {icon}
      </span>
      <span className="font-bold tracking-tight">{label}</span>

      {active && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute right-6 w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.5)]"
        />
      )}
    </Link>
  );
};
