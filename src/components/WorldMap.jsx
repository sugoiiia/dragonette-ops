import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { satellites } from '../data/satellites'
import { targets } from '../data/targets'

// 180x real-time so one full orbit (~95 min) completes in ~32 seconds visually
const SPEED = 180

const SAT_COLORS = {
  operational: '#22d3ee',
  standby: '#f59e0b',
  maintenance: '#f87171',
}

const TARGET_COLORS = {
  queued: '#fbbf24',
  processing: '#818cf8',
  captured: '#34d399',
  delivered: '#475569',
}

const PRIORITY_COLORS = {
  High: '#f87171',
  Med: '#fbbf24',
  Low: '#64748b',
}

function createSatIcon(sat) {
  const c = SAT_COLORS[sat.status]
  const pulse = sat.status === 'operational'
    ? `animation: sat-glow 2.5s ease-in-out infinite; color: ${c};`
    : ''
  return L.divIcon({
    className: '',
    html: `<div style="
      width: 9px; height: 9px; border-radius: 50%;
      background: ${c}; border: 1.5px solid rgba(255,255,255,0.35);
      box-shadow: 0 0 6px ${c}; ${pulse}
    "></div>`,
    iconSize: [9, 9],
    iconAnchor: [4.5, 4.5],
  })
}

function calcPosition(sat, nowSecs) {
  const T = sat.period * 60
  const u = (2 * Math.PI * (nowSecs * SPEED)) / T + sat.phaseOffset * 2 * Math.PI
  // SSO / retrograde orbits (inc > 90°): effective inclination for lat amplitude
  const inc = sat.inclination > 90 ? 180 - sat.inclination : sat.inclination
  const direction = sat.inclination > 90 ? -1 : 1
  const lat = inc * Math.sin(u)
  const lon = (((sat.ascLon + direction * (u * 180) / Math.PI) % 360) + 360) % 360 - 180
  return [lat, lon]
}

// Precompute icons once — satellite statuses are static in mock data
const SAT_ICONS = Object.fromEntries(
  satellites.map(sat => [sat.id, createSatIcon(sat)])
)

export default function WorldMap() {
  const [tick, setTick] = useState(() => Date.now() / 1000)

  useEffect(() => {
    const id = setInterval(() => setTick(Date.now() / 1000), 250)
    return () => clearInterval(id)
  }, [])

  const satPositions = useMemo(
    () => satellites.map(sat => ({ ...sat, pos: calcPosition(sat, tick) })),
    [tick]
  )

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[20, 15]}
        zoom={2}
        minZoom={2}
        maxZoom={6}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
        attributionControl={true}
        scrollWheelZoom={true}
        doubleClickZoom={true}
        worldCopyJump={true}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          subdomains="abcd"
          maxZoom={20}
        />

        {/* Imaging target markers */}
        {targets.map(t => (
          <CircleMarker
            key={t.id}
            center={[t.lat, t.lon]}
            radius={5}
            pathOptions={{
              color: TARGET_COLORS[t.status] || '#94a3b8',
              fillColor: TARGET_COLORS[t.status] || '#94a3b8',
              fillOpacity: 0.85,
              weight: 1.5,
            }}
          >
            <Popup>
              <div style={{
                background: '#0b1729',
                color: '#e2e8f0',
                padding: '10px 13px',
                borderRadius: 3,
                minWidth: 185,
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 11,
                lineHeight: 1.6,
              }}>
                <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em' }}>{t.id}</div>
                <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 13, marginBottom: 7 }}>{t.name}</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {[
                      ['Priority', <span style={{ color: PRIORITY_COLORS[t.priority], fontWeight: 600 }}>{t.priority}</span>],
                      ['Status', <span style={{ color: TARGET_COLORS[t.status], fontWeight: 500, textTransform: 'capitalize' }}>{t.status}</span>],
                      ['Requested', t.requestedDate],
                      ['Deadline', t.deadline],
                    ].map(([label, val]) => (
                      <tr key={label}>
                        <td style={{ color: '#64748b', paddingRight: 12, paddingBottom: 2 }}>{label}</td>
                        <td style={{ color: '#cbd5e1' }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Popup>
          </CircleMarker>
        ))}

        {/* Satellite markers */}
        {satPositions.map(sat => (
          <Marker key={sat.id} position={sat.pos} icon={SAT_ICONS[sat.id]}>
            <Popup>
              <div style={{
                background: '#0b1729',
                color: '#e2e8f0',
                padding: '10px 13px',
                borderRadius: 3,
                minWidth: 170,
                fontFamily: "'Inter', system-ui, sans-serif",
                fontSize: 11,
                lineHeight: 1.6,
              }}>
                <div style={{ color: '#f59e0b', fontWeight: 700, marginBottom: 5, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em' }}>{sat.id}</div>
                <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: 13, marginBottom: 7 }}>{sat.name}</div>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    {[
                      ['Status', <span style={{ color: SAT_COLORS[sat.status], fontWeight: 600, textTransform: 'capitalize' }}>{sat.status}</span>],
                      ['Altitude', `${sat.altitude} km`],
                      ['Inclination', `${sat.inclination}°`],
                      ['Period', `${sat.period} min`],
                    ].map(([label, val]) => (
                      <tr key={label}>
                        <td style={{ color: '#64748b', paddingRight: 12, paddingBottom: 2 }}>{label}</td>
                        <td style={{ color: '#cbd5e1' }}>{val}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Legend */}
      <div
        className="absolute bottom-4 right-4 z-[1000] rounded border border-[#1e3352] bg-[#060d1b]/90 px-3 py-2.5 text-[10px] backdrop-blur-sm"
        style={{ fontFamily: "'Inter', system-ui, sans-serif" }}
      >
        <div className="mb-2 uppercase tracking-widest text-slate-500 font-medium">Targets</div>
        {Object.entries(TARGET_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="capitalize text-slate-400">{status}</span>
          </div>
        ))}
        <div className="border-t border-[#1e3352] my-2" />
        <div className="mb-2 uppercase tracking-widest text-slate-500 font-medium">Satellites</div>
        {Object.entries(SAT_COLORS).map(([status, color]) => (
          <div key={status} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
            <span className="capitalize text-slate-400">{status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
