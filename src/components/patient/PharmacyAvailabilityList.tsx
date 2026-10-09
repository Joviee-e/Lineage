"use client";

import React, { useState } from "react";
import { Pharmacy, MedicineProduct, InventoryRecord, FreshnessCategory } from "../../lib/types";
import { FreshnessBadge, ParticipationBadge } from "../common/Badge";
import { 
  Store, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Bike, 
  Navigation, 
  ArrowUpDown,
  ShieldAlert,
  ChevronRight
} from "lucide-react";

interface PharmacyAvailabilityListProps {
  pharmacies: Pharmacy[];
  inventoryRecords: InventoryRecord[];
  product: MedicineProduct;
  selectedPharmacyId?: string;
  onSelectPharmacy: (pharmacyId: string) => void;
  onOpenReservation: (pharmacy: Pharmacy) => void;
  onPingPharmacy: (pharmacyId: string) => void;
  pingedPharmacyIds: string[];
}

export function PharmacyAvailabilityList({
  pharmacies,
  inventoryRecords,
  product,
  selectedPharmacyId,
  onSelectPharmacy,
  onOpenReservation,
  onPingPharmacy,
  pingedPharmacyIds
}: PharmacyAvailabilityListProps) {
  const [sortBy, setSortBy] = useState<"AVAILABILITY" | "DISTANCE" | "PRICE" | "FRESHNESS">("AVAILABILITY");

  // Pair pharmacies with their inventory for this product
  const items = pharmacies.map(pharmacy => {
    const inv = inventoryRecords.find(
      i => i.pharmacyId === pharmacy.id && i.productId === product.id
    );

    // Compute status
    let freshness: FreshnessCategory = "UNAVAILABLE";
    if (inv) {
      freshness = inv.freshnessCategory;
    }

    // Distance estimate based on coordinates offset
    const distanceKm = Math.round(
      Math.sqrt(
        Math.pow((pharmacy.coordinates.lat - 18.5204) * 110, 2) +
        Math.pow((pharmacy.coordinates.lng - 73.8567) * 95, 2)
      ) * 10
    ) / 10 || 0.4;

    return {
      pharmacy,
      inventory: inv,
      freshness,
      distanceKm,
      price: inv ? inv.sellingPrice : product.referencePrice,
      isPinged: pingedPharmacyIds.includes(pharmacy.id)
    };
  });

  // Sort logic
  const sortedItems = [...items].sort((a, b) => {
    // Quarantine always pushed to the bottom!
    if (a.freshness === "RESTRICTED") return 1;
    if (b.freshness === "RESTRICTED") return -1;

    if (sortBy === "AVAILABILITY") {
      const rank = (f: FreshnessCategory) => (f === "RECENTLY_CONFIRMED" ? 3 : f === "NEEDS_CONFIRMATION" ? 2 : 1);
      return rank(b.freshness) - rank(a.freshness);
    }
    if (sortBy === "DISTANCE") {
      return a.distanceKm - b.distanceKm;
    }
    if (sortBy === "PRICE") {
      return a.price - b.price;
    }
    if (sortBy === "FRESHNESS") {
      const timeA = a.inventory ? new Date(a.inventory.lastConfirmedAt).getTime() : 0;
      const timeB = b.inventory ? new Date(b.inventory.lastConfirmedAt).getTime() : 0;
      return timeB - timeA;
    }
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Sorting Controls */}
      <div className="flex items-center justify-between flex-wrap gap-2 text-xs">
        <div className="font-semibold text-slate-700">
          Showing {sortedItems.length} Licensed Dispensaries in Metro Radius
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={e => setSortBy(e.target.value as any)}
            className="px-2.5 py-1 rounded-lg border border-slate-300 text-xs font-medium text-slate-800 bg-white cursor-pointer"
          >
            <option value="AVAILABILITY">Confirmed Availability First</option>
            <option value="DISTANCE">Closest Distance</option>
            <option value="FRESHNESS">Freshness of Last Confirmation</option>
            <option value="PRICE">Reported Selling Price</option>
          </select>
        </div>
      </div>

      {/* Pharmacy Cards List */}
      <div className="space-y-3">
        {sortedItems.map(({ pharmacy, inventory, freshness, distanceKm, price, isPinged }) => {
          const isSelected = pharmacy.id === selectedPharmacyId;
          const isAvailable = freshness === "RECENTLY_CONFIRMED";
          const isStale = freshness === "NEEDS_CONFIRMATION";
          const isRestricted = freshness === "RESTRICTED";
          const isOut = freshness === "UNAVAILABLE";

          // Format last confirmed time
          let confirmedTimeAgo = "No recent confirmation";
          if (inventory) {
            const diffMinutes = Math.round((Date.now() - new Date(inventory.lastConfirmedAt).getTime()) / (60 * 1000));
            if (diffMinutes < 60) confirmedTimeAgo = `${diffMinutes} mins ago`;
            else confirmedTimeAgo = `${Math.round(diffMinutes / 60)} hours ago`;
          }

          return (
            <div
              key={pharmacy.id}
              id={`pharmacy-${pharmacy.id}`}
              onClick={() => onSelectPharmacy(pharmacy.id)}
              className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                isSelected
                  ? "border-emerald-600 bg-emerald-50/20 ring-2 ring-emerald-600/30 shadow-md"
                  : isRestricted
                  ? "border-rose-300 bg-rose-50/30"
                  : "border-slate-200 bg-white hover:border-emerald-300 hover:shadow-xs"
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                {/* Pharmacy Info & Badges */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <FreshnessBadge category={freshness} />
                    <ParticipationBadge mode={pharmacy.participationMode} />
                    <span className="text-[11px] font-semibold text-slate-500">
                      ★ {pharmacy.rating} ({pharmacy.reviewsCount})
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <span>{pharmacy.name}</span>
                    {isRestricted && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white uppercase">
                        Lot Quarantined
                      </span>
                    )}
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                      {distanceKm} km away ({pharmacy.locality})
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      Confirmed {confirmedTimeAgo}
                    </span>
                    <span>•</span>
                    <span className="text-emerald-800 font-medium">
                      Avg reply: ~{pharmacy.responseTimeAvgMinutes}m
                    </span>
                  </div>

                  {/* Low-Friction Store Note */}
                  {pharmacy.participationMode === "ONE_TAP_REQUEST" && (
                    <div className="text-[11px] text-sky-800 bg-sky-50 px-2 py-1 rounded inline-block">
                      ℹ️ Paper-first neighborhood chemist: verifies stock in real-time without keeping digital ledgers.
                    </div>
                  )}

                  {/* Restriction Notice */}
                  {isRestricted && (
                    <div className="text-xs text-rose-800 bg-rose-100/70 p-2.5 rounded-lg border border-rose-200 flex items-start gap-2">
                      <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                      <div>
                        <strong>Batch Quarantined:</strong> Stock held at this dispensary belongs to a batch flagged for quality inspection. Not available for patient supply pending verification.
                      </div>
                    </div>
                  )}
                </div>

                {/* Price & Action Area */}
                <div className="flex flex-col sm:items-end justify-between self-stretch shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <div className="text-left sm:text-right mb-2">
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">Dispensary Price</span>
                    <span className="text-lg font-bold text-slate-900">${price.toFixed(2)}</span>
                    {pharmacy.fulfillmentMethods.includes("DELIVERY") && (
                      <span className="text-[11px] text-slate-500 block">
                        +${pharmacy.deliveryFeeBase.toFixed(2)} courier delivery
                      </span>
                    )}
                  </div>

                  {/* Contextual Action Buttons */}
                  <div className="flex items-center gap-2">
                    {/* If Stale or Unconfirmed, Allow 1-Tap Ping */}
                    {isStale && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPingPharmacy(pharmacy.id);
                        }}
                        disabled={isPinged}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                          isPinged
                            ? "bg-slate-100 text-slate-500 cursor-not-allowed"
                            : "bg-amber-600 hover:bg-amber-700 text-white shadow-xs"
                        }`}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isPinged ? "Ping Sent (Awaiting)" : "Ping Dispensary (Fresh Check)"}</span>
                      </button>
                    )}

                    {/* Reserve Button */}
                    {!isRestricted && !isOut && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenReservation(pharmacy);
                        }}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B2A1F] hover:bg-[#134E3A] text-white text-xs font-bold shadow-md transition-colors"
                      >
                        <span>Reserve & Collect</span>
                        <ChevronRight className="w-4 h-4 text-emerald-400" />
                      </button>
                    )}

                    {isOut && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPingPharmacy(pharmacy.id);
                        }}
                        disabled={isPinged}
                        className="px-3 py-2 rounded-xl border border-slate-300 text-xs font-medium text-slate-600 hover:bg-slate-50"
                      >
                        {isPinged ? "Notified for Restock" : "Notify When Restocked"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
