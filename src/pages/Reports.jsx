import { useState } from 'react'
import { METRICS } from '../data/healthMetrics'
import { dense } from '../data/astronauts'
import { analyze, toCSV, fmt } from '../utils/healthCalculations'
const iso = (d) => d.toISOString().slice(0, 10)
export default function Reports({ c }) {
  const [from, setFrom] = useState(iso(new Date(Date.now() - 6048e5))), [to, setTo] = useState(iso(new Date()))
  const f = new Date(from).getTime(), t = new Date(to).getTime() + 864e5, rows = c.user.filter((r) => r.t >= f && r.t < t), sim = dense(c.a).filter((p) => p.t >= f && p.t < t)
  const an = analyze(c.a, c.user, c.ranges), avg = (k) => sim.length ? sim.reduce((s, p) => s + p[k], 0) / sim.length : null
  const csv = () => { const u = URL.createObjectURL(new Blob([toCSV(rows)], { type: 'text/csv' })), l = document.createElement('a'); l.href = u; l.download = `astroguard-${c.a.id}-${from}_${to}.csv`; l.click(); URL.revokeObjectURL(u); c.toast('CSV exported') }
  return (
    <div className="grid gap-4">
      <div className="card noprint"><h3>Report range</h3><div className="grid gap-3 sm:grid-cols-4"><label className="text-xs text-[var(--mu)]">From<input type="date" value={from} onChange={(e) => setFrom(e.target.value)} /></label><label className="text-xs text-[var(--mu)]">To<input type="date" value={to} onChange={(e) => setTo(e.target.value)} /></label><button className="btn self-end" disabled={!rows.length} onClick={csv}>Export CSV</button><button className="btn ghost self-end" onClick={() => window.print()}>Print or save as PDF</button></div></div>
      <div className="card"><h3>Health summary · {c.a.name} ({c.a.id})</h3><div className="st Attention mb-3">SIMULATED DATA – FOR DEMONSTRATION ONLY</div>
        <div className="ins"><b>Recorded measurements (entered by you).</b> {rows.length ? `${rows.length} assessment${rows.length > 1 ? 's' : ''} in range.` : 'None in this range.'}</div>
        {rows.map((r) => <div key={r.id} className="alert"><div className="flex-1"><b>{new Date(r.t).toLocaleString('en-GB')}</b>{Object.entries(r.v).map(([k, v]) => `${METRICS[k].t} ${fmt(v, k)}`).join(' · ')}{r.sym.length ? ` · Symptoms: ${r.sym.join(', ')}` : ''}</div></div>)}
        <div className="ins mt-3"><b>Illustrative data (simulated averages).</b> {sim.length ? ['hr', 'sp', 'tp', 'sl'].map((k) => `${METRICS[k].t} ${avg(k).toFixed(1)} ${METRICS[k].u}`).join(' · ') : 'No simulated data in this range.'}</div>
        <div className="ins"><b>Generated interpretation (demonstration logic).</b> {an.changes.join(' ')} {an.flags.length ? `Worth monitoring: ${an.flags.join('; ')}.` : ''}</div>
        <div className="note">Not a medical record or diagnosis. Reference ranges are illustrative and configurable.</div></div>
    </div>
  )
}
