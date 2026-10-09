"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useLineage } from "../../../lib/state/LineageContext";
import { 
  SAMPLE_MESSY_CSV_CONTENT, 
  detectColumnMappings, 
  parseCsvText, 
  evaluateRowMatches,
  ColumnMappingSuggestion,
  ParsedCsvRow
} from "../../../lib/utils/csvParser";
import confetti from "canvas-confetti";
import { 
  FileSpreadsheet, 
  Upload, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ArrowRight, 
  Download, 
  Sparkles,
  RotateCcw,
  Check,
  X
} from "lucide-react";

export default function PharmacyImportPage() {
  const router = useRouter();
  const { currentPersona, pharmacies, products, importCsvInventory, recordAgentExecution } = useLineage();
  const activePharmacyId = currentPersona.pharmacyId || "pharm-001";
  const pharmacy = pharmacies.find(p => p.id === activePharmacyId) || pharmacies[0];

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [csvRawText, setCsvRawText] = useState("");
  const [parsedHeaders, setParsedHeaders] = useState<string[]>([]);
  const [parsedRawRows, setParsedRawRows] = useState<Record<string, string>[]>([]);
  const [mappings, setMappings] = useState<ColumnMappingSuggestion[]>([]);
  const [evaluatedRows, setEvaluatedRows] = useState<ParsedCsvRow[]>([]);
  const [importSummary, setImportSummary] = useState<{ count: number; batches: number } | null>(null);

  // 1-Click Load Sample Messy CSV
  const handleLoadSampleCsv = () => {
    setCsvRawText(SAMPLE_MESSY_CSV_CONTENT);
    processUploadedCsv(SAMPLE_MESSY_CSV_CONTENT);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      setCsvRawText(text);
      processUploadedCsv(text);
    };
    reader.readAsText(file);
  };

  const processUploadedCsv = (text: string) => {
    const { headers, rows } = parseCsvText(text);
    setParsedHeaders(headers);
    setParsedRawRows(rows);

    // AI Mapping Agent Suggests Columns
    const suggestions = detectColumnMappings(headers);
    setMappings(suggestions);

    // Evaluate rows against canonical products
    const evaluated = evaluateRowMatches(rows, suggestions, products);
    setEvaluatedRows(evaluated);
    setStep(2);

    recordAgentExecution({
      agentId: "AGENT_2_IMPORT",
      agentName: "Inventory Mapping Agent",
      trigger: `Uploaded spreadsheet with ${headers.length} headers and ${rows.length} rows`,
      status: "NEEDS_HUMAN_APPROVAL",
      inputSummary: `Detected headers: [${headers.join(", ")}]`,
      outputSummary: `Suggested 5 field mappings with >90% confidence. ${evaluated.filter(r => r.matchType === "EXACT").length} rows matched canonical catalog.`,
      confidenceScore: 92,
      auditNote: "Human pharmacist review required before committing mutations to live state."
    });
  };

  const handleCommitImport = () => {
    const validRows = evaluatedRows.filter(r => r.matchedProduct !== null);
    const itemsToImport = validRows.map(r => ({
      productId: r.matchedProduct!.id,
      quantity: r.mapped.quantity,
      sellingPrice: r.mapped.sellingPrice || r.matchedProduct!.referencePrice,
      batchNumber: r.mapped.batchNumber,
      expiryDate: r.mapped.expiryDate
    }));

    const result = importCsvInventory(pharmacy.id, itemsToImport);
    setImportSummary({ count: result.importedCount, batches: result.batchCreatedCount });
    setStep(4);

    try {
      confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
    } catch (e) {}
  };

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>Agent 2 — Messy Data & Spreadsheet Ingestion</span>
          </div>
          <h1 className="text-3xl font-extrabold text-[#0B2A1F] tracking-tight">
            Inventory CSV Import Wizard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {pharmacy.name} • Ingest messy inventory ledgers. AI detects varying column names and maps candidate items to canonical products.
          </p>
        </div>

        {/* Wizard Step Progress Tracker */}
        <div className="grid grid-cols-4 gap-2 text-xs font-semibold">
          {[
            { num: 1, label: "1. Upload File" },
            { num: 2, label: "2. Column Mapping" },
            { num: 3, label: "3. Review & Validate" },
            { num: 4, label: "4. Summary" }
          ].map(s => (
            <div
              key={s.num}
              className={`p-3 rounded-xl border text-center transition-all ${
                step === s.num
                  ? "bg-[#0B2A1F] text-white border-[#0B2A1F] shadow-xs"
                  : step > s.num
                  ? "bg-emerald-50 text-emerald-900 border-emerald-300"
                  : "bg-white text-slate-400 border-slate-200"
              }`}
            >
              {s.label}
            </div>
          ))}
        </div>

        {/* STEP 1: Upload CSV */}
        {step === 1 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
            <div className="text-center max-w-md mx-auto space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-800 flex items-center justify-center mx-auto mb-2">
                <FileSpreadsheet className="w-6 h-6" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Upload Pharmacy Stock File</h2>
              <p className="text-xs text-slate-500">
                Upload your existing software export or POS inventory sheet (.csv).
                Column headers do not need to be standardized.
              </p>
            </div>

            {/* 1-Click Sample Preset */}
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300 flex items-center justify-between">
              <div>
                <span className="font-bold text-xs text-emerald-950 block">Quick Demo Evaluation File:</span>
                <span className="text-[11px] text-emerald-800">
                  Pre-configured sample spreadsheet with 8 messy columns (LOT_NUMBER, ON_HAND_STOCK, etc.)
                </span>
              </div>
              <button
                type="button"
                onClick={handleLoadSampleCsv}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs shadow-xs"
              >
                Load Sample Messy CSV
              </button>
            </div>

            {/* Drag & Drop File Zone */}
            <div className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-10 text-center bg-slate-50/60 relative cursor-pointer">
              <input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="flex flex-col items-center justify-center gap-2 pointer-events-none">
                <Upload className="w-8 h-8 text-slate-400" />
                <div className="text-xs font-bold text-slate-700">Choose a CSV file or drag here</div>
                <p className="text-[11px] text-slate-400">Accepts comma-separated values (.csv)</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Column Mapping */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-xs uppercase">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Agent 2: Header Auto-Detection</span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 mt-0.5">Suggested Column Mappings</h2>
              </div>

              <button
                onClick={() => setStep(3)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[#0B2A1F] hover:bg-[#134E3A] text-white font-bold text-xs shadow-md"
              >
                <span>Accept & Review Rows</span>
                <ArrowRight className="w-4 h-4 text-emerald-300" />
              </button>
            </div>

            <p className="text-xs text-slate-500">
              The mapping agent analyzed your CSV headers. Verify how columns correspond to canonical Lineage fields:
            </p>

            <div className="space-y-3">
              {mappings.map((m, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="space-y-0.5">
                    <span className="font-mono font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-slate-200 inline-block">
                      {m.sourceColumn}
                    </span>
                    <span className="text-[11px] text-slate-500 block">{m.reason}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900">
                      {m.confidence}% Confidence
                    </span>

                    <select
                      value={m.targetField}
                      onChange={e => {
                        const updated = [...mappings];
                        updated[idx].targetField = e.target.value as any;
                        setMappings(updated);
                        setEvaluatedRows(evaluateRowMatches(parsedRawRows, updated, products));
                      }}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-800 bg-white"
                    >
                      <option value="brandOrName">Medicine Name / Brand</option>
                      <option value="quantity">Stock Units (On-Hand)</option>
                      <option value="batchNumber">Batch / Lot Identifier</option>
                      <option value="expiryDate">Expiry Date</option>
                      <option value="sellingPrice">Selling Retail Price</option>
                      <option value="ignore">Ignore Column</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: Review & Validate Matches */}
        {step === 3 && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Catalogue Matching Review</h2>
                <p className="text-xs text-slate-500">
                  {evaluatedRows.filter(r => r.matchType === "EXACT").length} exact matches ready to import • {evaluatedRows.filter(r => r.matchType !== "EXACT").length} ambiguous items
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold"
                >
                  Back to Mappings
                </button>
                <button
                  onClick={handleCommitImport}
                  className="px-5 py-2 rounded-xl bg-[#0B2A1F] hover:bg-[#134E3A] text-white text-xs font-bold shadow-md"
                >
                  Commit Valid Items to Ledger
                </button>
              </div>
            </div>

            {/* Rows Evaluation Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs divide-y divide-slate-200">
                <thead className="bg-slate-50 text-[10px] uppercase font-bold text-slate-400">
                  <tr>
                    <th className="px-4 py-3">CSV Raw Item</th>
                    <th className="px-4 py-3">Canonical Catalogue Match</th>
                    <th className="px-4 py-3 text-center">Confidence</th>
                    <th className="px-4 py-3 text-center">Quantity</th>
                    <th className="px-4 py-3">Batch / Expiry</th>
                    <th className="px-4 py-3 text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {evaluatedRows.map(row => (
                    <tr key={row.rowNumber} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-800">
                        {row.mapped.productName}
                      </td>

                      <td className="px-4 py-3">
                        {row.matchedProduct ? (
                          <div>
                            <span className="font-bold text-slate-900">{row.matchedProduct.brandName}</span>
                            <span className="text-[11px] text-slate-500 block">{row.matchedProduct.genericName}</span>
                          </div>
                        ) : (
                          <span className="text-rose-600 font-bold text-[11px]">Unmatched in registry</span>
                        )}
                        {row.issues.length > 0 && (
                          <div className="text-[10px] text-amber-700 mt-0.5">{row.issues[0]}</div>
                        )}
                      </td>

                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          row.matchType === "EXACT"
                            ? "bg-emerald-100 text-emerald-900"
                            : "bg-amber-100 text-amber-900"
                        }`}>
                          {row.matchConfidence}%
                        </span>
                      </td>

                      <td className="px-4 py-3 text-center font-bold">
                        {row.mapped.quantity !== null ? row.mapped.quantity : "N/A"}
                      </td>

                      <td className="px-4 py-3 font-mono text-[11px]">
                        <div>{row.mapped.batchNumber || "—"}</div>
                        <div className="text-[10px] text-slate-400">{row.mapped.expiryDate || "—"}</div>
                      </td>

                      <td className="px-4 py-3 text-right font-bold">
                        ${(row.mapped.sellingPrice || 0).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STEP 4: Summary */}
        {step === 4 && importSummary && (
          <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-xs text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-extrabold text-[#0B2A1F]">Import Completed Successfully!</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Successfully committed {importSummary.count} inventory records and registered {importSummary.batches} traceable batch lots into {pharmacy.name}'s active stock.
            </p>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => router.push("/pharmacy/inventory")}
                className="px-6 py-2.5 rounded-xl bg-[#0B2A1F] hover:bg-[#134E3A] text-white text-xs font-bold shadow-md"
              >
                Inspect Live Inventory
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setCsvRawText("");
                  setImportSummary(null);
                }}
                className="px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 text-xs font-semibold hover:bg-slate-50"
              >
                Import Another File
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
