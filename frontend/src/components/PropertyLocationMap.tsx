import { useEffect } from 'react'
import { MapContainer, TileLayer, Marker, ZoomControl } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

delete (L.Icon.Default.prototype as unknown as Record<string, unknown>)._getIconUrl
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
})

interface PropertyLocationMapProps {
  center: [number, number]
}

export default function PropertyLocationMap({ center }: PropertyLocationMapProps) {
  useEffect(() => {
    window.dispatchEvent(new Event('resize'))
  }, [])

  return (
    <MapContainer
      center={center}
      zoom={14}
      zoomControl={false}
      scrollWheelZoom={false}
      style={{ width: '100%', height: '100%' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        subdomains="abcd"
        maxZoom={19}
      />
      <ZoomControl position="bottomright" />
      <Marker position={center} />
    </MapContainer>
  )
}
