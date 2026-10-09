"use client";

import React from "react";
import { useLineage } from "../../../lib/state/LineageContext";
import { OneTapResponseCard } from "../../../components/pharmacy/OneTapResponseCard";
import { Bell, Store, CheckCircle2 } from "lucide-react";

export default function PharmacyRequestsPage() {
  const { currentPersona, pharmacies, products, availabilityRequests } = useLineage();
  const activePharmacyId = currentPersona.pharmacyId || "pharm-001";
  const pharmacy = pharmacies.find(p => p.id === activePharmacyId) || pharmacies[0];

  const incomingRequests = availabilityRequests.filter(r => 
    r.targetPharmacyIds.includes(pharmacy.id)
  );

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <Bell className="w-4 h-4 text-emerald-600" />
              <span>Dispensary Counter Terminal</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
              Incoming Availability Pings
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {pharmacy.name} • One-tap confirmation queue for nearby patients searching for exact stock.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold border border-amber-300">
              {incomingRequests.length} Active Pings
            </span>
          </div>
        </div>

        {incomingRequests.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">All Pings Answered</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your counter queue is currently up to date. You will be alerted immediately when nearby patients ping for medicine stock.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
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
      </div>
    </div>
  );
}
