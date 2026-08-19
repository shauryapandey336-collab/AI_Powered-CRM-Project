"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef(({ className, label, error, options = [], children, ...props }, ref) => {
  return (
    <div className="w-full space-y-1.5">
      {label && <label className="block text-xs font-medium text-slate-300">{label}</label>}
      <select
        ref={ref}
        className={cn(
          "w-full bg-slate-900/80 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all duration-200 cursor-pointer",
          error && "border-red-500 focus:ring-red-500/50 focus:border-red-500",
          className
        )}
        {...props}
      >
        {children
          ? children
          : options.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-slate-900 text-slate-100">
                {opt.label}
              </option>
            ))}
      </select>
      {error && <p className="text-xs text-red-400 font-medium">{error}</p>}
    </div>
  );
});

Select.displayName = "Select";
