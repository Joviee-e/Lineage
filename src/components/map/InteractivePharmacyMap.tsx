"use client";

import React, { useEffect, useRef, useState } from "react";
import { Pharmacy, InventoryRecord, FreshnessCategory } from "../../lib/types";
import { Store, Navigation, MapPin, CheckCircle2, Clock, AlertTriangle, ShieldAlert } from "lucide-react";

interface InteractivePharmacyMapProps {
  pharmacies: Pharmacy[];
  inventoryRecords: InventoryRecord[];
  selectedPharmacyId?: string;
  onSelectPharmacy?: (pharmacyId: string) => void;
  userLocation: { lat: number; lng: number; label: string };
  searchRadiusKm?: number;
  highlightedBatchStatus?: "ACTIVE" | "RESTRICTED";
}

export function InteractivePharmacyMap({
  pharmacies,
  inventoryRecords,
  selectedPharmacyId,
  onSelectPharmacy,
  userLocation,
  searchRadiusKm = 5,
  highlightedBatchStatus
}: InteractivePharmacyMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const markersRef = useRef<Record<string, any>>({});
  const polylineRef = useRef<any>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [tileError, setTileError] = useState(false);

  // Helper to determine status for each pharmacy based on current inventory
  const getPharmacyStatus = (pharmacyId: string): FreshnessCategory => {
    const records = inventoryRecords.filter(i => i.pharmacyId === pharmacyId);
    if (records.length === 0) return "UNAVAILABLE";
    if (records.some(r => r.freshnessCategory === "RESTRICTED")) return "RESTRICTED";
    if (records.some(r => r.freshnessCategory === "RECENTLY_CONFIRMED")) return "RECENTLY_CONFIRMED";
    if (records.some(r => r.freshnessCategory === "NEEDS_CONFIRMATION")) return "NEEDS_CONFIRMATION";
    return "UNAVAILABLE";
  };

  useEffect(() => {
    let isMounted = true;

    async function initLeaflet() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (leafletMapRef.current) return; // already initialized

      try {
        const L = (await import("leaflet")).default;

        // Custom marker pin generator
        const createCustomIcon = (status: FreshnessCategory | "USER", isSelected: boolean) => {
          let bg = "#10B981"; // emerald
          let stroke = "#065F46";
          let label = "✓";

          if (status === "USER") {
            bg = "#2563EB";
            stroke = "#1D4ED8";
            label = "★";
          } else if (status === "RESTRICTED") {
            bg = "#E11D48";
            stroke = "#9F1239";
            label = "!";
          } else if (status === "NEEDS_CONFIRMATION") {
            bg = "#D97706";
            stroke = "#92400E";
            label = "⏱";
          } else if (status === "UNAVAILABLE") {
            bg = "#64748B";
            stroke = "#334155";
            label = "✕";
          }

          const size = isSelected ? 36 : 28;
          const html = `
            <div style="
              width: ${size}px;
              height: ${size}px;
              background-color: ${bg};
              border: 3px solid ${isSelected ? '#FFFFFF' : stroke};
              box-shadow: 0 4px 12px rgba(0,0,0,0.3);
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-weight: bold;
              font-size: ${isSelected ? '14px' : '11px'};
              cursor: pointer;
              transform: ${isSelected ? 'scale(1.15)' : 'scale(1)'};
              transition: transform 0.2s ease;
            ">
              ${label}
            </div>
          `;

          return L.divIcon({
            html,
            className: "custom-leaflet-marker",
            iconSize: [size, size],
            iconAnchor: [size / 2, size / 2]
          });
        };

        const map = L.map(mapContainerRef.current, {
          center: [userLocation.lat, userLocation.lng],
          zoom: 14,
          zoomControl: true,
          attributionControl: true
        });

        // OpenStreetMap Tile Layer
        const tileLayer = L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19
        });

        tileLayer.on("tileerror", () => {
          if (isMounted) setTileError(true);
        });

        tileLayer.addTo(map);

        // Add Patient Location Marker
        const userMarker = L.marker([userLocation.lat, userLocation.lng], {
          icon: createCustomIcon("USER", false),
          title: "Your Location: " + userLocation.label
        }).addTo(map);

        userMarker.bindPopup(`
          <div style="padding: 10px; font-family: sans-serif;">
            <div style="font-weight: bold; font-size: 13px; color: #1E3A8A;">📍 Your Location</div>
            <div style="font-size: 11px; color: #475569; margin-top: 2px;">${userLocation.label}</div>
            <div style="font-size: 10px; color: #64748B; margin-top: 4px;">Search Radius: ${searchRadiusKm} km</div>
          </div>
        `);

        // Add Search Radius Circle
        L.circle([userLocation.lat, userLocation.lng], {
          radius: searchRadiusKm * 1000,
          color: "#059669",
          fillColor: "#10B981",
          fillOpacity: 0.06,
          weight: 1.5,
          dashArray: "4, 4"
        }).addTo(map);

        // Add Pharmacy Markers
        const markers: Record<string, any> = {};

        pharmacies.forEach(p => {
          const status = getPharmacyStatus(p.id);
          const isSelected = p.id === selectedPharmacyId;
          const marker = L.marker([p.coordinates.lat, p.coordinates.lng], {
            icon: createCustomIcon(status, isSelected),
            title: p.name
          }).addTo(map);

          marker.on("click", () => {
            if (onSelectPharmacy) onSelectPharmacy(p.id);
          });

          const statusLabel = 
            status === "RECENTLY_CONFIRMED" ? "Recently Confirmed (<4h)" :
            status === "NEEDS_CONFIRMATION" ? "Needs Confirmation (Stale)" :
            status === "RESTRICTED" ? "Batch Restricted / Quarantined" : "Out of Stock";

          marker.bindPopup(`
            <div style="padding: 12px; font-family: sans-serif; min-width: 200px;">
              <div style="font-weight: bold; font-size: 13px; color: #0F172A;">${p.name}</div>
              <div style="font-size: 11px; color: #64748B; margin-top: 2px;">${p.locality}</div>
              <div style="margin-top: 6px; font-size: 11px; font-weight: 600; color: ${
                status === "RECENTLY_CONFIRMED" ? "#047857" :
                status === "NEEDS_CONFIRMATION" ? "#B45309" :
                status === "RESTRICTED" ? "#BE123C" : "#475569"
              }">
                ● ${statusLabel}
              </div>
              <div style="margin-top: 6px; font-size: 10px; color: #475569; display: flex; justify-content: space-between;">
                <span>Rating: ★ ${p.rating}</span>
                <span>Avg Resp: ${p.responseTimeAvgMinutes} min</span>
              </div>
            </div>
          `);

          markers[p.id] = marker;
        });

        leafletMapRef.current = map;
        markersRef.current = markers;
        if (isMounted) setMapLoaded(true);
      } catch (err) {
        console.warn("Leaflet map initialization encountered issue, falling back to SVG renderer", err);
        if (isMounted) setTileError(true);
      }
    }

    initLeaflet();

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [pharmacies.length, userLocation.lat, userLocation.lng, searchRadiusKm]);

  // Update selected pharmacy focus and polyline route
  useEffect(() => {
    if (!leafletMapRef.current || !selectedPharmacyId) return;

    const selectedPharm = pharmacies.find(p => p.id === selectedPharmacyId);
    if (!selectedPharm) return;

    import("leaflet").then(L => {
      // Pan to selected pharmacy
      leafletMapRef.current.setView([selectedPharm.coordinates.lat, selectedPharm.coordinates.lng], 15);

      // Open popup
      const marker = markersRef.current[selectedPharmacyId];
      if (marker) marker.openPopup();

      // Draw or update Polyline route
      if (polylineRef.current) {
        polylineRef.current.remove();
      }

      const routeCoordinates: [number, number][] = [
        [userLocation.lat, userLocation.lng],
        [selectedPharm.coordinates.lat, selectedPharm.coordinates.lng]
      ];

      polylineRef.current = L.polyline(routeCoordinates, {
        color: "#059669",
        weight: 3,
        opacity: 0.8,
        dashArray: "6, 6"
      }).addTo(leafletMapRef.current);
    });
  }, [selectedPharmacyId, pharmacies, userLocation.lat, userLocation.lng]);

  const selectedPharm = pharmacies.find(p => p.id === selectedPharmacyId);

  return (
    <div className="relative w-full h-[420px] rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-sm flex flex-col">
      {/* Map Header / Legend Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-slate-200/80 pointer-events-auto flex items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Metro Health Corridor</span>
          </div>

          <div className="h-3 w-px bg-slate-300 hidden sm:block" />

          {/* Quick Legend */}
          <div className="hidden md:flex items-center gap-2.5 text-[11px] text-slate-600 font-medium">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Confirmed
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              Stale / Ping
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
              Quarantined
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
              Unavailable
            </span>
          </div>
        </div>

        <div className="bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-lg shadow-md border border-slate-200/80 pointer-events-auto text-xs font-semibold text-slate-700">
          Radius: {searchRadiusKm} km
        </div>
      </div>

      {/* Primary Leaflet Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Robust Fallback SVG Map in case tiles cannot be reached */}
      {tileError && (
        <div className="absolute inset-0 z-15 bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-lg aspect-16/9 bg-emerald-950/5 rounded-xl border border-emerald-200/80 p-4 relative overflow-hidden">
            <div className="absolute top-2 left-2 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Schematic Locality Visualizer (Offline Safe)
            </div>
            
            {/* Center Patient Node */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-md border-2 border-white animate-pulse">
                ★
              </div>
              <span className="text-[10px] font-bold text-blue-900 mt-1 bg-white/90 px-1.5 py-0.5 rounded shadow-xs">
                Your Residence
              </span>
            </div>

            {/* Render Seeded Pharmacies around center */}
            {pharmacies.slice(0, 6).map((pharm, i) => {
              const angles = [0.3, 1.2, 2.1, 3.4, 4.2, 5.3];
              const radii = [70, 95, 110, 80, 100, 115];
              const x = 50 + Math.cos(angles[i]) * (radii[i] / 3);
              const y = 50 + Math.sin(angles[i]) * (radii[i] / 3);
              const status = getPharmacyStatus(pharm.id);
              const isSelected = pharm.id === selectedPharmacyId;

              const bg = 
                status === "RECENTLY_CONFIRMED" ? "bg-emerald-600" :
                status === "NEEDS_CONFIRMATION" ? "bg-amber-500" :
                status === "RESTRICTED" ? "bg-rose-600" : "bg-slate-400";

              return (
                <button
                  key={pharm.id}
                  onClick={() => onSelectPharmacy && onSelectPharmacy(pharm.id)}
                  style={{ top: `${y}%`, left: `${x}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer transition-transform ${
                    isSelected ? "scale-125 z-20" : "scale-100 hover:scale-110"
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full ${bg} text-white text-[10px] font-bold flex items-center justify-center shadow-md border border-white`}>
                    {i + 1}
                  </div>
                  <span className="hidden group-hover:block absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap text-[10px] font-semibold bg-slate-900 text-white px-2 py-0.5 rounded shadow-lg">
                    {pharm.name}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            Loaded in resilient vector coordinates mode. Click any pharmacy pin to view stock freshness.
          </p>
        </div>
      )}

      {/* Selected Pharmacy Quick Preview Drawer */}
      {selectedPharm && (
        <div className="absolute bottom-3 left-3 right-3 z-20 bg-white/95 backdrop-blur-md rounded-xl p-3 shadow-lg border border-slate-200 flex items-center justify-between flex-wrap gap-2 animate-fadeIn">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shrink-0">
              <Store className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="font-bold text-slate-900 text-sm">{selectedPharm.name}</div>
              <div className="text-xs text-slate-500">{selectedPharm.address} ({selectedPharm.locality})</div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-right text-xs">
              <div className="font-semibold text-slate-800">★ {selectedPharm.rating} ({selectedPharm.reviewsCount} reviews)</div>
              <div className="text-[11px] text-emerald-700 font-medium">Avg response ~{selectedPharm.responseTimeAvgMinutes} min</div>
            </div>
            <a
              href={`#pharmacy-${selectedPharm.id}`}
              className="px-3 py-1.5 rounded-lg bg-[#0B2A1F] text-white text-xs font-semibold hover:bg-[#134E3A] transition-colors"
            >
              Inspect Stock
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
