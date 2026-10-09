import { MedicineProduct } from "../types";
import { SEEDED_PRODUCTS } from "../data/seedData";

export interface OcrDetectionResult {
  rawDetectedText: string;
  candidateProduct: MedicineProduct | null;
  confidenceScore: number; // 0 - 100
  detectedBrand: string;
  detectedStrength: string;
  detectedDosageForm: string;
  activeIngredientsFound: string[];
  requiresHumanConfirmation: boolean;
  disclaimer: string;
}

export interface SampleStrip {
  id: string;
  name: string;
  subtitle: string;
  colorTheme: string;
  previewSvgData: string;
  expectedProductId: string;
  simulatedText: string;
}

export const SAMPLE_STRIPS: SampleStrip[] = [
  {
    id: "sample-aug-625",
    name: "Augmentin 625 Duo",
    subtitle: "GSK foil strip, 10 tablets",
    colorTheme: "from-blue-700 via-indigo-800 to-purple-900",
    expectedProductId: "prod-aug-625",
    simulatedText: "AUGMENTIN 625 DUO\nAmoxycillin and Potassium Clavulanate Tablets IP\nAmoxycillin Trihydrate IP eq. to Amoxycillin 500 mg\nPotassium Clavulanate IP eq. to Clavulanic Acid 125 mg\nRx only | GSK Pharmaceuticals | B.No. BAT-AUG-2024-881",
    previewSvgData: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-full rounded-lg">
      <defs>
        <linearGradient id="foilGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#E2E8F0"/>
          <stop offset="50%" stop-color="#CBD5E1"/>
          <stop offset="100%" stop-color="#94A3B8"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" rx="8" fill="url(#foilGrad1)"/>
      <rect x="15" y="15" width="290" height="150" rx="4" fill="#0B2A1F" fill-opacity="0.08" stroke="#64748B" stroke-dasharray="2,2"/>
      <circle cx="50" cy="50" r="18" fill="#FFFFFF" fill-opacity="0.5"/>
      <circle cx="110" cy="50" r="18" fill="#FFFFFF" fill-opacity="0.5"/>
      <circle cx="170" cy="50" r="18" fill="#FFFFFF" fill-opacity="0.5"/>
      <circle cx="230" cy="50" r="18" fill="#FFFFFF" fill-opacity="0.5"/>
      <circle cx="50" cy="130" r="18" fill="#FFFFFF" fill-opacity="0.5"/>
      <circle cx="110" cy="130" r="18" fill="#FFFFFF" fill-opacity="0.5"/>
      <circle cx="170" cy="130" r="18" fill="#FFFFFF" fill-opacity="0.5"/>
      <circle cx="230" cy="130" r="18" fill="#FFFFFF" fill-opacity="0.5"/>
      <rect x="80" y="80" width="160" height="32" rx="4" fill="#1E3A8A"/>
      <text x="160" y="100" fill="#FFFFFF" font-size="12" font-weight="bold" font-family="sans-serif" text-anchor="middle">AUGMENTIN 625 DUO</text>
      <text x="160" y="120" fill="#0F172A" font-size="8" font-family="sans-serif" text-anchor="middle">Amoxycillin 500mg + Clavulanic Acid 125mg</text>
    </svg>`
  },
  {
    id: "sample-lip-20",
    name: "Lipitor 20mg",
    subtitle: "Pfizer blister pack, 30 tablets",
    colorTheme: "from-sky-600 via-blue-700 to-indigo-900",
    expectedProductId: "prod-lip-20",
    simulatedText: "Pfizer\nLIPITOR 20 mg\natorvastatin calcium tablets\n30 Film-Coated Tablets | Rx only\nBatch: BAT-LIP-2024-104 | Exp: 06/2026",
    previewSvgData: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-full rounded-lg">
      <defs>
        <linearGradient id="foilLip" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#F1F5F9"/>
          <stop offset="100%" stop-color="#E2E8F0"/>
        </linearGradient>
      </defs>
      <rect width="320" height="180" rx="8" fill="url(#foilLip)"/>
      <ellipse cx="60" cy="60" rx="22" ry="14" fill="#FFFFFF" stroke="#CBD5E1"/>
      <ellipse cx="140" cy="60" rx="22" ry="14" fill="#FFFFFF" stroke="#CBD5E1"/>
      <ellipse cx="220" cy="60" rx="22" ry="14" fill="#FFFFFF" stroke="#CBD5E1"/>
      <ellipse cx="60" cy="120" rx="22" ry="14" fill="#FFFFFF" stroke="#CBD5E1"/>
      <ellipse cx="140" cy="120" rx="22" ry="14" fill="#FFFFFF" stroke="#CBD5E1"/>
      <ellipse cx="220" cy="120" rx="22" ry="14" fill="#FFFFFF" stroke="#CBD5E1"/>
      <rect x="70" y="85" width="140" height="24" rx="4" fill="#0284C7"/>
      <text x="140" y="101" fill="#FFFFFF" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">LIPITOR 20 mg</text>
      <text x="140" y="115" fill="#334155" font-size="8" font-family="sans-serif" text-anchor="middle">Atorvastatin Calcium</text>
    </svg>`
  },
  {
    id: "sample-glu-xr-500",
    name: "Glucophage XR 500mg",
    subtitle: "Merck extended release blister",
    colorTheme: "from-emerald-700 via-teal-800 to-slate-900",
    expectedProductId: "prod-glu-xr-500",
    simulatedText: "MERCK\nGLUCOPHAGE XR 500mg\nExtended Release Metformin Hydrochloride\n28 Tablets | Prolonged release\nBatch: BAT-GLU-2024-309",
    previewSvgData: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-full rounded-lg">
      <rect width="320" height="180" rx="8" fill="#F8FAFC"/>
      <rect x="20" y="20" width="280" height="140" rx="6" fill="#F1F5F9" stroke="#94A3B8"/>
      <circle cx="80" cy="70" r="16" fill="#FFFFFF" stroke="#CBD5E1"/>
      <circle cx="160" cy="70" r="16" fill="#FFFFFF" stroke="#CBD5E1"/>
      <circle cx="240" cy="70" r="16" fill="#FFFFFF" stroke="#CBD5E1"/>
      <rect x="60" y="100" width="200" height="28" rx="4" fill="#047857"/>
      <text x="160" y="118" fill="#FFFFFF" font-size="11" font-weight="bold" font-family="sans-serif" text-anchor="middle">GLUCOPHAGE XR 500mg</text>
    </svg>`
  },
  {
    id: "sample-pan-ext",
    name: "Panadol Extra",
    subtitle: "Haleon red & white caplets",
    colorTheme: "from-rose-600 via-red-700 to-amber-900",
    expectedProductId: "prod-pan-ext",
    simulatedText: "PANADOL EXTRA\nParacetamol 500mg + Caffeine 65mg\nTough on pain, gentle on stomach\n12 Film-Coated Caplets\nBatch: BAT-PAN-2024-702",
    previewSvgData: `<svg viewBox="0 0 320 180" xmlns="http://www.w3.org/2000/svg" class="w-full h-full rounded-lg">
      <rect width="320" height="180" rx="8" fill="#FEF2F2"/>
      <rect x="15" y="15" width="290" height="150" rx="6" fill="#DC2626"/>
      <rect x="25" y="25" width="270" height="50" rx="4" fill="#FFFFFF"/>
      <text x="160" y="58" fill="#B91C1C" font-size="16" font-weight="900" font-family="sans-serif" text-anchor="middle">PANADOL EXTRA</text>
      <text x="160" y="100" fill="#FFFFFF" font-size="11" font-family="sans-serif" text-anchor="middle">Paracetamol 500mg + Caffeine 65mg</text>
      <text x="160" y="125" fill="#FEE2E2" font-size="9" font-family="sans-serif" text-anchor="middle">Fast, effective pain relief</text>
    </svg>`
  }
];

export function analyzeMedicineImageText(text: string): OcrDetectionResult {
  const normalized = text.toLowerCase();
  
  // Heuristic match against catalogue
  let bestMatch: MedicineProduct | null = null;
  let highestScore = 0;
  let detectedBrand = "";
  let detectedStrength = "";
  let detectedDosageForm = "Tablet";
  const activeIngredients: string[] = [];

  for (const product of SEEDED_PRODUCTS) {
    let score = 0;
    const brandLower = product.brandName.toLowerCase();
    const genericLower = product.genericName.toLowerCase();

    // Check brand
    if (normalized.includes(brandLower)) {
      score += 50;
      detectedBrand = product.brandName;
    } else {
      for (const alias of product.aliases) {
        if (normalized.includes(alias.toLowerCase())) {
          score += 35;
          detectedBrand = product.brandName;
          break;
        }
      }
    }

    // Check strength
    const strengthNums = product.strength.match(/\d+/g) || [];
    let strengthFound = false;
    for (const num of strengthNums) {
      if (normalized.includes(num)) {
        score += 20;
        strengthFound = true;
        detectedStrength = product.strength;
      }
    }

    // Check generic ingredients
    const genericParts = genericLower.split("+").map(s => s.trim());
    for (const part of genericParts) {
      const mainWord = part.split(" ")[0];
      if (mainWord.length > 4 && normalized.includes(mainWord)) {
        score += 15;
        activeIngredients.push(part);
      }
    }

    // Check dosage form
    if (normalized.includes("tablet") || normalized.includes("caplet")) {
      detectedDosageForm = "Tablet";
      if (product.dosageForm === "Tablet") score += 10;
    } else if (normalized.includes("syrup") || normalized.includes("suspension")) {
      detectedDosageForm = "Suspension";
      if (product.dosageForm === "Suspension") score += 10;
    } else if (normalized.includes("inhaler")) {
      detectedDosageForm = "Inhaler";
      if (product.dosageForm === "Inhaler") score += 10;
    }

    if (score > highestScore) {
      highestScore = score;
      bestMatch = product;
    }
  }

  const confidenceScore = Math.min(Math.round(highestScore), 98);

  return {
    rawDetectedText: text,
    candidateProduct: bestMatch,
    confidenceScore: bestMatch ? confidenceScore : 0,
    detectedBrand: detectedBrand || (bestMatch ? bestMatch.brandName : "Unknown Brand"),
    detectedStrength: detectedStrength || (bestMatch ? bestMatch.strength : "Unknown"),
    detectedDosageForm,
    activeIngredientsFound: Array.from(new Set(activeIngredients)),
    requiresHumanConfirmation: true, // Always prompt patient for verification as per clinical safety principles!
    disclaimer: "AI-assisted optical character interpretation. This automated analysis does NOT verify medicine authenticity, clinical appropriateness, or replace pharmacist review."
  };
}
