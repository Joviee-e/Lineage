import React from "react";
import { MedicineProduct } from "../../lib/types";
import { 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Building2, 
  Layers, 
  Package, 
  ThermometerSnowflake, 
  FileText,
  ChevronRight
} from "lucide-react";

interface ExactMatchCardProps {
  product: MedicineProduct;
  isExact: boolean;
  alternativeReason?: string;
  differenceType?: "BRAND_ONLY" | "STRENGTH_MISMATCH" | "FORMULATION_MISMATCH" | "NONE";
  onSelect: (productId: string) => void;
  isSelected?: boolean;
}

export function ExactMatchCard({
  product,
  isExact,
  alternativeReason,
  differenceType = "NONE",
  onSelect,
  isSelected = false
}: ExactMatchCardProps) {
  return (
    <div
      onClick={() => onSelect(product.id)}
      className={`rounded-2xl p-5 border transition-all cursor-pointer relative overflow-hidden ${
        isSelected
          ? "border-emerald-700 bg-white ring-2 ring-emerald-600/30 shadow-md"
          : isExact
          ? "border-emerald-200 bg-white hover:border-emerald-400 hover:shadow-sm"
          : "border-amber-200 bg-amber-50/20 hover:border-amber-300"
      }`}
    >
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          {isExact ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              CONFIRMED EXACT MATCH
            </span>
          ) : differenceType === "BRAND_ONLY" ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
              <AlertCircle className="w-3.5 h-3.5 text-amber-700" />
              ALTERNATIVE BRAND (CONSULT PHARMACIST)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
              <HelpCircle className="w-3.5 h-3.5 text-slate-600" />
              DIFFERENT STRENGTH / FORMULATION
            </span>
          )}

          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            {product.category}
          </span>
        </div>

        <div className="text-right">
          <span className="text-xs text-slate-500">Ref. Price</span>
          <div className="font-bold text-base text-slate-900">${product.referencePrice.toFixed(2)}</div>
        </div>
      </div>

      {/* Main Product Title & Composition */}
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-slate-900 tracking-tight flex items-center justify-between">
          <span>{product.brandName}</span>
          <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
        </h3>
        <p className="text-xs font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded inline-block">
          Active Ingredients: {product.genericName}
        </p>
      </div>

      {/* Product Spec Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3 border-t border-slate-100 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Strength</span>
          <span className="font-semibold text-slate-800">{product.strength}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Dosage & Form</span>
          <span className="font-semibold text-slate-800">{product.dosageForm}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Formulation</span>
          <span className="font-semibold text-slate-800">{product.releaseFormulation}</span>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-bold">Manufacturer</span>
          <span className="font-semibold text-slate-800 truncate block" title={product.manufacturer}>
            {product.manufacturer}
          </span>
        </div>
      </div>

      {/* Packaging & Safety Disclaimer */}
      <div className="mt-3 pt-2 text-[11px] text-slate-500 flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Package className="w-3.5 h-3.5 text-slate-400" />
          <span>{product.packaging}</span>
        </div>

        {product.prescriptionRequired && (
          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
            Prescription Required (Rx)
          </span>
        )}
      </div>

      {/* Explanatory banner if this is an alternative brand */}
      {!isExact && alternativeReason && (
        <div className="mt-3 p-2.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
          <strong>Pharmacist Note:</strong> {alternativeReason}
        </div>
      )}
    </div>
  );
}
