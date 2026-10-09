"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useLineage } from "../../lib/state/LineageContext";
import { OrderStatusBadge } from "../../components/common/Badge";
import { 
  Package, 
  Store, 
  Bike, 
  Clock, 
  MapPin, 
  ChevronRight, 
  ShieldCheck,
  Plus
} from "lucide-react";

export default function ReservationsPage() {
  const router = useRouter();
  const { reservations, products, pharmacies } = useLineage();

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Fulfilment & Hold Ledger</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
              My Reservations & Orders
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Inspect confirmed holds, counter collection codes, and courier delivery tracking.
            </p>
          </div>

          <button
            onClick={() => router.push("/search")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0B2A1F] hover:bg-[#134E3A] text-white font-bold text-xs shadow-md transition-colors"
          >
            <Plus className="w-4 h-4 text-emerald-300" />
            <span>New Reservation</span>
          </button>
        </div>

        {reservations.length === 0 ? (
          <div className="p-12 rounded-3xl bg-white border border-slate-200 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <h3 className="font-bold text-base text-slate-800">No Reservations Yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Search for your prescribed medicine and select a nearby pharmacy to reserve stock before travelling.
            </p>
            <button
              onClick={() => router.push("/search")}
              className="px-5 py-2.5 rounded-xl bg-[#0B2A1F] text-white text-xs font-bold shadow-md hover:bg-[#134E3A]"
            >
              Find a Medicine
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {reservations.map(res => {
              const product = products.find(p => p.id === res.productId);
              const pharmacy = pharmacies.find(p => p.id === res.pharmacyId);
              if (!product || !pharmacy) return null;

              return (
                <div
                  key={res.id}
                  onClick={() => router.push(`/orders/${res.id}`)}
                  className="p-6 rounded-3xl bg-white border border-slate-200 hover:border-emerald-400 hover:shadow-sm transition-all cursor-pointer space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono font-bold text-sm text-slate-900">{res.id}</span>
                      <span className="text-xs text-slate-400">•</span>
                      <span className="text-xs text-slate-500">
                        {new Date(res.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(res.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <OrderStatusBadge status={res.status} />
                      <div className="flex items-center gap-1 text-xs font-bold text-emerald-800">
                        <span>Inspect Order</span>
                        <ChevronRight className="w-4 h-4" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h3 className="text-base font-bold text-slate-900">{product.brandName}</h3>
                      <p className="text-xs text-slate-500">{product.genericName} • {product.strength}</p>
                      <div className="text-xs text-slate-700 font-medium pt-1 flex items-center gap-2">
                        <Store className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{pharmacy.name} ({pharmacy.locality})</span>
                      </div>
                    </div>

                    <div className="text-left md:text-right space-y-1">
                      <div className="flex md:justify-end items-center gap-2">
                        <span className="text-xs text-slate-500">{res.quantity} pack(s)</span>
                        <span className="font-bold text-base text-slate-900">
                          ${(res.unitPrice * res.quantity + (res.deliveryFee || 0)).toFixed(2)}
                        </span>
                      </div>

                      <div className="inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {res.fulfillmentType === "PICKUP" ? (
                          <>
                            <Store className="w-3 h-3 text-slate-600" />
                            <span>Reserve & Collect</span>
                          </>
                        ) : (
                          <>
                            <Bike className="w-3 h-3 text-slate-600" />
                            <span>Delivery Order</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Verification Code preview */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-700" />
                      <span>Verification Code: <strong className="font-mono text-slate-800">{res.verificationCode}</strong></span>
                    </div>

                    <span className="text-emerald-800 font-medium">Click to view details & tracking →</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
