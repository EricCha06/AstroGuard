import * as L from 'lucide-react'
import { HAZARDS } from '../data/spaceflightHazards'
export default function SpaceflightHazards() {
  return (
    <div className="grid gap-4">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4">{HAZARDS.map((h) => { const Icon = L[h.icon]; return (
        <div key={h.id} className="card"><h3><span className="flex items-center gap-2"><Icon size={20} color="#22d3ee" />{h.name}</span></h3><p className="mt-0 text-[var(--mu)]">{h.desc}</p>
          <div className="mb-2 flex flex-wrap gap-1.5">{h.sys.map((s) => <span key={s} className="chip !py-0.5 !text-[11px]">{s}</span>)}</div>
          {[['Relevant indicators', h.ind], ['Why monitoring matters', h.why], ['Prevention and countermeasures', h.prev]].map(([a, b]) => <div key={a} className="ins"><b>{a}.</b> {b}</div>)}</div>) })}</div>
      <p className="note">General educational summaries. Verify against NASA Human Research Program resources and mission-approved countermeasures.</p>
    </div>
  )
}
