"use client";

import { cn } from "@/lib/utils";

export function DietIcon({ type, size = "sm" }: { type: "veg" | "non-veg"; size?: "sm" | "md" }) {
  const box = size === "md" ? "h-4 w-4 border-2" : "h-3.5 w-3.5 border-[1.5px]";
  const dot = size === "md" ? "h-2 w-2" : "h-1.5 w-1.5";

  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center justify-center",
        box,
        type === "veg" ? "border-green-600" : "border-red-600"
      )}
      aria-hidden
    >
      <span className={cn("rounded-full", dot, type === "veg" ? "bg-green-600" : "bg-red-600")} />
    </span>
  );
}

interface DietTypeSelectProps {
  value: "veg" | "non-veg";
  onChange: (value: "veg" | "non-veg") => void;
}

export function DietTypeSelect({ value, onChange }: DietTypeSelectProps) {
  const options: { value: "veg" | "non-veg"; label: string }[] = [
    { value: "veg", label: "Veg" },
    { value: "non-veg", label: "Non-Veg" },
  ];

  return (
    <div className="flex gap-2">
      {options.map((opt) => (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(opt.value)}
          className={cn(
            "flex flex-1 items-center justify-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all",
            value === opt.value
              ? opt.value === "veg"
                ? "border-green-600 bg-green-50 text-green-800"
                : "border-red-600 bg-red-50 text-red-800"
              : "border-zinc-100 bg-zinc-50 text-zinc-500 hover:border-zinc-200"
          )}
        >
          <DietIcon type={opt.value} />
          {opt.label}
        </button>
      ))}
    </div>
  );
}
