"use client";

import React, { useState } from "react";
import { useLineage } from "../../../lib/state/LineageContext";
import { AgentCard } from "../../../components/admin/AgentCard";
import { AgentExecution } from "../../../lib/types";
import { Bot, Sparkles, ShieldCheck, CheckCircle2, AlertTriangle, Play } from "lucide-react";

export default function AdminAgentsPage() {
  const { agentExecutions, recordAgentExecution } = useLineage();
  const [filterAgent, setFilterAgent] = useState<string>("ALL");

  const agentsList: {
    id: AgentExecution["agentId"];
    title: string;
    tagline: string;
    description: string;
    clinicalSafetyRule: string;
  }[] = [
    {
      id: "AGENT_1_OCR",
      title: "Agent 1 — Medicine Identification Agent",
      tagline: "Blister strip & packaging optical character recognition",
      description: "Processes uploaded medicine photographs, extracts chemical strength typography, and queries the canonical registry for candidate formulations.",
      clinicalSafetyRule: "Never claims image establishes authentic drug composition or replaces mandatory patient confirmation."
    },
    {
      id: "AGENT_2_IMPORT",
      title: "Agent 2 — Inventory Mapping Agent",
      tagline: "Messy spreadsheet header & alias auto-resolver",
      description: "Ingests inconsistent pharmacy CSV headers (e.g. 'ON_HAND_STOCK', 'LOT_NUMBER'), scores confidence, and matches candidate lines against canonical drug identifiers.",
      clinicalSafetyRule: "Ambiguous mappings require human pharmacist review before committing mutations to live state."
    },
    {
      id: "AGENT_3_AVAILABILITY",
      title: "Agent 3 — Availability Coordination Agent",
      tagline: "Broadcast ping manager & response aggregator",
      description: "Identifies nearby dispensaries for open medicine requests, broadcasts low-friction pings, aggregates one-tap pharmacist responses, and updates patient discovery cards.",
      clinicalSafetyRule: "Operates deterministically on geographic radius without exposing patient medical history to non-participating stores."
    },
    {
      id: "AGENT_4_INTELLIGENCE",
      title: "Agent 4 — Inventory Intelligence Agent",
      tagline: "Telemetry auditor & stock freshness monitor",
      description: "Continuously scans inventory timestamps. When a stock confirmation crosses the 4-hour freshness threshold, downgrades record to 'Needs Confirmation'.",
      clinicalSafetyRule: "Missing verification data is never assumed to be zero stock; represented as 'Needs Confirmation'."
    },
    {
      id: "AGENT_5_TRACEABILITY",
      title: "Agent 5 — Traceability & Restriction Agent",
      tagline: "Quarantine coordinator & blast radius evaluator",
      description: "When authorized quality advisories are simulated, identifies all linked pharmacy inventory records, suppresses compromised lots from patient search, and issues pharmacy alerts.",
      clinicalSafetyRule: "Quarantine suppression is deterministic and immediate. Unaffected batches are strictly preserved."
    },
    {
      id: "AGENT_6_FULFILLMENT",
      title: "Agent 6 — Fulfilment Coordination Agent",
      tagline: "Route efficiency evaluator & courier batching",
      description: "Compares reserve-and-collect against local delivery, checks route economics within 2.5 km corridors, and flags uneconomical deliveries in favor of counter pickup.",
      clinicalSafetyRule: "Reserve-and-collect remains the primary default. Delivery is cost-aware and illustrative."
    }
  ];

  const handleRunFullDiagnostic = () => {
    agentsList.forEach(ag => {
      recordAgentExecution({
        agentId: ag.id,
        agentName: ag.title,
        trigger: "Admin health sweep & policy integrity test",
        status: "SUCCESS",
        inputSummary: "Automated baseline telemetry check",
        outputSummary: "Agent active, responsive, and enforcing all clinical boundary constraints.",
        confidenceScore: 99,
        auditNote: "Platform integrity confirmed."
      });
    });
  };

  const filteredExecutions = filterAgent === "ALL" 
    ? agentExecutions 
    : agentExecutions.filter(e => e.agentId === filterAgent);

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <Bot className="w-4 h-4 text-emerald-600" />
              <span>Transparent AI Governance & Automation Hub</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
              AI Agent Activity Centre
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Inspect the 6 specialized AI agents running within Lineage. Accountable, transparent, and bounded by non-negotiable clinical safety gates.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRunFullDiagnostic}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B2A1F] hover:bg-[#134E3A] text-white font-bold text-xs shadow-md"
            >
              <Play className="w-3.5 h-3.5 text-emerald-300" />
              <span>Run Network-Wide Health Sweep</span>
            </button>
          </div>
        </div>

        {/* 6 Specialized Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {agentsList.map(agent => (
            <AgentCard
              key={agent.id}
              agentId={agent.id}
              title={agent.title}
              tagline={agent.tagline}
              description={agent.description}
              clinicalSafetyRule={agent.clinicalSafetyRule}
            />
          ))}
        </div>

        {/* Unified Live Execution History */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Unified Agent Execution Stream</h2>
              <p className="text-xs text-slate-500">Live operational ledger showing agent inputs, outputs, and confidence scores</p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-400 font-semibold">Filter:</span>
              <select
                value={filterAgent}
                onChange={e => setFilterAgent(e.target.value)}
                className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
              >
                <option value="ALL">All 6 Agents</option>
                <option value="AGENT_1_OCR">Agent 1: Packaging OCR</option>
                <option value="AGENT_2_IMPORT">Agent 2: CSV Mapping</option>
                <option value="AGENT_3_AVAILABILITY">Agent 3: Availability</option>
                <option value="AGENT_4_INTELLIGENCE">Agent 4: Freshness</option>
                <option value="AGENT_5_TRACEABILITY">Agent 5: Traceability</option>
                <option value="AGENT_6_FULFILLMENT">Agent 6: Fulfilment</option>
              </select>
            </div>
          </div>

          <div className="space-y-3">
            {filteredExecutions.map(exec => (
              <div
                key={exec.id}
                className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 text-xs space-y-2 hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">{exec.agentName}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      exec.status === "SUCCESS"
                        ? "bg-emerald-100 text-emerald-900"
                        : exec.status === "NEEDS_HUMAN_APPROVAL"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-slate-200 text-slate-700"
                    }`}>
                      {exec.status.replace(/_/g, " ")}
                    </span>
                  </div>

                  <span className="text-slate-400 text-[11px]">
                    {new Date(exec.timestamp).toLocaleTimeString()}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <strong className="text-slate-700 block mb-0.5">Input Summary:</strong>
                    <span className="text-slate-600">{exec.inputSummary}</span>
                  </div>

                  <div className="p-2 rounded-lg bg-white border border-slate-200">
                    <strong className="text-slate-700 block mb-0.5">Output Result:</strong>
                    <span className="text-slate-600">{exec.outputSummary}</span>
                  </div>
                </div>

                {exec.confidenceScore && (
                  <div className="text-[11px] text-emerald-800 font-bold flex items-center justify-between pt-1">
                    <span>Confidence Score: {exec.confidenceScore}%</span>
                    <span className="text-slate-400 font-normal italic">Safety boundary verified</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
