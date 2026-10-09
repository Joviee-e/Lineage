"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLineage } from "../../lib/state/LineageContext";
import { ParticipationBadge } from "../../components/common/Badge";
import { InteractivePharmacyMap } from "../../components/map/InteractivePharmacyMap";
import { 
  Store, 
  MapPin, 
  Clock, 
  Phone, 
  Bike, 
  Search, 
  ShieldCheck, 
  CheckCircle2,
  Navigation,
  ArrowRight
} from "lucide-react";

export default function PharmaciesPage() {
  const router = useRouter();
  const { pharmacies, inventory, userLocation } = useLineage();
  const [filterMode, setFilterMode] = useState<string>("ALL");
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>(pharmacies[0]?.id || "");
  const [searchFilter, setSearchFilter] = useState("");

  const filteredPharmacies = pharmacies.filter(p => {
    if (filterMode !== "ALL" && p.participationMode !== filterMode) return false;
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return p.name.toLowerCase().includes(q) || p.locality.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Licensed Dispensary Network</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
              Nearby Pharmacies
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Explore 8 verified community and retail pharmacies in the Metro Health Corridor.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Origin:</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-emerald-700" />
              {userLocation.label}
            </span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchFilter}
              onChange={e => setSearchFilter(e.target.value)}
              placeholder="Search by pharmacy name or area..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap w-full md:w-auto">
            <span className="text-slate-400 font-semibold mr-1">Participation Mode:</span>
            {[
              { id: "ALL", label: "All Tiers" },
              { id: "ONE_TAP_REQUEST", label: "One-Tap Zero Ledger" },
              { id: "CSV_IMPORT", label: "CSV Sync" },
              { id: "CONNECTED_LEDGER", label: "Direct Ledger Link" }
            ].map(tier => (
              <button
                key={tier.id}
                type="button"
                onClick={() => setFilterMode(tier.id)}
                className={`px-3 py-1.5 rounded-lg transition-colors font-medium ${
                  filterMode === tier.id
                    ? "bg-[#0B2A1F] text-white shadow-xs font-semibold"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {tier.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Map & Pharmacies List Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Map Column */}
          <div className="lg:col-span-6 sticky top-24 space-y-3">
            <InteractivePharmacyMap
              pharmacies={filteredPharmacies}
              inventoryRecords={inventory}
              selectedPharmacyId={selectedPharmacyId}
              onSelectPharmacy={setSelectedPharmacyId}
              userLocation={userLocation}
              searchRadiusKm={5}
            />

            <div className="p-4 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-2">
              <div className="font-bold text-slate-900 flex items-center justify-between">
                <span>Inclusive Pharmacy Network Architecture</span>
                <span className="text-emerald-700 font-semibold">100% In-Stock Visibility</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                By allowing independent paper-first chemists to participate without point-of-sale software, 
                Lineage captures inventory from neighborhood stores that other apps miss.
              </p>
            </div>
          </div>

          {/* Directory Column */}
          <div className="lg:col-span-6 space-y-3">
            {filteredPharmacies.map(pharmacy => {
              const isSelected = pharmacy.id === selectedPharmacyId;
              const stockItemsCount = inventory.filter(i => i.pharmacyId === pharmacy.id).length;

              return (
                <div
                  key={pharmacy.id}
                  onClick={() => setSelectedPharmacyId(pharmacy.id)}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? "border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-600/30 shadow-md"
                      : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <ParticipationBadge mode={pharmacy.participationMode} />
                        <span className="text-[11px] font-semibold text-slate-500">
                          ★ {pharmacy.rating} ({pharmacy.reviewsCount} reviews)
                        </span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900">{pharmacy.name}</h3>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                        {pharmacy.address} • <strong className="text-slate-700">{pharmacy.locality}</strong>
                      </p>
                    </div>

                    <div className="text-right text-xs">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900">
                        OPEN NOW
                      </span>
                      <div className="text-[11px] text-slate-500 mt-1">{pharmacy.operatingHours}</div>
                    </div>
                  </div>

                  {/* Pharmacist & Metrics Bar */}
                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Pharmacist-in-Charge</span>
                      <span className="font-semibold text-slate-800 truncate block">{pharmacy.pharmacistInCharge}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Avg Response</span>
                      <span className="font-semibold text-emerald-800">~{pharmacy.responseTimeAvgMinutes} minutes</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Fulfilment</span>
                      <span className="font-semibold text-slate-800">
                        {pharmacy.fulfillmentMethods.join(" + ")}
                      </span>
                    </div>
                  </div>

                  {/* Action Link to Search this Pharmacy */}
                  <div className="mt-3 pt-2 flex items-center justify-between text-xs">
                    <span className="text-slate-500">
                      Catalogued lines: <strong className="text-slate-800">{stockItemsCount} items</strong>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/search?q=Augmentin`);
                      }}
                      className="text-emerald-800 font-bold hover:text-emerald-950 flex items-center gap-1"
                    >
                      <span>Check Prescribed Medicines</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
