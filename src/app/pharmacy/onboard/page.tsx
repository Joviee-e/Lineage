"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLineage } from "../../../lib/state/LineageContext";
import { ParticipationMode, FulfillmentType } from "../../../lib/types";
import confetti from "canvas-confetti";
import { Store, Check, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function PharmacyOnboardingPage() {
  const router = useRouter();
  const { switchPersona } = useLineage();

  const [name, setName] = useState("Hope Community Pharmacy");
  const [pharmacist, setPharmacist] = useState("Sarah Lin, RPh");
  const [phone, setPhone] = useState("+1 (555) 334-9912");
  const [address, setAddress] = useState("105 Central Market Lane, Metro Hub");
  const [mode, setMode] = useState<ParticipationMode>("ONE_TAP_REQUEST");
  const [fulfillment, setFulfillment] = useState<FulfillmentType[]>(["PICKUP"]);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSuccess(true);
    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}

    setTimeout(() => {
      switchPersona("PHARMACIST");
      router.push("/pharmacy/dashboard");
    }, 1800);
  };

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-10">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Minimum Friction Dispensary Onboarding</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
            Join the Lineage Network
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Zero hardware required. Independent neighborhood chemists can participate in 3 minutes.
          </p>
        </div>

        {isSuccess ? (
          <div className="p-8 rounded-3xl bg-white border border-emerald-300 text-center space-y-4 shadow-sm animate-fadeIn">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#0B2A1F]">Dispensary Enrolled!</h2>
            <p className="text-xs text-slate-600 max-w-sm mx-auto">
              Your store terminal is now active in Mode 1 (One-Tap). Redirecting you to your incoming counter requests queue...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5 text-xs">
            <div className="space-y-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Dispensary Trading Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Pharmacist-in-Charge</label>
                  <input
                    type="text"
                    required
                    value={pharmacist}
                    onChange={e => setPharmacist(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Counter Phone</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600/30"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Physical Address</label>
                <input
                  type="text"
                  required
                  value={address}
                  onChange={e => setAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              {/* Participation Mode Selection */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="font-semibold text-slate-800 block">
                  Select Operating Participation Mode
                </label>

                <div className="space-y-2">
                  {[
                    {
                      id: "ONE_TAP_REQUEST" as ParticipationMode,
                      title: "Mode 1: One-Tap Confirmation (Zero Ledger)",
                      desc: "Recommended for paper-based stores. You receive incoming pings and tap Available/Unavailable. No inventory ledger required."
                    },
                    {
                      id: "CSV_IMPORT" as ParticipationMode,
                      title: "Mode 2: Periodic CSV Import",
                      desc: "For stores that have weekly stock spreadsheets. Upload messy files and let AI auto-map columns."
                    },
                    {
                      id: "CONNECTED_LEDGER" as ParticipationMode,
                      title: "Mode 3: Connected POS Sync",
                      desc: "Direct simulated API integration with existing pharmacy management software."
                    }
                  ].map(m => (
                    <div
                      key={m.id}
                      onClick={() => setMode(m.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        mode === m.id
                          ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/30"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="font-bold text-slate-900">{m.title}</div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{m.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0B2A1F] hover:bg-[#134E3A] text-white font-bold text-xs shadow-md transition-colors"
              >
                <span>Complete Enrollment & Launch Terminal</span>
                <ArrowRight className="w-4 h-4 text-emerald-400" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
