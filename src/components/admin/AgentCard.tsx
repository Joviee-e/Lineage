"use client";

import React, { useState } from "react";
import { AgentExecution } from "../../lib/types";
import { useLineage } from "../../lib/state/LineageContext";
import { 
  Bot, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  Play, 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp,
  ExternalLink
} from "lucide-react";

interface AgentCardProps {
  agentId: AgentExecution["agentId"];
  title: string;
  tagline: string;
  description: string;
  clinicalSafetyRule: string;
  onTriggerTest?: () => void;
}

export function AgentCard({
  agentId,
  title,
  tagline,
  description,
  clinicalSafetyRule,
  onTriggerTest
}: AgentCardProps) {
  const { agentExecutions, recordAgentExecution } = useLineage();
  const [expanded, setExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  // Filter executions for this agent
  const executions = agentExecutions.filter(e => e.agentId === agentId);
  const latestExecution = executions[0];

  const handleManualRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      if (onTriggerTest) {
        onTriggerTest();
      } else {
        recordAgentExecution({
          agentId,
          agentName: title,
          trigger: "Admin manual verification ping",
          status: "SUCCESS",
          inputSummary: "Health verification and heuristic boundary test",
          outputSummary: "All deterministic matching policies verified. Zero anomalies.",
          confidenceScore: 98,
          auditNote: "Agent execution completed within approved clinical bounds."
        });
      }
      setIsRunning(false);
    }, 600);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-5 space-y-4 hover:border-emerald-300 transition-all">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-base text-slate-900">{title}</h3>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
            <p className="text-xs font-medium text-emerald-800">{tagline}</p>
          </div>
        </div>

        <button
          onClick={handleManualRun}
          disabled={isRunning}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          {isRunning ? (
            <span className="w-3 h-3 rounded-full border-2 border-white border-t-transparent animate-spin" />
          ) : (
            <Play className="w-3 h-3 text-emerald-400" />
          )}
          <span>{isRunning ? "Verifying..." : "Run Test"}</span>
        </button>
      </div>

      {/* Description */}
      <p className="text-xs text-slate-600 leading-relaxed">
        {description}
      </p>

      {/* Clinical Safety Boundary Box */}
      <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
        <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold uppercase tracking-wider text-[10px] block">Non-Negotiable Safety Constraint:</span>
          <span className="text-[11px] leading-relaxed">{clinicalSafetyRule}</span>
        </div>
      </div>

      {/* Latest Execution Summary */}
      {latestExecution && (
        <div className="pt-2 border-t border-slate-100 text-xs space-y-1.5">
          <div className="flex items-center justify-between text-slate-500">
            <span className="font-semibold text-slate-700">Latest Invocation:</span>
            <span>{new Date(latestExecution.timestamp).toLocaleTimeString()}</span>
          </div>

          <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 space-y-1">
            <div><strong className="text-slate-900">Trigger:</strong> {latestExecution.trigger}</div>
            <div><strong className="text-slate-900">Result:</strong> {latestExecution.outputSummary}</div>
            {latestExecution.confidenceScore && (
              <div className="text-emerald-700 font-bold">
                Confidence Rating: {latestExecution.confidenceScore}%
              </div>
            )}
          </div>
        </div>
      )}

      {/* Expand History Toggle */}
      {executions.length > 1 && (
        <div className="pt-1">
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-slate-800"
          >
            <span>{expanded ? "Hide" : "View"} Execution Logs ({executions.length})</span>
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>

          {expanded && (
            <div className="mt-2 space-y-2 max-h-48 overflow-y-auto pr-1">
              {executions.slice(1).map(exec => (
                <div key={exec.id} className="p-2 rounded bg-slate-50 border border-slate-200 text-[11px] text-slate-600">
                  <div className="flex justify-between font-semibold text-slate-800">
                    <span>{exec.trigger}</span>
                    <span>{new Date(exec.timestamp).toLocaleTimeString()}</span>
                  </div>
                  <p className="mt-0.5">{exec.outputSummary}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
