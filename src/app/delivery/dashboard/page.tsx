"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLineage } from "../../../lib/state/LineageContext";
import { 
  Bike, 
  Store, 
  MapPin, 
  Clock, 
  DollarSign, 
  Sparkles, 
  Package, 
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

export default function DeliveryDashboardPage() {
  const router = useRouter();
  const { currentPersona, deliveryJobs, pharmacies, updateDeliveryJobStatus } = useLineage();

  const handleAcceptJob = (jobId: string) => {
    updateDeliveryJobStatus(jobId, "ASSIGNED");
    router.push(`/delivery/jobs/${jobId}`);
  };

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
              <Bike className="w-4 h-4" />
              <span>Simulated Logistics Pool</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
              Delivery Partner Dispatch
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Active Rider: <strong>{currentPersona.name}</strong> • Zone 4 (Downtown Medical Corridor)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
              {deliveryJobs.filter(j => j.status === "AVAILABLE").length} Jobs Available
            </span>
          </div>
        </div>

        {/* Cost-Aware Batching Callout (Agent 6) */}
        <div className="p-5 rounded-3xl bg-gradient-to-r from-indigo-900 to-[#0B2A1F] text-white shadow-md space-y-2">
          <div className="flex items-center gap-2 text-xs font-bold text-indigo-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span>Agent 6 — Fulfilment & Route Batching Coordinator</span>
          </div>
          <h3 className="font-bold text-base">Cost-Aware Route Grouping Active</h3>
          <p className="text-xs text-indigo-100/80 leading-relaxed">
            Lineage evaluates medicine handling conditions (cold-chain, urgency) and automatically suggests grouping compatible orders 
            within a 2.5 km corridor to maximize rider payouts while keeping patient fees minimal.
          </p>
        </div>

        {/* Jobs List */}
        <div className="space-y-4">
          {deliveryJobs.map(job => {
            const pharmacy = pharmacies.find(p => p.id === job.pharmacyId);
            const isAssignedToMe = job.riderName === currentPersona.name;

            return (
              <div
                key={job.id}
                className={`p-6 rounded-3xl border transition-all ${
                  job.status === "ASSIGNED"
                    ? "border-emerald-500 bg-white ring-2 ring-emerald-600/30 shadow-md"
                    : "border-slate-200 bg-white shadow-xs"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-slate-900">{job.id}</span>
                    <span className="text-xs text-slate-400">• Order {job.orderId}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      job.status === "AVAILABLE"
                        ? "bg-emerald-100 text-emerald-900"
                        : job.status === "ASSIGNED"
                        ? "bg-sky-100 text-sky-900"
                        : job.status === "OUT_FOR_DELIVERY"
                        ? "bg-amber-100 text-amber-900"
                        : "bg-slate-100 text-slate-800"
                    }`}>
                      {job.status.replace(/_/g, " ")}
                    </span>
                    <span className="font-extrabold text-base text-emerald-900">
                      ${job.payout.toFixed(2)} payout
                    </span>
                  </div>
                </div>

                {/* Pickup & Destination Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Dispensary Pickup
                    </span>
                    <div className="font-bold text-slate-900">{pharmacy?.name}</div>
                    <div className="text-slate-500 flex items-center gap-1">
                      <Store className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                      <span>{job.pickupAddress}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                      Patient Destination
                    </span>
                    <div className="font-bold text-slate-900">{job.patientName}</div>
                    <div className="text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-blue-700 shrink-0" />
                      <span>{job.dropoffAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Batching & Action Row */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-slate-500 flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Est. Distance: ~{job.distanceKm} km ({job.estimatedTimeMinutes} mins)</span>
                    {job.batchGroupId && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-800 border border-indigo-200">
                        Grouped: {job.batchGroupId}
                      </span>
                    )}
                  </div>

                  <div>
                    {job.status === "AVAILABLE" ? (
                      <button
                        onClick={() => handleAcceptJob(job.id)}
                        className="px-5 py-2 rounded-xl bg-[#0B2A1F] hover:bg-[#134E3A] text-white font-bold text-xs shadow-md"
                      >
                        Accept Delivery Job
                      </button>
                    ) : (
                      <button
                        onClick={() => router.push(`/delivery/jobs/${job.id}`)}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-xs"
                      >
                        <span>Open Active Job Tracking</span>
                        <ArrowRight className="w-3.5 h-3.5 text-emerald-300" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
