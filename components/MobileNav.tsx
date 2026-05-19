"use client";
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { LayoutDashboard, Layers, UtensilsCrossed, QrCode } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
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
    <div className="md:hidden fixed bottom-6 left-6 right-6 h-16 bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl z-50 flex items-center justify-around px-4 border border-zinc-100">
      <MobileNavLink href="/" icon={<LayoutDashboard size={22} />} active={activeTab === "dashboard"} />
      <MobileNavLink href="/categories" icon={<Layers size={22} />} active={activeTab === "categories"} />
      <MobileNavLink href="/menu" icon={<UtensilsCrossed size={22} />} active={activeTab === "menu"} />
      <MobileNavLink href="/qr" icon={<QrCode size={22} />} active={activeTab === "qr"} />
    </div>
  );
}

function MobileNavLink({ href, icon, active }: { href: string; icon: React.ReactNode; active: boolean }) {
  return (
    <Link href={href} className={cn("p-3 rounded-xl transition-all relative", active ? "text-primary" : "text-zinc-400")}>
      {icon}
      {active && (
        <motion.div layoutId="mobile-nav-active" className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-primary" />
      )}
    </Link>
  );
}
