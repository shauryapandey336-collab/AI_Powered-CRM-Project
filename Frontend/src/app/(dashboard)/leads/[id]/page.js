"use client";

import { use, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { leadService } from "@/services/lead.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import AiAnalysisCard from "@/components/leads/AiAnalysisCard";
import LeadActivities from "@/components/leads/LeadActivities";
import LeadForm from "@/components/forms/LeadForm";
import { Modal } from "@/components/ui/Modal";
import Link from "next/link";
import {
  ArrowLeft,
  Edit2,
  Mail,
  Phone,
  Building2,
  Briefcase,
  Calendar,
  Sparkles
} from "lucide-react";
import { formatDate } from "@/lib/utils";
import { toast } from "sonner";

export default function LeadDetailPage({ params }) {
  const resolvedParams = use(params);
  const leadId = resolvedParams.id;
  const queryClient = useQueryClient();

  const [isEditOpen, setIsEditOpen] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["lead", leadId],
    queryFn: async () => {
      const res = await leadService.getLeadById(leadId);
      return res.data?.lead;
    }
  });

  const updateMutation = useMutation({
    mutationFn: (formData) => leadService.updateLead(leadId, formData),
    onSuccess: () => {
      toast.success("Lead details updated");
      setIsEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ["lead", leadId] });
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update lead");
    }
  });

  const handleStatusChange = (newStatus) => {
    updateMutation.mutate({ status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="text-sm text-slate-400">Fetching lead profile details...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6 bg-red-950/20 border border-red-800/50 rounded-2xl text-center space-y-3">
        <p className="text-sm text-red-400">Lead profile could not be loaded: {error?.message || "Not found"}</p>
        <Link href="/leads">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Return to Leads List
          </Button>
        </Link>
      </div>
    );
  }

  const lead = data;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Navigation & Header */}
      <div className="flex items-center justify-between">
        <Link href="/leads">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Leads
          </Button>
        </Link>
        <div className="flex items-center space-x-3">
          <Select
            value={lead.status}
            onChange={(e) => handleStatusChange(e.target.value)}
            className="w-40 text-xs py-1.5"
          >
            <option value="NEW">New</option>
            <option value="CONTACTED">Contacted</option>
            <option value="QUALIFIED">Qualified</option>
            <option value="PROPOSAL">Proposal</option>
            <option value="WON">Won</option>
            <option value="LOST">Lost</option>
          </Select>
          <Button size="sm" variant="outline" onClick={() => setIsEditOpen(true)}>
            <Edit2 className="w-4 h-4 mr-1.5" /> Edit Profile
          </Button>
        </div>
      </div>

      {/* Main Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-1 space-y-6">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <Badge>{lead.status}</Badge>
              <div className="flex items-center space-x-1 font-bold text-xs text-indigo-400 bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                <Sparkles className="w-3.5 h-3.5" /> Score: {lead.score}
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mt-3">
              {lead.firstName} {lead.lastName || ""}
            </h2>
            <p className="text-xs text-slate-400">{lead.jobTitle || "No title specified"}</p>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-3 text-xs">
              <div className="flex items-center text-slate-300">
                <Mail className="w-4 h-4 mr-3 text-slate-500 shrink-0" />
                <span className="truncate">{lead.email}</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Phone className="w-4 h-4 mr-3 text-slate-500 shrink-0" />
                <span>{lead.phone || "Not provided"}</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Building2 className="w-4 h-4 mr-3 text-slate-500 shrink-0" />
                <span>{lead.company || "Not provided"}</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Briefcase className="w-4 h-4 mr-3 text-slate-500 shrink-0" />
                <span>Source: {lead.source}</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Calendar className="w-4 h-4 mr-3 text-slate-500 shrink-0" />
                <span>Added: {formatDate(lead.createdAt)}</span>
              </div>
            </div>

            {lead.notes && (
              <div className="pt-3 border-t border-slate-800 space-y-1">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Notes</span>
                <p className="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  {lead.notes}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI & Timeline Column */}
        <div className="lg:col-span-2 space-y-6">
          <AiAnalysisCard
            leadId={lead.id}
            currentScore={lead.score}
            onAnalyzed={() => queryClient.invalidateQueries({ queryKey: ["lead", leadId] })}
          />

          <LeadActivities
            leadId={lead.id}
            initialActivities={lead.activities || []}
            onActivityAdded={() => queryClient.invalidateQueries({ queryKey: ["lead", leadId] })}
          />
        </div>
      </div>

      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title="Edit Lead Details">
        <LeadForm
          initialData={lead}
          onSubmit={(formData) => updateMutation.mutate(formData)}
          isLoading={updateMutation.isPending}
          onCancel={() => setIsEditOpen(false)}
        />
      </Modal>
    </div>
  );
}
