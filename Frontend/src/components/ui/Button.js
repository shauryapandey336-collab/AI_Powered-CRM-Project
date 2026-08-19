"use client";

import { forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export const Button = forwardRef(
  ({ className, variant = "default", size = "default", isLoading = false, children, disabled, ...props }, ref) => {
    const variants = {
      default: "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 border border-indigo-500/30",
      secondary: "bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700",
      outline: "border border-slate-700 hover:bg-slate-800 text-slate-300 hover:text-white",
      danger: "bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-600/30",
      ghost: "hover:bg-slate-800 text-slate-300 hover:text-white"
    };

    const sizes = {
      sm: "h-8 px-3 text-xs rounded-md",
      default: "h-10 px-4 text-sm rounded-lg",
      lg: "h-12 px-6 text-base rounded-xl"
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          "inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
