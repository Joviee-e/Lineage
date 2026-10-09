"use client";

import React, { useState } from "react";
import { useLineage } from "../../../lib/state/LineageContext";
import { Package, Search, Plus, Tag, Check } from "lucide-react";

export default function AdminProductsPage() {
  const { products, inventory, addOrUpdateProductAlias } = useLineage();
  const [search, setSearch] = useState("");
  const [selectedProdId, setSelectedProdId] = useState<string | null>(null);
  const [newAliasInput, setNewAliasInput] = useState("");

  const filtered = products.filter(p => 
    p.brandName.toLowerCase().includes(search.toLowerCase()) || 
    p.genericName.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddAlias = (productId: string) => {
    if (!newAliasInput.trim()) return;
    addOrUpdateProductAlias(productId, newAliasInput.trim());
    setNewAliasInput("");
    setSelectedProdId(null);
  };

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Package className="w-4 h-4 text-emerald-600" />
            <span>Canonical Medicine Registry</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
            Drug Catalogue & Aliases
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Maintain canonical brand formulations, active ingredients, ATC codes, and packaging aliases.
          </p>
        </div>

        {/* Filter Input */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-between gap-3 text-xs">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search catalogue by brand or generic..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-emerald-600/30"
            />
          </div>

          <div className="text-slate-500 font-medium">
            {filtered.length} Canonical Medicines
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs divide-y divide-slate-200">
              <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                <tr>
                  <th className="px-6 py-4">Brand & Strength</th>
                  <th className="px-4 py-4">Active Chemical Entity</th>
                  <th className="px-4 py-4">Form & Release</th>
                  <th className="px-4 py-4">Known Aliases / Shorthand</th>
                  <th className="px-4 py-4 text-center">Linked Stocks</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filtered.map(product => {
                  const linkedStockCount = inventory.filter(i => i.productId === product.id).length;
                  const isAddingAlias = selectedProdId === product.id;

                  return (
                    <tr key={product.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-sm text-slate-900">{product.brandName}</div>
                        <div className="text-slate-400 text-[11px]">{product.manufacturer}</div>
                      </td>

                      <td className="px-4 py-4 text-slate-700">
                        {product.genericName}
                      </td>

                      <td className="px-4 py-4">
                        <div>{product.dosageForm} ({product.strength})</div>
                        <div className="text-slate-400 text-[11px]">{product.releaseFormulation}</div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 flex-wrap">
                          {product.aliases.map((alias, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700 border border-slate-200"
                            >
                              {alias}
                            </span>
                          ))}
                        </div>
                      </td>

                      <td className="px-4 py-4 text-center font-bold text-slate-800">
                        {linkedStockCount} stores
                      </td>

                      <td className="px-6 py-4 text-right">
                        {isAddingAlias ? (
                          <div className="flex items-center justify-end gap-1">
                            <input
                              type="text"
                              placeholder="New alias"
                              value={newAliasInput}
                              onChange={e => setNewAliasInput(e.target.value)}
                              className="px-2 py-1 rounded border border-emerald-500 text-xs w-28"
                            />
                            <button
                              onClick={() => handleAddAlias(product.id)}
                              className="p-1 rounded bg-emerald-700 text-white"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setSelectedProdId(product.id);
                              setNewAliasInput("");
                            }}
                            className="text-emerald-800 font-bold hover:underline"
                          >
                            + Add Alias
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
