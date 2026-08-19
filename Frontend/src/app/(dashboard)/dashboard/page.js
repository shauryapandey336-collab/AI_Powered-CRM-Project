"use client";

import { useQuery } from "@tanstack/react-query";
import { dashboardService } from "@/services/dashboard.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import StatusChart from "@/components/charts/StatusChart";
import SourceChart from "@/components/charts/SourceChart";
import Link from "next/link";
import {
  Users,
  CheckCircle2,
  Trophy,
  TrendingUp,
  ArrowRight,
  Plus,
  Sparkles
} from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["dashboard-summary"],
    queryFn: async () => {
      const res = await dashboardService.getSummary();
      return res.data;
    }
  });

  if (isLoading) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="text-sm text-slate-400">Loading AI Dashboard Analytics...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-950/20 border border-red-800/50 rounded-2xl text-center space-y-2">
        <p className="text-sm text-red-400">Failed to load dashboard metrics: {error.message}</p>
      </div>
    );
  }

  const metrics = data || {
    totalLeads: 0,
    qualifiedLeads: 0,
    wonLeads: 0,
    conversionRate: 0,
    byStatus: {},
    bySource: {},
    recentLeads: []
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-indigo-900/30 via-slate-900 to-slate-900 p-6 rounded-3xl border border-indigo-500/20 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-white tracking-tight flex items-center">
            Executive CRM Dashboard <Sparkles className="w-5 h-5 ml-2 text-indigo-400" />
          </h2>
          <p className="text-xs text-slate-400">
            Real-time multi-tenant lead intelligence, conversion pipelines, and AI scoring metrics.
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/leads/import">
            <Button variant="outline" size="sm">
              Import CSV
            </Button>
          </Link>
          <Link href="/leads">
            <Button size="sm">
              <Plus className="w-4 h-4 mr-1.5" /> Manage Leads
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <Card className="hover:scale-[1.02] transition-transform">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pipeline Leads</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{metrics.totalLeads}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <Users className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-[1.02] transition-transform">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Qualified Prospects</p>
              <h3 className="text-3xl font-extrabold text-purple-400 mt-1">{metrics.qualifiedLeads}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-[1.02] transition-transform">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Won Deals</p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">{metrics.wonLeads}</h3>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Trophy className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>

        <Card className="hover:scale-[1.02] transition-transform">
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Conversion Rate</p>
              <h3 className="text-3xl font-extrabold text-indigo-400 mt-1">{metrics.conversionRate}%</h3>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <TrendingUp className="w-6 h-6" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead Status Breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <StatusChart data={metrics.byStatus} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lead Sources Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <SourceChart data={metrics.bySource} />
          </CardContent>
        </Card>
      </div>

      {/* Recent Leads Preview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-base">Recently Added Leads</CardTitle>
            <p className="text-xs text-slate-400">Latest additions to your organization pipeline</p>
          </div>
          <Link href="/leads">
            <Button variant="ghost" size="sm">
              View All <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {metrics.recentLeads.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">No recent leads found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950 text-slate-400 uppercase font-semibold">
                  <tr>
                    <th className="p-3">Lead Name</th>
                    <th className="p-3">Company</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">AI Score</th>
                    <th className="p-3 text-right">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {metrics.recentLeads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3 font-semibold text-white">
                        <Link href={`/leads/${lead.id}`} className="hover:text-indigo-400">
                          {lead.firstName} {lead.lastName || ""}
                        </Link>
                      </td>
                      <td className="p-3 text-slate-300">{lead.company || "—"}</td>
                      <td className="p-3">
                        <Badge>{lead.status}</Badge>
                      </td>
                      <td className="p-3 font-bold text-indigo-400">{lead.score || 0}</td>
                      <td className="p-3 text-right text-slate-400">{formatDate(lead.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
