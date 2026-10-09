"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLineage } from "../../lib/state/LineageContext";
import { Role } from "../../lib/types";
import { DEMO_PERSONAS } from "../../lib/data/seedData";
import { 
  UserCheck, 
  RotateCcw, 
  Sparkles, 
  ChevronDown, 
  ShieldAlert, 
  CheckCircle, 
  Info,
  Package,
  Layers,
  FileSpreadsheet
} from "lucide-react";

export function DemoControlBar() {
  const router = useRouter();
  const { currentPersona, switchPersona, resetDemoData, triggerBatchRestriction, activeScenarioNotice, setScenarioNotice } = useLineage();
  const [isScenarioMenuOpen, setIsScenarioMenuOpen] = useState(false);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  const handleRoleChange = (role: Role) => {
    switchPersona(role);
    if (role === "PATIENT") router.push("/search");
    else if (role === "PHARMACIST") router.push("/pharmacy/dashboard");
    else if (role === "DELIVERY") router.push("/delivery/dashboard");
    else if (role === "ADMIN") router.push("/admin/dashboard");
  };

  const runScenario = (scenarioKey: string) => {
    setIsScenarioMenuOpen(false);
    switch (scenarioKey) {
      case "A":
        // Exact Brand Discovery: Augmentin 625 Duo vs Moxikind-CV
        switchPersona("PATIENT");
        setScenarioNotice("Scenario A Active: Searching for exact prescribed brand 'Augmentin 625 Duo'. Notice how alternative brand Moxikind-CV is kept distinctly separate.");
        router.push("/search?q=Augmentin+625+Duo");
        break;
      case "B":
        // Stale Availability warning & confirmation ping
        switchPersona("PATIENT");
        setScenarioNotice("Scenario B Active: Apex Care reported Augmentin 625 stock 22h ago. Notice the amber 'Needs Confirmation' badge and one-tap Ping button.");
        router.push("/search?q=Augmentin+625+Duo");
        break;
      case "C":
        // Photo strip OCR identification
        switchPersona("PATIENT");
        setScenarioNotice("Scenario C Active: Medicine identification from package photo. Select a sample strip to preview OCR extraction and confidence scoring.");
        router.push("/search?tab=ocr");
        break;
      case "D":
        // End-to-end reservation & pickup
        switchPersona("PATIENT");
        setScenarioNotice("Scenario D Active: Inspect active reservation ORD-9428 at St. Jude Apothecary ready for collection with verification code LIN-772.");
        router.push("/orders/ORD-9428");
        break;
      case "E":
        // Delivery coordination & rider simulation
        switchPersona("DELIVERY");
        setScenarioNotice("Scenario E Active: Delivery rider dashboard. Inspect job DEL-801, review batching potential, and progress job to drop-off.");
        router.push("/delivery/dashboard");
        break;
      case "F":
        // Batch restriction & quarantine
        switchPersona("ADMIN");
        triggerBatchRestriction("batch-aug-881", "Quality Control Advisory - Secondary packaging moisture seal defect detected in Lot 881.", "CRITICAL_QUARANTINE");
        setScenarioNotice("Scenario F Active: Simulated restriction applied to Batch BAT-AUG-2024-881. Affected stock across pharmacies is quarantined while Batch 912 remains available.");
        router.push("/admin/restrictions");
        break;
      case "G":
        // Messy CSV import
        switchPersona("PHARMACIST", "pharm-003");
        setScenarioNotice("Scenario G Active: Messy CSV inventory import wizard. Auto-detect inconsistent headers, preview confidence flags, and commit to inventory.");
        router.push("/pharmacy/import");
        break;
      case "H":
        // Zero-ledger independent pharmacy mode
        switchPersona("PHARMACIST", "pharm-002");
        setScenarioNotice("Scenario H Active: Greenfield Family Pharmacy operates with ZERO digital ledger. Requests are confirmed in one tap without tracking complex stock ledgers.");
        router.push("/pharmacy/dashboard");
        break;
    }
  };

  const handleReset = () => {
    resetDemoData();
    setResetConfirmOpen(false);
    setScenarioNotice("Demo data restored to initial pristine state.");
    router.push("/");
  };

  return (
    <aside aria-label="Demo environment controls" className="bg-[#0B2A1F] text-slate-100 text-xs border-b border-emerald-900/60 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Left: Environment Badge & Role Switcher */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700/50 text-emerald-300 font-semibold tracking-wide text-[10px] uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Demo Sandbox
          </div>

          <span className="text-slate-400 text-xs hidden sm:inline">Role:</span>

          <div className="inline-flex rounded-lg bg-emerald-950/60 p-0.5 border border-emerald-800/40">
            {DEMO_PERSONAS.map(persona => {
              const isActive = currentPersona.role === persona.role;
              return (
                <button
                  key={persona.role}
                  onClick={() => handleRoleChange(persona.role)}
                  className={`px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-sm font-semibold"
                      : "text-slate-300 hover:text-white hover:bg-emerald-900/40"
                  }`}
                  title={`${persona.name} — ${persona.subtitle}`}
                >
                  {persona.role === "PATIENT" && "Patient"}
                  {persona.role === "PHARMACIST" && "Pharmacist"}
                  {persona.role === "DELIVERY" && "Delivery Rider"}
                  {persona.role === "ADMIN" && "Platform Admin"}
                </button>
              );
            })}
          </div>

          <span className="text-slate-400 text-[11px] hidden md:inline ml-1">
            ({currentPersona.name})
          </span>
        </div>

        {/* Right: Quick Scenario Launchers & Reset */}
        <div className="flex items-center gap-2 relative">
          {/* Quick Scenario Runner */}
          <div className="relative">
            <button
              onClick={() => setIsScenarioMenuOpen(!isScenarioMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-900/80 hover:bg-emerald-800 text-emerald-100 font-medium border border-emerald-700/60 transition-colors shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>Run Scenario</span>
              <ChevronDown className="w-3 h-3 text-emerald-300" />
            </button>

            {isScenarioMenuOpen && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl bg-slate-900 text-slate-100 border border-slate-700 shadow-2xl py-2 z-50 text-xs divide-y divide-slate-800">
                <div className="px-3 py-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-400 flex items-center justify-between">
                  <span>Hackathon Demo Scenarios</span>
                  <span className="text-emerald-400">8 Presets</span>
                </div>
                
                <div className="py-1">
                  <button
                    onClick={() => runScenario("A")}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-950/80 flex items-start gap-2.5 transition-colors"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Scenario A: Exact-Brand Discovery</div>
                      <div className="text-[11px] text-slate-400">Augmentin 625 Duo vs Moxikind-CV generic (Never silent substitution)</div>
                    </div>
                  </button>

                  <button
                    onClick={() => runScenario("B")}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-950/80 flex items-start gap-2.5 transition-colors"
                  >
                    <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Scenario B: Stale Availability Warning</div>
                      <div className="text-[11px] text-slate-400">Detects 22h-old inventory at Apex Care with one-tap ping request</div>
                    </div>
                  </button>

                  <button
                    onClick={() => runScenario("C")}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-950/80 flex items-start gap-2.5 transition-colors"
                  >
                    <Layers className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Scenario C: Photo Identification (OCR)</div>
                      <div className="text-[11px] text-slate-400">Upload sample blister strip; AI extracts brand & requests confirmation</div>
                    </div>
                  </button>

                  <button
                    onClick={() => runScenario("D")}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-950/80 flex items-start gap-2.5 transition-colors"
                  >
                    <Package className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Scenario D: Reserve & Collect Workflow</div>
                      <div className="text-[11px] text-slate-400">Track order ORD-9428, pickup Bay A-3 & verify with code LIN-772</div>
                    </div>
                  </button>

                  <button
                    onClick={() => runScenario("E")}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-950/80 flex items-start gap-2.5 transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Scenario E: Delivery Rider Simulation</div>
                      <div className="text-[11px] text-slate-400">View job DEL-801, cost-aware batching, pickup & dropoff verification</div>
                    </div>
                  </button>

                  <button
                    onClick={() => runScenario("F")}
                    className="w-full text-left px-3 py-2 hover:bg-rose-950/60 flex items-start gap-2.5 transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-rose-300">Scenario F: Simulated Batch Restriction</div>
                      <div className="text-[11px] text-slate-400">Quarantine Batch 881; automatically isolates stock across pharmacies</div>
                    </div>
                  </button>

                  <button
                    onClick={() => runScenario("G")}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-950/80 flex items-start gap-2.5 transition-colors"
                  >
                    <FileSpreadsheet className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Scenario G: Messy CSV Inventory Import</div>
                      <div className="text-[11px] text-slate-400">AI mapping agent resolves inconsistent headers and ambiguous rows</div>
                    </div>
                  </button>

                  <button
                    onClick={() => runScenario("H")}
                    className="w-full text-left px-3 py-2 hover:bg-emerald-950/80 flex items-start gap-2.5 transition-colors"
                  >
                    <UserCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-white">Scenario H: Zero-Ledger Independent Store</div>
                      <div className="text-[11px] text-slate-400">Greenfield Pharmacy responds via one-tap without a digital ledger</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Reset Demo Data Button */}
          <button
            onClick={() => setResetConfirmOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors"
            title="Reset all demo mutations to pristine state"
          >
            <RotateCcw className="w-3 h-3 text-slate-400" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>
        </div>
      </div>

      {/* Active Scenario Notice Banner */}
      {activeScenarioNotice && (
        <div className="bg-emerald-900/90 text-emerald-100 px-4 py-1.5 border-t border-emerald-700/60 flex items-center justify-between text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300 shrink-0" />
            <span>{activeScenarioNotice}</span>
          </div>
          <button
            onClick={() => setScenarioNotice(null)}
            className="text-emerald-300 hover:text-white text-[11px] font-semibold underline ml-3 shrink-0"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Reset Confirmation Dialog */}
      {resetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-900 rounded-xl p-5 max-w-sm w-full shadow-2xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-2">Reset Demo Environment?</h3>
            <p className="text-xs text-slate-600 mb-4 leading-relaxed">
              This will restore all medicines, pharmacy stock levels, active reservations, delivery jobs, and simulated batch restrictions back to initial demonstration values.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 text-white text-xs font-medium hover:bg-emerald-800 shadow-sm"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
