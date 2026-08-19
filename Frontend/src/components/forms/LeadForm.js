"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";

const leadSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().optional(),
  email: z.string().email("Valid email is required"),
  phone: z.string().optional(),
  company: z.string().optional(),
  jobTitle: z.string().optional(),
  source: z.enum(["CSV", "MANUAL", "WEBSITE", "OTHER"]),
  status: z.enum(["NEW", "CONTACTED", "QUALIFIED", "PROPOSAL", "WON", "LOST"]),
  notes: z.string().optional()
});

export default function LeadForm({ initialData = null, onSubmit, isLoading = false, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(leadSchema),
    defaultValues: initialData || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      jobTitle: "",
      source: "MANUAL",
      status: "NEW",
      notes: ""
    }
  });

  useEffect(() => {
    if (initialData) {
      reset(initialData);
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="First Name *"
          placeholder="Jane"
          error={errors.firstName?.message}
          {...register("firstName")}
        />
        <Input
          label="Last Name"
          placeholder="Smith"
          error={errors.lastName?.message}
          {...register("lastName")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Email Address *"
          type="email"
          placeholder="jane@company.com"
          error={errors.email?.message}
          {...register("email")}
        />
        <Input
          label="Phone Number"
          placeholder="+1 (555) 019-2834"
          error={errors.phone?.message}
          {...register("phone")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          label="Company"
          placeholder="Global Tech Inc"
          error={errors.company?.message}
          {...register("company")}
        />
        <Input
          label="Job Title"
          placeholder="VP of Sales"
          error={errors.jobTitle?.message}
          {...register("jobTitle")}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Status" error={errors.status?.message} {...register("status")}>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="PROPOSAL">Proposal</option>
          <option value="WON">Won</option>
          <option value="LOST">Lost</option>
        </Select>

        <Select label="Source" error={errors.source?.message} {...register("source")}>
          <option value="MANUAL">Manual Entry</option>
          <option value="WEBSITE">Website</option>
          <option value="CSV">CSV Upload</option>
          <option value="OTHER">Other</option>
        </Select>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-medium text-slate-300">Notes / Details</label>
        <textarea
          rows={3}
          className="w-full bg-slate-900/80 border border-slate-700/80 rounded-lg px-3.5 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          placeholder="Lead background information..."
          {...register("notes")}
        />
      </div>

      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" isLoading={isLoading}>
          {initialData ? "Update Lead" : "Save Lead"}
        </Button>
      </div>
    </form>
  );
}
