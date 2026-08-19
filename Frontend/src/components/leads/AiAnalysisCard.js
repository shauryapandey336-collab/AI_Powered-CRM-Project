"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Brain, CheckCircle2, AlertCircle } from "lucide-react";
import { aiService } from "@/services/ai.service";
import { toast } from "sonner";

export default function AiAnalysisCard({ leadId, currentScore = 0, onAnalyzed }) {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState(null);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await aiService.analyzeLead(leadId);
      if (response.success && response.data?.analysis) {
        setAnalysis(response.data.analysis);
        toast.success("AI Analysis generated successfully!");
        if (onAnalyzed) onAnalyzed(response.data.analysis);
      }
    } catch (error) {
      toast.error(error.message || "AI Analysis failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-purple-950/40 border-indigo-500/30 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
        <Sparkles className="w-32 h-32 text-indigo-400" />
      </div>

      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <CardTitle className="text-base font-bold text-white">AI Lead Intelligence</CardTitle>
            <p className="text-xs text-slate-400">OpenAI powered lead evaluation & scoring</p>
          </div>
        </div>

        <Button
          onClick={handleAnalyze}
          isLoading={loading}
          size="sm"
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-medium shadow-md shadow-indigo-600/30"
        >
          <Sparkles className="w-4 h-4 mr-1.5" />
          {analysis ? "Re-Analyze" : "Run AI Analysis"}
        </Button>
      </CardHeader>

      <CardContent className="space-y-4 pt-2">
        {!analysis ? (
          <div className="flex flex-col items-center justify-center p-6 text-center border border-dashed border-indigo-500/20 rounded-xl bg-indigo-950/10">
            <Sparkles className="w-8 h-8 text-indigo-400 mb-2 animate-bounce" />
            <p className="text-sm font-semibold text-slate-200">
              Current Lead Score: <span className="text-indigo-400">{currentScore}/100</span>
            </p>
            <p className="text-xs text-slate-400 mt-1 max-w-md">
              Click &quot;Run AI Analysis&quot; to evaluate this lead with OpenAI to generate qualification metrics, summary, and action items.
            </p>
          </div>
        ) : (
          <div className="space-y-4 animate-in fade-in duration-300">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center space-x-4">
                <div className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 font-extrabold text-xl border border-indigo-500/30">
                  {analysis.score}
                </div>
                <div>
                  <span className="text-xs text-slate-400">Calculated Quality Score</span>
                  <p className="text-sm font-bold text-white">Out of 100 points</p>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Assigned Priority</span>
                  <div className="mt-1">
                    <Badge variant={analysis.priority}>{analysis.priority} PRIORITY</Badge>
                  </div>
                </div>
                {analysis.priority === "HIGH" ? (
                  <CheckCircle2 className="w-8 h-8 text-emerald-400" />
                ) : (
                  <AlertCircle className="w-8 h-8 text-amber-400" />
                )}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1">
              <h5 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Executive Summary</h5>
              <p className="text-xs text-slate-200 leading-relaxed">{analysis.summary}</p>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/30 space-y-1">
              <h5 className="text-xs font-semibold text-indigo-400 uppercase tracking-wider flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Recommended Action
              </h5>
              <p className="text-xs text-slate-100 font-medium">{analysis.recommendedAction}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950/40 border border-slate-800/60">
              <span className="text-[11px] font-medium text-slate-400">Reasoning: </span>
              <span className="text-[11px] text-slate-300">{analysis.reasoning}</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
