"use client";

import React, { useState } from "react";
import { Pharmacy, MedicineProduct, FulfillmentType, Reservation } from "../../lib/types";
import { useLineage } from "../../lib/state/LineageContext";
import confetti from "canvas-confetti";
import { 
  X, 
  Store, 
  Bike, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  User, 
  ShieldCheck,
  AlertCircle,
  ArrowRight
} from "lucide-react";

interface ReservationModalProps {
  pharmacy: Pharmacy;
  product: MedicineProduct;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (reservation: Reservation) => void;
}

export function ReservationModal({
  pharmacy,
  product,
  isOpen,
  onClose,
  onSuccess
}: ReservationModalProps) {
  const { currentPersona, createReservation } = useLineage();
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>("PICKUP");
  const [quantity, setQuantity] = useState(1);
  const [patientName, setPatientName] = useState(currentPersona.name || "Sarah Jenkins");
  const [patientPhone, setPatientPhone] = useState("+1 (555) 782-1920");
  const [deliveryAddress, setDeliveryAddress] = useState("442 Crescent Boulevard, Apt 3B, Downtown Metro");
  const [deliveryNotes, setDeliveryNotes] = useState("Ring buzzer 3B. Medicine for elderly patient.");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const supportsDelivery = pharmacy.fulfillmentMethods.includes("DELIVERY");
  const unitPrice = product.referencePrice;
  const deliveryFee = fulfillmentType === "DELIVERY" ? pharmacy.deliveryFeeBase : 0;
  const totalAmount = unitPrice * quantity + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const reservation = createReservation({
        patientName,
        patientPhone,
        pharmacyId: pharmacy.id,
        productId: product.id,
        quantity,
        fulfillmentType,
        deliveryAddress: fulfillmentType === "DELIVERY" ? deliveryAddress : undefined,
        deliveryNotes: fulfillmentType === "DELIVERY" ? deliveryNotes : undefined,
        deliveryFee: fulfillmentType === "DELIVERY" ? deliveryFee : undefined
      });

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore if canvas not supported
      }

      setIsSubmitting(false);
      onSuccess(reservation);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden my-8 animate-fadeIn">
        {/* Modal Header */}
        <div className="bg-[#0B2A1F] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-900/60 border border-emerald-700/50">
              <Store className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Reserve Medicine</h3>
              <p className="text-xs text-emerald-200">{pharmacy.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-300 hover:text-white hover:bg-emerald-900/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {/* Selected Product Banner */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                Selected Prescribed Product
              </span>
              <div className="font-bold text-sm text-slate-900">{product.brandName}</div>
              <div className="text-slate-500 text-[11px]">{product.genericName} • {product.strength}</div>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase font-bold">Unit Price</span>
              <span className="font-bold text-sm text-emerald-800">${unitPrice.toFixed(2)}</span>
            </div>
          </div>

          {/* Fulfillment Method Selector */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-700 block">
              Choose Fulfilment Method
            </label>

            <div className="grid grid-cols-2 gap-3">
              {/* Pickup Option (Default) */}
              <button
                type="button"
                onClick={() => setFulfillmentType("PICKUP")}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  fulfillmentType === "PICKUP"
                    ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/30"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Reserve & Collect</span>
                  <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Recommended
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Held at store for 4 hours. No fee. Pay at counter upon inspection.
                </p>
              </button>

              {/* Delivery Option */}
              <button
                type="button"
                disabled={!supportsDelivery}
                onClick={() => setFulfillmentType("DELIVERY")}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  !supportsDelivery
                    ? "opacity-40 cursor-not-allowed bg-slate-50 border-slate-200"
                    : fulfillmentType === "DELIVERY"
                    ? "border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/30"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">Local Delivery</span>
                  <span className="text-slate-600 font-semibold">${pharmacy.deliveryFeeBase.toFixed(2)}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {supportsDelivery
                    ? "Dispatched by simulated courier partner."
                    : "Not offered by this pharmacy."}
                </p>
              </button>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center justify-between py-2 border-y border-slate-100">
            <div>
              <span className="font-semibold text-slate-800">Package Quantity</span>
              <p className="text-[11px] text-slate-500">{product.packaging}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-8 h-8 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center"
              >
                -
              </button>
              <span className="w-8 text-center font-bold text-sm text-slate-900">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(quantity + 1)}
                className="w-8 h-8 rounded-lg border border-slate-300 text-slate-700 font-bold hover:bg-slate-100 flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Patient Full Name</label>
              <input
                type="text"
                required
                value={patientName}
                onChange={e => setPatientName(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile Contact</label>
              <input
                type="text"
                required
                value={patientPhone}
                onChange={e => setPatientPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600/30"
              />
            </div>
          </div>

          {/* Delivery Fields if selected */}
          {fulfillmentType === "DELIVERY" && (
            <div className="space-y-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Delivery Address</label>
                <input
                  type="text"
                  required
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Delivery Instructions / Gate Code</label>
                <input
                  type="text"
                  value={deliveryNotes}
                  onChange={e => setDeliveryNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 text-xs bg-white"
                />
              </div>
              <p className="text-[10px] text-slate-400 italic">
                * Illustrative logistics simulation. No real money or payment processor is engaged.
              </p>
            </div>
          )}

          {/* Pricing Breakdown */}
          <div className="pt-2 border-t border-slate-200 space-y-1 text-slate-600">
            <div className="flex justify-between">
              <span>Medicine Subtotal ({quantity}x ${unitPrice.toFixed(2)})</span>
              <span className="font-medium text-slate-800">${(unitPrice * quantity).toFixed(2)}</span>
            </div>
            {fulfillmentType === "DELIVERY" && (
              <div className="flex justify-between">
                <span>Simulated Courier Dispatch</span>
                <span className="font-medium text-slate-800">${deliveryFee.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-slate-900 pt-2 border-t border-slate-100">
              <span>Total Estimated Payable</span>
              <span className="text-emerald-800">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Safety Disclaimer */}
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-emerald-50/80 border border-emerald-200 text-[11px] text-emerald-950">
            <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
            <span>
              Stock is tentatively reserved upon submission. The pharmacist reviews packaging, batch expiry, and physical availability before issuing your secure verification pickup code.
            </span>
          </div>

          {/* Modal Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#0B2A1F] hover:bg-[#134E3A] text-white font-bold shadow-md transition-colors"
            >
              {isSubmitting ? "Holding Stock..." : "Confirm & Submit Reservation"}
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
