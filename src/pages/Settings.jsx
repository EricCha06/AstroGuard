import { METRICS, DEFAULT_RANGES } from '../data/healthMetrics'
const COLS = [['lo', 'Attention below'], ['hi', 'Attention above'], ['rlo', 'Review below'], ['rhi', 'Review above']]
export default function Settings({ c }) {
  const set = (k, f, v) => c.setRanges({ ...c.ranges, [k]: { ...c.ranges[k], [f]: v === '' ? null : Number(v) } })
  return (
    <div className="grid gap-4">
      <div className="card"><h3>Reference ranges<button className="btn ghost !py-1.5 text-xs" onClick={() => { c.setRanges(DEFAULT_RANGES); c.toast('Ranges reset to illustrative defaults') }}>Reset to defaults</button></h3>
        <div className="ins">Defaults are <b>illustrative general-adult values, not mission-approved</b>. Replace them with ranges approved by your flight surgeon. Leave a field blank to show “Reference data not configured”.</div>
        <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-xs"><thead><tr className="text-left text-[var(--mu)]"><th className="p-1.5">Indicator</th>{COLS.map(([, l]) => <th key={l} className="p-1.5">{l}</th>)}</tr></thead>
          <tbody>{Object.keys(METRICS).map((k) => <tr key={k}><td className="p-1.5">{METRICS[k].t} ({METRICS[k].u})</td>{COLS.map(([f]) => <td key={f} className="p-1.5"><input type="number" step="any" aria-label={`${METRICS[k].t} ${f}`} value={c.ranges[k][f] ?? ''} onChange={(e) => set(k, f, e.target.value)} /></td>)}</tr>)}</tbody></table></div></div>
      <div className="card"><h3>Saved data</h3><p className="mt-0 text-xs text-[var(--mu)]">Assessments, checklist progress, notifications and settings are stored in this browser only.</p>
        <button className="btn ghost" onClick={() => { if (window.confirm('Delete all saved assessments in this browser?')) { c.setUserAll({}); c.toast('Saved assessments cleared') } }}>Clear saved assessments</button></div>
    </div>
  )
}
