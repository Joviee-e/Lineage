"use client";

import React, { useState } from "react";
import { AvailabilityRequest, MedicineProduct } from "../../lib/types";
import { useLineage } from "../../lib/state/LineageContext";
import { Check, X, Clock, DollarSign, Store, Send, ShieldCheck } from "lucide-react";

interface OneTapResponseCardProps {
  request: AvailabilityRequest;
  product: MedicineProduct;
  pharmacyId: string;
}

export function OneTapResponseCard({
  request,
  product,
  pharmacyId
}: OneTapResponseCardProps) {
  const { respondToAvailability } = useLineage();
  const existingResponse = request.responses.find(r => r.pharmacyId === pharmacyId);

  const [price, setPrice] = useState(product.referencePrice.toString());
  const [notes, setNotes] = useState("");
  const [justAnswered, setJustAnswered] = useState(false);

  const handleRespond = (status: "CONFIRMED_AVAILABLE" | "UNAVAILABLE" | "NEEDS_PHYSICAL_CHECK") => {
    const numPrice = parseFloat(price);
    respondToAvailability(
      request.id,
      pharmacyId,
      status,
      !isNaN(numPrice) ? numPrice : product.referencePrice,
      notes || undefined
    );
    setJustAnswered(true);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
              Incoming Availability Ping
            </span>
            <span className="text-[11px] text-slate-500">
              From: {request.patientName} • {new Date(request.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>

          <h3 className="font-bold text-base text-slate-900">{product.brandName}</h3>
          <p className="text-xs text-slate-600">
            {product.genericName} • {product.strength} ({product.dosageForm})
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Ref MRP</span>
          <span className="font-bold text-sm text-slate-800">${product.referencePrice.toFixed(2)}</span>
        </div>
      </div>

      {/* Already Answered Status Banner */}
      {existingResponse ? (
        <div className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
          existingResponse.status === "CONFIRMED_AVAILABLE"
            ? "bg-emerald-50 border-emerald-300 text-emerald-900"
            : existingResponse.status === "UNAVAILABLE"
            ? "bg-rose-50 border-rose-300 text-rose-900"
            : "bg-amber-50 border-amber-300 text-amber-900"
        }`}>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <div>
              <strong>Response Broadcasted:</strong> {existingResponse.status.replace("_", " ")}
              {existingResponse.confirmedPrice && ` at $${existingResponse.confirmedPrice.toFixed(2)}`}
              {existingResponse.notes && ` — "${existingResponse.notes}"`}
            </div>
          </div>

          <span className="text-[11px] font-semibold opacity-75">
            Confirmed {new Date(existingResponse.confirmedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      ) : (
        /* One-Tap Action Buttons */
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1 text-xs">
              <label className="font-medium text-slate-600">Selling Price:</label>
              <div className="relative">
                <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">$</span>
                <input
                  type="number"
                  step="0.10"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  className="w-20 pl-5 pr-2 py-1 rounded-lg border border-slate-300 text-xs font-semibold text-slate-900 focus:ring-1 focus:ring-emerald-600"
                />
              </div>
            </div>

            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Optional pharmacist note (e.g. 'Pack of 10 in stock')"
                className="w-full px-2.5 py-1 rounded-lg border border-slate-300 text-xs text-slate-700 focus:ring-1 focus:ring-emerald-600"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleRespond("CONFIRMED_AVAILABLE")}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-sm transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>In Stock (Available)</span>
            </button>

            <button
              type="button"
              onClick={() => handleRespond("UNAVAILABLE")}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-rose-700 hover:bg-rose-800 text-white font-bold text-xs shadow-sm transition-colors"
            >
              <X className="w-4 h-4" />
              <span>Out of Stock</span>
            </button>

            <button
              type="button"
              onClick={() => handleRespond("NEEDS_PHYSICAL_CHECK")}
              className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-sm transition-colors"
            >
              <Clock className="w-4 h-4" />
              <span>Checking Shelf</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
