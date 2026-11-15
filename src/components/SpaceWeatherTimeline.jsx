import { useState } from 'react'
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, CartesianGrid, BarChart, Bar, Legend, Cell } from 'recharts'
import { SW, TYPES, fmtUTC } from '../data/spaceWeatherInfo'
const ax = { tick: { fill: '#8b9bc7', fontSize: 10 }, stroke: 'rgba(120,160,255,.15)' }
const tip = { contentStyle: { background: '#0b1433', border: '1px solid rgba(120,160,255,.3)', borderRadius: 10 } }
const day = (t) => new Date(t).toISOString().slice(0, 10)
export default function SpaceWeatherTimeline({ events, range, onSelect }) {
  const [off, setOff] = useState([]), on = TYPES.filter((t) => !off.includes(t)), ev = events.filter((e) => e.t && on.includes(e.type))
  const days = {}; ev.forEach((e) => { const d = (days[day(e.t)] ??= { d: day(e.t), FLR: 0, CME: 0, SEP: 0, GST: 0 }); d[e.type]++ })
  const daily = Object.values(days).sort((a, b) => a.d.localeCompare(b.d)), freq = TYPES.map((t) => ({ name: SW[t].plural, n: ev.filter((e) => e.type === t).length, fill: SW[t].color }))
  return (
    <div className="grid gap-4">
      <div className="card"><h3>Event timeline<span className="tabs">{TYPES.map((t) => <button key={t} className={on.includes(t) ? 'on' : ''} onClick={() => setOff(off.includes(t) ? off.filter((x) => x !== t) : [...off, t])}>{t}</button>)}</span></h3>
        {ev.length ? <ResponsiveContainer width="100%" height={240}><ScatterChart margin={{ top: 8, right: 12, left: 8 }}>
          <CartesianGrid stroke="rgba(120,160,255,.12)" /><XAxis dataKey="x" type="number" domain={['dataMin', 'dataMax']} scale="time" tickFormatter={(t) => new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', timeZone: 'UTC' })} {...ax} />
          <YAxis dataKey="y" type="number" domain={[0, 5]} ticks={[1, 2, 3, 4]} tickFormatter={(i) => TYPES[i - 1] || ''} width={40} {...ax} /><ZAxis range={[70, 70]} />
          <Tooltip {...tip} cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => { const p = payload?.[0]?.payload; return p ? <div className="card !p-2.5 text-xs"><b>{SW[p.type].label}</b><br />{fmtUTC(p.time)}<br />{p.classification || 'Classification not available'}<br /><span className="text-[var(--cy)]">Click to open details</span></div> : null }} />
          {TYPES.map((t, i) => on.includes(t) && <Scatter key={t} data={ev.filter((e) => e.type === t).map((e) => ({ ...e, x: e.t, y: i + 1 }))} fill={SW[t].color} cursor="pointer" onClick={(d) => onSelect(d?.payload?.id ? d.payload : d)} />)}
        </ScatterChart></ResponsiveContainer> : <div className="py-8 text-center text-[var(--mu)]">No events found for the selected date range.</div>}
        <div className="note">Event times in UTC · Period {range.startDate} to {range.endDate} · Data source: NASA DONKI</div></div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="card"><h3>Events per day</h3><ResponsiveContainer width="100%" height={220}><BarChart data={daily} margin={{ left: -20 }}><CartesianGrid stroke="rgba(120,160,255,.12)" vertical={false} /><XAxis dataKey="d" tickFormatter={(d) => d.slice(5)} {...ax} /><YAxis allowDecimals={false} {...ax} /><Tooltip {...tip} /><Legend />{TYPES.map((t) => <Bar key={t} dataKey={t} stackId="a" fill={SW[t].color} />)}</BarChart></ResponsiveContainer></div>
        <div className="card"><h3>Event frequency by category</h3><ResponsiveContainer width="100%" height={220}><BarChart data={freq} margin={{ left: -20 }}><CartesianGrid stroke="rgba(120,160,255,.12)" vertical={false} /><XAxis dataKey="name" tick={{ fill: '#8b9bc7', fontSize: 9 }} interval={0} stroke="rgba(120,160,255,.15)" /><YAxis allowDecimals={false} {...ax} /><Tooltip {...tip} /><Bar dataKey="n" name="Events">{freq.map((f) => <Cell key={f.name} fill={f.fill} />)}</Bar></BarChart></ResponsiveContainer></div>
      </div>
    </div>
  )
}
