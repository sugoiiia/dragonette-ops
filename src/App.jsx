import TopBar from './components/TopBar'
import WorldMap from './components/WorldMap'
import RequestQueue from './components/RequestQueue'
import HyperspectralViewer from './components/HyperspectralViewer'

export default function App() {
  return (
    <div
      className="flex flex-col bg-[#060d1b] text-slate-200"
      style={{ height: '100dvh', fontFamily: "'Inter', system-ui, sans-serif", overflow: 'hidden' }}
    >
      {/* Region 1 — constellation status bar */}
      <TopBar />

      {/* Region 2 — map + queue */}
      <div className="flex flex-1 min-h-0">
        {/* World map — 60% */}
        <div className="flex-[3] min-w-0 min-h-0">
          <WorldMap />
        </div>

        {/* Imaging queue — 40% */}
        <div className="flex-[2] min-w-0 min-h-0 border-l border-[#1e3352]">
          <RequestQueue />
        </div>
      </div>

      {/* Region 3 — hyperspectral viewer */}
      <div className="h-72 shrink-0 border-t border-[#1e3352]">
        <HyperspectralViewer />
      </div>
    </div>
  )
}
