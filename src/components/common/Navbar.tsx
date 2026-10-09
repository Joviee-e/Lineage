"use client";

import React, { useState } from "react";
import Link from "next/navigation";
import { usePathname } from "next/navigation";
import { useLineage } from "../../lib/state/LineageContext";
import { Logo } from "./Logo";
import { 
  Search, 
  Store, 
  Bell, 
  Package, 
  User, 
  LayoutDashboard, 
  FileSpreadsheet, 
  BarChart3, 
  ShieldAlert, 
  Bot, 
  History, 
  Bike,
  Menu,
  X
} from "lucide-react";

export function Navbar() {
  const pathname = usePathname();
  const { currentPersona, availabilityRequests, reservations, deliveryJobs, batches } = useLineage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Compute live counts
  const pendingRequestsCount = availabilityRequests.filter(r => r.status === "OPEN").length;
  const activeReservationsCount = reservations.filter(
    r => r.status !== "COMPLETED" && r.status !== "CANCELLED" && r.status !== "REJECTED"
  ).length;
  const activeJobsCount = deliveryJobs.filter(j => j.status === "AVAILABLE" || j.status === "ASSIGNED").length;
  const quarantinedBatchesCount = batches.filter(b => b.status === "RESTRICTED_QUARANTINE").length;

  const role = currentPersona.role;

  return (
    <header className="sticky top-8 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <a href="/" className="hover:opacity-95 transition-opacity">
            <Logo size="md" />
          </a>

          {/* Role-Specific Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-medium text-sm text-slate-600">
            {role === "PATIENT" && (
              <>
                <a
                  href="/search"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/search" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <Search className="w-4 h-4 text-emerald-700" />
                  <span>Find Medicine</span>
                </a>

                <a
                  href="/pharmacies"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/pharmacies" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <Store className="w-4 h-4 text-slate-500" />
                  <span>Nearby Pharmacies</span>
                </a>

                <a
                  href="/requests"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/requests" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <Bell className="w-4 h-4 text-slate-500" />
                  <span>Requests</span>
                  {pendingRequestsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      {pendingRequestsCount}
                    </span>
                  )}
                </a>

                <a
                  href="/reservations"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/reservations" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <Package className="w-4 h-4 text-slate-500" />
                  <span>Reservations</span>
                  {activeReservationsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                      {activeReservationsCount}
                    </span>
                  )}
                </a>

                <a
                  href="/profile"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/profile" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <User className="w-4 h-4 text-slate-500" />
                  <span>Profile</span>
                </a>
              </>
            )}

            {role === "PHARMACIST" && (
              <>
                <a
                  href="/pharmacy/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/pharmacy/dashboard" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                  <span>Dispensary Hub</span>
                </a>

                <a
                  href="/pharmacy/requests"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/pharmacy/requests" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <Bell className="w-4 h-4 text-slate-500" />
                  <span>Incoming Pings</span>
                  {pendingRequestsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {pendingRequestsCount}
                    </span>
                  )}
                </a>

                <a
                  href="/pharmacy/inventory"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/pharmacy/inventory" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <Store className="w-4 h-4 text-slate-500" />
                  <span>Stock & Freshness</span>
                </a>

                <a
                  href="/pharmacy/reservations"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/pharmacy/reservations" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <Package className="w-4 h-4 text-slate-500" />
                  <span>Reservations</span>
                </a>

                <a
                  href="/pharmacy/batches"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/pharmacy/batches" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-slate-500" />
                  <span>Batches</span>
                  {quarantinedBatchesCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                      {quarantinedBatchesCount}
                    </span>
                  )}
                </a>

                <a
                  href="/pharmacy/import"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/pharmacy/import" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <FileSpreadsheet className="w-4 h-4 text-slate-500" />
                  <span>CSV Import</span>
                </a>

                <a
                  href="/pharmacy/analytics"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/pharmacy/analytics" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <BarChart3 className="w-4 h-4 text-slate-500" />
                  <span>Analytics</span>
                </a>
              </>
            )}

            {role === "DELIVERY" && (
              <>
                <a
                  href="/delivery/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/delivery/dashboard" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <Bike className="w-4 h-4 text-emerald-700" />
                  <span>Rider Jobs Queue</span>
                  {activeJobsCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-white">
                      {activeJobsCount}
                    </span>
                  )}
                </a>
                <a
                  href="/delivery/jobs/DEL-801"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname.includes("/delivery/jobs") ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <Package className="w-4 h-4 text-slate-500" />
                  <span>Active Delivery (DEL-801)</span>
                </a>
              </>
            )}

            {role === "ADMIN" && (
              <>
                <a
                  href="/admin/dashboard"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/admin/dashboard" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4 text-emerald-700" />
                  <span>Overview</span>
                </a>

                <a
                  href="/admin/pharmacies"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/admin/pharmacies" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <Store className="w-4 h-4 text-slate-500" />
                  <span>Pharmacies</span>
                </a>

                <a
                  href="/admin/products"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/admin/products" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <Package className="w-4 h-4 text-slate-500" />
                  <span>Catalogue</span>
                </a>

                <a
                  href="/admin/restrictions"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/admin/restrictions" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <ShieldAlert className="w-4 h-4 text-slate-500" />
                  <span>Quarantine Sim</span>
                  {quarantinedBatchesCount > 0 && (
                    <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-600 text-white">
                      {quarantinedBatchesCount}
                    </span>
                  )}
                </a>

                <a
                  href="/admin/agents"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/admin/agents" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <Bot className="w-4 h-4 text-slate-500" />
                  <span>AI Agents</span>
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                </a>

                <a
                  href="/admin/audit"
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                    pathname === "/admin/audit" ? "bg-emerald-50 text-emerald-900 font-semibold" : "hover:text-emerald-950 hover:bg-slate-100"
                  }`}
                >
                  <History className="w-4 h-4 text-slate-500" />
                  <span>Audit Trail</span>
                </a>
              </>
            )}
          </nav>

          {/* Right Area: Contextual CTA & Persona Pill */}
          <div className="hidden sm:flex items-center gap-3">
            <a
              href="/admin/agents"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-medium"
              title="Inspect 6 Autonomous AI Agents"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-600" />
              <span>Agents Active (6)</span>
            </a>

            {role === "PATIENT" ? (
              <a
                href="/search"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B2A1F] hover:bg-[#134E3A] text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Search className="w-3.5 h-3.5 text-emerald-300" />
                <span>Search Catalogue</span>
              </a>
            ) : role === "PHARMACIST" ? (
              <a
                href="/pharmacy/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B2A1F] hover:bg-[#134E3A] text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Store className="w-3.5 h-3.5 text-emerald-300" />
                <span>One-Tap Queue</span>
              </a>
            ) : role === "DELIVERY" ? (
              <a
                href="/delivery/dashboard"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0B2A1F] hover:bg-[#134E3A] text-white text-xs font-semibold shadow-sm transition-all"
              >
                <Bike className="w-3.5 h-3.5 text-emerald-300" />
                <span>Dispatch Pool</span>
              </a>
            ) : (
              <a
                href="/admin/restrictions"
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-rose-200" />
                <span>Simulate Recall</span>
              </a>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 py-3 space-y-1 text-sm">
            {role === "PATIENT" && (
              <>
                <a href="/search" className="block px-3 py-2 rounded-md hover:bg-slate-100">Find Medicine</a>
                <a href="/pharmacies" className="block px-3 py-2 rounded-md hover:bg-slate-100">Nearby Pharmacies</a>
                <a href="/requests" className="block px-3 py-2 rounded-md hover:bg-slate-100">Availability Requests ({pendingRequestsCount})</a>
                <a href="/reservations" className="block px-3 py-2 rounded-md hover:bg-slate-100">Reservations ({activeReservationsCount})</a>
                <a href="/profile" className="block px-3 py-2 rounded-md hover:bg-slate-100">Patient Profile</a>
              </>
            )}
            {role === "PHARMACIST" && (
              <>
                <a href="/pharmacy/dashboard" className="block px-3 py-2 rounded-md hover:bg-slate-100">Dispensary Hub</a>
                <a href="/pharmacy/requests" className="block px-3 py-2 rounded-md hover:bg-slate-100">Incoming Requests ({pendingRequestsCount})</a>
                <a href="/pharmacy/inventory" className="block px-3 py-2 rounded-md hover:bg-slate-100">Inventory & Freshness</a>
                <a href="/pharmacy/reservations" className="block px-3 py-2 rounded-md hover:bg-slate-100">Reservations</a>
                <a href="/pharmacy/batches" className="block px-3 py-2 rounded-md hover:bg-slate-100">Batch Ledger</a>
                <a href="/pharmacy/import" className="block px-3 py-2 rounded-md hover:bg-slate-100">CSV Import</a>
                <a href="/pharmacy/analytics" className="block px-3 py-2 rounded-md hover:bg-slate-100">Analytics</a>
              </>
            )}
            {role === "DELIVERY" && (
              <>
                <a href="/delivery/dashboard" className="block px-3 py-2 rounded-md hover:bg-slate-100">Rider Dashboard</a>
                <a href="/delivery/jobs/DEL-801" className="block px-3 py-2 rounded-md hover:bg-slate-100">Active Job DEL-801</a>
              </>
            )}
            {role === "ADMIN" && (
              <>
                <a href="/admin/dashboard" className="block px-3 py-2 rounded-md hover:bg-slate-100">Overview Dashboard</a>
                <a href="/admin/pharmacies" className="block px-3 py-2 rounded-md hover:bg-slate-100">Pharmacy Network</a>
                <a href="/admin/products" className="block px-3 py-2 rounded-md hover:bg-slate-100">Catalogue Management</a>
                <a href="/admin/restrictions" className="block px-3 py-2 rounded-md hover:bg-slate-100">Batch Restriction Simulation</a>
                <a href="/admin/agents" className="block px-3 py-2 rounded-md hover:bg-slate-100">AI Agent Centre</a>
                <a href="/admin/audit" className="block px-3 py-2 rounded-md hover:bg-slate-100">Audit Trail</a>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
