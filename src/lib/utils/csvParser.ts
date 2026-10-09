import { MedicineProduct } from "../types";
import { SEEDED_PRODUCTS } from "../data/seedData";

export interface ColumnMappingSuggestion {
  sourceColumn: string;
  targetField: "brandOrName" | "quantity" | "batchNumber" | "expiryDate" | "sellingPrice" | "ignore";
  confidence: number; // 0 - 100
  reason: string;
}

export interface ParsedCsvRow {
  rowNumber: number;
  raw: Record<string, string>;
  mapped: {
    productName: string;
    quantity: number | null;
    batchNumber?: string;
    expiryDate?: string;
    sellingPrice?: number;
  };
  matchedProduct: MedicineProduct | null;
  matchType: "EXACT" | "FUZZY_CONFIRMATION_NEEDED" | "UNMATCHED";
  matchConfidence: number;
  issues: string[];
}

export const SAMPLE_MESSY_CSV_CONTENT = `ITEM_DESCRIPTION,ON_HAND_STOCK,LOT_NUMBER,EXP_DT,RETAIL_PRICE,NOTES
Augmentin 625 Duo Tab 10s,28,BAT-AUG-2024-881,2026-03,18.50,Fast moving
Lipitor 20mg Tab (Pfizer),14,BAT-LIP-2024-104,2026-06,24.00,Cold storage check
Glucophage XR 500 Tab,30,BAT-GLU-2024-309,2026-08,11.20,Stock checked
Ventolin Inhaler 100mcg,12,BAT-VEN-2024-440,2026-10,14.00,Respiratory
Panadol Extra Red 12s,50,BAT-PAN-2024-702,2026-12,5.50,OTC counter
Dolo 650mg Paracetamol,40,BAT-DOLO-2024-515,2026-07,4.00,Fever care
Metformin generic 500mg,20,BAT-MET-UNVERIFIED,2025-12,3.50,Ambiguous generic formulation
Unknown Herbal Elixir 200ml,5,BAT-XYZ-999,2025-05,12.00,Not in canonical list`;

export function detectColumnMappings(headers: string[]): ColumnMappingSuggestion[] {
  return headers.map(header => {
    const h = header.trim().toLowerCase().replace(/[^a-z0-9]/g, "");

    if (h.includes("item") || h.includes("medicine") || h.includes("desc") || h.includes("brand") || h.includes("name") || h.includes("product")) {
      return {
        sourceColumn: header,
        targetField: "brandOrName",
        confidence: 96,
        reason: "Detected product/brand descriptor header"
      };
    }

    if (h.includes("stock") || h.includes("qty") || h.includes("quantity") || h.includes("onhand") || h.includes("units") || h.includes("avail")) {
      return {
        sourceColumn: header,
        targetField: "quantity",
        confidence: 95,
        reason: "Detected inventory quantity indicator"
      };
    }

    if (h.includes("lot") || h.includes("batch") || h.includes("bno") || h.includes("batchno")) {
      return {
        sourceColumn: header,
        targetField: "batchNumber",
        confidence: 94,
        reason: "Detected pharmaceutical batch/lot identifier"
      };
    }

    if (h.includes("exp") || h.includes("expiry") || h.includes("valid") || h.includes("bestbefore")) {
      return {
        sourceColumn: header,
        targetField: "expiryDate",
        confidence: 92,
        reason: "Detected expiry date column"
      };
    }

    if (h.includes("price") || h.includes("mrp") || h.includes("retail") || h.includes("rate") || h.includes("cost")) {
      return {
        sourceColumn: header,
        targetField: "sellingPrice",
        confidence: 90,
        reason: "Detected consumer retail pricing"
      };
    }

    return {
      sourceColumn: header,
      targetField: "ignore",
      confidence: 80,
      reason: "Auxiliary column excluded from public inventory"
    };
  });
}

export function parseCsvText(csvText: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = csvText.split(/\r?\n/).filter(line => line.trim().length > 0);
  if (lines.length === 0) return { headers: [], rows: [] };

  const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const rawCols = lines[i].split(",").map(c => c.trim().replace(/^["']|["']$/g, ""));
    const rowObj: Record<string, string> = {};
    headers.forEach((h, idx) => {
      rowObj[h] = rawCols[idx] !== undefined ? rawCols[idx] : "";
    });
    rows.push(rowObj);
  }

  return { headers, rows };
}

export function evaluateRowMatches(
  rows: Record<string, string>[],
  mappings: ColumnMappingSuggestion[],
  products: MedicineProduct[] = SEEDED_PRODUCTS
): ParsedCsvRow[] {
  const nameCol = mappings.find(m => m.targetField === "brandOrName")?.sourceColumn;
  const qtyCol = mappings.find(m => m.targetField === "quantity")?.sourceColumn;
  const batchCol = mappings.find(m => m.targetField === "batchNumber")?.sourceColumn;
  const expCol = mappings.find(m => m.targetField === "expiryDate")?.sourceColumn;
  const priceCol = mappings.find(m => m.targetField === "sellingPrice")?.sourceColumn;

  return rows.map((row, index) => {
    const productName = nameCol ? row[nameCol] || "" : "";
    const rawQty = qtyCol ? row[qtyCol] : "";
    const quantity = rawQty ? parseInt(rawQty, 10) : null;
    const batchNumber = batchCol ? row[batchCol] : undefined;
    const expiryDate = expCol ? row[expCol] : undefined;
    const rawPrice = priceCol ? parseFloat(row[priceCol]) : undefined;
    const sellingPrice = !isNaN(rawPrice as number) ? rawPrice : undefined;

    const issues: string[] = [];
    if (!productName) {
      issues.push("Missing product descriptor");
    }

    // Match against canonical product catalogue
    let matchedProduct: MedicineProduct | null = null;
    let matchType: "EXACT" | "FUZZY_CONFIRMATION_NEEDED" | "UNMATCHED" = "UNMATCHED";
    let matchConfidence = 0;

    const normName = productName.toLowerCase();

    for (const prod of products) {
      const bLower = prod.brandName.toLowerCase();
      if (normName.includes(bLower)) {
        matchedProduct = prod;
        matchType = "EXACT";
        matchConfidence = 96;
        break;
      }
      for (const alias of prod.aliases) {
        if (normName.includes(alias.toLowerCase())) {
          matchedProduct = prod;
          matchType = "EXACT";
          matchConfidence = 92;
          break;
        }
      }
    }

    if (!matchedProduct && productName) {
      // Check generic fallback
      for (const prod of products) {
        const gLower = prod.genericName.toLowerCase().split("+")[0].trim();
        if (normName.includes(gLower)) {
          matchedProduct = prod;
          matchType = "FUZZY_CONFIRMATION_NEEDED";
          matchConfidence = 65;
          issues.push(`Ambiguous mapping: Generic '${prod.genericName}' detected, but brand is unverified.`);
          break;
        }
      }
    }

    if (!matchedProduct) {
      issues.push("No matching canonical product found in Lineage registry.");
    }

    return {
      rowNumber: index + 1,
      raw: row,
      mapped: {
        productName,
        quantity: isNaN(quantity as number) ? null : quantity,
        batchNumber,
        expiryDate,
        sellingPrice
      },
      matchedProduct,
      matchType,
      matchConfidence,
      issues
    };
  });
}
