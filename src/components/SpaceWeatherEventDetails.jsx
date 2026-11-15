import { ExternalLink, ShieldAlert } from 'lucide-react'
import { SW, fmtUTC } from '../data/spaceWeatherInfo'
const NA = (v) => (v === null || v === undefined || v === '' ? 'Not available' : v)
export default function SpaceWeatherEventDetails({ e, events, userRecords, onSelect, go, onClose }) {
  const info = SW[e.type], after = userRecords.filter((r) => e.t && r.t >= e.t && r.t <= e.t + 72 * 36e5)
  const rows = [['Event ID', e.id], ['Start time', fmtUTC(e.time)], ...(e.type === 'FLR' ? [['Peak time', fmtUTC(e.peakTime)], ['End time', fmtUTC(e.endTime)]] : []), ['Classification', e.classification], ['Source location', e.location], ['Instruments / source', e.source], ...(e.type === 'CME' ? [['Estimated speed', e.speed != null ? `${Math.round(e.speed)} km/s` : null], ['Analyses listed by NASA', e.analysisCount]] : []), ['Active region', e.activeRegion], ['NASA note', e.note]]
  return (
    <div className="card" style={{ borderColor: info.color }}>
      <h3 style={{ color: info.color }}>{info.label}<button className="btn ghost !px-2.5 !py-1 text-xs" onClick={onClose}>Close</button></h3>
      <div className="grid grid-cols-2 gap-2 text-xs text-[var(--mu)]">{rows.map(([a, b]) => <div key={a} className={a === 'NASA note' ? 'col-span-2' : ''}><b className="block text-[13px] font-semibold text-[var(--tx)]">{NA(b)}</b>{a}</div>)}</div>
      <div className="ins mt-3"><b>Related events (linked by NASA).</b> {e.linked.length ? e.linked.map((id) => { const f = events.find((x) => x.id === id); return f ? <button key={id} className="mr-2 text-[var(--cy)] underline" onClick={() => onSelect(f)}>{id}</button> : <span key={id} className="mr-2">{id}</span> }) : 'Not available'}</div>
      <div className="ins"><b>What this means.</b> {info.explain} <i className="text-[var(--mu)]">(Plain-language explanation written for AstroGuard, not NASA text.)</i></div>
      <div className="ins" style={{ borderLeft: '3px solid var(--pu)' }}>
        <b className="flex items-center gap-1.5"><ShieldAlert size={14} />AstroGuard mission monitoring (configured guidance)</b>
        {info.relevance} {e.type === 'SEP' && 'Review your mission-approved radiation monitoring procedures and any mission monitoring reminders.'}
        <div className="mt-2 text-xs text-[var(--mu)]">Your recorded assessments in the 72 hours after this event: <b className="text-[var(--tx)]">{after.length}</b>. They are recorded separately from NASA data, and no link between this event and any measurement is implied.</div>
        <div className="mt-2 flex flex-wrap gap-2"><button className="btn ghost !py-1.5 text-xs" onClick={() => go('analytics')}>Review health analytics</button><button className="btn ghost !py-1.5 text-xs" onClick={() => go('assessment')}>Record an assessment</button></div>
      </div>
      <a className="flex items-center gap-1.5 text-xs text-[var(--cy)]" href={e.link} target="_blank" rel="noreferrer">NASA source <ExternalLink size={12} /></a>
    </div>
  )
}
