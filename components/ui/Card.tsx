import React from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export const Card = ({ children, className, hover = true }: CardProps) => {
  return (
    <div className={cn(
      "bg-white rounded-3xl border border-zinc-100 shadow-sm p-5 overflow-hidden",
      hover && "hover:shadow-xl hover:border-primary/20 transition-all duration-500",
      className
    )}>
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) => {
  return (
    <div className="flex justify-between items-start mb-6">
      <div>
        <h3 className="text-xl font-serif font-semibold text-zinc-900 tracking-tight leading-none mb-1 capitalize">{title}</h3>
        {subtitle && <p className="text-gray-400 font-medium text-xs">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};
