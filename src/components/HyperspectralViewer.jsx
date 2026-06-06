import { useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import { spectra } from '../data/spectra'

const GRID_SIZE = 8

// Deterministic terrain type per cell — hand-arranged to look like a real scene
const CELL_TYPES = [
  ['snow',        'snow',        'soil',        'soil',        'urban',       'urban',       'soil',        'water'],
  ['soil',        'snow',        'soil',        'urban',       'urban',       'urban',       'soil',        'water'],
  ['soil',        'soil',        'vegetation',  'urban',       'vegetation',  'soil',        'water',       'water'],
  ['vegetation',  'soil',        'vegetation',  'vegetation',  'vegetation',  'water',       'water',       'water'],
  ['vegetation',  'vegetation',  'vegetation',  'vegetation',  'soil',        'water',       'soil',        'soil'],
  ['vegetation',  'vegetation',  'water',       'vegetation',  'soil',        'soil',        'soil',        'vegetation'],
  ['water',       'water',       'water',       'soil',        'soil',        'vegetation',  'vegetation',  'vegetation'],
  ['water',       'water',       'soil',        'soil',        'vegetation',  'vegetation',  'soil',        'urban'],
]

// Subtle tint hints for each terrain
const CELL_BASE = {
  vegetation: 'rgba(74, 222, 128, 0.12)',
  water:      'rgba(56, 189, 248, 0.14)',
  soil:       'rgba(217, 119, 6, 0.10)',
  urban:      'rgba(148, 163, 184, 0.10)',
  snow:       'rgba(226, 232, 240, 0.14)',
}
const CELL_HOVER = {
  vegetation: 'rgba(74, 222, 128, 0.30)',
  water:      'rgba(56, 189, 248, 0.32)',
  soil:       'rgba(217, 119, 6, 0.28)',
  urban:      'rgba(148, 163, 184, 0.28)',
  snow:       'rgba(226, 232, 240, 0.30)',
}

const X_TICKS = [400, 700, 1000, 1400, 1800, 2500]

function ChartTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: '#0b1729',
      border: '1px solid #1e3352',
      borderRadius: 4,
      padding: '4px 8px',
      fontSize: 11,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      <div style={{ color: '#64748b' }}>{payload[0]?.payload?.wavelength} nm</div>
      <div style={{ color: payload[0]?.stroke }}>{Number(payload[0]?.value ?? 0).toFixed(4)}</div>
    </div>
  )
}

export default function HyperspectralViewer() {
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)

  const active = hovered ?? selected
  const cellType = active ? CELL_TYPES[active.row][active.col] : null
  const spectrum = cellType ? spectra[cellType] : null

  return (
    <div className="flex h-full">
      {/* Left: Image tile with grid overlay */}
      <div className="flex-[5] flex flex-col border-r border-[#1e3352]">
        <div className="flex items-center justify-between px-4 h-9 border-b border-[#1e3352] shrink-0">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-500">
            Hyperspectral Tile — TGT-003 Amazon Basin
          </span>
          {active && (
            <span
              className="text-[10px] text-slate-600"
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            >
              [{active.row},{active.col}]&nbsp;
              <span style={{ color: spectrum?.color }}>{cellType}</span>
            </span>
          )}
        </div>

        <div className="flex-1 relative p-3 min-h-0">
          {/* False-colour background — simulates Earth observation imagery */}
          <div
            className="absolute inset-3 rounded overflow-hidden"
            style={{
              background: `
                radial-gradient(ellipse at 18% 20%, rgba(226,232,240,0.55) 0%, transparent 22%),
                radial-gradient(ellipse at 30% 35%, rgba(120,53,15,0.70) 0%, transparent 28%),
                radial-gradient(ellipse at 55% 55%, rgba(21,128,61,0.80) 0%, transparent 35%),
                radial-gradient(ellipse at 70% 30%, rgba(30,58,138,0.85) 0%, transparent 32%),
                radial-gradient(ellipse at 85% 70%, rgba(30,58,138,0.75) 0%, transparent 28%),
                radial-gradient(ellipse at 15% 70%, rgba(30,58,138,0.80) 0%, transparent 30%),
                radial-gradient(ellipse at 50% 80%, rgba(21,128,61,0.70) 0%, transparent 28%),
                linear-gradient(155deg, #04100a 0%, #061828 40%, #080e04 100%)
              `,
            }}
          />

          {/* Pixel grid */}
          <div
            className="absolute inset-3 rounded overflow-hidden"
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${GRID_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, 1fr)`,
            }}
          >
            {Array.from({ length: GRID_SIZE * GRID_SIZE }, (_, idx) => {
              const row = Math.floor(idx / GRID_SIZE)
              const col = idx % GRID_SIZE
              const type = CELL_TYPES[row][col]
              const isHovered = hovered?.row === row && hovered?.col === col
              const isSelected = selected?.row === row && selected?.col === col
              const isActive = isHovered || isSelected
              return (
                <div
                  key={idx}
                  className="border border-white/[0.04] cursor-crosshair transition-all duration-75"
                  style={{
                    background: isActive ? CELL_HOVER[type] : CELL_BASE[type],
                    outline: isSelected ? `1.5px solid ${spectra[type]?.color}` : 'none',
                    outlineOffset: '-1px',
                  }}
                  onMouseEnter={() => setHovered({ row, col })}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setSelected(s =>
                    s?.row === row && s?.col === col ? null : { row, col }
                  )}
                />
              )
            })}
          </div>
        </div>

        {/* Status line */}
        <div className="px-4 h-7 border-t border-[#1e3352] flex items-center shrink-0">
          <span className="text-[10px] text-slate-600">
            {active
              ? `${GRID_SIZE}×${GRID_SIZE} pixel grid · hover to inspect · click to lock selection`
              : 'Hover a cell to preview spectral signature · click to lock'}
          </span>
        </div>
      </div>

      {/* Right: Spectral chart */}
      <div className="flex-[6] flex flex-col">
        <div className="flex items-center justify-between px-4 h-9 border-b border-[#1e3352] shrink-0">
          <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-500">
            Spectral Signature
          </span>
          {spectrum && (
            <span className="text-[10px] font-semibold" style={{ color: spectrum.color }}>
              {spectrum.label}
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col min-h-0 p-3">
          {spectrum ? (
            <>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={spectrum.data} margin={{ top: 4, right: 12, left: -16, bottom: 14 }}>
                    <CartesianGrid strokeDasharray="2 4" stroke="#1e3352" strokeOpacity={0.7} />
                    <XAxis
                      dataKey="wavelength"
                      stroke="#1e3352"
                      tick={{ fill: '#475569', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}
                      tickLine={false}
                      axisLine={false}
                      ticks={X_TICKS}
                      label={{ value: 'Wavelength (nm)', position: 'insideBottom', offset: -4, fill: '#334155', fontSize: 9 }}
                    />
                    <YAxis
                      domain={[0, 1]}
                      stroke="#1e3352"
                      tick={{ fill: '#475569', fontSize: 9, fontFamily: "'JetBrains Mono', monospace" }}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={v => v.toFixed(1)}
                      label={{ value: 'Reflectance', angle: -90, position: 'insideLeft', offset: 28, fill: '#334155', fontSize: 9 }}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="reflectance"
                      stroke={spectrum.color}
                      strokeWidth={1.5}
                      dot={false}
                      activeDot={{ r: 3, fill: spectrum.color, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-1 pt-2 border-t border-[#1e3352] text-[10px] text-slate-500 leading-relaxed shrink-0">
                {spectrum.description}
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center">
              <div>
                <div className="text-slate-700 text-xs mb-1">No pixel selected</div>
                <div className="text-slate-600 text-[10px]">Hover a cell on the tile to preview its reflectance curve</div>
                <div className="text-slate-600 text-[10px]">Click to lock · wavelength range 400–2500 nm</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
