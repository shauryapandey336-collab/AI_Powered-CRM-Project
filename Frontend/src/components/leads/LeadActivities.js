"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { formatDateTime } from "@/lib/utils";
import {
  Activity,
  PhoneCall,
  Mail,
  FileText,
  RefreshCw,
  Brain,
  Plus
} from "lucide-react";
import { leadService } from "@/services/lead.service";
import { toast } from "sonner";

const ACTIVITY_ICONS = {
  NOTE: FileText,
  CALL: PhoneCall,
  EMAIL: Mail,
  STATUS_CHANGE: RefreshCw,
  AI_ANALYSIS: Brain
};

export default function LeadActivities({ leadId, initialActivities = [], onActivityAdded }) {
  const [activities, setActivities] = useState(initialActivities);
  const [type, setType] = useState("NOTE");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleAddActivity = async (e) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    setSubmitting(true);
    try {
      const response = await leadService.addActivity(leadId, { type, description });
      if (response.success && response.data?.activity) {
        setActivities([response.data.activity, ...activities]);
        setDescription("");
        toast.success("Activity recorded");
        if (onActivityAdded) onActivityAdded();
      }
    } catch (error) {
      toast.error(error.message || "Failed to add activity");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card className="space-y-6">
      <CardHeader className="pb-2">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          <CardTitle>Activity Timeline</CardTitle>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* New Activity Form */}
        <form onSubmit={handleAddActivity} className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300">Log New Activity</span>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              className="w-36 text-xs py-1"
            >
              <option value="NOTE">Note</option>
              <option value="CALL">Call</option>
              <option value="EMAIL">Email</option>
            </Select>
          </div>

          <textarea
            rows={2}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Type notes or call summary..."
            className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />

          <div className="flex justify-end">
            <Button type="submit" size="sm" isLoading={submitting}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Log Activity
            </Button>
          </div>
        </form>

        {/* Timeline Items */}
        <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {activities.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-4">No activity history recorded yet.</p>
          ) : (
            activities.map((act) => {
              const Icon = ACTIVITY_ICONS[act.type] || Activity;
              return (
                <div key={act.id} className="relative group">
                  <div className="absolute -left-[31px] top-0.5 w-6 h-6 rounded-full bg-slate-900 border border-slate-700 flex items-center justify-center text-indigo-400 shadow-md">
                    <Icon className="w-3 h-3" />
                  </div>

                  <div className="bg-slate-950/40 border border-slate-800/80 p-3 rounded-xl space-y-1">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-semibold text-slate-200 uppercase tracking-wider">{act.type}</span>
                      <span className="text-slate-500">{formatDateTime(act.createdAt)}</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{act.description}</p>
                    {act.createdBy && (
                      <p className="text-[10px] text-slate-500 pt-1">Logged by: {act.createdBy.name}</p>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
}
