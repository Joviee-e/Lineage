"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLineage } from "../../lib/state/LineageContext";
import { ReservationModal } from "../../components/patient/ReservationModal";
import { Pharmacy, MedicineProduct, Reservation } from "../../lib/types";
import { 
  Bell, 
  Store, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Send, 
  ArrowRight,
  ShieldCheck,
  Package
} from "lucide-react";

export default function AvailabilityRequestsPage() {
  const router = useRouter();
  const { availabilityRequests, products, pharmacies } = useLineage();

  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<{ pharmacy: Pharmacy; product: MedicineProduct } | null>(null);

  const handleOpenReservation = (pharmacy: Pharmacy, product: MedicineProduct) => {
    setSelectedTarget({ pharmacy, product });
    setReservationModalOpen(true);
  };

  const handleReservationSuccess = (reservation: Reservation) => {
    setReservationModalOpen(false);
    router.push(`/orders/${reservation.id}`);
  };

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4 text-emerald-600" />
            <span>Availability Coordination Ledger</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
            Availability Requests & Live Responses
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track real-time responses from neighborhood pharmacies for your medicine requests.
          </p>
        </div>

        {availabilityRequests.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
            <Bell className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">No Open Availability Requests</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              When a medicine has stale stock records, you can dispatch a one-tap ping to nearby pharmacies.
            </p>
            <button
              onClick={() => router.push("/search")}
              className="px-5 py-2.5 rounded-xl bg-[#0B2A1F] text-white text-xs font-bold shadow-md hover:bg-[#134E3A]"
            >
              Search Medicines
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {availabilityRequests.map(req => {
              const product = products.find(p => p.id === req.productId);
              if (!product) return null;

              return (
                <div key={req.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                        Ping Ref: {req.id} • {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <h2 className="text-lg font-bold text-slate-900">{product.brandName}</h2>
                      <p className="text-xs text-slate-500">{product.genericName} • {product.strength}</p>
                    </div>

                    <div className="text-left sm:text-right">
                      <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {req.responses.length} / {req.targetPharmacyIds.length} Responded
                      </span>
                    </div>
                  </div>

                  {/* Pharmacist Responses Grid */}
                  <div className="space-y-3">
                    <span className="text-xs font-bold text-slate-700 block">Dispensary Confirmation Feed:</span>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {req.targetPharmacyIds.map(pharmId => {
                        const pharmacy = pharmacies.find(p => p.id === pharmId);
                        if (!pharmacy) return null;

                        const resp = req.responses.find(r => r.pharmacyId === pharmId);

                        return (
                          <div
                            key={pharmId}
                            className={`p-4 rounded-2xl border transition-all ${
                              resp?.status === "CONFIRMED_AVAILABLE"
                                ? "border-emerald-300 bg-emerald-50/50"
                                : resp?.status === "UNAVAILABLE"
                                ? "border-rose-200 bg-rose-50/40"
                                : resp?.status === "NEEDS_PHYSICAL_CHECK"
                                ? "border-amber-200 bg-amber-50/40"
                                : "border-slate-200 bg-slate-50/60"
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <div className="font-bold text-slate-900">{pharmacy.name}</div>
                                <div className="text-[11px] text-slate-500">{pharmacy.address}</div>
                              </div>

                              {resp ? (
                                resp.status === "CONFIRMED_AVAILABLE" ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900">
                                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                    Available
                                  </span>
                                ) : resp.status === "UNAVAILABLE" ? (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-900">
                                    <XCircle className="w-3 h-3 text-rose-600" />
                                    Out of Stock
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900">
                                    <Clock className="w-3 h-3 text-amber-600" />
                                    Checking Shelf
                                  </span>
                                )
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                                  <Clock className="w-3 h-3 text-slate-400" />
                                  Awaiting
                                </span>
                              )}
                            </div>

                            {resp && (
                              <div className="mt-2 pt-2 border-t border-slate-200/60 flex items-center justify-between">
                                <div className="text-[11px] text-slate-600">
                                  {resp.confirmedPrice && <strong>Price: ${resp.confirmedPrice.toFixed(2)}</strong>}
                                  {resp.notes && <div className="italic text-slate-500">"{resp.notes}"</div>}
                                </div>

                                {resp.status === "CONFIRMED_AVAILABLE" && (
                                  <button
                                    onClick={() => handleOpenReservation(pharmacy, product)}
                                    className="px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs"
                                  >
                                    Reserve Now
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal if Reserve clicked from request card */}
        {selectedTarget && (
          <ReservationModal
            pharmacy={selectedTarget.pharmacy}
            product={selectedTarget.product}
            isOpen={reservationModalOpen}
            onClose={() => setReservationModalOpen(false)}
            onSuccess={handleReservationSuccess}
          />
        )}
      </div>
    </div>
  );
}
