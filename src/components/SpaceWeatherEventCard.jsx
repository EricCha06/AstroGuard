import { ExternalLink } from 'lucide-react'
import { SW, fmtUTC } from '../data/spaceWeatherInfo'
export default function SpaceWeatherEventCard({ e, active, onSelect }) {
  const info = SW[e.type]
  return (
    <div className="card !p-3.5 cursor-pointer" style={active ? { borderColor: info.color } : {}} onClick={() => onSelect(e)} role="button" tabIndex={0} onKeyDown={(k) => (k.key === 'Enter' || k.key === ' ') && onSelect(e)}>
      <div className="flex flex-wrap items-center justify-between gap-2"><span className="st" style={{ background: info.color + '24', color: info.color }}>{info.label}</span><span className="text-xs text-[var(--mu)]">{fmtUTC(e.time)}</span></div>
      <div className="mt-2 text-[13px]">{e.description}</div>
      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-[var(--mu)]">
        <span>Classification: {e.classification || 'Not available'} · Source: {e.source || 'Not available'}</span>
        <a className="flex items-center gap-1 text-[var(--cy)]" href={e.link} target="_blank" rel="noreferrer" onClick={(x) => x.stopPropagation()}>NASA reference <ExternalLink size={12} /></a>
      </div>
    </div>
  )
}
