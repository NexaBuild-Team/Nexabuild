import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

interface LocationPickerMapProps {
  latitude?: number | null;
  longitude?: number | null;
  onLocationSelect: (lat: number, lng: number) => void;
}

function MapClickHandler({ onLocationSelect }: { onLocationSelect: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LocationPickerMap({
  latitude,
  longitude,
  onLocationSelect,
}: LocationPickerMapProps) {
  // Default to Colombo center (6.9271, 79.8612) if null
  const initialLat = latitude || 6.9271;
  const initialLng = longitude || 79.8612;

  const [position, setPosition] = useState<[number, number]>([initialLat, initialLng]);

  useEffect(() => {
    if (latitude && longitude) {
      setPosition([latitude, longitude]);
    }
  }, [latitude, longitude]);

  useEffect(() => {
    window.dispatchEvent(new Event('resize'));
  }, []);

  const handleSelect = (lat: number, lng: number) => {
    setPosition([lat, lng]);
    onLocationSelect(lat, lng);
  };

  return (
    <div className="relative w-full h-[240px] sm:h-[280px] rounded-2xl overflow-hidden border border-gray-200 shadow-inner">
      <MapContainer
        center={position}
        zoom={13}
        maxZoom={19}
        zoomControl={true}
        scrollWheelZoom={true}
        style={{ width: '100%', height: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
          subdomains="abcd"
        />
        <MapClickHandler onLocationSelect={handleSelect} />
        <Marker position={position} />
      </MapContainer>

      {/* Floating Center Overlay Banner styled exactly like reference image */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            if (navigator.geolocation) {
              navigator.geolocation.getCurrentPosition(
                (pos) => {
                  handleSelect(pos.coords.latitude, pos.coords.longitude);
                },
                () => {
                  // Fallback click center
                  handleSelect(position[0], position[1]);
                }
              );
            }
          }}
          className="bg-white/95 hover:bg-white text-gray-800 text-xs font-bold px-4 py-2.5 rounded-full shadow-lg border border-gray-200 backdrop-blur-md flex items-center gap-2 transition-transform hover:scale-105 cursor-pointer whitespace-nowrap"
        >
          <svg className="size-4 text-[#345b79]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>
            {latitude && longitude
              ? `Pinned: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
              : 'Click to pin exact location on map'}
          </span>
        </button>
      </div>
    </div>
  );
}
