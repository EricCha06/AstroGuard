import { SYSTEMS } from '../data/bodySystems'
import { METRICS } from '../data/healthMetrics'
import { StatusBadge } from './Health'
export function BodyExplorer({ sel, setSel, view }) {
  const R = (id, kids) => { const s = SYSTEMS.find((x) => x.id === id); return <g key={id} className={`reg ${sel === id ? 'on' : ''}`} style={{ color: s.color, fill: s.color, stroke: s.color }} role="button" tabIndex={0} aria-label={s.name} onClick={() => setSel(id)} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setSel(id)}>{kids}</g> }
  const f = view === 'front'
  return (
    <svg viewBox="0 0 200 400" className="mx-auto h-[480px] max-w-full">
      {R('skin', <g fill="none" strokeWidth="2.5"><circle cx="100" cy="40" r="26" fill="currentColor" /><rect x="92" y="64" width="16" height="14" /><rect x="62" y="78" width="76" height="130" rx="22" fill="currentColor" /><rect x="38" y="84" width="20" height="124" rx="10" fill="currentColor" /><rect x="142" y="84" width="20" height="124" rx="10" fill="currentColor" /><rect x="66" y="208" width="30" height="180" rx="14" fill="currentColor" /><rect x="104" y="208" width="30" height="180" rx="14" fill="currentColor" /></g>)}
      {R('muscles', <g><rect x="38" y="90" width="20" height="60" rx="10" /><rect x="142" y="90" width="20" height="60" rx="10" /><rect x="68" y="225" width="26" height="70" rx="12" /><rect x="106" y="225" width="26" height="70" rx="12" />{!f && <rect x="72" y="84" width="56" height="50" rx="14" />}</g>)}
      {R('bones', <g><rect x="97" y="72" width="6" height="140" rx="3" />{f && [92, 108, 124].map((y) => <rect key={y} x="76" y={y} width="48" height="5" rx="2.5" />)}<rect x="76" y="300" width="10" height="80" rx="5" /><rect x="114" y="300" width="10" height="80" rx="5" /></g>)}
      {R('lungs', <g><ellipse cx="82" cy="112" rx="14" ry="22" /><ellipse cx="118" cy="112" rx="14" ry="22" /></g>)}
      {f && R('heart', <ellipse cx="106" cy="122" rx="10" ry="12" />)}
      {f && R('digestive', <ellipse cx="100" cy="170" rx="25" ry="22" />)}
      {R('immune', <g>{[[88, 76], [112, 76], [64, 100], [136, 100], [88, 212], [112, 212]].map(([x, y]) => <circle key={x + '' + y} cx={x} cy={y} r="5" />)}</g>)}
      {R('brain', <ellipse cx="100" cy="32" rx="17" ry="13" />)}
      {f && R('eyes', <g><circle cx="92" cy="44" r="4.5" /><circle cx="108" cy="44" r="4.5" /></g>)}
    </svg>
  )
}
export function BodySystemPanel({ s, rd }) {
  const rows = [['Normal function', s.fn], ['Potential spaceflight effects', s.fx], ['Symptoms worth monitoring', s.sym], ['Recommended monitoring', s.mon]]
  return (
    <div className="card" style={{ borderColor: s.color }}>
      <h3 style={{ color: s.color }}>{s.name}</h3>
      {rows.map(([a, b]) => <div key={a} className="ins"><b>{a}.</b> {b}</div>)}
      <div className="ins"><b>Relevant indicators.</b> {s.keys.length ? <span className="mt-1 flex flex-wrap gap-2">{rd.map((d) => <span key={d.c} className="flex items-center gap-1.5">{d.c === 'bp' ? 'Blood Pressure' : METRICS[d.k].t} {d.value}<StatusBadge s={d.st} /></span>)}</span> : 'No live indicator. Tracked through symptom reports and scheduled mission assessments.'}</div>
      <div className="ins" style={{ borderLeft: '3px solid var(--cr)' }}><b style={{ color: 'var(--cr)' }}>When to contact a flight surgeon.</b> {s.call}</div>
      <div className="note">General educational summary. Verify against NASA Human Research Program resources and your mission-approved medical protocols.</div>
    </div>
  )
}
