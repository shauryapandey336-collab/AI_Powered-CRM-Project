"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";
import { Eye, Edit2, Trash2, Sparkles, Building2, Mail } from "lucide-react";

export default function LeadTable({
  leads = [],
  pagination = {},
  onPageChange,
  onEdit,
  onDelete,
  isLoading = false
}) {
  if (isLoading) {
    return (
      <div className="w-full space-y-4 py-8 text-center text-slate-400">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="text-sm">Loading leads database...</p>
      </div>
    );
  }

  if (leads.length === 0) {
    return (
      <div className="w-full py-16 text-center space-y-3 bg-slate-900/40 rounded-2xl border border-slate-800/80">
        <UsersIcon className="mx-auto h-12 w-12 text-slate-600" />
        <h4 className="text-base font-semibold text-white">No leads found</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          Try adjusting your search criteria or filters, or add a new lead to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-950/80 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-800">
            <tr>
              <th className="px-6 py-4">Lead Name</th>
              <th className="px-6 py-4">Company & Title</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">AI Score</th>
              <th className="px-6 py-4">Source</th>
              <th className="px-6 py-4">Created</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {leads.map((lead) => (
              <tr
                key={lead.id}
                className="hover:bg-slate-800/40 transition-colors group"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="font-semibold text-white group-hover:text-indigo-400 transition-colors">
                    {lead.firstName} {lead.lastName || ""}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center mt-0.5">
                    <Mail className="w-3 h-3 mr-1 text-slate-500" />
                    {lead.email}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-slate-200 flex items-center font-medium">
                    <Building2 className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                    {lead.company || "—"}
                  </div>
                  <div className="text-xs text-slate-400">{lead.jobTitle || "—"}</div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge>{lead.status}</Badge>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-1.5">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-center font-bold text-xs text-indigo-400">
                      {lead.score || 0}
                    </div>
                    {lead.score >= 70 && (
                      <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    )}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                  <span className="px-2 py-1 rounded-md bg-slate-800/80 border border-slate-700/60">
                    {lead.source}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-400">
                  {formatDate(lead.createdAt)}
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                  <Link href={`/leads/${lead.id}`}>
                    <Button variant="ghost" size="sm" title="View Details">
                      <Eye className="w-4 h-4 text-slate-400 hover:text-indigo-400" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(lead)}
                    title="Edit Lead"
                  >
                    <Edit2 className="w-4 h-4 text-slate-400 hover:text-amber-400" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(lead.id)}
                    title="Delete Lead"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400 hover:text-red-400" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400">
          <div>
            Page <span className="font-semibold text-white">{pagination.page}</span> of{" "}
            <span className="font-semibold text-white">{pagination.totalPages}</span> ({pagination.total} total leads)
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page <= 1}
              onClick={() => onPageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={pagination.page >= pagination.totalPages}
              onClick={() => onPageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}
