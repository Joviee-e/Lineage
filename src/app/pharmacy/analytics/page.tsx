"use client";

import React from "react";
import { useLineage } from "../../../lib/state/LineageContext";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from "recharts";
import { BarChart3, TrendingUp, Clock, CheckCircle2, Package } from "lucide-react";

const DEMO_HOURLY_TRAFFIC = [
  { hour: "8am", pings: 3, confirmed: 3 },
  { hour: "10am", pings: 7, confirmed: 6 },
  { hour: "12pm", pings: 12, confirmed: 11 },
  { hour: "2pm", pings: 9, confirmed: 8 },
  { hour: "4pm", pings: 15, confirmed: 14 },
  { hour: "6pm", pings: 18, confirmed: 17 },
  { hour: "8pm", pings: 8, confirmed: 8 }
];

const FRESHNESS_PIE = [
  { name: "Confirmed (<4h)", value: 78, color: "#10B981" },
  { name: "Needs Confirmation", value: 14, color: "#F59E0B" },
  { name: "Out of Stock", value: 8, color: "#64748B" }
];

export default function PharmacyAnalyticsPage() {
  const { currentPersona, pharmacies, inventory, reservations, availabilityRequests } = useLineage();
  const activePharmacyId = currentPersona.pharmacyId || "pharm-001";
  const pharmacy = pharmacies.find(p => p.id === activePharmacyId) || pharmacies[0];

  const pharmacyReservations = reservations.filter(r => r.pharmacyId === pharmacy.id);
  const completedReservations = pharmacyReservations.filter(r => r.status === "COMPLETED");

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            <span>Dispensary Intelligence</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
            Operational Analytics & Speed Metrics
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {pharmacy.name} • Response performance, stock freshness retention, and counter pickup conversion.
          </p>
        </div>

        {/* Metrics Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Response Speed</span>
            <div className="text-3xl font-extrabold text-slate-900">~{pharmacy.responseTimeAvgMinutes} min</div>
            <p className="text-[11px] text-emerald-700 font-medium">Faster than 85% of dispensaries</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Pickup Handoff Rate</span>
            <div className="text-3xl font-extrabold text-slate-900">
              {pharmacyReservations.length > 0 ? Math.round((completedReservations.length / pharmacyReservations.length) * 100) : 100}%
            </div>
            <p className="text-[11px] text-slate-500">{completedReservations.length} completed collections</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400">Customer Rating</span>
            <div className="text-3xl font-extrabold text-slate-900">★ {pharmacy.rating}</div>
            <p className="text-[11px] text-slate-500">Based on {pharmacy.reviewsCount} verified patient ratings</p>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Patient Pings vs Confirmed Availability (Today)</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEMO_HOURLY_TRAFFIC}>
                  <XAxis dataKey="hour" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="pings" fill="#CBD5E1" radius={[4, 4, 0, 0]} name="Inquiries" />
                  <Bar dataKey="confirmed" fill="#10B981" radius={[4, 4, 0, 0]} name="Confirmed" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Stock Freshness Split</h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={FRESHNESS_PIE} innerRadius={50} outerRadius={80} dataKey="value">
                    {FRESHNESS_PIE.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 text-xs">
              {FRESHNESS_PIE.map(item => (
                <div key={item.name} className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-slate-800">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
