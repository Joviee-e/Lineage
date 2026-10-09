"use client";

import React, { useState } from "react";
import { useLineage } from "../../../lib/state/LineageContext";
import { FreshnessBadge } from "../../../components/common/Badge";
import { 
  Store, 
  Package, 
  Search, 
  Plus, 
  ShieldAlert, 
  Clock, 
  Edit3, 
  Check, 
  X,
  RotateCcw
} from "lucide-react";

export default function PharmacyInventoryPage() {
  const { currentPersona, pharmacies, products, inventory, batches, updateInventoryItem } = useLineage();
  const activePharmacyId = currentPersona.pharmacyId || "pharm-001";
  const pharmacy = pharmacies.find(p => p.id === activePharmacyId) || pharmacies[0];

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState<number>(0);
  const [editPrice, setEditPrice] = useState<number>(0);

  const pharmacyInventory = inventory.filter(i => i.pharmacyId === pharmacy.id);

  const filteredItems = pharmacyInventory.filter(inv => {
    const prod = products.find(p => p.id === inv.productId);
    if (!prod) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return prod.brandName.toLowerCase().includes(q) || prod.genericName.toLowerCase().includes(q);
    }
    return true;
  });

  const startEdit = (invId: string, currentQty: number | null, currentPrice: number) => {
    setEditingId(invId);
    setEditQty(currentQty !== null ? currentQty : 10);
    setEditPrice(currentPrice);
  };

  const saveEdit = (invId: string) => {
    updateInventoryItem(invId, {
      quantity: editQty,
      sellingPrice: editPrice,
      lastConfirmedAt: new Date().toISOString(),
      freshnessCategory: "RECENTLY_CONFIRMED",
      availabilityStatus: editQty > 0 ? "AVAILABLE" : "OUT_OF_STOCK"
    });
    setEditingId(null);
  };

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <Package className="w-4 h-4 text-emerald-600" />
              <span>Live Dispensary Stock Ledger</span>
            </div>
            <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
              Inventory & Freshness
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {pharmacy.name} • {pharmacyInventory.length} registered lines • Real-time stock status and reserved holds.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/pharmacy/import"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-bold text-xs shadow-md transition-colors"
            >
              <span>Import CSV Spreadsheet</span>
            </a>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Filter by brand name or active molecule..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          <div className="text-slate-500 font-medium">
            Showing {filteredItems.length} lines
          </div>
        </div>

        {/* Inventory Data Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                <tr>
                  <th className="px-6 py-4">Medicine Product</th>
                  <th className="px-4 py-4">Linked Batch</th>
                  <th className="px-4 py-4">Freshness State</th>
                  <th className="px-4 py-4 text-center">Available Units</th>
                  <th className="px-4 py-4 text-center">Reserved Hold</th>
                  <th className="px-4 py-4 text-right">Selling Price</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredItems.map(inv => {
                  const prod = products.find(p => p.id === inv.productId);
                  const batch = batches.find(b => b.id === inv.batchId);
                  const isEditing = editingId === inv.id;
                  const isQuarantined = inv.freshnessCategory === "RESTRICTED";

                  if (!prod) return null;

                  return (
                    <tr
                      key={inv.id}
                      className={`hover:bg-slate-50/70 transition-colors ${
                        isQuarantined ? "bg-rose-50/40" : ""
                      }`}
                    >
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-slate-900">{prod.brandName}</div>
                        <div className="text-slate-500 text-[11px]">{prod.genericName} • {prod.strength}</div>
                      </td>

                      <td className="px-4 py-4 font-mono text-[11px]">
                        {batch ? (
                          batch.status === "RESTRICTED_QUARANTINE" ? (
                            <span className="text-rose-700 font-bold flex items-center gap-1">
                              <ShieldAlert className="w-3.5 h-3.5" />
                              {batch.batchNumber}
                            </span>
                          ) : (
                            <span className="text-slate-700">{batch.batchNumber}</span>
                          )
                        ) : (
                          <span className="text-slate-400 italic">Unlinked (Paper ledger)</span>
                        )}
                      </td>

                      <td className="px-4 py-4">
                        <FreshnessBadge category={inv.freshnessCategory} />
                      </td>

                      <td className="px-4 py-4 text-center">
                        {isEditing ? (
                          <input
                            type="number"
                            value={editQty}
                            onChange={e => setEditQty(parseInt(e.target.value, 10) || 0)}
                            className="w-16 px-2 py-1 rounded border border-emerald-500 text-center text-xs font-bold"
                          />
                        ) : inv.quantity === null ? (
                          <span className="text-sky-800 bg-sky-50 px-2 py-0.5 rounded text-[10px] font-bold">
                            Uncounted (One-Tap)
                          </span>
                        ) : (
                          <span className="font-bold text-slate-900">{inv.quantity}</span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-center">
                        {inv.reservedQuantity > 0 ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                            {inv.reservedQuantity} held
                          </span>
                        ) : (
                          <span className="text-slate-400">0</span>
                        )}
                      </td>

                      <td className="px-4 py-4 text-right">
                        {isEditing ? (
                          <input
                            type="number"
                            step="0.10"
                            value={editPrice}
                            onChange={e => setEditPrice(parseFloat(e.target.value) || 0)}
                            className="w-20 px-2 py-1 rounded border border-emerald-500 text-right text-xs font-bold"
                          />
                        ) : (
                          <span className="font-bold text-slate-900">${inv.sellingPrice.toFixed(2)}</span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-right">
                        {isEditing ? (
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => saveEdit(inv.id)}
                              className="p-1 rounded bg-emerald-700 text-white hover:bg-emerald-800"
                              title="Save changes"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="p-1 rounded bg-slate-200 text-slate-700 hover:bg-slate-300"
                              title="Cancel"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => startEdit(inv.id, inv.quantity, inv.sellingPrice)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="Adjust quantity or price"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
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
