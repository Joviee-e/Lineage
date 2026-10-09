"use client";

import React, { useState } from "react";
import { useLineage } from "../../../lib/state/LineageContext";
import { History, ShieldCheck, Filter, Search } from "lucide-react";

export default function AdminAuditPage() {
  const { auditEvents } = useLineage();
  const [filterType, setFilterType] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = auditEvents.filter(evt => {
    if (filterType !== "ALL" && evt.entityType !== filterType) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return evt.action.toLowerCase().includes(q) || 
             evt.actor.toLowerCase().includes(q) || 
             evt.details.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <History className="w-4 h-4 text-emerald-600" />
            <span>Traceability & Compliance Records</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
            Platform Immutable Audit Log
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Traceable chronological event record tracking every reservation, stock confirmation, batch quarantine, and agent decision.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search audit details or actor..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-slate-400 font-semibold">Entity:</span>
            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
              className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
            >
              <option value="ALL">All Entity Types</option>
              <option value="INVENTORY">Inventory</option>
              <option value="RESERVATION">Reservations</option>
              <option value="RESTRICTION">Quarantine / Recall</option>
              <option value="IMPORT">CSV Import</option>
              <option value="PRODUCT">Products</option>
              <option value="DELIVERY">Delivery</option>
            </select>
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="px-6 py-4">Timestamp</th>
                  <th className="px-4 py-4">Action</th>
                  <th className="px-4 py-4">Entity</th>
                  <th className="px-4 py-4">Actor / Role</th>
                  <th className="px-6 py-4">Event Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map(evt => (
                  <tr key={evt.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                      {new Date(evt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>

                    <td className="px-4 py-4">
                      <span className="font-bold text-slate-900 font-mono text-[11px] px-2 py-0.5 rounded bg-slate-100">
                        {evt.action}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-900 border border-emerald-200">
                        {evt.entityType}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      <div className="font-bold text-slate-900">{evt.actor}</div>
                      <div className="text-[10px] text-slate-400 font-semibold">{evt.role}</div>
                    </td>

                    <td className="px-6 py-4 text-slate-600 leading-relaxed">
                      {evt.details}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
