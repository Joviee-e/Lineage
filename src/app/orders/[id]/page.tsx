"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLineage } from "../../../lib/state/LineageContext";
import { OrderStatusBadge } from "../../../components/common/Badge";
import { DeliveryTrackerMap } from "../../../components/map/DeliveryTrackerMap";
import { ReservationStatus } from "../../../lib/types";
import { 
  ArrowLeft, 
  Store, 
  MapPin, 
  Phone, 
  Clock, 
  ShieldCheck, 
  Package, 
  Bike, 
  AlertCircle,
  CheckCircle2,
  XCircle,
  Navigation,
  Sparkles
} from "lucide-react";

function OrderTrackingContent() {
  const params = useParams();
  const router = useRouter();
  const { reservations, products, pharmacies, deliveryJobs, updateReservationStatus, cancelReservation } = useLineage();

  const orderId = params?.id as string;
  const reservation = reservations.find(r => r.id === orderId);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  if (!reservation) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Order Not Found</h2>
        <p className="text-xs text-slate-500">The reservation reference could not be located in the current demo ledger.</p>
        <button
          onClick={() => router.push("/reservations")}
          className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
        >
          View All Reservations
        </button>
      </div>
    );
  }

  const product = products.find(p => p.id === reservation.productId);
  const pharmacy = pharmacies.find(p => p.id === reservation.pharmacyId);
  const linkedJob = deliveryJobs.find(j => j.id === reservation.deliveryJobId || j.orderId === reservation.id);

  const isTerminal = reservation.status === "COMPLETED" || reservation.status === "CANCELLED" || reservation.status === "REJECTED";

  const handleCancel = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cancelReason.trim()) return;
    cancelReservation(reservation.id, cancelReason);
    setCancelModalOpen(false);
  };

  const advanceDemoStatus = (status: ReservationStatus) => {
    updateReservationStatus(reservation.id, status, `Manually progressed via Demo Control in evaluator view`);
  };

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Back */}
        <button
          onClick={() => router.push("/reservations")}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </button>

        {/* Top Order Identity Card */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-slate-100 text-slate-800">
                  {reservation.id}
                </span>
                <span className="text-xs text-slate-400">Created {new Date(reservation.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-[#0B2A1F]">
                {product?.brandName || "Medicine Order"}
              </h1>
              <p className="text-xs text-slate-500">{product?.genericName} • {product?.strength}</p>
            </div>

            <div className="flex flex-col sm:items-end gap-2">
              <OrderStatusBadge status={reservation.status} className="text-sm px-3 py-1.5" />
              <div className="text-xs text-slate-500">
                Fulfilment: <strong className="text-slate-800">{reservation.fulfillmentType === "PICKUP" ? "Reserve & Collect" : "Simulated Delivery"}</strong>
              </div>
            </div>
          </div>

          {/* Verification Code Box (Crucial for Counter Pickup!) */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/50 border border-emerald-300 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span>SECURE VERIFICATION PICKUP CODE</span>
              </div>
              <p className="text-xs text-slate-600">
                Present this code to the pharmacist upon counter collection to verify held stock.
              </p>
            </div>

            <div className="bg-white px-5 py-2.5 rounded-xl border-2 border-dashed border-emerald-600 shadow-sm text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Verification PIN</span>
              <span className="font-mono font-black text-2xl text-emerald-950 tracking-wider">
                {reservation.verificationCode}
              </span>
            </div>
          </div>

          {/* Delivery GPS Map if Fulfillment is Delivery */}
          {reservation.fulfillmentType === "DELIVERY" && linkedJob && (
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 flex items-center gap-1.5">
                  <Bike className="w-4 h-4 text-emerald-700" />
                  <span>Live Courier GPS Tracker (Simulated)</span>
                </span>
                <span className="text-emerald-700 font-semibold">
                  ETA: ~{linkedJob.estimatedTimeMinutes} minutes
                </span>
              </div>

              <DeliveryTrackerMap job={linkedJob} pharmacy={pharmacy} reservation={reservation} />
            </div>
          )}

          {/* Pharmacy & Patient Address Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 pt-2">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                Dispensary Location
              </span>
              <div className="font-bold text-slate-900 text-sm">{pharmacy?.name}</div>
              <div className="text-slate-500">{pharmacy?.address}</div>
              <div className="text-slate-500">Contact: {pharmacy?.phone}</div>
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pharmacy?.name + " " + pharmacy?.address)}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-emerald-800 font-bold hover:underline pt-1"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Open Google Maps Directions</span>
              </a>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block">
                Recipient Details
              </span>
              <div className="font-bold text-slate-900 text-sm">{reservation.patientName}</div>
              <div className="text-slate-500">Phone: {reservation.patientPhone}</div>
              {reservation.deliveryAddress && (
                <div className="text-slate-700"><strong>Address:</strong> {reservation.deliveryAddress}</div>
              )}
              {reservation.deliveryNotes && (
                <div className="text-slate-500 italic">"{reservation.deliveryNotes}"</div>
              )}
            </div>
          </div>

          {/* Order Status History Timeline */}
          <div className="space-y-3 pt-4 border-t border-slate-100">
            <h4 className="font-bold text-sm text-slate-900">Traceable Status Progression</h4>
            
            <div className="space-y-2">
              {reservation.statusHistory.map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <div className="flex-1 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div className="flex justify-between items-center mb-0.5">
                      <strong className="text-slate-900">{item.status.replace(/_/g, " ")}</strong>
                      <span className="text-[11px] text-slate-400">{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-slate-600">{item.note}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">Actor: {item.actor}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evaluator Demo Progression Controls */}
          <div className="p-4 rounded-2xl bg-emerald-950 text-emerald-100 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-300 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Evaluator Demo Controls: Step Through State Machine</span>
            </div>
            <p className="text-xs text-emerald-200/80">
              Judges can click any state below to immediately simulate the pharmacy or rider transitioning this reservation.
            </p>

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <button
                onClick={() => advanceDemoStatus("CONFIRMED")}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors"
              >
                1. Pharmacist Confirms Stock
              </button>

              <button
                onClick={() => advanceDemoStatus("READY_FOR_COLLECTION")}
                className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors"
              >
                2. Mark Ready in Pickup Bay A-3
              </button>

              {reservation.fulfillmentType === "DELIVERY" && (
                <>
                  <button
                    onClick={() => advanceDemoStatus("PICKED_UP")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors"
                  >
                    3. Courier Picked Up
                  </button>
                  <button
                    onClick={() => advanceDemoStatus("OUT_FOR_DELIVERY")}
                    className="px-3 py-1.5 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-white font-semibold transition-colors"
                  >
                    4. Out For Delivery
                  </button>
                </>
              )}

              <button
                onClick={() => advanceDemoStatus("COMPLETED")}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-colors shadow-xs"
              >
                ✓ Complete & Verify Order
              </button>
            </div>
          </div>

          {/* Bottom Actions: Cancel Reservation if permitted */}
          {!isTerminal && (
            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setCancelModalOpen(true)}
                className="text-xs text-rose-700 hover:text-rose-900 underline font-semibold"
              >
                Cancel This Reservation & Release Stock Hold
              </button>
            </div>
          )}
        </div>

        {/* Cancellation Dialog */}
        {cancelModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-base text-slate-900">Cancel Reservation {reservation.id}?</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Cancelling will immediately notify the dispensary and release any tentatively held physical units back into active public inventory.
              </p>

              <div>
                <label className="font-semibold text-xs text-slate-700 block mb-1">Reason for cancellation:</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Doctor adjusted dosage, purchased elsewhere"
                  value={cancelReason}
                  onChange={e => setCancelReason(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600/30"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setCancelModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700"
                >
                  Keep Reservation
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white text-xs font-bold"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function OrderTrackingPage() {
  return (
    <React.Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center p-8">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-700 border-t-transparent animate-spin" />
      </div>
    }>
      <OrderTrackingContent />
    </React.Suspense>
  );
}
