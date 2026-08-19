"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: async () => {}
});

const PUBLIC_PATHS = ["/login", "/register", "/"];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    async function checkAuth() {
      try {
        const response = await authService.getCurrentUser();
        if (response.success && response.data?.user) {
          setUser(response.data.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  useEffect(() => {
    if (!loading) {
      const isPublic = PUBLIC_PATHS.some((path) => pathname === path || (path !== "/" && pathname?.startsWith(path)));
      if (!user && !isPublic) {
        router.push("/login");
      } else if (user && (pathname === "/login" || pathname === "/register")) {
        router.push("/dashboard");
      }
    }
  }, [user, loading, pathname, router]);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        toast.success("Welcome back!");
        router.push("/dashboard");
        return response;
      }
    } catch (error) {
      toast.error(error.message || "Failed to login");
      throw error;
    }
  };

  const register = async (data) => {
    try {
      const response = await authService.register(data);
      if (response.success && response.data?.user) {
        setUser(response.data.user);
        toast.success("Account created successfully!");
        router.push("/dashboard");
        return response;
      }
    } catch (error) {
      toast.error(error.message || "Registration failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      toast.info("Logged out");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
