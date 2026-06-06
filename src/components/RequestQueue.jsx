import { useState } from 'react'
import { ChevronUp, ChevronDown, ChevronsUpDown } from 'lucide-react'
import { targets } from '../data/targets'

const PRIORITY_ORDER = { High: 0, Med: 1, Low: 2 }
const STATUS_ORDER = { queued: 0, processing: 1, captured: 2, delivered: 3 }

const PRIORITY_BADGE = {
  High: 'text-red-400 bg-red-400/10 border-red-400/25',
  Med: 'text-amber-400 bg-amber-400/10 border-amber-400/25',
  Low: 'text-slate-500 bg-slate-500/10 border-slate-500/20',
}

const STATUS_STYLE = {
  queued: 'text-amber-400',
  processing: 'text-indigo-400',
  captured: 'text-emerald-400',
  delivered: 'text-slate-600',
}

const COLUMNS = [
  { key: 'id', label: 'ID', w: 'w-[72px]' },
  { key: 'name', label: 'Target', w: '' },
  { key: 'priority', label: 'Pri', w: 'w-[48px]' },
  { key: 'status', label: 'Status', w: 'w-[76px]' },
  { key: 'deadline', label: 'Deadline', w: 'w-[80px]' },
]

export default function RequestQueue() {
  const [sortCol, setSortCol] = useState('priority')
  const [sortDir, setSortDir] = useState('asc')

  const handleSort = col => {
    if (sortCol === col) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else { setSortCol(col); setSortDir('asc') }
  }

  const sorted = [...targets].sort((a, b) => {
    let cmp = 0
    if (sortCol === 'priority') cmp = PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
    else if (sortCol === 'status') cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
    else if (sortCol === 'id') cmp = a.id.localeCompare(b.id)
    else if (sortCol === 'name') cmp = a.name.localeCompare(b.name)
    else if (sortCol === 'deadline') cmp = a.deadline.localeCompare(b.deadline)
    return sortDir === 'asc' ? cmp : -cmp
  })

  const activeCount = targets.filter(t => t.status === 'queued' || t.status === 'processing').length

  return (
    <div className="flex flex-col h-full bg-[#060d1b]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 h-9 border-b border-[#1e3352] shrink-0">
        <span className="text-[10px] font-semibold tracking-widest uppercase text-slate-500">
          Imaging Queue
        </span>
        <span
          className="text-[10px] text-slate-600"
          style={{ fontFamily: "'JetBrains Mono', monospace" }}
        >
          {activeCount} active · {targets.length} total
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <table className="w-full text-[11px] border-collapse">
          <thead className="sticky top-0 z-10 bg-[#0a1525]">
            <tr>
              {COLUMNS.map(col => (
                <th
                  key={col.key}
                  className={`text-left px-3 py-2 text-[9px] tracking-widest uppercase cursor-pointer select-none font-medium transition-colors ${col.w} ${sortCol === col.key ? 'text-amber-400' : 'text-slate-600 hover:text-slate-400'}`}
                  onClick={() => handleSort(col.key)}
                >
                  <span className="flex items-center gap-1">
                    {col.label}
                    {sortCol === col.key ? (
                      sortDir === 'asc'
                        ? <ChevronUp size={9} className="shrink-0" />
                        : <ChevronDown size={9} className="shrink-0" />
                    ) : (
                      <ChevronsUpDown size={9} className="shrink-0 opacity-30" />
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((t, i) => (
              <tr
                key={t.id}
                className={`border-b border-[#1e3352]/40 transition-colors hover:bg-[#0f2040]/70 ${i % 2 === 1 ? 'bg-[#0a1525]/30' : ''}`}
              >
                <td
                  className="px-3 py-2 text-slate-500"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}
                >
                  {t.id}
                </td>
                <td className="px-3 py-2 text-slate-200 font-medium whitespace-nowrap overflow-hidden text-ellipsis max-w-0" style={{ maxWidth: 0 }}>
                  {t.name}
                </td>
                <td className="px-3 py-2">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded border text-[9px] font-semibold tracking-wide ${PRIORITY_BADGE[t.priority]}`}
                  >
                    {t.priority}
                  </span>
                </td>
                <td className={`px-3 py-2 font-medium capitalize ${STATUS_STYLE[t.status]}`}>
                  {t.status}
                </td>
                <td
                  className="px-3 py-2 text-slate-500"
                  style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10 }}
                >
                  {t.deadline}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
