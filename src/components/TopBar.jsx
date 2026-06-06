import { useState, useEffect } from 'react'
import { Satellite, Database, Layers, Clock } from 'lucide-react'
import { satellites } from '../data/satellites'

const STATUS_DOT = {
  operational: '#34d399',
  standby: '#f59e0b',
  maintenance: '#f87171',
}

function NextPassTimer({ initialSecs }) {
  const [secs, setSecs] = useState(initialSecs)
  useEffect(() => {
    const id = setInterval(() => setSecs(s => (s <= 0 ? 93 * 60 + 12 : s - 1)), 1000)
    return () => clearInterval(id)
  }, [])
  const p = n => String(n).padStart(2, '0')
  const h = Math.floor(secs / 3600)
  const m = Math.floor((secs % 3600) / 60)
  const s = secs % 60
  return `${p(h)}:${p(m)}:${p(s)}`
}

function Divider() {
  return <div className="h-5 w-px bg-[#1e3352] shrink-0" />
}

function Metric({ icon, label, value }) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-slate-600">{icon}</span>
      <span className="text-[11px] text-slate-500">{label}</span>
      <span className="text-[11px] font-semibold text-slate-200">{value}</span>
    </div>
  )
}

export default function TopBar() {
  const opCount = satellites.filter(s => s.status === 'operational').length

  return (
    <header className="flex items-center gap-5 px-5 py-0 h-11 bg-[#060d1b] border-b border-[#1e3352] shrink-0">
      {/* Branding */}
      <div className="flex items-center gap-2 shrink-0">
        <Satellite size={15} className="text-amber-400" />
        <span
          className="text-[11px] font-bold tracking-[0.2em] uppercase text-amber-400"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          Dragonette Ops
        </span>
      </div>

      <Divider />

      {/* Satellite constellation dots */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="flex gap-1.5">
          {satellites.map(sat => (
            <div
              key={sat.id}
              className="w-2 h-2 rounded-full ring-1 ring-black/20"
              style={{ backgroundColor: STATUS_DOT[sat.status] }}
              title={`${sat.name} — ${sat.status}`}
            />
          ))}
        </div>
        <span className="text-[11px] text-slate-500">
          <span className="text-slate-300 font-medium">{opCount}</span>
          <span>/{satellites.length} operational</span>
        </span>
      </div>

      <Divider />

      {/* Stats */}
      <div className="flex items-center gap-5 flex-1">
        <Metric icon={<Layers size={12} />} label="Captures today" value="47" />
        <Metric icon={<Database size={12} />} label="Downlinked" value="312.4 GB" />
        <div className="flex items-center gap-1.5">
          <Clock size={12} className="text-slate-600" />
          <span className="text-[11px] text-slate-500">Next pass</span>
          <span
            className="text-[11px] text-amber-400 tabular-nums"
            style={{ fontFamily: "'JetBrains Mono', monospace" }}
          >
            <NextPassTimer initialSecs={14 * 60 + 33} />
          </span>
        </div>
      </div>

      {/* Live indicator */}
      <div className="flex items-center gap-1.5 shrink-0">
        <span className="relative flex h-1.5 w-1.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
        </span>
        <span
          className="text-[10px] tracking-widest text-emerald-400"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          LIVE
        </span>
      </div>
    </header>
  )
}
