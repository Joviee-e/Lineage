"use client";

import React, { useState } from "react";
import { useLineage } from "../../../lib/state/LineageContext";
import { OrderStatusBadge } from "../../../components/common/Badge";
import { ReservationStatus } from "../../../lib/types";
import confetti from "canvas-confetti";
import { 
  Package, 
  Store, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  ShieldCheck, 
  Search,
  Check,
  AlertCircle
} from "lucide-react";

export default function PharmacyReservationsPage() {
  const { currentPersona, pharmacies, products, reservations, updateReservationStatus } = useLineage();
  const activePharmacyId = currentPersona.pharmacyId || "pharm-001";
  const pharmacy = pharmacies.find(p => p.id === activePharmacyId) || pharmacies[0];

  const [verifyPinInput, setVerifyPinInput] = useState("");
  const [pinVerificationNotice, setPinVerificationNotice] = useState<string | null>(null);

  const pharmacyReservations = reservations.filter(r => r.pharmacyId === pharmacy.id);

  const handleAdvanceStatus = (reservationId: string, newStatus: ReservationStatus, note?: string) => {
    updateReservationStatus(reservationId, newStatus, note);
    if (newStatus === "COMPLETED") {
      try {
        confetti({ particleCount: 50, spread: 60, origin: { y: 0.6 } });
      } catch (e) {}
    }
  };

  const handleVerifyPin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = verifyPinInput.trim().toUpperCase();
    const matched = pharmacyReservations.find(
      r => r.verificationCode.toUpperCase() === cleanPin && r.status !== "COMPLETED"
    );

    if (matched) {
      handleAdvanceStatus(matched.id, "COMPLETED", `Counter pickup verified with code ${cleanPin}`);
      setPinVerificationNotice(`Success: Verified ${matched.id} (${matched.patientName}) and marked as Collected!`);
      setVerifyPinInput("");
      try {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      } catch (e) {}
    } else {
      setPinVerificationNotice("Error: Verification code not found or already completed.");
    }
    setTimeout(() => setPinVerificationNotice(null), 5000);
  };

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Counter Pickup & Reservations Desk</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
              Reservations & Counter Collections
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {pharmacy.name} • Manage held stock, verify pickup codes, and complete handoffs.
            </p>
          </div>
        </div>

        {/* Counter PIN Verification Fast-Action Box */}
        <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-900 to-[#0B2A1F] text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-4 h-4" />
              <span>Quick Counter Handoff PIN Verification</span>
            </div>
            <h3 className="font-bold text-lg">Enter Patient Verification PIN</h3>
            <p className="text-xs text-emerald-200/80">
              When a patient arrives at your counter, enter their code (e.g. LIN-772) to complete handoff.
            </p>
          </div>

          <form onSubmit={handleVerifyPin} className="flex items-center gap-2 w-full md:w-auto">
            <input
              type="text"
              required
              placeholder="e.g. LIN-772"
              value={verifyPinInput}
              onChange={e => setVerifyPinInput(e.target.value)}
              className="px-4 py-2.5 rounded-xl border border-emerald-700 bg-emerald-950/80 text-white font-mono font-bold text-sm tracking-wider uppercase focus:outline-none focus:ring-2 focus:ring-emerald-400 w-full md:w-44"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-bold text-xs shadow-md transition-colors shrink-0"
            >
              Verify Code
            </button>
          </form>
        </div>

        {/* Verification Result Toast Notice */}
        {pinVerificationNotice && (
          <div className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 animate-fadeIn ${
            pinVerificationNotice.startsWith("Success")
              ? "bg-emerald-100 text-emerald-900 border-emerald-300"
              : "bg-rose-100 text-rose-900 border-rose-300"
          }`}>
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{pinVerificationNotice}</span>
          </div>
        )}

        {/* Reservations List Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">
              Active Dispensary Orders ({pharmacyReservations.length})
            </h3>
            <span className="text-xs text-slate-500">Live held stock queue</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Order Ref / Date</th>
                  <th className="px-4 py-4">Patient Details</th>
                  <th className="px-4 py-4">Prescribed Medicine</th>
                  <th className="px-4 py-4 text-center">Qty / Total</th>
                  <th className="px-4 py-4">Verification PIN</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Counter Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {pharmacyReservations.map(res => {
                  const prod = products.find(p => p.id === res.productId);

                  return (
                    <tr key={res.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-mono font-bold text-slate-900">{res.id}</div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(res.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900">{res.patientName}</div>
                        <div className="text-[11px] text-slate-500">{res.patientPhone}</div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="font-bold text-slate-900">{prod?.brandName}</div>
                        <div className="text-[11px] text-slate-500">{prod?.strength}</div>
                      </td>

                      <td className="px-4 py-4 text-center">
                        <div className="font-bold text-slate-900">{res.quantity} pack(s)</div>
                        <div className="text-[11px] text-slate-500 font-semibold">${(res.unitPrice * res.quantity).toFixed(2)}</div>
                      </td>

                      <td className="px-4 py-4">
                        <span className="font-mono font-black text-sm px-2.5 py-1 rounded bg-slate-100 text-slate-900 border border-slate-300">
                          {res.verificationCode}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <OrderStatusBadge status={res.status} />
                      </td>

                      <td className="px-6 py-4 text-right">
                        {res.status === "REQUEST_SUBMITTED" && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => handleAdvanceStatus(res.id, "CONFIRMED", "Stock confirmed by pharmacist")}
                              className="px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold"
                            >
                              Accept & Reserve
                            </button>
                            <button
                              onClick={() => handleAdvanceStatus(res.id, "REJECTED", "Declined due to out of stock")}
                              className="px-2 py-1 rounded-lg border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs"
                            >
                              Decline
                            </button>
                          </div>
                        )}

                        {res.status === "CONFIRMED" && (
                          <button
                            onClick={() => handleAdvanceStatus(res.id, "READY_FOR_COLLECTION", "Medicine packed and placed in Bay A-3")}
                            className="px-3 py-1 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold"
                          >
                            Mark Ready in Bay A-3
                          </button>
                        )}

                        {res.status === "READY_FOR_COLLECTION" && (
                          <button
                            onClick={() => handleAdvanceStatus(res.id, "COMPLETED", "Counter handoff verified by pharmacist")}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs flex items-center gap-1 ml-auto"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Complete Pickup</span>
                          </button>
                        )}

                        {res.status === "COMPLETED" && (
                          <span className="text-slate-400 font-semibold text-xs flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            Verified & Handed Off
                          </span>
                        )}

                        {res.status === "CANCELLED" && (
                          <span className="text-rose-600 text-xs italic">
                            Cancelled (Stock released)
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
