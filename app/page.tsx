"use client";

import React from "react";
import { useAdmin } from "@/context/AdminContext";
import { UtensilsCrossed, Layers, TrendingUp, Plus, QrCode } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Card, CardHeader } from "@/components/ui/Card";

export default function DashboardPage() {
  const { menuItems, categories } = useAdmin();

  return (
    <div className="space-y-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard title="Total Dishes" value={menuItems.length} icon={<UtensilsCrossed />} color="text-primary" />
        <StatCard title="Categories" value={categories.length} icon={<Layers />} color="text-primary" />
        <StatCard title="Menu Scans" value="12" icon={<TrendingUp />} color="text-primary" />

        <Card className="sm:col-span-2 p-10">
          <CardHeader
            title="Quick Management"
            subtitle="Access your most frequent tasks instantly"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link
              href="/menu"
              className="group flex flex-col items-center justify-center p-6 bg-primary/5 rounded-3xl border border-primary/10 hover:bg-primary transition-all duration-500 hover:scale-[1.02] active:scale-95"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                <Plus className="text-primary" size={24} />
              </div>
              <span className="font-serif font-semibold text-lg text-zinc-900 group-hover:text-white transition-colors">Add New Dish</span>
              <p className="text-zinc-400 group-hover:text-primary-foreground/60 text-[10px] mt-1 uppercase tracking-widest font-bold transition-colors">Menu Catalogue</p>
            </Link>

            <Link
              href="/qr"
              className="group flex flex-col items-center justify-center p-6 bg-primary/5 rounded-3xl border border-primary/10 hover:bg-primary transition-all duration-500 hover:scale-[1.02] active:scale-95"
            >
              <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-4 group-hover:-rotate-12 group-hover:scale-110 transition-all duration-500">
                <QrCode className="text-primary" size={24} />
              </div>
              <span className="font-serif font-semibold text-lg text-zinc-900 group-hover:text-white transition-colors">Print QR Code</span>
              <p className="text-zinc-400 group-hover:text-primary-foreground/60 text-[10px] mt-1 uppercase tracking-widest font-bold transition-colors">Table Setup</p>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, color }: any) {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-3 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors duration-500 shadow-inner", color)}>
          {React.cloneElement(icon as any, { size: 20 })}
        </div>
        <div className="flex flex-col items-end">
          <span className="text-primary text-[10px] font-black bg-primary/5 px-2 py-1 rounded-lg tracking-tighter shadow-sm">+12%</span>
          <span className="text-[9px] text-gray-400 font-bold uppercase mt-1">Growth</span>
        </div>
      </div>
      <div>
        <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] mb-1">{title}</p>
        <p className="text-3xl font-serif font-semibold text-zinc-900 tracking-tight lining-nums">{value}</p>
      </div>
    </Card>
  );
}
