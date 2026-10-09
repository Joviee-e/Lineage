"use client";

import React, { useState } from "react";
import { useLineage } from "../../../lib/state/LineageContext";
import { ParticipationBadge } from "../../../components/common/Badge";
import { Store, ShieldCheck, CheckCircle2, XCircle, Search, Power } from "lucide-react";

export default function AdminPharmaciesPage() {
  const { pharmacies, inventory, togglePharmacyActive } = useLineage();
  const [search, setSearch] = useState("");

  const filtered = pharmacies.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.locality.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <Store className="w-4 h-4 text-emerald-600" />
              <span>Platform Network Governance</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
              Pharmacy Network Directory
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Audit participating dispensaries, manage license verifications, and toggle network active state.
            </p>
          </div>
        </div>

        {/* Filter Input */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter pharmacies by name or district..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          <div className="text-slate-500 font-medium">
            {filtered.length} Pharmacies Enrolled
          </div>
        </div>

        {/* Pharmacies Management Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="px-6 py-4">Dispensary Name / License</th>
                  <th className="px-4 py-4">District / Locality</th>
                  <th className="px-4 py-4">Participation Tier</th>
                  <th className="px-4 py-4 text-center">Avg Response</th>
                  <th className="px-4 py-4 text-center">Catalogued Lines</th>
                  <th className="px-4 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Network Toggle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map(pharm => {
                  const stockLines = inventory.filter(i => i.pharmacyId === pharm.id).length;

                  return (
                    <tr key={pharm.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-slate-900">{pharm.name}</div>
                        <div className="text-slate-400 font-mono text-[11px]">{pharm.licenseNumber}</div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="text-slate-800">{pharm.locality}</div>
                        <div className="text-[11px] text-slate-400">{pharm.address}</div>
                      </td>

                      <td className="px-4 py-4">
                        <ParticipationBadge mode={pharm.participationMode} />
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="font-bold text-emerald-800">~{pharm.responseTimeAvgMinutes} min</span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <span className="font-bold text-slate-900">{stockLines}</span>
                      </td>

                      <td className="px-4 py-4 text-center">
                        {pharm.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                            Deactivated
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => togglePharmacyActive(pharm.id)}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                            pharm.isActive
                              ? "bg-slate-100 text-slate-700 hover:bg-rose-50 hover:text-rose-700"
                              : "bg-emerald-700 text-white hover:bg-emerald-800"
                          }`}
                        >
                          {pharm.isActive ? "Deactivate" : "Activate"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
