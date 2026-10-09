"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useLineage } from "../../lib/state/LineageContext";
import { searchAndCategorizeProducts } from "../../lib/utils/matchingEngine";
import { MedicineProduct, Pharmacy, Reservation } from "../../lib/types";
import { SearchBar } from "../../components/patient/SearchBar";
import { ExactMatchCard } from "../../components/patient/ExactMatchCard";
import { ImageOcrUploader } from "../../components/patient/ImageOcrUploader";
import { PharmacyAvailabilityList } from "../../components/patient/PharmacyAvailabilityList";
import { InteractivePharmacyMap } from "../../components/map/InteractivePharmacyMap";
import { ReservationModal } from "../../components/patient/ReservationModal";
import { 
  Search, 
  MapPin, 
  Sparkles, 
  AlertCircle, 
  Store, 
  CheckCircle2, 
  Clock, 
  Send,
  ArrowRight,
  ShieldAlert
} from "lucide-react";

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, pharmacies, inventory, userLocation, requestAvailability } = useLineage();

  const urlQuery = searchParams.get("q") || "";
  const urlTab = searchParams.get("tab") === "ocr" ? "ocr" : "text";

  const [searchQuery, setSearchQuery] = useState(urlQuery);
  const [activeTab, setActiveTab] = useState<"text" | "ocr">(urlTab);
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [selectedProductId, setSelectedProductId] = useState<string>("");
  const [selectedPharmacyId, setSelectedPharmacyId] = useState<string>("");
  
  // Modal state
  const [reservationModalOpen, setReservationModalOpen] = useState(false);
  const [reservationTargetPharmacy, setReservationTargetPharmacy] = useState<Pharmacy | null>(null);
  
  // Broadcast ping tracker
  const [pingedPharmacyIds, setPingedPharmacyIds] = useState<string[]>([]);
  const [pingBannerNotice, setPingBannerNotice] = useState<string | null>(null);

  // Synchronize with URL query changes
  useEffect(() => {
    if (urlQuery) setSearchQuery(urlQuery);
    if (searchParams.get("tab") === "ocr") setActiveTab("ocr");
  }, [urlQuery, searchParams]);

  // Execute matching engine
  const searchResults = searchAndCategorizeProducts(products, searchQuery, categoryFilter);

  // Set default selected product
  useEffect(() => {
    if (searchResults.exactMatches.length > 0) {
      if (!selectedProductId || !searchResults.exactMatches.some(p => p.id === selectedProductId)) {
        setSelectedProductId(searchResults.exactMatches[0].id);
      }
    } else if (searchResults.alternativeBrands.length > 0) {
      setSelectedProductId(searchResults.alternativeBrands[0].product.id);
    } else if (products.length > 0 && !selectedProductId) {
      setSelectedProductId(products[0].id);
    }
  }, [searchResults.exactMatches, searchResults.alternativeBrands, products, selectedProductId]);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleSearch = (q: string, loc: string, cat: string) => {
    setSearchQuery(q);
    setCategoryFilter(cat);
  };

  const handleOcrConfirmed = (prodId: string, brandName: string) => {
    setSelectedProductId(prodId);
    setSearchQuery(brandName);
    setActiveTab("text");
  };

  const handleOpenReservation = (pharmacy: Pharmacy) => {
    setReservationTargetPharmacy(pharmacy);
    setReservationModalOpen(true);
  };

  const handleReservationSuccess = (reservation: Reservation) => {
    setReservationModalOpen(false);
    router.push(`/orders/${reservation.id}`);
  };

  const handlePingDispensary = (pharmacyId: string) => {
    setPingedPharmacyIds(prev => [...prev, pharmacyId]);
    requestAvailability(selectedProduct.id, [pharmacyId]);
    const pharm = pharmacies.find(p => p.id === pharmacyId);
    setPingBannerNotice(`Availability ping dispatched to ${pharm?.name || "pharmacy"}. You'll receive real-time notification upon pharmacist confirmation.`);
    setTimeout(() => setPingBannerNotice(null), 6000);
  };

  return (
    <div className="w-full bg-[#FAFAF8] min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Breadcrumb / Top Indicator */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <a href="/" className="hover:text-emerald-800">Home</a>
            <span>/</span>
            <span className="text-slate-800 font-semibold">Medicine Discovery</span>
          </div>

          <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
            <MapPin className="w-3.5 h-3.5" />
            <span>Search Area: {userLocation.label}</span>
          </div>
        </div>

        {/* Search Bar / Mode Switcher */}
        <SearchBar
          initialQuery={searchQuery}
          onSearch={handleSearch}
          onOpenOcr={() => setActiveTab("ocr")}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Global Ping Confirmation Alert Banner */}
        {pingBannerNotice && (
          <div className="p-3.5 rounded-xl bg-emerald-900 text-white text-xs font-semibold flex items-center justify-between shadow-md animate-fadeIn">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-emerald-300 shrink-0" />
              <span>{pingBannerNotice}</span>
            </div>
            <button
              onClick={() => setPingBannerNotice(null)}
              className="text-emerald-300 hover:text-white underline text-[11px] ml-4"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* OCR Tab Content */}
        {activeTab === "ocr" ? (
          <ImageOcrUploader onConfirmProduct={handleOcrConfirmed} />
        ) : (
          /* Normal Catalogue Search Results */
          <div className="space-y-8">
            {/* Matching Section: Exact vs Alternative */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                    <span>Product Identification & Matching</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      Deterministic Engine
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {searchQuery
                      ? `Matching query '${searchQuery}' against 25+ canonical registered pharmaceuticals`
                      : "Displaying canonical catalogue medicines"}
                  </p>
                </div>
              </div>

              {/* Exact Matches Cards Grid */}
              {searchResults.exactMatches.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {searchResults.exactMatches.map(product => (
                    <ExactMatchCard
                      key={product.id}
                      product={product}
                      isExact={true}
                      isSelected={selectedProductId === product.id}
                      onSelect={(id) => setSelectedProductId(id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
                  <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
                  <h4 className="font-bold text-slate-800 text-base">No Exact Brand Match Found</h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    We did not locate an exact brand match for "{searchQuery}". Check the alternative brands below or try searching by active generic ingredient.
                  </p>
                </div>
              )}

              {/* Separate Alternative Brands Section (Never Silent Substitution!) */}
              {searchResults.alternativeBrands.length > 0 && (
                <div className="mt-6 pt-6 border-t border-slate-200 space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-900 border border-amber-300">
                      Clinical Safety Checkpoint
                    </span>
                    <h3 className="font-bold text-slate-900 text-sm">
                      Alternative Brands Sharing Identical Active Ingredients (Discuss with Pharmacist)
                    </h3>
                  </div>
                  <p className="text-xs text-slate-500">
                    These formulations contain identical active molecules ({searchResults.alternativeBrands[0].sharedGeneric}), but are manufactured by different pharmaceutical companies.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {searchResults.alternativeBrands.map(({ product, reason }) => (
                      <ExactMatchCard
                        key={product.id}
                        product={product}
                        isExact={false}
                        alternativeReason={reason}
                        differenceType="BRAND_ONLY"
                        isSelected={selectedProductId === product.id}
                        onSelect={(id) => setSelectedProductId(id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Different Strengths Section */}
              {searchResults.differentStrengthsOrForms.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-2">
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                    Different Strengths or Formulations (Requires Prescription Review)
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {searchResults.differentStrengthsOrForms.map(({ product, reason }) => (
                      <ExactMatchCard
                        key={product.id}
                        product={product}
                        isExact={false}
                        alternativeReason={reason}
                        differenceType="STRENGTH_MISMATCH"
                        isSelected={selectedProductId === product.id}
                        onSelect={(id) => setSelectedProductId(id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Selected Product Pharmacy Availability: Combination of Map and List */}
            {selectedProduct && (
              <div className="pt-8 border-t border-slate-200 space-y-6">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                      Hyperlocal Availability Ledger
                    </span>
                    <h2 className="text-2xl font-extrabold text-[#0B2A1F] tracking-tight">
                      Dispensaries Stocking {selectedProduct.brandName}
                    </h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Real-time confirmed stocks, freshness ratings, and reserve-and-collect options.
                    </p>
                  </div>
                </div>

                {/* Combined Grid: Interactive Leaflet Map & Pharmacy List */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  {/* Left Column: Interactive Map */}
                  <div className="lg:col-span-5 sticky top-24 space-y-3">
                    <InteractivePharmacyMap
                      pharmacies={pharmacies}
                      inventoryRecords={inventory.filter(i => i.productId === selectedProduct.id)}
                      selectedPharmacyId={selectedPharmacyId}
                      onSelectPharmacy={setSelectedPharmacyId}
                      userLocation={userLocation}
                      searchRadiusKm={5}
                    />

                    <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 space-y-1.5 shadow-xs">
                      <div className="font-semibold text-slate-800 flex items-center justify-between">
                        <span>Search Origin: {userLocation.label}</span>
                        <span className="text-emerald-700 font-bold">5.0 km radius</span>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed">
                        Distances reflect calculated point-to-point road estimates within the Metro Health Corridor. Click any pin to inspect stock freshness.
                      </p>
                    </div>
                  </div>

                  {/* Right Column: Pharmacy Availability Cards List */}
                  <div className="lg:col-span-7">
                    <PharmacyAvailabilityList
                      pharmacies={pharmacies}
                      inventoryRecords={inventory}
                      product={selectedProduct}
                      selectedPharmacyId={selectedPharmacyId}
                      onSelectPharmacy={setSelectedPharmacyId}
                      onOpenReservation={handleOpenReservation}
                      onPingPharmacy={handlePingDispensary}
                      pingedPharmacyIds={pingedPharmacyIds}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Reservation Modal Dialog */}
        {reservationTargetPharmacy && selectedProduct && (
          <ReservationModal
            pharmacy={reservationTargetPharmacy}
            product={selectedProduct}
            isOpen={reservationModalOpen}
            onClose={() => setReservationModalOpen(false)}
            onSuccess={handleReservationSuccess}
          />
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="w-full min-h-screen flex items-center justify-center p-8">
        <div className="w-8 h-8 rounded-full border-4 border-emerald-700 border-t-transparent animate-spin" />
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}
