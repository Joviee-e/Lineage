"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLineage } from "../../../../lib/state/LineageContext";
import { DeliveryTrackerMap } from "../../../../components/map/DeliveryTrackerMap";
import { DeliveryJobStatus } from "../../../../lib/types";
import confetti from "canvas-confetti";
import { 
  ArrowLeft, 
  Bike, 
  Store, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  AlertCircle,
  PackageCheck
} from "lucide-react";

function DeliveryJobDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { deliveryJobs, pharmacies, reservations, updateDeliveryJobStatus } = useLineage();

  const jobId = params?.id as string;
  const job = deliveryJobs.find(j => j.id === jobId);

  const [pinCodeInput, setPinCodeInput] = useState("");
  const [pinError, setPinError] = useState(false);

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Job Not Found</h2>
        <p className="text-xs text-slate-500">The delivery job reference does not exist in the active pool.</p>
        <button
          onClick={() => router.push("/delivery/dashboard")}
          className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
        >
          Return to Dispatch Pool
        </button>
      </div>
    );
  }

  const pharmacy = pharmacies.find(p => p.id === job.pharmacyId);
  const reservation = reservations.find(r => r.id === job.orderId);

  const handleStep = (newStatus: DeliveryJobStatus) => {
    updateDeliveryJobStatus(job.id, newStatus);
    if (newStatus === "DELIVERED") {
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleConfirmDropoffWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reservation) {
      handleStep("DELIVERED");
      return;
    }

    if (pinCodeInput.trim().toUpperCase() === reservation.verificationCode.toUpperCase()) {
      handleStep("DELIVERED");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <button
          onClick={() => router.push("/delivery/dashboard")}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Rider Jobs Queue</span>
        </button>

        {/* Top Job Overview */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono font-bold text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-800">
                  {job.id}
                </span>
                <span className="text-xs text-slate-400">Order: {job.orderId}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#0B2A1F]">Active Delivery Execution</h1>
              <p className="text-xs text-slate-500">
                Route: {pharmacy?.name} → {job.patientName} ({job.distanceKm} km)
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Rider Payout</span>
              <span className="text-2xl font-black text-emerald-800">${job.payout.toFixed(2)}</span>
            </div>
          </div>

          {/* Interactive Delivery GPS Tracker */}
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 block">Simulated GPS Route:</span>
            <DeliveryTrackerMap job={job} pharmacy={pharmacy} reservation={reservation} />
          </div>

          {/* Stepper Progression Controls */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
            <h3 className="font-bold text-sm text-slate-900">Delivery Workflow Progression</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {/* Step 1: Pickup */}
              <button
                type="button"
                onClick={() => handleStep("PICKED_UP")}
                disabled={job.status === "PICKED_UP" || job.status === "OUT_FOR_DELIVERY" || job.status === "DELIVERED"}
                className={`p-3 rounded-xl border text-center font-bold transition-all ${
                  job.status === "ASSIGNED"
                    ? "bg-emerald-700 text-white shadow-sm hover:bg-emerald-800"
                    : job.status === "PICKED_UP" || job.status === "OUT_FOR_DELIVERY" || job.status === "DELIVERED"
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300 opacity-80"
                    : "bg-white text-slate-400 border-slate-200"
                }`}
              >
                1. Confirm Store Pickup
              </button>

              {/* Step 2: Out for Delivery */}
              <button
                type="button"
                onClick={() => handleStep("OUT_FOR_DELIVERY")}
                disabled={job.status !== "PICKED_UP"}
                className={`p-3 rounded-xl border text-center font-bold transition-all ${
                  job.status === "PICKED_UP"
                    ? "bg-emerald-700 text-white shadow-sm hover:bg-emerald-800"
                    : job.status === "OUT_FOR_DELIVERY" || job.status === "DELIVERED"
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300 opacity-80"
                    : "bg-white text-slate-400 border-slate-200 cursor-not-allowed"
                }`}
              >
                2. Out for Delivery
              </button>

              {/* Step 3: Delivered */}
              <div
                className={`p-3 rounded-xl border text-center font-bold flex items-center justify-center ${
                  job.status === "DELIVERED"
                    ? "bg-emerald-100 text-emerald-900 border-emerald-300"
                    : "bg-white text-slate-400 border-slate-200"
                }`}
              >
                {job.status === "DELIVERED" ? "✓ Successfully Delivered" : "3. Dropoff Confirmation"}
              </div>
            </div>

            {/* Handover PIN verification at doorstep */}
            {job.status === "OUT_FOR_DELIVERY" && (
              <form onSubmit={handleConfirmDropoffWithPin} className="p-4 rounded-xl bg-white border border-emerald-300 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Doorstep Security Check: Enter Patient Code</span>
                </div>
                <p className="text-xs text-slate-500">
                  Ask {job.patientName} for their verification code PIN (e.g. {reservation?.verificationCode}) to confirm dropoff:
                </p>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Enter PIN (e.g. LIN-409)"
                    value={pinCodeInput}
                    onChange={e => setPinCodeInput(e.target.value)}
                    className="px-3 py-2 rounded-lg border border-slate-300 text-xs font-mono font-bold w-44 uppercase focus:ring-2 focus:ring-emerald-600"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm"
                  >
                    Confirm Dropoff & Complete
                  </button>
                </div>

                {pinError && (
                  <p className="text-[11px] text-rose-600 font-semibold">
                    Code mismatch. The demo PIN is {reservation?.verificationCode}.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DeliveryJobDetailPage() {
  return (
    <React.Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center p-8">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-700 border-t-transparent animate-spin" />
      </div>
    }>
      <DeliveryJobDetailContent />
    </React.Suspense>
  );
}
