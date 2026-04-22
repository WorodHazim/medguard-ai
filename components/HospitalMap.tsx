"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RecommendationResult } from "@/lib/recommendation";

// ─── Custom Icons ─────────────────────────────────────────────────────────────

// Fix for default marker icons in Next.js
const createDivIcon = (className: string, color: string, isPatient = false) => {
  return L.divIcon({
    className: "custom-marker",
    html: `
      <div class="relative flex items-center justify-center">
        ${isPatient ? '<div class="absolute w-8 h-8 bg-blue-400/30 rounded-full animate-ping"></div>' : ""}
        <div class="w-4 h-4 rounded-full border-2 border-white shadow-lg" style="background-color: ${color}"></div>
        ${!isPatient ? '<div class="absolute -bottom-1 w-1 h-1 bg-black/20 rounded-full blur-[1px]"></div>' : ""}
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

const ICONS = {
  patient: createDivIcon("patient-marker", "#3b82f6", true), // Blue
  best: createDivIcon("best-marker", "#10b981"), // Emerald
  alt: createDivIcon("alt-marker", "#94a3b8"), // Slate
};

// ─── Map Bounds Helper ───────────────────────────────────────────────────────

function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [bounds, map]);
  return null;
}

// ─── Main Component ──────────────────────────────────────────────────────────

interface HospitalMapProps {
  result: RecommendationResult;
  patientCoords: [number, number];
}

export default function HospitalMap({ result, patientCoords }: HospitalMapProps) {
  // Center map on patient initially
  const center: [number, number] = patientCoords;

  // Build points for bounds and markers
  const markers = useMemo(() => {
    const list = [
      { id: "patient", name: "Current Location", coords: patientCoords, type: "patient" },
      { id: "best", name: result.hospitalName, coords: [result.lat || 0, result.lng || 0] as [number, number], type: "best", data: result },
    ];

    if (result.alternatives) {
      result.alternatives.forEach((alt, i) => {
        if (alt.lat && alt.lng) {
          list.push({
            id: `alt-${i}`,
            name: alt.hospitalName,
            coords: [alt.lat, alt.lng] as [number, number],
            type: "alt",
            data: alt,
          });
        }
      });
    }

    return list;
  }, [result, patientCoords]);

  const bounds = useMemo(() => {
    if (markers.length < 2) return null;
    return L.latLngBounds(markers.map((m) => m.coords));
  }, [markers]);

  const bestCoords = markers.find((m) => m.type === "best")?.coords || [0, 0];

  return (
    <div className="relative w-full h-[400px] rounded-3xl overflow-hidden border border-slate-100 shadow-xl shadow-slate-200/50 bg-slate-50">
      {/* Map Header Overlay */}
      <div className="absolute top-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm px-4 py-2 rounded-2xl border border-slate-100 shadow-sm">
        <h4 className="text-[10px] font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Proximity Logic
        </h4>
      </div>

      {/* Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-sm p-3 rounded-2xl border border-slate-100 shadow-sm space-y-2">
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
          <div className="w-2 h-2 rounded-full bg-blue-500"></div> Patient
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div> Best Match
        </div>
        <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600">
          <div className="w-2 h-2 rounded-full bg-slate-400"></div> Alternative
        </div>
      </div>

      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-grayscale"
        />

        <ChangeView bounds={bounds} />

        {/* Route Line to Best Match */}
        <Polyline 
          positions={[patientCoords, bestCoords]} 
          pathOptions={{ color: "#10b981", weight: 3, dashArray: "10, 10", opacity: 0.6 }} 
        />

        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={marker.coords} 
            icon={ICONS[marker.type as keyof typeof ICONS]}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <h5 className="font-bold text-slate-900 text-sm mb-1">{marker.name}</h5>
                {marker.type === "patient" ? (
                  <p className="text-[10px] text-slate-500 font-medium italic">Incident / Patient Location</p>
                ) : (
                  <div className="space-y-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">
                      {marker.data?.hospitalType}
                    </p>
                    <div className="flex items-center justify-between gap-4 pt-1 border-t border-slate-50">
                      <span className="text-[10px] font-black text-slate-700">{marker.data?.travelTime}</span>
                      <span className={`text-[10px] font-black ${marker.type === 'best' ? 'text-emerald-600' : 'text-slate-400'}`}>
                        {marker.type === 'best' ? 'MATCH #1' : 'ALT OPTION'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style jsx global>{`
        .leaflet-container {
          background: #f8fafc !important;
        }
        .map-tiles-grayscale {
          filter: grayscale(0.2) contrast(1.1) brightness(1.05);
        }
        .leaflet-popup-content-wrapper {
          border-radius: 12px !important;
          padding: 0 !important;
          box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1) !important;
        }
        .leaflet-popup-content {
          margin: 12px !important;
          width: auto !important;
        }
        .leaflet-popup-tip {
          box-shadow: none !important;
        }
      `}</style>
    </div>
  );
}
