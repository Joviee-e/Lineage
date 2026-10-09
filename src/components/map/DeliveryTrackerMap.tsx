"use client";

import React, { useEffect, useRef } from "react";
import { DeliveryJob, Pharmacy, Reservation } from "../../lib/types";
import { Bike, Store, MapPin } from "lucide-react";

interface DeliveryTrackerMapProps {
  job: DeliveryJob;
  pharmacy?: Pharmacy;
  reservation?: Reservation;
}

export function DeliveryTrackerMap({ job, pharmacy, reservation }: DeliveryTrackerMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  const pharmacyCoords = pharmacy ? [pharmacy.coordinates.lat, pharmacy.coordinates.lng] : [18.5220, 73.8575];
  const patientCoords = [18.5204, 73.8567]; // Crescent Blvd

  // Interpolated rider coordinates based on job status
  let riderCoords = [18.5220, 73.8575];
  if (job.status === "ASSIGNED") {
    riderCoords = [18.5230, 73.8580]; // Heading to pharmacy
  } else if (job.status === "PICKED_UP") {
    riderCoords = [18.5215, 73.8572]; // En route
  } else if (job.status === "OUT_FOR_DELIVERY") {
    riderCoords = [18.5208, 73.8569]; // Near patient
  } else if (job.status === "DELIVERED") {
    riderCoords = patientCoords;
  }

  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;
      if (leafletMapRef.current) return;

      try {
        const L = (await import("leaflet")).default;

        const map = L.map(mapContainerRef.current, {
          center: [18.5212, 73.8571],
          zoom: 15,
          zoomControl: false
        });

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        // Pharmacy Marker
        const pharmIcon = L.divIcon({
          html: `<div style="background:#0F382A; color:white; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 3px 8px rgba(0,0,0,0.3); font-weight:bold;">🏥</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        L.marker(pharmacyCoords as [number, number], { icon: pharmIcon }).addTo(map).bindPopup("<b>Pickup:</b> " + (pharmacy?.name || "Dispensary"));

        // Patient Destination Marker
        const patientIcon = L.divIcon({
          html: `<div style="background:#1E3A8A; color:white; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:2px solid white; box-shadow:0 3px 8px rgba(0,0,0,0.3); font-weight:bold;">📍</div>`,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });
        L.marker(patientCoords as [number, number], { icon: patientIcon }).addTo(map).bindPopup("<b>Dropoff:</b> " + job.dropoffAddress);

        // Rider Marker
        const riderIcon = L.divIcon({
          html: `<div style="background:#D97706; color:white; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; border:3px solid white; box-shadow:0 4px 12px rgba(0,0,0,0.4); font-size:16px;">🛵</div>`,
          iconSize: [36, 36],
          iconAnchor: [18, 18]
        });
        L.marker(riderCoords as [number, number], { icon: riderIcon }).addTo(map).bindPopup(`<b>Courier:</b> ${job.riderName || "Leo Chen"}<br>Status: ${job.status}`);

        // Polyline connecting route
        L.polyline([pharmacyCoords as [number, number], riderCoords as [number, number], patientCoords as [number, number]], {
          color: "#059669",
          weight: 4,
          opacity: 0.8,
          dashArray: "6, 6"
        }).addTo(map);

        leafletMapRef.current = map;
      } catch (e) {
        console.warn("Could not load leaflet tiles in delivery tracker", e);
      }
    }

    initMap();

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [job.status]);

  return (
    <div className="relative w-full h-72 rounded-xl overflow-hidden border border-slate-200 bg-slate-100 shadow-inner">
      <div ref={mapContainerRef} className="w-full h-full" />
      
      {/* Live Rider Position Overlay Banner */}
      <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-slate-200 text-xs flex items-center gap-2">
        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-slate-800">Live GPS Simulation:</span>
        <span className="text-emerald-800 font-medium">{job.riderName || "Leo Chen"} (En Route)</span>
      </div>
    </div>
  );
}
