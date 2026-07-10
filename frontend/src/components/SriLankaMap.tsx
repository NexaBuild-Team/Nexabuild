import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// ── Fix Leaflet default icon paths broken by bundlers ──────────────────────
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

// ── Custom price-label marker ───────────────────────────────────────────────
function createPriceIcon(label: string, color: string) {
  return L.divIcon({
    className: '',
    html: `
      <div style="
        background:${color};
        color:#fff;
        font-size:11px;
        font-weight:700;
        font-family:Inter,sans-serif;
        padding:4px 9px;
        border-radius:20px;
        white-space:nowrap;
        box-shadow:0 2px 8px rgba(0,0,0,0.25);
        position:relative;
        display:inline-block;
      ">
        ${label}
        <span style="
          position:absolute;
          bottom:-6px;
          left:50%;
          transform:translateX(-50%);
          border-left:5px solid transparent;
          border-right:5px solid transparent;
          border-top:6px solid ${color};
        "></span>
      </div>`,
    iconAnchor: [30, 30],
    popupAnchor: [0, -32],
  })
}

// ── Property pins on the map ────────────────────────────────────────────────
const pins = [
  { lat: 6.9271,  lng: 79.8612, label: 'LKR 85M',  color: '#be5d3f', title: 'Luxury Villa, Colombo 7',          price: 'LKR 85,000,000' },
  { lat: 7.2906,  lng: 80.6337, label: 'LKR 32M',  color: '#be5d3f', title: 'Modern Apartment, Kandy',           price: 'LKR 32,500,000' },
  { lat: 6.0535,  lng: 80.2210, label: 'LKR 125M', color: '#495d38', title: 'Beachfront Residence, Galle',       price: 'LKR 125,000,000' },
  { lat: 7.2095,  lng: 79.8368, label: 'LKR 55M',  color: '#be5d3f', title: 'Premium Townhouse, Negombo',        price: 'LKR 55,000,000' },
  { lat: 6.8649,  lng: 79.8997, label: 'LKR 48M',  color: '#be5d3f', title: 'Garden Bungalow, Nugegoda',         price: 'LKR 48,000,000' },
  { lat: 6.9167,  lng: 79.8500, label: 'LKR 220M', color: '#345b79', title: 'Penthouse, Colombo 3',              price: 'LKR 220,000,000' },
  { lat: 8.3114,  lng: 80.4037, label: 'LKR 42M',  color: '#be5d3f', title: 'Hill Country Estate, Anuradhapura', price: 'LKR 42,000,000' },
  { lat: 6.8244,  lng: 81.3347, label: 'LKR 75M',  color: '#345b79', title: 'Colonial Villa, Nuwara Eliya',      price: 'LKR 75,000,000' },
]

// ── Component ───────────────────────────────────────────────────────────────
export default function SriLankaMap() {
  useEffect(() => {
    // Invalidate map size after mount so it fills the container
    window.dispatchEvent(new Event('resize'))
  }, [])

  return (
    <MapContainer
      center={[7.8731, 80.7718]}
      zoom={7}
      zoomControl={false}
      scrollWheelZoom={true}
      style={{ width: '100%', height: '100%' }}
    >
      {/* CARTO Voyager tile layer — clean, modern, free, no API key needed */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />

      {/* Zoom control — bottom right */}
      <ZoomControl position="bottomright" />

      {/* Property pins */}
      {pins.map((pin, i) => (
        <Marker
          key={i}
          position={[pin.lat, pin.lng]}
          icon={createPriceIcon(pin.label, pin.color)}
        >
          <Popup>
            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '160px' }}>
              <p style={{ fontWeight: 700, fontSize: '13px', color: '#1d1d1d', marginBottom: '2px' }}>
                {pin.title}
              </p>
              <p style={{ fontSize: '13px', fontWeight: 700, color: pin.color }}>
                {pin.price}
              </p>
              <button
                style={{
                  marginTop: '8px',
                  width: '100%',
                  padding: '6px 0',
                  backgroundColor: '#345b79',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '12px',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                View Property
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
