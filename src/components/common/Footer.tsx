"use client";

import React from "react";
import { Logo } from "./Logo";
import { ShieldCheck, HeartPulse, Sparkles, AlertCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 text-xs border-t border-slate-800 mt-auto">
      {/* Trust & Safety Principles Highlight Bar */}
      <div className="border-b border-slate-800/80 bg-slate-950/60 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 shrink-0 border border-emerald-800/50">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Exact-Product Integrity</h4>
              <p className="text-slate-400 mt-1 leading-relaxed">
                We prioritize the exact prescribed brand, strength, and formulation. Alternative brands are clearly segregated and never substituted without pharmacist consultation.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-teal-950 text-teal-400 shrink-0 border border-teal-800/50">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Independent Pharmacy Inclusion</h4>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Small neighborhood chemists can participate in the digital network through zero-friction one-tap responses without purchasing expensive point-of-sale software.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 shrink-0 border border-indigo-800/50">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-slate-200 text-sm">Accountable AI Interpretation</h4>
              <p className="text-slate-400 mt-1 leading-relaxed">
                Our 6 specialized AI agents assist in optical character recognition and messy data mapping, strictly separated from deterministic clinical and regulatory rules.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Information */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <Logo size="md" showTagline={true} />
            <p className="text-slate-400 text-xs leading-relaxed">
              Hyperlocal medicine discovery, real-time inventory intelligence, and batch-level pharmaceutical traceability network.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Demo Environment v2.0
              </span>
            </div>
          </div>

          {/* Patient Exploration */}
          <div>
            <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Patient Discovery</h5>
            <ul className="space-y-2">
              <li><a href="/search" className="hover:text-emerald-400 transition-colors">Exact Medicine Search</a></li>
              <li><a href="/search?tab=ocr" className="hover:text-emerald-400 transition-colors">Prescription Strip Scanner</a></li>
              <li><a href="/pharmacies" className="hover:text-emerald-400 transition-colors">Nearby Licensed Pharmacies</a></li>
              <li><a href="/requests" className="hover:text-emerald-400 transition-colors">Broadcast Availability Pings</a></li>
              <li><a href="/reservations" className="hover:text-emerald-400 transition-colors">Reserve & Collect Orders</a></li>
            </ul>
          </div>

          {/* Pharmacy & Logistics */}
          <div>
            <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Network Partners</h5>
            <ul className="space-y-2">
              <li><a href="/pharmacy/dashboard" className="hover:text-emerald-400 transition-colors">Dispensary Rapid Response</a></li>
              <li><a href="/pharmacy/inventory" className="hover:text-emerald-400 transition-colors">Stock Freshness Ledger</a></li>
              <li><a href="/pharmacy/import" className="hover:text-emerald-400 transition-colors">Messy CSV Mapping Wizard</a></li>
              <li><a href="/pharmacy/batches" className="hover:text-emerald-400 transition-colors">Batch Safety Verification</a></li>
              <li><a href="/delivery/dashboard" className="hover:text-emerald-400 transition-colors">Delivery Courier Dashboard</a></li>
            </ul>
          </div>

          {/* Safety & Administration */}
          <div>
            <h5 className="font-semibold text-slate-200 text-xs uppercase tracking-wider mb-3">Governance & AI</h5>
            <ul className="space-y-2">
              <li><a href="/admin/dashboard" className="hover:text-emerald-400 transition-colors">Platform Administration</a></li>
              <li><a href="/admin/restrictions" className="hover:text-emerald-400 transition-colors">Batch Quarantine Simulator</a></li>
              <li><a href="/admin/agents" className="hover:text-emerald-400 transition-colors">AI Agent Activity Centre</a></li>
              <li><a href="/admin/audit" className="hover:text-emerald-400 transition-colors">Immutable Audit Logs</a></li>
              <li><a href="/admin/products" className="hover:text-emerald-400 transition-colors">Canonical Drug Registry</a></li>
            </ul>
          </div>
        </div>

        {/* Mandatory Hackathon Disclaimer Box */}
        <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-2 max-w-3xl">
            <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-normal">
              <strong>Notice for Evaluators:</strong> LINEAGE is an interactive hackathon software prototype. 
              All pharmaceutical brand listings, batch codes, pharmacy coordinates, stock records, and recall advisories are simulated demonstration assets. 
              This software is not intended to provide clinical diagnosis, medical counsel, or official health authority regulatory notices.
            </p>
          </div>
          <div className="text-right text-[11px] text-slate-400 shrink-0">
            © 2026 Lineage Platform. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
}
