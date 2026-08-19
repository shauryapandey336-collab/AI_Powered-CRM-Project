"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { leadService } from "@/services/lead.service";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, ArrowLeft, Download } from "lucide-react";
import { toast } from "sonner";

export default function CsvImportPage() {
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);
  const [summary, setSummary] = useState(null);

  const importMutation = useMutation({
    mutationFn: (formData) => leadService.importCsv(formData),
    onSuccess: (res) => {
      if (res.success && res.data?.summary) {
        setSummary(res.data.summary);
        toast.success(`Successfully imported ${res.data.summary.imported} leads!`);
        queryClient.invalidateQueries({ queryKey: ["leads"] });
        queryClient.invalidateQueries({ queryKey: ["dashboard-summary"] });
      }
    },
    onError: (err) => {
      toast.error(err.message || "CSV Import failed");
    }
  });

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (selected) {
      if (!selected.name.endsWith(".csv") && selected.type !== "text/csv") {
        toast.error("Please select a valid CSV file");
        return;
      }
      setFile(selected);
      setSummary(null);
    }
  };

  const handleUpload = () => {
    if (!file) {
      toast.error("Please select a file to import");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    importMutation.mutate(formData);
  };

  const downloadSampleCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8,First Name,Last Name,Email,Phone,Company,Job Title,Notes\n" +
      "John,Doe,john.doe@example.com,+15550192831,Acme Corp,VP of Sales,High intent lead\n" +
      "Jane,Smith,jane.smith@example.com,+15550192832,Global Tech,Director of Marketing,Met at annual conference";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "sample_leads_import.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <Link href="/leads">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1.5" /> Back to Leads
          </Button>
        </Link>
        <Button variant="outline" size="sm" onClick={downloadSampleCsv}>
          <Download className="w-4 h-4 mr-1.5" /> Download Sample CSV
        </Button>
      </div>

      <Card className="p-6 space-y-6">
        <CardHeader className="p-0 space-y-1">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold">Bulk CSV Lead Import</CardTitle>
              <p className="text-xs text-slate-400">
                Upload CSV files to import batch prospect leads directly into your organization pipeline.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 space-y-6">
          {/* File Selector Dropzone */}
          <div className="border-2 border-dashed border-slate-800 hover:border-indigo-500/50 rounded-2xl p-8 text-center transition-colors bg-slate-950/40">
            <input
              type="file"
              accept=".csv"
              id="csv-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="csv-upload" className="cursor-pointer space-y-3 block">
              <FileSpreadsheet className="w-12 h-12 text-indigo-400 mx-auto" />
              <div>
                <p className="text-sm font-semibold text-white">
                  {file ? file.name : "Click to select a CSV file"}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {file ? `${(file.size / 1024).toFixed(1)} KB` : "Supports standard CSV with headers (First Name, Email, etc.)"}
                </p>
              </div>
            </label>
          </div>

          <div className="flex justify-end">
            <Button
              onClick={handleUpload}
              isLoading={importMutation.isPending}
              disabled={!file}
              className="px-8 h-11"
            >
              Start Bulk Import
            </Button>
          </div>

          {/* Import Summary Results */}
          {summary && (
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 animate-in fade-in duration-300">
              <h4 className="text-sm font-bold text-white flex items-center">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 mr-2" /> Import Execution Summary
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800">
                  <span className="text-xs text-slate-400">Total Rows</span>
                  <p className="text-lg font-bold text-white">{summary.totalRows}</p>
                </div>
                <div className="p-3 bg-emerald-950/30 rounded-xl border border-emerald-500/30">
                  <span className="text-xs text-emerald-400">Imported</span>
                  <p className="text-lg font-bold text-emerald-400">{summary.imported}</p>
                </div>
                <div className="p-3 bg-amber-950/30 rounded-xl border border-amber-500/30">
                  <span className="text-xs text-amber-400">Duplicates Skipped</span>
                  <p className="text-lg font-bold text-amber-400">{summary.duplicates}</p>
                </div>
                <div className="p-3 bg-red-950/30 rounded-xl border border-red-500/30">
                  <span className="text-xs text-red-400">Invalid Rows</span>
                  <p className="text-lg font-bold text-red-400">{summary.invalid}</p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <Link href="/leads">
                  <Button size="sm">View Imported Leads</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
