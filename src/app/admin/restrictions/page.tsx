"use client";

import React, { useState } from "react";
import { useLineage } from "../../../lib/state/LineageContext";
import { BatchStatusBadge } from "../../../components/common/Badge";
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  RotateCcw, 
  Store, 
  Sparkles, 
  Package,
  Layers,
  Check
} from "lucide-react";

export default function AdminRestrictionsPage() {
  const { 
    batches, 
    products, 
    inventory, 
    pharmacies, 
    restrictionEvents, 
    triggerBatchRestriction, 
    liftBatchRestriction 
  } = useLineage();

  const [selectedBatchId, setSelectedBatchId] = useState("batch-aug-881");
  const [restrictionReason, setRestrictionReason] = useState(
    "Quality Control Advisory - Moisture seal defect observed on secondary packaging in Lot 881."
  );
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [successToast, setSuccessToast] = useState<string | null>(null);

  const targetBatch = batches.find(b => b.id === selectedBatchId);
  const targetProduct = targetBatch ? products.find(p => p.id === targetBatch.productId) : null;
  const affectedInventory = inventory.filter(i => i.batchId === selectedBatchId);
  const affectedPharmacies = pharmacies.filter(p => affectedInventory.some(i => i.pharmacyId === p.id));

  // Also show unaffected clean batches of the SAME product to prove Scenario F!
  const unaffectedBatches = targetProduct 
    ? batches.filter(b => b.productId === targetProduct.id && b.id !== selectedBatchId)
    : [];

  const handleTrigger = () => {
    if (!targetBatch) return;
    triggerBatchRestriction(targetBatch.id, restrictionReason, "CRITICAL_QUARANTINE");
    setConfirmModalOpen(false);
    setSuccessToast(`Quarantine event activated for Lot ${targetBatch.batchNumber}! Linked records isolated.`);
    setTimeout(() => setSuccessToast(null), 6000);
  };

  const handleLift = (batchId: string) => {
    liftBatchRestriction(batchId);
    setSuccessToast(`Quarantine lifted for lot ${batchId}. Inventory returned to regular supply.`);
    setTimeout(() => setSuccessToast(null), 6000);
  };

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-700 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-rose-600" />
            <span>Scenario F — Pharmaceutical Traceability & Isolation Engine</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
            Simulated Batch Restriction Simulator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Simulate a batch-level quarantine to demonstrate how Lineage immediately suppresses compromised lots across all pharmacies while keeping unaffected batches accessible.
          </p>
        </div>

        {/* Success Toast */}
        {successToast && (
          <div className="p-4 rounded-2xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold flex items-center gap-2 shadow-sm animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
            <span>{successToast}</span>
          </div>
        )}

        {/* Simulation Control Studio */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Quarantine Simulation Control</h2>
              <p className="text-xs text-slate-500">Configure parameters for mock regulatory quality advisory</p>
            </div>

            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-rose-50 text-rose-800 border border-rose-200">
              Admin Authorized Only
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Lot / Batch Number:</label>
              <select
                value={selectedBatchId}
                onChange={e => setSelectedBatchId(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs font-mono font-bold bg-slate-50 focus:ring-2 focus:ring-rose-500 cursor-pointer"
              >
                {batches.map(b => {
                  const p = products.find(prod => prod.id === b.productId);
                  return (
                    <option key={b.id} value={b.id}>
                      {b.batchNumber} — {p?.brandName} ({b.status})
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Quality Advisory / Defect Reason:</label>
              <input
                type="text"
                value={restrictionReason}
                onChange={e => setRestrictionReason(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-rose-500"
              />
            </div>
          </div>

          {/* Impact Preview Callout */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <h3 className="font-bold text-xs text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>Simulated Blast Radius Impact Preview:</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Affected Product</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">{targetProduct?.brandName}</span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Dispensaries Holding Lot</span>
                <span className="font-bold text-slate-900 text-sm mt-0.5 block">
                  {affectedPharmacies.length} pharmacies ({affectedPharmacies.map(p => p.name).join(", ") || "None"})
                </span>
              </div>

              <div className="p-3 bg-white rounded-xl border border-slate-200">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Unaffected Clean Batches</span>
                <span className="font-bold text-emerald-800 text-sm mt-0.5 block">
                  {unaffectedBatches.map(b => b.batchNumber).join(", ") || "None"}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              * Notice that when Lot BAT-AUG-2024-881 is quarantined at St. Jude and Apex Care, Beacon Health's stock under Lot BAT-AUG-2024-912 remains completely safe and visible to patients!
            </p>
          </div>

          {/* Trigger Button or Lift Button */}
          <div className="flex justify-end gap-3 pt-2">
            {targetBatch?.status === "RESTRICTED_QUARANTINE" ? (
              <button
                type="button"
                onClick={() => handleLift(targetBatch.id)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Lift Simulated Quarantine & Restore Regular Supply</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmModalOpen(true)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-md transition-colors"
              >
                <AlertTriangle className="w-4 h-4" />
                <span>Trigger Simulated Batch Quarantine</span>
              </button>
            )}
          </div>
        </div>

        {/* Traceability Audit Trail of Restriction Events */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900">
            Quarantine Audit Log & Incident Records ({restrictionEvents.length})
          </h3>

          {restrictionEvents.length === 0 ? (
            <div className="p-6 text-center text-xs text-slate-500">
              No quarantine events currently recorded in this session. Trigger one above to evaluate.
            </div>
          ) : (
            <div className="space-y-3 text-xs">
              {restrictionEvents.map(evt => (
                <div key={evt.id} className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-rose-950">{evt.batchNumber}</span>
                    <span className="text-[11px] text-slate-500">Issued: {new Date(evt.issuedAt).toLocaleTimeString()}</span>
                  </div>

                  <p className="text-slate-700">{evt.reason}</p>

                  <div className="flex justify-between items-center text-[11px] text-slate-500 pt-1 border-t border-rose-200/60">
                    <span>Issued By: {evt.issuedBy}</span>
                    <span className="font-semibold text-rose-800">
                      {evt.isActive ? "ACTIVE QUARANTINE" : "LIFTED / RESOLVED"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Confirmation Modal */}
        {confirmModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900">Confirm Simulated Batch Quarantine?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                This will immediately flag Batch <strong>{targetBatch?.batchNumber}</strong>, remove affected stock across all {affectedPharmacies.length} pharmacies from regular patient search, and generate high-priority dispensary alerts.
              </p>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setConfirmModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleTrigger}
                  className="px-5 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md"
                >
                  Confirm Quarantine
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
