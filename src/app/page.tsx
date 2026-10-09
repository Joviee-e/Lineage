"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLineage } from "../lib/state/LineageContext";
import { 
  Search, 
  Camera, 
  Store, 
  ShieldCheck, 
  Clock, 
  Package, 
  Bike, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  MapPin, 
  Check, 
  Layers,
  Database,
  Building2,
  FileSpreadsheet
} from "lucide-react";

export default function LandingPage() {
  const router = useRouter();
  const { products, pharmacies, inventory } = useLineage();
  const [heroSearch, setHeroSearch] = useState("");

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      router.push(`/search?q=${encodeURIComponent(heroSearch.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <div className="flex flex-col w-full bg-[#FAFAF8] text-slate-900 overflow-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative pt-12 pb-20 md:py-24 border-b border-slate-200/80 bg-gradient-to-b from-white via-[#F7FAF8] to-[#FAFAF8]">
        {/* Subtle decorative background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0F382A08_1px,transparent_1px),linear-gradient(to_bottom,#0F382A08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Vision & Primary Actions */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Hyperlocal Medicine Discovery & Traceability Platform
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#0B2A1F] tracking-tight leading-[1.1]">
                The right medicine. <br />
                The right pharmacy. <br />
                <span className="text-emerald-700">Less uncertainty.</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Discover the exact medicine you need, check availability with nearby pharmacies, 
                and reserve before you travel. Built to make medicine availability more transparent, 
                reliable, and traceable.
              </p>

              {/* Hero Search Box */}
              <form onSubmit={handleHeroSubmit} className="pt-2 max-w-xl">
                <div className="p-2 rounded-2xl bg-white shadow-lg border border-slate-200 flex flex-col sm:flex-row items-center gap-2">
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700" />
                    <input
                      type="text"
                      value={heroSearch}
                      onChange={e => setHeroSearch(e.target.value)}
                      placeholder="Search exact brand (e.g. Augmentin 625 Duo)..."
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm focus:outline-none bg-slate-50/70 border border-slate-200 focus:border-emerald-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-[#0B2A1F] hover:bg-[#134E3A] text-white text-sm font-bold shadow-md transition-colors flex items-center justify-center gap-2 shrink-0"
                  >
                    <span>Find Medicine</span>
                    <ArrowRight className="w-4 h-4 text-emerald-300" />
                  </button>
                </div>

                <div className="flex items-center gap-2 pt-2.5 text-xs text-slate-500">
                  <span className="font-semibold text-slate-700">Popular:</span>
                  {["Augmentin 625 Duo", "Lipitor 20mg", "Glucophage XR", "Ventolin Inhaler"].map(item => (
                    <button
                      key={item}
                      type="button"
                      onClick={() => {
                        setHeroSearch(item);
                        router.push(`/search?q=${encodeURIComponent(item)}`);
                      }}
                      className="underline hover:text-emerald-800 transition-colors"
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </form>

              {/* Action Buttons */}
              <div className="flex items-center gap-4 pt-2">
                <a
                  href="/search?tab=ocr"
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-xs shadow-xs transition-colors"
                >
                  <Camera className="w-4 h-4 text-emerald-700" />
                  <span>Scan Medicine Strip (AI OCR)</span>
                </a>

                <a
                  href="/pharmacies"
                  className="flex items-center gap-1.5 text-xs font-semibold text-emerald-800 hover:text-emerald-950 transition-colors"
                >
                  <span>Explore Licensed Pharmacies</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Right Column: Interactive Live Network Teaser */}
            <div className="lg:col-span-5 relative">
              <div className="rounded-3xl bg-white p-6 shadow-xl border border-slate-200/90 relative overflow-hidden space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Live Dispensary Availability Feed
                    </span>
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                    Metro Corridor
                  </span>
                </div>

                {/* Sample Live Cards */}
                <div className="space-y-2.5 text-xs">
                  {/* Card 1: St. Jude Confirmed */}
                  <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Augmentin 625 Duo Tablet</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        St. Jude Apothecary • 0.4 km away
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-emerald-800 text-sm">$18.50</span>
                      <span className="block text-[10px] text-emerald-700 font-medium">Confirmed 35m ago</span>
                    </div>
                  </div>

                  {/* Card 2: Greenfield Low-Friction Store */}
                  <div className="p-3.5 rounded-xl bg-sky-50/60 border border-sky-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Store className="w-4 h-4 text-sky-600" />
                        <span>Lipitor 20mg (Pfizer)</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Greenfield Family Pharmacy • 0.9 km (Zero-ledger store)
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800 text-sm">$23.50</span>
                      <span className="block text-[10px] text-sky-700 font-medium">One-Tap Verified</span>
                    </div>
                  </div>

                  {/* Card 3: Apex Stale Warning */}
                  <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-1.5 font-bold text-slate-900">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <span>Glucophage XR 500mg</span>
                      </div>
                      <div className="text-[11px] text-slate-500 mt-0.5">
                        Apex Care 24/7 • 1.2 km away
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-slate-800 text-sm">$11.20</span>
                      <span className="block text-[10px] text-amber-700 font-medium">Stale: Ping Available</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center border-t border-slate-100">
                  <a
                    href="/search?q=Augmentin+625+Duo"
                    className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 hover:text-emerald-950"
                  >
                    <span>Simulate Full Search Workflow</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. HOW LINEAGE WORKS */}
      <section id="how-it-works" className="py-16 md:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-12">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Architecture & Patient Workflow
            </span>
            <h2 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
              How Lineage Works
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              A transparent 3-step loop that eliminates wasted trips to out-of-stock pharmacies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
                1
              </div>
              <h3 className="font-bold text-base text-slate-900">Exact Product Discovery</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search by exact brand, strength, formulation, or packaging photo. Our deterministic matcher never silently substitutes another brand without clinical review.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
                2
              </div>
              <h3 className="font-bold text-base text-slate-900">Freshness Verification</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Inspect stock freshness badges. If an inventory record is stale (&gt;4 hours old), broadcast an instant one-tap ping to nearby dispensaries for fresh confirmation.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3 relative">
              <div className="w-10 h-10 rounded-xl bg-emerald-900 text-white flex items-center justify-center font-bold text-base shadow-sm">
                3
              </div>
              <h3 className="font-bold text-base text-slate-900">Reserve & Collect (or Delivery)</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Reserve your pack at the counter with held stock and a verification code, or opt for cost-aware delivery coordinated with simulated courier partners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. EXACT-PRODUCT MATCHING VS SILENT SUBSTITUTION (SCENARIO A SPOTLIGHT) */}
      <section className="py-16 md:py-20 bg-[#FAFAF8] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-6 space-y-4">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Core Clinical Principle
              </span>
              <h2 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
                Never Silently Substitute a Prescribed Medicine
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                When a doctor prescribes a specific brand like <strong>Augmentin 625 Duo</strong>, patients should know with certainty if a pharmacy has that exact brand.
              </p>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                While alternative brands (like Moxikind-CV 625) share the same active ingredient, excipients, coatings, and patient tolerance can differ. Lineage keeps alternative products in a clearly marked consultation section.
              </p>

              <div className="pt-2">
                <a
                  href="/search?q=Augmentin+625+Duo"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2A1F] hover:bg-[#134E3A] text-white text-xs font-bold shadow-md transition-colors"
                >
                  <span>Launch Scenario A: Exact Matching Demo</span>
                  <ArrowRight className="w-4 h-4 text-emerald-400" />
                </a>
              </div>
            </div>

            {/* Side-by-Side Comparison Mockup */}
            <div className="lg:col-span-6 space-y-3">
              <div className="p-4 rounded-2xl bg-white border-2 border-emerald-500 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    CONFIRMED EXACT BRAND
                  </span>
                  <span className="font-bold text-sm text-slate-900">$18.50</span>
                </div>
                <div className="font-bold text-base text-slate-900">Augmentin 625 Duo Tablet</div>
                <div className="text-xs text-slate-600">Amoxicillin 500mg + Clavulanic Acid 125mg • GlaxoSmithKline</div>
                <div className="text-[11px] text-emerald-700 font-medium">In stock at St. Jude Apothecary (0.4 km)</div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-amber-300 shadow-xs space-y-2 opacity-90">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
                    ALTERNATIVE BRAND (DISCUSS WITH PHARMACIST)
                  </span>
                  <span className="font-bold text-sm text-slate-900">$15.20</span>
                </div>
                <div className="font-bold text-base text-slate-900">Moxikind-CV 625 Tablet</div>
                <div className="text-xs text-slate-600">Amoxicillin 500mg + Clavulanic Acid 125mg • Mankind Pharma</div>
                <div className="text-[11px] text-amber-800">Bioequivalent active formula. Clearly distinguished from exact query.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FOR INDEPENDENT PHARMACIES (ZERO LEDGER OVERHEAD) */}
      <section className="py-16 md:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Visual Callout */}
            <div className="lg:col-span-5 order-2 lg:order-1">
              <div className="p-6 rounded-3xl bg-[#0B2A1F] text-white shadow-xl space-y-4">
                <div className="flex items-center gap-2">
                  <Store className="w-5 h-5 text-emerald-400" />
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-wider">
                    Zero-Friction Participation
                  </span>
                </div>

                <h3 className="text-xl font-bold">Paper-First Independent Pharmacies Welcome</h3>
                <p className="text-xs text-emerald-100/80 leading-relaxed">
                  Most neighborhood pharmacies keep paper records and cannot maintain complex cloud inventory software. Lineage lets them join through <strong>one-tap responses</strong> on any phone.
                </p>

                <div className="space-y-2 pt-2 text-xs">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>No barcode scanners or software installation required</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Receive incoming pings; tap "Available" or "Out of Stock"</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Optional messy CSV import wizard with automated column matching</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="/pharmacy/dashboard"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
                  >
                    <span>Inspect Pharmacist Hub</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 order-1 lg:order-2 space-y-4">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                Inclusivity by Design
              </span>
              <h2 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
                Built for Independent Chemists, Not Just Big Chains
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Platforms that demand 100% real-time digital sync exclude 80% of local neighborhood pharmacies. 
                Lineage supports 3 distinct participation tiers:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="font-bold text-slate-900">Mode 1: One-Tap</div>
                  <div className="text-slate-500 text-[11px]">Request-driven ping confirmations. Zero digital ledger needed.</div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="font-bold text-slate-900">Mode 2: CSV Sync</div>
                  <div className="text-slate-500 text-[11px]">Weekly upload of legacy spreadsheets with AI column auto-mapping.</div>
                </div>
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-1">
                  <div className="font-bold text-slate-900">Mode 3: API Link</div>
                  <div className="text-slate-500 text-[11px]">Direct integration for pharmacy chains with existing billing software.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. BATCH TRACEABILITY & RECALL SIMULATION */}
      <section className="py-16 md:py-20 bg-[#FAFAF8] border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl mx-auto space-y-4">
          <span className="text-xs font-bold text-rose-700 uppercase tracking-wider">
            Traceability & Regulatory Safety
          </span>
          <h2 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
            Batch-Level Quarantine Intelligence
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            When a pharmaceutical quality advisory or packaging defect is identified, administrators can trigger a simulated quarantine. 
            All linked stock across pharmacies is quarantined instantly while unaffected batches remain available.
          </p>

          <div className="pt-2 flex justify-center gap-3">
            <a
              href="/admin/restrictions"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold shadow-md transition-colors"
            >
              <AlertTriangle className="w-4 h-4 text-rose-200" />
              <span>Explore Simulated Batch Quarantine (Scenario F)</span>
            </a>
          </div>
        </div>
      </section>

      {/* 6. HACKATHON EVALUATION PRESET LAUNCHPAD */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
              Judge Quick-Start
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0B2A1F]">
              Explore Demo Scenarios
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Jump directly into any workflow with pre-configured demonstration personas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/search?q=Augmentin+625+Duo"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-sm bg-slate-50/50 transition-all text-left space-y-2"
            >
              <div className="font-bold text-slate-900 text-sm">Scenario A: Exact Brand Discovery</div>
              <p className="text-xs text-slate-500">Augmentin 625 Duo vs Moxikind-CV bioequivalent</p>
              <span className="text-[11px] font-semibold text-emerald-700 inline-flex items-center gap-1">
                Launch as Patient →
              </span>
            </a>

            <a
              href="/search?tab=ocr"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-sm bg-slate-50/50 transition-all text-left space-y-2"
            >
              <div className="font-bold text-slate-900 text-sm">Scenario C: Photo Strip OCR</div>
              <p className="text-xs text-slate-500">AI package typography scanner with 1-click test strips</p>
              <span className="text-[11px] font-semibold text-emerald-700 inline-flex items-center gap-1">
                Scan Strip →
              </span>
            </a>

            <a
              href="/orders/ORD-9428"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-sm bg-slate-50/50 transition-all text-left space-y-2"
            >
              <div className="font-bold text-slate-900 text-sm">Scenario D: Reserve & Collect</div>
              <p className="text-xs text-slate-500">Inspect Bay A-3 pickup with verification code LIN-772</p>
              <span className="text-[11px] font-semibold text-emerald-700 inline-flex items-center gap-1">
                Track Order →
              </span>
            </a>

            <a
              href="/admin/agents"
              className="p-4 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-sm bg-slate-50/50 transition-all text-left space-y-2"
            >
              <div className="font-bold text-slate-900 text-sm">AI Agent Centre</div>
              <p className="text-xs text-slate-500">Inspect all 6 autonomous agents & safety logs</p>
              <span className="text-[11px] font-semibold text-emerald-700 inline-flex items-center gap-1">
                Open Agent Hub →
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
