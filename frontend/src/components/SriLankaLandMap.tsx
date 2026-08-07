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
function createLandPriceIcon(label: string, color: string) {
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

// ── Land parcel pins — matching LandListing data ────────────────────────────
const landPins = [
  {
    lat: 6.9271,  lng: 79.8612,
    label: 'LKR 28.5M',
    color: '#be5d3f',
    title: 'Prime Residential Land, Colombo 5',
    price: 'LKR 28,500,000',
    size: '15 Perches',
    type: 'Residential',
    badge: null,
  },
  {
    lat: 7.2906,  lng: 80.6337,
    label: 'LKR 12M',
    color: '#345b79',
    title: 'Scenic Land Parcel, Kandy',
    price: 'LKR 12,000,000',
    size: '20 Perches',
    type: 'Residential',
    badge: 'AI Pick',
  },
  {
    lat: 6.0535,  lng: 80.2210,
    label: 'LKR 75M',
    color: '#928d64',
    title: 'Beachfront Land, Galle Fort',
    price: 'LKR 75,000,000',
    size: '40 Perches',
    type: 'Commercial',
    badge: 'Premium',
  },
  {
    lat: 7.2095,  lng: 79.8368,
    label: 'LKR 18M',
    color: '#be5d3f',
    title: 'Road Frontage Land, Negombo',
    price: 'LKR 18,000,000',
    size: '12 Perches',
    type: 'Residential',
    badge: null,
  },
  {
    lat: 7.4863,  lng: 80.3623,
    label: 'LKR 6.8M',
    color: '#495d38',
    title: 'Coconut Estate, Kurunegala',
    price: 'LKR 6,800,000',
    size: '1 Acre',
    type: 'Agricultural',
    badge: null,
  },
  {
    lat: 6.9220,  lng: 79.8570,
    label: 'LKR 55M',
    color: '#345b79',
    title: 'Lakefront Land, Colombo 10',
    price: 'LKR 55,000,000',
    size: '30 Perches',
    type: 'Residential',
    badge: null,
  },
]

// ── Badge color helper ──────────────────────────────────────────────────────
function badgeColor(badge: string | null) {
  if (badge === 'AI Pick')  return '#345b79'
  if (badge === 'Premium')  return '#928d64'
  return '#be5d3f'
}

// ── Component ───────────────────────────────────────────────────────────────
export default function SriLankaLandMap() {
  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [])

  return (
    <MapContainer
      center={[7.8731, 80.7718]}
      zoom={7}
      maxZoom={20}
      zoomControl={false}
      scrollWheelZoom={true}
      style={{ width: '100%', height: '100%' }}
    >
      {/* CARTO Voyager tile layer — clean, modern, free, no API key needed */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png"
        subdomains="abcd"
        maxZoom={20}
        maxNativeZoom={18}
      />

      {/* Zoom control — bottom right */}
      <ZoomControl position="bottomright" />

      {/* Land parcel pins */}
      {landPins.map((pin, i) => (
        <Marker
          key={i}
          position={[pin.lat, pin.lng]}
          icon={createLandPriceIcon(pin.label, pin.color)}
        >
          <Popup>
            <div style={{ fontFamily: 'Inter, sans-serif', minWidth: '175px' }}>
              {/* Badge */}
              {pin.badge && (
                <span style={{
                  display: 'inline-block',
                  fontSize: '10px',
                  fontWeight: 700,
                  color: '#fff',
                  backgroundColor: badgeColor(pin.badge),
                  borderRadius: '4px',
                  padding: '2px 6px',
                  marginBottom: '5px',
                  letterSpacing: '0.05em',
                }}>
                  {pin.badge === 'AI Pick' ? '✦ ' : ''}{pin.badge}
                </span>
              )}
              {/* Title */}
              <p style={{ fontWeight: 700, fontSize: '13px', color: '#1d1d1d', marginBottom: '2px' }}>
                {pin.title}
              </p>
              {/* Price */}
              <p style={{ fontSize: '13px', fontWeight: 700, color: pin.color, marginBottom: '4px' }}>
                {pin.price}
              </p>
              {/* Size + Type */}
              <div style={{ display: 'flex', gap: '8px', fontSize: '11px', color: '#928d64', marginBottom: '8px' }}>
                <span>⬛ {pin.size}</span>
                <span>· {pin.type}</span>
              </div>
              {/* CTA */}
              <button
                style={{
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
                View Land
              </button>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
