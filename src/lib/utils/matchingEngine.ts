import { MedicineProduct } from "../types";

export interface CategorizedSearchResults {
  exactMatches: MedicineProduct[];
  alternativeBrands: {
    product: MedicineProduct;
    reason: string;
    sharedGeneric: string;
  }[];
  differentStrengthsOrForms: {
    product: MedicineProduct;
    reason: string;
    difference: "STRENGTH" | "FORMULATION" | "DOSAGE_FORM";
  }[];
  query: string;
}

export function searchAndCategorizeProducts(
  products: MedicineProduct[],
  query: string,
  categoryFilter?: string
): CategorizedSearchResults {
  const cleanQuery = query.trim().toLowerCase();

  if (!cleanQuery) {
    let filtered = products;
    if (categoryFilter && categoryFilter !== "ALL") {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }
    return {
      exactMatches: filtered,
      alternativeBrands: [],
      differentStrengthsOrForms: [],
      query: ""
    };
  }

  const exactMatches: MedicineProduct[] = [];
  const alternativeBrands: CategorizedSearchResults["alternativeBrands"] = [];
  const differentStrengthsOrForms: CategorizedSearchResults["differentStrengthsOrForms"] = [];

  // 1. First, check if the query directly matches a specific brand name or exact alias
  for (const product of products) {
    if (categoryFilter && categoryFilter !== "ALL" && product.category !== categoryFilter) {
      continue;
    }

    const brandLower = product.brandName.toLowerCase();
    const genericLower = product.genericName.toLowerCase();
    const aliasesLower = product.aliases.map(a => a.toLowerCase());
    const strengthLower = product.strength.toLowerCase();

    // Check for exact brand hit
    const matchesBrand = brandLower.includes(cleanQuery) || 
      aliasesLower.some(alias => alias.includes(cleanQuery) || cleanQuery.includes(alias));

    // Check if query contains strength numbers if product has them
    const numbersInQuery: string[] = cleanQuery.match(/\d+/g) || [];
    const numbersInProduct: string[] = product.strength.match(/\d+/g) || [];
    const strengthMatches = numbersInQuery.length === 0 || 
      numbersInQuery.some((num: string) => numbersInProduct.includes(num));

    if (matchesBrand) {
      if (strengthMatches) {
        exactMatches.push(product);
      } else {
        differentStrengthsOrForms.push({
          product,
          reason: `Same brand '${product.brandName}', but strength is ${product.strength} (differing from search query).`,
          difference: "STRENGTH"
        });
      }
    }
  }

  // 2. If we found exact matches, search for alternative brands that share the EXACT same active ingredient & strength
  if (exactMatches.length > 0) {
    const primaryMatch = exactMatches[0];
    const primaryGeneric = primaryMatch.genericName.toLowerCase();
    const primaryStrength = primaryMatch.strength.toLowerCase();

    for (const product of products) {
      if (exactMatches.some(e => e.id === product.id)) continue;
      if (differentStrengthsOrForms.some(d => d.product.id === product.id)) continue;

      const productGeneric = product.genericName.toLowerCase();
      const productStrength = product.strength.toLowerCase();

      // Check for identical active ingredient
      if (productGeneric === primaryGeneric) {
        if (productStrength === primaryStrength) {
          alternativeBrands.push({
            product,
            reason: `Contains identical active ingredients (${product.genericName} ${product.strength}), but manufactured by ${product.manufacturer} under brand '${product.brandName}'. Discuss substitution with your pharmacist.`,
            sharedGeneric: product.genericName
          });
        } else {
          differentStrengthsOrForms.push({
            product,
            reason: `Related active ingredient (${product.genericName}), but different strength: ${product.strength}.`,
            difference: "STRENGTH"
          });
        }
      }
    }
  } else {
    // 3. If query was a generic or didn't match a specific brand directly, check active ingredients
    for (const product of products) {
      const genericLower = product.genericName.toLowerCase();
      if (genericLower.includes(cleanQuery)) {
        // Query is a generic search like "amoxicillin" or "paracetamol"
        // In this case, each brand is presented clearly
        exactMatches.push(product);
      }
    }
  }

  return {
    exactMatches,
    alternativeBrands,
    differentStrengthsOrForms,
    query: cleanQuery
  };
}

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}
