"use client";

import React from "react";
import { useLineage } from "../../../lib/state/LineageContext";
import { BatchStatusBadge } from "../../../components/common/Badge";
import { ShieldAlert, AlertTriangle, CheckCircle2, Clock, Package } from "lucide-react";

export default function PharmacyBatchesPage() {
  const { currentPersona, pharmacies, products, inventory, batches } = useLineage();
  const activePharmacyId = currentPersona.pharmacyId || "pharm-001";
  const pharmacy = pharmacies.find(p => p.id === activePharmacyId) || pharmacies[0];

  const pharmacyInventory = inventory.filter(i => i.pharmacyId === pharmacy.id && i.batchId);

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <ShieldAlert className="w-4 h-4 text-emerald-600" />
            <span>Traceability & Safety Ledger</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
            Batch & Lot Safety Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {pharmacy.name} • Monitor lot-level expiration dates, quality advisories, and isolation alerts.
          </p>
        </div>

        {/* Batch Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {batches.map(batch => {
            const prod = products.find(p => p.id === batch.productId);
            const stockInStore = pharmacyInventory.find(i => i.batchId === batch.id);
            const isQuarantined = batch.status === "RESTRICTED_QUARANTINE";

            return (
              <div
                key={batch.id}
                className={`p-5 rounded-3xl border transition-all ${
                  isQuarantined
                    ? "border-rose-400 bg-rose-50/60 shadow-md ring-2 ring-rose-500/20"
                    : "border-slate-200 bg-white shadow-xs"
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono font-bold text-sm text-slate-900">{batch.batchNumber}</span>
                  <BatchStatusBadge status={batch.status} />
                </div>

                <div className="space-y-1">
                  <h3 className="font-bold text-sm text-slate-900">{prod?.brandName || "Medicine"}</h3>
                  <p className="text-xs text-slate-500">{prod?.genericName} • {prod?.strength}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Manufacturing</span>
                    <span className="font-medium text-slate-800">{batch.manufacturingDate}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Expiry Date</span>
                    <span className="font-bold text-slate-900">{batch.expiryDate}</span>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Stock at this Dispensary:</span>
                  <span className="font-bold text-slate-900">
                    {stockInStore ? `${stockInStore.quantity || "Tracked"} units` : "0 units"}
                  </span>
                </div>

                {isQuarantined && (
                  <div className="mt-3 p-2.5 rounded-xl bg-rose-100 border border-rose-200 text-xs text-rose-900 space-y-1">
                    <strong className="block text-[11px] uppercase font-bold text-rose-950 flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      Immediate Action Required
                    </strong>
                    <p className="text-[11px] leading-relaxed">
                      {batch.restrictionReason || "Quality inspection hold applied. Segregate pack from dispensing shelf."}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
