import React from "react";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "danger" | "ghost";
  size?: "sm" | "md" | "lg" | "xl";
  icon?: React.ReactNode;
  loading?: boolean;
}

export const Button = ({ 
  children, 
  variant = "primary", 
  size = "md", 
  icon, 
  loading, 
  className, 
  ...props 
}: ButtonProps) => {
  const variants = {
    primary: "bg-primary text-white hover:bg-zinc-900 shadow-lg shadow-primary/20 active:scale-95",
    secondary: "bg-zinc-900 text-white hover:bg-zinc-800 shadow-xl shadow-zinc-200 active:scale-95",
    outline: "bg-white border-2 border-zinc-100 text-zinc-600 hover:border-primary hover:text-primary active:scale-95",
    danger: "bg-red-50 text-red-500 hover:bg-red-500 hover:text-white active:scale-95",
    ghost: "text-zinc-400 hover:text-primary hover:bg-primary/5"
  };

  const sizes = {
    sm: "px-4 py-2 text-xs rounded-xl",
    md: "px-6 py-3 text-sm rounded-xl font-bold",
    lg: "px-8 py-4 text-base rounded-2xl font-bold",
    xl: "px-10 py-5 text-lg rounded-3xl font-black tracking-tight"
  };

  return (
    <button 
      className={cn(
        "flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={loading}
      {...props}
    >
      {loading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="transition-transform group-hover:scale-110">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
