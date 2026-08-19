"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

const registerSchema = z.object({
  organizationName: z.string().min(2, "Organization name must be at least 2 characters"),
  name: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters")
});

export default function RegisterForm() {
  const { register: registerAuth } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await registerAuth(data);
    } catch (err) {
      // Handled in context toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md space-y-6 bg-slate-900/80 backdrop-blur-2xl border border-slate-800 p-8 rounded-3xl shadow-2xl shadow-indigo-950/20">
      <div className="text-center space-y-2">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight">Create Organization</h2>
        <p className="text-xs text-slate-400">Launch your enterprise LeadFlow AI workspace</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Organization Name"
          placeholder="Acme Technologies"
          error={errors.organizationName?.message}
          {...register("organizationName")}
        />

        <Input
          label="Your Full Name"
          placeholder="Sarah Jenkins"
          error={errors.name?.message}
          {...register("name")}
        />

        <Input
          label="Work Email"
          type="email"
          placeholder="sarah@acme.com"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" isLoading={loading} className="w-full h-11 text-sm font-semibold">
          Get Started <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </form>

      <div className="text-center pt-2 border-t border-slate-800">
        <p className="text-xs text-slate-400">
          Already registered?{" "}
          <Link href="/login" className="text-indigo-400 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
