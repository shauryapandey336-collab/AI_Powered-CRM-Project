"use client";

import { useAuth as useAuthContext } from "@/components/common/AuthContext";

export function useAuth() {
  return useAuthContext();
}
