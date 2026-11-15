import { AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts'
import * as L from 'lucide-react'
import { SL, SC, ago } from '../utils/healthCalculations'
import { METRICS } from '../data/healthMetrics'
export const StatusBadge = ({ s }) => <span className={`st ${s}`}>● {SL[s]}</span>
export function HealthCard({ d }) {
  const m = METRICS[d.k], c = SC[d.st], Icon = d.c === 'bp' ? L.Activity : L[m.icon], T = d.trend > 0 ? L.TrendingUp : d.trend < 0 ? L.TrendingDown : L.Minus
  const name = d.c === 'bp' ? 'Blood Pressure' : m.t, unit = d.c === 'bp' ? 'mmHg' : m.u, id = 'sp' + d.c
  return (
    <div className="card">
      <div className="flex items-center justify-between text-[13px] text-[var(--mu)]"><span>{name}</span><Icon size={20} color={c} /></div>
      <div className="mt-2 text-[32px] font-bold tracking-tight">{d.value}<small className="ml-1 text-[13px] font-normal text-[var(--mu)]">{unit}</small></div>
      <div className="mb-1 flex items-center justify-between text-xs text-[var(--mu)]"><span>Previous {d.prev}</span><span className="flex items-center gap-1"><T size={14} />{d.trend > 0 ? 'Higher' : d.trend < 0 ? 'Lower' : 'Stable'}</span></div>
      <div className="mb-2"><StatusBadge s={d.st} /></div>
      <ResponsiveContainer width="100%" height={40}><AreaChart data={d.spark} margin={{ top: 4 }}><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={c} stopOpacity={0.35} /><stop offset="1" stopColor={c} stopOpacity={0} /></linearGradient></defs><YAxis hide domain={['dataMin', 'dataMax']} /><Area dataKey="v" type="monotone" stroke={c} strokeWidth={2} fill={`url(#${id})`} isAnimationActive={false} /></AreaChart></ResponsiveContainer>
      <div className="mt-1 text-[11px] text-[var(--mu)]">{d.src} · {ago(d.t)}</div>
    </div>
  )
}
export function TrendChart({ data, lines, range }) {
  const short = range === '1 hour' || range === '6 hours' || range === '24 hours'
  const tf = (t) => (short ? new Date(t).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : new Date(t).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }))
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -12 }}>
        <CartesianGrid stroke="rgba(120,160,255,.12)" vertical={false} />
        <XAxis dataKey="t" type="number" scale="time" domain={['dataMin', 'dataMax']} tickFormatter={tf} tick={{ fill: '#8b9bc7', fontSize: 10 }} stroke="rgba(120,160,255,.15)" />
        <YAxis domain={['auto', 'auto']} tick={{ fill: '#8b9bc7', fontSize: 10 }} stroke="rgba(120,160,255,.15)" />
        <Tooltip labelFormatter={tf} contentStyle={{ background: '#0b1433', border: '1px solid rgba(120,160,255,.3)', borderRadius: 10 }} />
        {lines.length > 1 && <Legend />}
        {lines.map((l) => <Line key={l.k} dataKey={l.k} name={l.n} stroke={l.c} strokeWidth={2.5} dot={false} type="monotone" connectNulls />)}
      </LineChart>
    </ResponsiveContainer>
  )
}
