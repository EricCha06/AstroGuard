import { useState, useEffect, useCallback, useMemo } from 'react'
import * as L from 'lucide-react'
import { fetchSummary } from '../services/spaceWeatherService'
import { SW, TYPES, SOURCE, DONKI_URL, DISCLAIMER } from '../data/spaceWeatherInfo'
import SpaceWeatherStatus from '../components/SpaceWeatherStatus'
import SpaceWeatherFilters from '../components/SpaceWeatherFilters'
import SpaceWeatherSummary from '../components/SpaceWeatherSummary'
import SpaceWeatherEventCard from '../components/SpaceWeatherEventCard'
import SpaceWeatherEventDetails from '../components/SpaceWeatherEventDetails'
import SpaceWeatherTimeline from '../components/SpaceWeatherTimeline'

const iso = (d) => d.toISOString().slice(0, 10), daysAgo = (n) => iso(new Date(Date.now() - n * 864e5))
export default function SpaceWeather({ c }) {
  const [preset, setPreset] = useState('Last 7 days'), [cat, setCat] = useState('ALL'), [custom, setCustom] = useState({ from: daysAgo(7), to: daysAgo(0) }), [draft, setDraft] = useState(custom)
  const [state, setState] = useState({ status: 'loading', data: null, err: '', lastOk: null }), [sel, setSel] = useState(null), [limit, setLimit] = useState(30)
  const range = useMemo(() => preset === 'Last 24 hours' ? { startDate: daysAgo(1), endDate: daysAgo(0) } : preset === 'Last 7 days' ? { startDate: daysAgo(7), endDate: daysAgo(0) } : preset === 'Last 30 days' ? { startDate: daysAgo(30), endDate: daysAgo(0) } : { startDate: custom.from, endDate: custom.to }, [preset, custom])
  const invalid = !draft.from || !draft.to ? 'Choose both dates.' : draft.from > draft.to ? 'Start date must not be after end date.' : (Date.parse(draft.to) - Date.parse(draft.from)) / 864e5 > 120 ? 'Range must not exceed 120 days.' : ''
  const load = useCallback(async (refresh = false) => {
    setState((s) => ({ ...s, status: 'loading', err: '' })); setSel(null)
    try { const data = await fetchSummary({ ...range, refresh }); setState({ status: 'ok', data, err: '', lastOk: new Date() }) }
    catch (e) { setState((s) => ({ status: 'error', data: null, err: e.message, lastOk: s.lastOk })) }
  }, [range])
  useEffect(() => { load() }, [load])
  const { status, data } = state, cutoff = preset === 'Last 24 hours' ? Date.now() - 864e5 : 0
  const windowed = useMemo(() => (data?.events || []).filter((e) => !cutoff || (e.t && e.t >= cutoff)), [data, cutoff])
  const shown = windowed.filter((e) => cat === 'ALL' || e.type === cat)
  const ok = status === 'ok'
  return (
    <div className="grid gap-4">
      <div className="flex flex-wrap gap-2 text-[11px]">{[['Real NASA API data', 'Within'], ['Simulated astronaut health data', 'Attention'], ['Plain-language explanations (written for AstroGuard)', 'NC'], ['Configured mission guidance', 'NC']].map(([a, b]) => <span key={a} className={`st ${b}`}>{a}</span>)}</div>
      <SpaceWeatherStatus status={status} err={state.err} lastOk={state.lastOk} cached={data && Object.values(data.types).every((t) => t.cached)} onRefresh={load} />
      <SpaceWeatherFilters cat={cat} setCat={setCat} preset={preset} setPreset={setPreset} draft={draft} setDraft={setDraft} apply={() => setCustom(draft)} invalid={invalid} />
      <SpaceWeatherSummary types={data?.types} events={windowed} loading={status === 'loading'} />
      {status === 'loading' && <div className="card text-center text-[var(--mu)]"><span className="spin" />Retrieving space-weather information from NASA...</div>}
      {status === 'error' && <div className="card" style={{ borderColor: 'var(--cr)' }}>Unable to retrieve NASA data. Please try again.<div className="err">{state.err}</div></div>}
      {ok && (<>
        <div className="grid items-start gap-4 xl:grid-cols-[1.2fr_1fr]">
          <div className="grid gap-3"><h3 className="m-0 text-[15px] font-semibold">Latest space weather events ({shown.length})</h3>
            {shown.length ? <>{shown.slice(0, limit).map((e) => <SpaceWeatherEventCard key={e.type + e.id + e.time} e={e} active={sel?.id === e.id && sel?.type === e.type} onSelect={setSel} />)}
              {shown.length > limit && <button className="btn ghost" onClick={() => setLimit(limit + 30)}>Show more</button>}</> : <div className="card text-center text-[var(--mu)]">No events found for the selected date range.</div>}</div>
          <div className="xl:sticky xl:top-20">{sel ? <SpaceWeatherEventDetails e={sel} events={windowed} userRecords={c.user} onSelect={setSel} go={c.go} onClose={() => setSel(null)} /> : <div className="card text-sm text-[var(--mu)]">Select an event to see details, related events and mission monitoring guidance.</div>}</div>
        </div>
        <SpaceWeatherTimeline events={shown} range={data} onSelect={setSel} />
      </>)}
      <div className="card"><h3>Mission environmental awareness</h3><div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-3">{TYPES.map((t) => { const I = L[SW[t].icon]; return <div key={t} className="ins !mb-0"><b className="flex items-center gap-1.5" style={{ color: SW[t].color }}><I size={15} />{SW[t].plural}</b>{SW[t].relevance}</div> })}</div>
        <div className="note">Configured mission guidance, not a NASA measurement. A DONKI event alone does not indicate that an astronaut is at medical risk, and environmental events are kept separate from personal health measurements.</div></div>
      <div className="note !mt-0">Data source: {SOURCE}. <a className="text-[var(--cy)]" href={DONKI_URL} target="_blank" rel="noreferrer">{DONKI_URL}</a><br />{DISCLAIMER}</div>
    </div>
  )
}
