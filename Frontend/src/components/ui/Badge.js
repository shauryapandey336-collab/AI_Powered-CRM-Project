"use client";

import { cn } from "@/lib/utils";

export function Badge({ className, variant = "default", children, ...props }) {
  const statusVariants = {
    NEW: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    CONTACTED: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    QUALIFIED: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    PROPOSAL: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
    WON: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    LOST: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    HIGH: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30 font-semibold",
    MEDIUM: "bg-amber-500/15 text-amber-400 border-amber-500/30 font-semibold",
    LOW: "bg-slate-500/15 text-slate-400 border-slate-500/30 font-semibold",
    default: "bg-slate-800 text-slate-300 border-slate-700"
  };

  const styleClass = statusVariants[children] || statusVariants[variant] || statusVariants.default;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm transition-all",
        styleClass,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
