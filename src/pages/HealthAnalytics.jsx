import { useState } from 'react'
import { TrendChart } from '../components/Health'
import { METRICS } from '../data/healthMetrics'
import { dense } from '../data/astronauts'
import { seriesFor, WIN } from '../utils/healthCalculations'
const OPT = { hr: ['Heart rate', [['hr', 'Heart rate (BPM)', '#22d3ee']]], sp: ['Blood oxygen', [['sp', 'SpO₂ (%)', '#3b82f6']]], tp: ['Temperature', [['tp', 'Temperature (°C)', '#8b5cf6']]], bp: ['Blood pressure', [['sys', 'Systolic', '#f87171'], ['dia', 'Diastolic', '#fbbf24']]], sl: ['Sleep', [['sl', 'Sleep (h)', '#a78bfa']]], sf: ['Stress & fatigue', [['stress', 'Stress', '#fb923c'], ['fat', 'Fatigue', '#22d3ee']]], rr: ['Respiratory rate', [['rr', 'Breaths/min', '#34d399']]] }
export default function HealthAnalytics({ c }) {
  const [m, setM] = useState('hr'), [range, setRange] = useState('24 hours'), [name, ls] = OPT[m], k = ls[0][0]
  const data = seriesFor(c.a, c.user, range), vs = data.map((p) => p[k]).filter((v) => v != null), avg = (a) => a.reduce((x, y) => x + y, 0) / (a.length || 1)
  const now = Date.now(), W = WIN[range], prev = dense(c.a).filter((p) => p.t >= now - 2 * W && p.t < now - W).map((p) => p[k])
  const stat = [['Latest', vs[vs.length - 1]], ['Minimum', Math.min(...vs)], ['Average', avg(vs)], ['Maximum', Math.max(...vs)]]
  const tl = c.user.filter((r) => r.v[k] != null).slice(-6).reverse()
  return (
    <div className="grid gap-4">
      <div className="card"><h3><span>Health Analytics: {name}</span><span className="tabs">{Object.keys(WIN).map((r) => <button key={r} className={r === range ? 'on' : ''} onClick={() => setRange(r)}>{r}</button>)}</span></h3>
        <div className="tabs mb-3">{Object.entries(OPT).map(([id, o]) => <button key={id} className={id === m ? 'on' : ''} onClick={() => setM(id)}>{o[0]}</button>)}</div>
        <TrendChart data={data} lines={ls.map(([key, n, col]) => ({ k: key, n, c: col }))} range={range} />
        <div className="note">Chart shows simulated data plus any values you recorded. Unit: {METRICS[k].u}.</div></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card"><h3>Trend comparison</h3><div className="grid grid-cols-4 gap-2 text-xs text-[var(--mu)]">{stat.map(([a, b]) => <div key={a}><b className="block text-[15px] text-[var(--tx)]">{(+b).toFixed(1)}</b>{a}</div>)}</div>
          <div className="ins mt-3">{prev.length ? <>Average this period {avg(vs).toFixed(1)} vs previous {range} {avg(prev).toFixed(1)} ({avg(vs) - avg(prev) >= 0 ? '+' : ''}{(avg(vs) - avg(prev)).toFixed(1)} {METRICS[k].u}).</> : 'Not enough stored history to compare with a previous period.'}</div></div>
        <div className="card"><h3>Measurement timeline</h3>{tl.length ? tl.map((r, i) => { const before = c.user.filter((x) => x.v[k] != null && x.t < r.t).pop(); return <div key={r.id} className="alert"><div className="flex-1"><b>{ls.map(([key]) => r.v[key]).filter((x) => x != null).join(' / ')} {METRICS[k].u}</b>{new Date(r.t).toLocaleString('en-GB')}</div><span>{before ? `${r.v[k] - before.v[k] >= 0 ? '+' : ''}${(r.v[k] - before.v[k]).toFixed(1)} vs previous` : 'First record'}</span></div> }) : <div className="text-xs text-[var(--mu)]">Your recorded measurements for this indicator will appear here.</div>}</div>
      </div>
    </div>
  )
}
