"use client";

import React, { useState } from "react";
import { useLineage } from "../../lib/state/LineageContext";
import { User, MapPin, Bell, ShieldCheck, FileText, CheckCircle2 } from "lucide-react";

export default function ProfilePage() {
  const { currentPersona, userLocation, setUserLocation } = useLineage();
  const [address, setAddress] = useState(userLocation.address);
  const [phone, setPhone] = useState("+1 (555) 782-1920");
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setUserLocation({
      ...userLocation,
      address
    });
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <User className="w-4 h-4 text-emerald-600" />
            <span>Patient Account</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
            Patient Profile & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your default delivery residence, search district, and simulated notifications.
          </p>
        </div>

        {savedNotice && (
          <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700" />
            <span>Preferences updated successfully!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
            <div className="w-16 h-16 rounded-2xl bg-emerald-800 text-white flex items-center justify-center font-bold text-xl shadow-md">
              SJ
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">{currentPersona.name}</h2>
              <p className="text-xs text-slate-500">Caregiver / Primary Patient Profile</p>
              <span className="inline-block mt-1 text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                Verified Lineage ID: PAT-METRO-4091
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Default Search Locality</label>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-medium">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>{userLocation.label}</span>
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile Contact for Confirmations</label>
              <input
                type="text"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="font-semibold text-slate-700 block mb-1">Default Residence / Delivery Address</label>
              <input
                type="text"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>
          </div>

          {/* Seeded Prescription Records */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-emerald-700" />
                <span>Active Prescriptions on File (Demonstration Data)</span>
              </h3>
              <span className="text-[11px] text-slate-400">Dr. Anthony Reed, MD</span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Augmentin 625 Duo Tablet</div>
                  <div className="text-[11px] text-slate-500">1 tablet twice daily after meals (5-day course)</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  Active
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                <div>
                  <div className="font-bold text-slate-900">Glucophage XR 500mg</div>
                  <div className="text-[11px] text-slate-500">1 tablet daily at evening meal</div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                  Active (Repeats: 2 remaining)
                </span>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#0B2A1F] hover:bg-[#134E3A] text-white text-xs font-bold shadow-md transition-colors"
            >
              Save Preferences
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
