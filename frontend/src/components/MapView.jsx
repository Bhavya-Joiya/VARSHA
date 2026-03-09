import { MapContainer, TileLayer, GeoJSON, useMap } from 'react-leaflet'
import { useEffect, useRef } from 'react'
import L from 'leaflet'

// Fix Leaflet default icon issue with Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

// This component flies the map to the selected ward
function FlyToWard({ selectedWard, wardData }) {
  const map = useMap()

  useEffect(() => {
    if (!selectedWard || !wardData) return

    const feature = wardData.features.find(
      f => f.properties.id === selectedWard.id
    )
    if (!feature) return

    // Calculate bounds of the selected ward polygon
    const layer = L.geoJSON(feature)
    map.flyToBounds(layer.getBounds(), { padding: [80, 80], duration: 0.8 })
  }, [selectedWard, map, wardData])

  return null
}

function styleFeature(feature) {
  const score = feature.properties.overall_score
  const color = feature.properties.risk_color

  return {
    fillColor: color,
    fillOpacity: 0.35,
    color: color,
    weight: 1.5,
    opacity: 0.8,
  }
}

export default function MapView({ wardData, selectedWard, onSelectWard }) {
  const geoJsonKey = wardData?.features?.length + (selectedWard?.id || '')

  const onEachFeature = (feature, layer) => {
    const p = feature.properties

    // Highlight on hover
    layer.on({
      mouseover: (e) => {
        e.target.setStyle({
          fillOpacity: 0.65,
          weight: 2.5,
        })
        // Show tooltip
        layer.bindTooltip(`
          <div style="font-family: 'Segoe UI', sans-serif; padding: 4px">
            <strong style="font-size:13px">${p.name}</strong><br/>
            <span style="color:#94a3b8;font-size:11px">${p.district} District</span><br/>
            <span style="font-size:12px;font-weight:700;color:${p.risk_color}">
              Score: ${p.overall_score}/100 — ${p.risk_level}
            </span>
          </div>
        `, { sticky: true, opacity: 1 }).openTooltip()
      },
      mouseout: (e) => {
        e.target.setStyle(styleFeature(feature))
        layer.closeTooltip()
      },
      click: () => {
        onSelectWard(p)
      },
    })

    // Highlight selected ward differently
    if (selectedWard && p.id === selectedWard.id) {
      layer.setStyle({
        fillOpacity: 0.7,
        weight: 3,
        color: '#ffffff',
      })
    }
  }

  return (
    <MapContainer
      center={[19.07, 72.88]}
      zoom={11}
      style={{ height: '100%', width: '100%' }}
      zoomControl={true}
    >
      {/* Dark map tiles from CartoDB */}
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com">CARTO</a>'
        subdomains='abcd'
        maxZoom={19}
      />

      {/* Ward polygons */}
      {wardData && (
        <GeoJSON
          key={geoJsonKey}
          data={wardData}
          style={styleFeature}
          onEachFeature={onEachFeature}
        />
      )}

      {/* Fly to selected ward */}
      <FlyToWard selectedWard={selectedWard} wardData={wardData} />

      {/* Legend */}
      <MapLegend />
    </MapContainer>
  )
}

// Custom Leaflet control for legend
function MapLegend() {
  const map = useMap()

  useEffect(() => {
    const legend = L.control({ position: 'bottomright' })

    legend.onAdd = () => {
      const div = L.DomUtil.create('div')
      div.innerHTML = `
        <div style="
          background: rgba(15,23,42,0.92);
          border: 1px solid #334155;
          border-radius: 10px;
          padding: 12px 16px;
          font-family: 'Segoe UI', sans-serif;
          min-width: 160px;
        ">
          <div style="font-size:11px;color:#64748b;letter-spacing:0.1em;margin-bottom:8px;font-weight:600">
            FLOOD RISK SCORE
          </div>
          ${[
            ['🔴', '#dc2626', '70–100', 'CRITICAL'],
            ['🟠', '#ea580c', '50–69', 'HIGH'],
            ['🟡', '#ca8a04', '30–49', 'MODERATE'],
            ['🟢', '#16a34a', '0–29', 'LOW'],
          ].map(([emoji, color, range, label]) => `
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px">
              <div style="width:14px;height:14px;border-radius:3px;background:${color};flex-shrink:0"></div>
              <span style="font-size:12px;color:#94a3b8">${range}</span>
              <span style="font-size:11px;color:#64748b">${label}</span>
            </div>
          `).join('')}
          <div style="margin-top:10px;padding-top:8px;border-top:1px solid #1e293b;font-size:10px;color:#475569">
            Click any ward for details
          </div>
        </div>
      `
      return div
    }

    legend.addTo(map)
    return () => legend.remove()
  }, [map])

  return null
}
