import { SW, TYPES } from '../data/spaceWeatherInfo'
export const PRESETS = ['Last 24 hours', 'Last 7 days', 'Last 30 days', 'Custom']
export default function SpaceWeatherFilters({ cat, setCat, preset, setPreset, draft, setDraft, apply, invalid }) {
  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="tabs">{[['ALL', 'All events'], ...TYPES.map((t) => [t, SW[t].plural])].map(([k, l]) => <button key={k} className={cat === k ? 'on' : ''} onClick={() => setCat(k)}>{l}</button>)}</div>
        <div className="tabs">{PRESETS.map((p) => <button key={p} className={preset === p ? 'on' : ''} onClick={() => setPreset(p)}>{p}</button>)}</div>
      </div>
      {preset === 'Custom' && (
        <div className="mt-3 grid items-end gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <label className="text-xs text-[var(--mu)]">From<input type="date" value={draft.from} onChange={(e) => setDraft({ ...draft, from: e.target.value })} /></label>
          <label className="text-xs text-[var(--mu)]">To<input type="date" value={draft.to} onChange={(e) => setDraft({ ...draft, to: e.target.value })} /></label>
          <button className="btn" disabled={!!invalid} onClick={apply}>Apply</button>
          {invalid && <div className="err sm:col-span-3">{invalid}</div>}
        </div>
      )}
    </div>
  )
}
