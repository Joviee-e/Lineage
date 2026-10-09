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
  Cell, 
  LineChart, 
  Line 
} from "recharts";
import { 
  Store, 
  Package, 
  Bell, 
  ShieldAlert, 
  Bike, 
  Bot, 
  Clock, 
  CheckCircle2, 
  History,
  TrendingUp,
  ArrowRight
} from "lucide-react";

const DEMO_WEEKLY_ACTIVITY = [
  { day: "Mon", requests: 38, confirmed: 35, reservations: 18 },
  { day: "Tue", requests: 45, confirmed: 42, reservations: 24 },
  { day: "Wed", requests: 52, confirmed: 49, reservations: 29 },
  { day: "Thu", requests: 48, confirmed: 44, reservations: 22 },
  { day: "Fri", requests: 65, confirmed: 61, reservations: 38 },
  { day: "Sat", requests: 72, confirmed: 68, reservations: 42 },
  { day: "Sun", requests: 30, confirmed: 29, reservations: 16 }
];

const FULFILLMENT_SPLIT = [
  { name: "Reserve & Collect (Default)", value: 74, color: "#0F382A" },
  { name: "Simulated Delivery", value: 26, color: "#10B981" }
];

export default function AdminDashboardPage() {
  const { 
    pharmacies, 
    products, 
    inventory, 
    batches, 
    reservations, 
    availabilityRequests, 
    restrictionEvents, 
    agentExecutions 
  } = useLineage();

  const totalPharmacies = pharmacies.length;
  const activePharmacies = pharmacies.filter(p => p.isActive).length;
  const totalProducts = products.length;
  const totalStockRecords = inventory.length;
  const staleRecords = inventory.filter(i => i.freshnessCategory === "NEEDS_CONFIRMATION").length;
  const quarantinedRecords = inventory.filter(i => i.freshnessCategory === "RESTRICTED").length;
  const completedPickups = reservations.filter(r => r.status === "COMPLETED" && r.fulfillmentType === "PICKUP").length;
  const completedDeliveries = reservations.filter(r => r.status === "COMPLETED" && r.fulfillmentType === "DELIVERY").length;

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              <ShieldAlert className="w-4 h-4 text-emerald-700" />
              <span>Network Operations & Regulatory Oversight</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
              Platform Administration
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Real-time health telemetry across {totalPharmacies} pharmacies, {totalProducts} canonical drugs, and active batch quarantines.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/admin/restrictions"
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-md"
            >
              <ShieldAlert className="w-4 h-4" />
              <span>Simulate Recall / Quarantine</span>
            </a>
          </div>
        </div>

        {/* Overview KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Pharmacies</span>
            <div className="text-2xl font-black text-slate-900">{activePharmacies} / {totalPharmacies}</div>
            <span className="text-[10px] text-emerald-700 font-semibold">100% Verified</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Drug Catalogue</span>
            <div className="text-2xl font-black text-slate-900">{totalProducts}</div>
            <span className="text-[10px] text-slate-500">Canonical lines</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Live Stock Items</span>
            <div className="text-2xl font-black text-slate-900">{totalStockRecords}</div>
            <span className="text-[10px] text-emerald-700 font-semibold">{totalStockRecords - staleRecords} Confirmed Fresh</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Orders</span>
            <div className="text-2xl font-black text-slate-900">{reservations.length}</div>
            <span className="text-[10px] text-slate-500">{completedPickups} Pickups Completed</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Stale Items</span>
            <div className="text-2xl font-black text-amber-700">{staleRecords}</div>
            <span className="text-[10px] text-amber-700 font-semibold">&gt;4h Inactivity</span>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs space-y-1">
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Quarantined Lots</span>
            <div className={`text-2xl font-black ${quarantinedRecords > 0 ? "text-rose-700 animate-pulse" : "text-slate-900"}`}>
              {quarantinedRecords}
            </div>
            <span className="text-[10px] text-rose-700 font-semibold">Lot 881 Status</span>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Traffic & Fulfillment Chart */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-base text-slate-900">Weekly Network Velocity</h3>
                <p className="text-xs text-slate-500">Patient availability pings vs fulfilled reservations</p>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                92.4% Response Rate
              </span>
            </div>

            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={DEMO_WEEKLY_ACTIVITY}>
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} />
                  <YAxis stroke="#94A3B8" fontSize={11} />
                  <Tooltip />
                  <Bar dataKey="requests" fill="#E2E8F0" radius={[4, 4, 0, 0]} name="Inquiries" />
                  <Bar dataKey="confirmed" fill="#10B981" radius={[4, 4, 0, 0]} name="Confirmed" />
                  <Bar dataKey="reservations" fill="#0B2A1F" radius={[4, 4, 0, 0]} name="Reservations" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Fulfillment Method Split */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">Fulfilment Distribution</h3>
              <p className="text-xs text-slate-500">Reserve-and-collect default vs simulated delivery</p>
            </div>

            <div className="h-56 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={FULFILLMENT_SPLIT} innerRadius={55} outerRadius={85} dataKey="value">
                    {FULFILLMENT_SPLIT.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-1.5 text-xs">
              {FULFILLMENT_SPLIT.map(item => (
                <div key={item.name} className="flex justify-between items-center">
                  <span className="flex items-center gap-1.5 text-slate-700">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                    {item.name}
                  </span>
                  <span className="font-bold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Fast Management Links */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <a
            href="/admin/pharmacies"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-slate-900 text-sm">Pharmacy Network Management</div>
              <div className="text-slate-500">Inspect participation modes & active status</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href="/admin/products"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-slate-900 text-sm">Canonical Product Registry</div>
              <div className="text-slate-500">Manage brand aliases & drug formulations</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </a>

          <a
            href="/admin/agents"
            className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-emerald-300 transition-all flex items-center justify-between"
          >
            <div>
              <div className="font-bold text-slate-900 text-sm">AI Agent Centre (6 Agents)</div>
              <div className="text-slate-500">Monitor OCR, mapping & quarantine safety</div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400" />
          </a>
        </div>
      </div>
    </div>
  );
}
