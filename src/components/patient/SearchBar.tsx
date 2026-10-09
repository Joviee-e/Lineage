"use client";

import React, { useState } from "react";
import { Search, Camera, MapPin, X, Sparkles, Filter } from "lucide-react";

interface SearchBarProps {
  initialQuery?: string;
  onSearch: (query: string, locality: string, category: string) => void;
  onOpenOcr: () => void;
  activeTab: "text" | "ocr";
  onTabChange: (tab: "text" | "ocr") => void;
}

const LOCALITIES = [
  { id: "all", label: "All Metro Districts (5 km)" },
  { id: "downtown", label: "Downtown Health District (1 km)" },
  { id: "greenfield", label: "Greenfield West (2 km)" },
  { id: "central", label: "Central Medical Hub (2.5 km)" },
  { id: "oakridge", label: "Oakridge Residential (3.5 km)" }
];

const CATEGORIES = [
  { id: "ALL", label: "All Categories" },
  { id: "Antibiotic", label: "Antibiotics" },
  { id: "Cardiovascular", label: "Cardiovascular" },
  { id: "Antidiabetic", label: "Antidiabetic" },
  { id: "Analgesic", label: "Pain Relief & Antipyretic" },
  { id: "Respiratory", label: "Respiratory / Inhalers" },
  { id: "Gastrointestinal", label: "Gastrointestinal" }
];

const SUGGESTED_QUERIES = [
  "Augmentin 625 Duo",
  "Lipitor 20mg",
  "Glucophage XR 500mg",
  "Ventolin Inhaler",
  "Panadol Extra",
  "Dolo 650",
  "Amoxicillin"
];

export function SearchBar({
  initialQuery = "",
  onSearch,
  onOpenOcr,
  activeTab,
  onTabChange
}: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery);
  const [locality, setLocality] = useState(LOCALITIES[0].id);
  const [category, setCategory] = useState("ALL");
  const [showFilters, setShowFilters] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, locality, category);
  };

  const handleSelectSuggestion = (suggested: string) => {
    setQuery(suggested);
    onSearch(suggested, locality, category);
  };

  const handleClear = () => {
    setQuery("");
    onSearch("", locality, category);
  };

  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-slate-200/90 p-4 transition-all">
      {/* Search Mode Tabs */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onTabChange("text")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "text"
                ? "bg-[#0B2A1F] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Search className="w-3.5 h-3.5 text-emerald-400" />
            <span>Search by Medicine Name</span>
          </button>

          <button
            type="button"
            onClick={() => onTabChange("ocr")}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "ocr"
                ? "bg-[#0B2A1F] text-white shadow-xs"
                : "text-slate-600 hover:bg-slate-100"
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-emerald-400" />
            <span>Scan Package Photo (AI OCR)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${
            showFilters || category !== "ALL"
              ? "bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold"
              : "border-slate-200 text-slate-600 hover:bg-slate-50"
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
          {category !== "ALL" && (
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
          )}
        </button>
      </div>

      {/* Main Search Input Form */}
      {activeTab === "text" && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search exact brand (e.g. Augmentin 625 Duo), generic ingredient, or strength..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 bg-slate-50/50"
              />
              {query && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Locality Selector */}
            <div className="w-full md:w-56 relative shrink-0">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-700 pointer-events-none" />
              <select
                value={locality}
                onChange={e => {
                  setLocality(e.target.value);
                  onSearch(query, e.target.value, category);
                }}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 text-xs font-medium text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-600/30 focus:border-emerald-600 appearance-none cursor-pointer"
              >
                {LOCALITIES.map(l => (
                  <option key={l.id} value={l.id}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-[#0B2A1F] hover:bg-[#134E3A] text-white text-sm font-semibold shadow-sm transition-colors shrink-0"
            >
              Search
            </button>
          </div>

          {/* Collapsible Filter Bar */}
          {showFilters && (
            <div className="pt-2 border-t border-slate-100 flex items-center gap-2 flex-wrap text-xs">
              <span className="text-slate-500 font-medium">Therapeutic Category:</span>
              {CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    setCategory(cat.id);
                    onSearch(query, locality, cat.id);
                  }}
                  className={`px-2.5 py-1 rounded-md transition-colors ${
                    category === cat.id
                      ? "bg-emerald-800 text-white font-semibold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Quick Suggestions Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-emerald-600" />
              Try exact:
            </span>
            {SUGGESTED_QUERIES.map(s => (
              <button
                key={s}
                type="button"
                onClick={() => handleSelectSuggestion(s)}
                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 hover:bg-emerald-50 text-slate-700 hover:text-emerald-900 border border-slate-200/80 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        </form>
      )}
    </div>
  );
}
