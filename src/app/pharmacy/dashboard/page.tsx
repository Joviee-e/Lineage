"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLineage } from "../../../lib/state/LineageContext";
import { OneTapResponseCard } from "../../../components/pharmacy/OneTapResponseCard";
import { ParticipationBadge, FreshnessBadge, OrderStatusBadge } from "../../../components/common/Badge";
import { 
  Store, 
  Bell, 
  Package, 
  Clock, 
  FileSpreadsheet, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  RotateCcw
} from "lucide-react";

export default function PharmacyDashboardPage() {
  const router = useRouter();
  const { 
    currentPersona, 
    pharmacies, 
    products, 
    inventory, 
    availabilityRequests, 
    reservations, 
    batches,
    switchPersona 
  } = useLineage();

  // Active pharmacy (defaults to persona's assigned pharmacy or St. Jude)
  const activePharmacyId = currentPersona.pharmacyId || "pharm-001";
  const pharmacy = pharmacies.find(p => p.id === activePharmacyId) || pharmacies[0];

  const incomingRequests = availabilityRequests.filter(r => 
    r.targetPharmacyIds.includes(pharmacy.id)
  );

  const pharmacyInventory = inventory.filter(i => i.pharmacyId === pharmacy.id);
  const pharmacyReservations = reservations.filter(r => r.pharmacyId === pharmacy.id);

  // Stale inventory records needing confirmation
  const staleRecords = pharmacyInventory.filter(i => i.freshnessCategory === "NEEDS_CONFIRMATION");
  
  // Quarantined inventory records
  const quarantinedRecords = pharmacyInventory.filter(i => i.freshnessCategory === "RESTRICTED");

  // Ready for collection reservations
  const readyReservations = pharmacyReservations.filter(r => r.status === "READY_FOR_COLLECTION" || r.status === "CONFIRMED");

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Top Pharmacy Switcher Banner */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0B2A1F] text-emerald-300 flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
              <Store className="w-7 h-7 text-emerald-400" />
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Active Dispensary Terminal
                </span>
                <ParticipationBadge mode={pharmacy.participationMode} />
              </div>

              <h1 className="text-2xl font-extrabold text-[#0B2A1F]">{pharmacy.name}</h1>
              <p className="text-xs text-slate-500">
                {pharmacy.address} • License: <strong className="font-mono text-slate-700">{pharmacy.licenseNumber}</strong>
              </p>
            </div>
          </div>

          {/* Quick Pharmacy Terminal Switcher */}
          <div className="flex items-center gap-2 bg-slate-50 p-2 rounded-2xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-600 pl-2">Switch Store:</span>
            <select
              value={pharmacy.id}
              onChange={e => switchPersona("PHARMACIST", e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white cursor-pointer"
            >
              <option value="pharm-001">St. Jude Apothecary (Connected Ledger)</option>
              <option value="pharm-002">Greenfield Family Pharmacy (One-Tap Zero Ledger)</option>
              <option value="pharm-003">Apex Care 24/7 (CSV Import Store)</option>
              <option value="pharm-004">Oakridge Prescription Centre</option>
            </select>
          </div>
        </div>

        {/* Quarantine Alert if Stock is Affected (Scenario F) */}
        {quarantinedRecords.length > 0 && (
          <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-400 text-xs text-rose-900 flex items-start gap-3 shadow-sm animate-pulse">
            <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="text-sm font-bold text-rose-950 block">
                LOT RESTRICTION NOTICE: {quarantinedRecords.length} Inventory Item(s) Quarantined
              </strong>
              <p className="mt-1 leading-relaxed">
                Platform Quality Director has issued an emergency simulated quarantine on Batch BAT-AUG-2024-881. 
                Associated packs in your dispensary have been suppressed from public search. Do NOT dispense lot 881.
              </p>
              <div className="mt-2">
                <a
                  href="/pharmacy/batches"
                  className="font-bold underline text-rose-900 hover:text-rose-950"
                >
                  View Quarantined Lots in Batch Ledger →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Metric Cards Row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Incoming Availability Pings</span>
              <Bell className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{incomingRequests.length}</div>
            <p className="text-[11px] text-slate-500">Patient requests needing 1-tap confirmation</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Active Reservations</span>
              <Package className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">{pharmacyReservations.length}</div>
            <p className="text-[11px] text-slate-500">{readyReservations.length} ready in pickup bays</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Stock Freshness</span>
              <Clock className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-3xl font-extrabold text-emerald-800">
              {Math.round(((pharmacyInventory.length - staleRecords.length) / Math.max(1, pharmacyInventory.length)) * 100)}%
            </div>
            <p className="text-[11px] text-slate-500">{staleRecords.length} records require re-verification</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span className="font-semibold uppercase tracking-wider text-[10px]">Avg Response Time</span>
              <TrendingUp className="w-4 h-4 text-teal-600" />
            </div>
            <div className="text-3xl font-extrabold text-slate-900">~{pharmacy.responseTimeAvgMinutes}m</div>
            <p className="text-[11px] text-slate-500">Top 10% in Metro Health Corridor</p>
          </div>
        </div>

        {/* Main Content Layout: Incoming Requests Queue & Fast Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Incoming Availability Pings Queue */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  <span>One-Tap Availability Requests</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold">
                    {incomingRequests.length} Pending
                  </span>
                </h2>
                <p className="text-xs text-slate-500">
                  Tap 'Available' or 'Out of Stock' in 1 second. No inventory ledger required.
                </p>
              </div>

              <a
                href="/pharmacy/requests"
                className="text-xs font-bold text-emerald-800 hover:underline"
              >
                View Full Queue →
              </a>
            </div>

            {incomingRequests.length === 0 ? (
              <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                No open availability pings currently queued for this dispensary.
              </div>
            ) : (
              <div className="space-y-3">
                {incomingRequests.map(req => {
                  const product = products.find(p => p.id === req.productId);
                  if (!product) return null;

                  return (
                    <OneTapResponseCard
                      key={req.id}
                      request={req}
                      product={product}
                      pharmacyId={pharmacy.id}
                    />
                  );
                })}
              </div>
            )}

            {/* Ready for Collection Orders */}
            <div className="pt-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-slate-900">
                  Counter Reservations Ready for Pickup ({readyReservations.length})
                </h3>
                <a href="/pharmacy/reservations" className="text-xs font-bold text-emerald-800 hover:underline">
                  Open Collection Desk →
                </a>
              </div>

              {readyReservations.length === 0 ? (
                <div className="p-6 rounded-2xl bg-white border border-slate-200 text-center text-xs text-slate-500">
                  No pending pickups awaiting collection.
                </div>
              ) : (
                <div className="space-y-2">
                  {readyReservations.map(res => {
                    const prod = products.find(p => p.id === res.productId);
                    return (
                      <div
                        key={res.id}
                        onClick={() => router.push(`/pharmacy/reservations`)}
                        className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer flex items-center justify-between text-xs"
                      >
                        <div>
                          <div className="font-bold text-slate-900">{prod?.brandName} ({res.quantity} pack)</div>
                          <div className="text-slate-500">Patient: {res.patientName} • Verification PIN: <strong className="font-mono text-emerald-900">{res.verificationCode}</strong></div>
                        </div>

                        <div className="flex items-center gap-3">
                          <OrderStatusBadge status={res.status} />
                          <span className="font-bold text-emerald-800">Handle Pickup →</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Fast Pharmacist Actions & Stock Freshness Panel */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-bold text-sm text-slate-900">Dispensary Operations</h3>

              <div className="space-y-2 text-xs">
                <a
                  href="/pharmacy/import"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                    <div>
                      <div className="font-bold text-slate-900">Messy CSV Import</div>
                      <div className="text-[11px] text-slate-500">AI auto-maps varied column headers</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="/pharmacy/inventory"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <Package className="w-4 h-4 text-emerald-700" />
                    <div>
                      <div className="font-bold text-slate-900">Live Stock Ledger</div>
                      <div className="text-[11px] text-slate-500">{pharmacyInventory.length} products tracked</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="/pharmacy/batches"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-4 h-4 text-rose-600" />
                    <div>
                      <div className="font-bold text-slate-900">Batch & Expiry Ledger</div>
                      <div className="text-[11px] text-slate-500">Monitor quarantine status & shelf life</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="/pharmacy/analytics"
                  className="flex items-center justify-between p-3 rounded-xl border border-slate-200 bg-slate-50 hover:bg-emerald-50/50 hover:border-emerald-300 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <TrendingUp className="w-4 h-4 text-teal-600" />
                    <div>
                      <div className="font-bold text-slate-900">Performance Analytics</div>
                      <div className="text-[11px] text-slate-500">Request response rate & speed</div>
                    </div>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>

            {/* Zero-Ledger Independent Chemist Callout */}
            <div className="p-5 rounded-3xl bg-[#0B2A1F] text-white shadow-md space-y-3">
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-300">
                <Store className="w-4 h-4" />
                <span>Zero Digital Burden Guarantee</span>
              </div>
              <p className="text-xs text-emerald-100/80 leading-relaxed">
                If you run an independent family pharmacy without computer software, you are NOT required to upload or maintain spreadsheets. 
                Patients find you, ping your counter, and you tap to confirm.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
