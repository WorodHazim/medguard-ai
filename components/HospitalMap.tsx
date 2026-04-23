"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { RecommendationResult } from "@/lib/recommendation";

// ─── Custom Icons ─────────────────────────────────────────────────────────────

const createMarkerIcon = (color: string, size: number, isBest = false, isPatient = false) => {
  const iconSize: [number, number] = [size, size];
  const iconAnchor: [number, number] = [size / 2, size / 2];

  return L.divIcon({
    className: "custom-marker-container",
    html: `
      <div class="relative flex items-center justify-center" style="width: ${size}px; height: ${size}px;">
        ${isBest ? `<div class="absolute w-[180%] h-[180%] bg-emerald-400/20 rounded-full animate-map-pulse"></div>` : ""}
        ${isPatient ? `<div class="absolute w-[150%] h-[150%] bg-blue-400/20 rounded-full animate-ping opacity-75"></div>` : ""}
        <div class="rounded-full border-2 border-white shadow-2xl transition-transform duration-300 hover:scale-125" 
             style="width: 100%; height: 100%; background-color: ${color}; z-index: 10;">
        </div>
      </div>
    `,
    iconSize,
    iconAnchor,
    popupAnchor: [0, -size / 2],
  });
};

const ICONS = {
  patient: createMarkerIcon("#3b82f6", 24, false, true), // Medium Blue
  best: createMarkerIcon("#10b981", 32, true),           // Large Green (Best)
  alt: createMarkerIcon("#94a3b8", 14),                 // Small Gray (Alternative)
};

// ─── Map Bounds Helper ───────────────────────────────────────────────────────

function ChangeView({ bounds }: { bounds: L.LatLngBoundsExpression | null }) {
  const map = useMap();
  useEffect(() => {
    if (bounds) {
      // Specifically focusing on current location and best match with healthy padding
      map.fitBounds(bounds, { 
        padding: [60, 60], 
        maxZoom: 15,
        animate: true,
        duration: 1.5
      });
    }
  }, [bounds, map]);
  return null;
}

// ─── Legend Component ────────────────────────────────────────────────────────

const MapLegend = () => (
  <div className="absolute top-4 right-4 z-[1000] bg-white/95 backdrop-blur-xl p-4 rounded-2xl border border-slate-100 shadow-2xl space-y-3 min-w-[140px]">
    <h5 className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Routing Key</h5>
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-blue-500 shadow-lg shadow-blue-200"></div>
        <span className="text-[10px] font-black text-slate-700">PATIENT</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-lg shadow-emerald-200"></div>
        <span className="text-[10px] font-black text-slate-700">RECOMMENDED</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-3 h-3 rounded-full bg-slate-400"></div>
        <span className="text-[10px] font-black text-slate-500">ALTERNATIVE</span>
      </div>
    </div>
  </div>
);

// ─── Main Component ──────────────────────────────────────────────────────────

interface HospitalMapProps {
  result: RecommendationResult;
  patientCoords: [number, number];
}

export default function HospitalMap({ result, patientCoords }: HospitalMapProps) {
  const center: [number, number] = patientCoords;

  const markers = useMemo(() => {
    const list = [
      { id: "patient", name: "Patient Location", coords: patientCoords, type: "patient" },
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

  // Focus bounds primarily on Patient and Best Match
  const bounds = useMemo(() => {
    const focusMarkers = markers.filter(m => m.type === "patient" || m.type === "best");
    if (focusMarkers.length < 2) return null;
    return L.latLngBounds(focusMarkers.map((m) => m.coords));
  }, [markers]);

  const bestCoords = markers.find((m) => m.type === "best")?.coords || [0, 0];

  return (
    <div className="relative w-full h-[450px] rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-2xl bg-slate-50 animate-in fade-in duration-1000">
      <MapLegend />

      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={false}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false} // Cleaner UI
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          className="map-tiles-grayscale"
        />

        <ChangeView bounds={bounds} />

        {/* 🛣️ Improved Route Line */}
        <Polyline 
          positions={[patientCoords, bestCoords]} 
          pathOptions={{ 
            color: "#3b82f6", 
            weight: 6, 
            dashArray: "12, 18", 
            opacity: 0.8,
            lineCap: "round",
            lineJoin: "round"
          }} 
        />

        {markers.map((marker) => (
          <Marker 
            key={marker.id} 
            position={marker.coords} 
            icon={ICONS[marker.type as keyof typeof ICONS]}
            zIndexOffset={marker.type === 'best' ? 1000 : marker.type === 'patient' ? 500 : 0}
          >
            <Popup className="custom-medical-popup">
              <div className="p-2 min-w-[200px] space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-black uppercase tracking-widest ${
                      marker.type === 'best' ? 'text-emerald-500' : marker.type === 'patient' ? 'text-blue-500' : 'text-slate-400'
                    }`}>
                      {marker.type === 'best' ? 'Optimal Route' : marker.type === 'patient' ? 'Emergency Origin' : 'Backup Facility'}
                    </span>
                  </div>
                  <h5 className="font-black text-slate-900 text-base leading-tight tracking-tight">{marker.name}</h5>
                </div>

                {marker.type !== "patient" && (
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-50">
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Distance</span>
                      <span className="text-xs font-black text-slate-700">{marker.data?.distance}</span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Travel Time</span>
                      <span className="text-xs font-black text-slate-900">{marker.data?.travelTime}</span>
                    </div>
                  </div>
                )}

                {marker.type === "best" && (
                  <div className="mt-4 bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-700 uppercase tracking-tight flex items-center gap-2">
                       <span className="text-lg">⭐</span> Recommended Hospital
                    </p>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <style jsx global>{`
        @keyframes mapPulse {
          0% { transform: scale(0.8); opacity: 0.8; }
          50% { transform: scale(1.2); opacity: 0.3; }
          100% { transform: scale(0.8); opacity: 0.8; }
        }
        .animate-map-pulse {
          animation: mapPulse 2.5s infinite ease-in-out;
        }
        .leaflet-container {
          background: #f8fafc !important;
        }
        .map-tiles-grayscale {
          filter: grayscale(0.4) contrast(1.1) brightness(1.05);
        }
        .custom-medical-popup .leaflet-popup-content-wrapper {
          border-radius: 24px !important;
          padding: 4px !important;
          box-shadow: 0 25px 50px -12px rgb(0 0 0 / 0.15) !important;
          border: 1px solid rgba(255,255,255,0.8);
          background: rgba(255, 255, 255, 0.98);
          backdrop-filter: blur(12px);
        }
        .custom-medical-popup .leaflet-popup-content {
          margin: 16px !important;
        }
        .custom-medical-popup .leaflet-popup-tip {
          background: white !important;
        }
      `}</style>
    </div>
  );
}
