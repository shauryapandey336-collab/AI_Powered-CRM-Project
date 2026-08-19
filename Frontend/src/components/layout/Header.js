"use client";

import { useAuth } from "@/hooks/useAuth";
import { User, Bell, Sparkles } from "lucide-react";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-20 flex items-center justify-between px-6">
      <div className="flex items-center space-x-3">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
          <Sparkles className="w-3.5 h-3.5 mr-1" /> Multi-Tenant AI Platform
        </span>
      </div>

      {user && (
        <div className="flex items-center space-x-4">
          <button className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors relative">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-500 rounded-full"></span>
          </button>
          
          <div className="h-4 w-px bg-slate-800" />

          <div className="flex items-center space-x-3">
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-sm text-white shadow-md">
              {user.name ? user.name[0].toUpperCase() : <User className="w-4 h-4" />}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-semibold text-white">{user.name}</p>
              <p className="text-[10px] text-slate-400">{user.email}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
