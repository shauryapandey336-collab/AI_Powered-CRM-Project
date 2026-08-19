"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadService } from "@/services/lead.service";
import LeadTable from "@/components/tables/LeadTable";
import LeadForm from "@/components/forms/LeadForm";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Plus, Search, Filter, Upload } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function LeadsPage() {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");
  const [source, setSource] = useState("ALL");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLead, setEditingLead] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["leads", { page, search, status, source }],
    queryFn: async () => {
      const res = await leadService.getLeads({ page, search, status, source });
      return res;
    }
  });

  const createMutation = useMutation({
    mutationFn: (formData) => leadService.createLead(formData),
    onSuccess: () => {
      toast.success("Lead created successfully");
      setIsCreateOpen(false);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to create lead");
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => leadService.updateLead(id, data),
    onSuccess: () => {
      toast.success("Lead updated successfully");
      setEditingLead(null);
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update lead");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => leadService.deleteLead(id),
    onSuccess: () => {
      toast.success("Lead deleted");
      queryClient.invalidateQueries({ queryKey: ["leads"] });
      queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete lead");
    }
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this lead?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Lead Management</h2>
          <p className="text-xs text-slate-400">Search, filter, score, and manage multi-tenant sales leads</p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/leads/import">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-1.5" /> CSV Import
            </Button>
          </Link>
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            <Plus className="w-4 h-4 mr-1.5" /> Add New Lead
          </Button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-4 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="relative">
          <Input
            placeholder="Search leads by name, email, company..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="pl-9"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
        </div>

        <Select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
        >
          <option value="ALL">All Statuses</option>
          <option value="NEW">New</option>
          <option value="CONTACTED">Contacted</option>
          <option value="QUALIFIED">Qualified</option>
          <option value="PROPOSAL">Proposal</option>
          <option value="WON">Won</option>
          <option value="LOST">Lost</option>
        </Select>

        <Select
          value={source}
          onChange={(e) => {
            setSource(e.target.value);
            setPage(1);
          }}
        >
          <option value="ALL">All Sources</option>
          <option value="MANUAL">Manual</option>
          <option value="CSV">CSV Upload</option>
          <option value="WEBSITE">Website</option>
          <option value="OTHER">Other</option>
        </Select>
      </div>

      {/* Lead Table */}
      <LeadTable
        leads={data?.data || []}
        pagination={data?.pagination}
        onPageChange={(p) => setPage(p)}
        onEdit={(lead) => setEditingLead(lead)}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Lead">
        <LeadForm
          onSubmit={(formData) => createMutation.mutate(formData)}
          isLoading={createMutation.isPending}
          onCancel={() => setIsCreateOpen(false)}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingLead} onClose={() => setEditingLead(null)} title="Edit Lead Information">
        {editingLead && (
          <LeadForm
            initialData={editingLead}
            onSubmit={(formData) => updateMutation.mutate({ id: editingLead.id, data: formData })}
            isLoading={updateMutation.isPending}
            onCancel={() => setEditingLead(null)}
          />
        )}
      </Modal>
    </div>
  );
}
