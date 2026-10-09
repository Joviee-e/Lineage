"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { useLineage } from "../../../lib/state/LineageContext";
import { FreshnessBadge } from "../../../components/common/Badge";
import { 
  Building2, 
  Package, 
  ThermometerSnowflake, 
  FileText, 
  ShieldCheck, 
  Store, 
  ArrowLeft,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight
} from "lucide-react";

function MedicineDetailContent() {
  const params = useParams();
  const router = useRouter();
  const { products, pharmacies, inventory, batches } = useLineage();

  const productId = params?.id as string;
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto p-12 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800">Medicine Not Found</h2>
        <p className="text-xs text-slate-500">The product identifier does not match any record in the canonical registry.</p>
        <button
          onClick={() => router.push("/search")}
          className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold"
        >
          Return to Search
        </button>
      </div>
    );
  }

  // Linked stock records & batches
  const linkedInventory = inventory.filter(i => i.productId === product.id);
  const linkedBatches = batches.filter(b => b.productId === product.id);

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Navigation Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Discovery Results</span>
        </button>

        {/* Product Identity Header */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
                  CANONICAL REGISTRY ITEM
                </span>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {product.category}
                </span>
                {product.prescriptionRequired && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                    Rx Required
                  </span>
                )}
              </div>

              <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
                {product.brandName}
              </h1>

              <p className="text-sm font-semibold text-emerald-800">
                Active Chemical Form: {product.genericName}
              </p>
            </div>

            <div className="text-left md:text-right p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 shrink-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
                Standard Reference MRP
              </span>
              <div className="text-2xl font-black text-slate-900">
                ${product.referencePrice.toFixed(2)}
              </div>
              <span className="text-[11px] text-emerald-700 font-medium">Per {product.packaging}</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
            {product.description}
          </p>

          {/* Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Strength</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{product.strength}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Dosage Form</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{product.dosageForm}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">Release System</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{product.releaseFormulation}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-bold uppercase text-[10px] block">ATC Classification</span>
              <span className="font-bold text-slate-900 text-sm mt-0.5 block">{product.atcCode}</span>
            </div>
          </div>

          {/* Manufacturer & Storage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
            <div className="flex items-start gap-2.5">
              <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Manufacturer & Marketer:</span>
                <div>{product.manufacturer} (Marketed by {product.marketer})</div>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ThermometerSnowflake className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-slate-800">Storage & Integrity:</span>
                <div>{product.storageCondition}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Batches Linked to Product */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900">
              Registered Batches ({linkedBatches.length})
            </h3>
            <span className="text-xs text-slate-500">Traceable lot identifiers</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            {linkedBatches.map(batch => (
              <div
                key={batch.id}
                className={`p-4 rounded-xl border ${
                  batch.status === "RESTRICTED_QUARANTINE"
                    ? "border-rose-300 bg-rose-50/50"
                    : "border-slate-200 bg-slate-50/50"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono font-bold text-slate-900">{batch.batchNumber}</span>
                  {batch.status === "RESTRICTED_QUARANTINE" ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-600 text-white animate-pulse">
                      QUARANTINED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      ACTIVE & SAFE
                    </span>
                  )}
                </div>
                <div className="text-slate-500 text-[11px] flex justify-between">
                  <span>Mfg: {batch.manufacturingDate}</span>
                  <span>Exp: {batch.expiryDate}</span>
                </div>
                {batch.restrictionReason && (
                  <div className="mt-2 text-[11px] text-rose-800 bg-rose-100 p-1.5 rounded">
                    <strong>Advisory:</strong> {batch.restrictionReason}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Stock Availability across Pharmacies */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Dispensary Availability ({linkedInventory.length} locations)
              </h3>
              <p className="text-xs text-slate-500">Live verified stock statuses across network</p>
            </div>

            <button
              onClick={() => router.push(`/search?q=${encodeURIComponent(product.brandName)}`)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B2A1F] hover:bg-[#134E3A] text-white text-xs font-bold transition-colors"
            >
              <span>View On Interactive Map</span>
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
            </button>
          </div>

          <div className="divide-y divide-slate-100 text-xs">
            {linkedInventory.map(inv => {
              const pharm = pharmacies.find(p => p.id === inv.pharmacyId);
              if (!pharm) return null;

              return (
                <div key={inv.id} className="py-3 flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="font-bold text-slate-900">{pharm.name}</div>
                    <div className="text-slate-500 text-[11px]">{pharm.address} ({pharm.locality})</div>
                  </div>

                  <div className="flex items-center gap-4">
                    <FreshnessBadge category={inv.freshnessCategory} />
                    <div className="text-right">
                      <span className="font-bold text-sm text-slate-900">${inv.sellingPrice.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MedicineDetailPage() {
  return (
    <React.Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center p-8">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-700 border-t-transparent animate-spin" />
      </div>
    }>
      <MedicineDetailContent />
    </React.Suspense>
  );
}
