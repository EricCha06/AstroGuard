import { HealthCard, StatusBadge } from '../components/Health'
import { CARD_KEYS, METRICS } from '../data/healthMetrics'
import { cardData, ago } from '../utils/healthCalculations'
export default function Overview({ c }) {
  const { a } = c, cards = CARD_KEYS.map((k) => cardData(a, c.user, c.ranges, k)), att = cards.filter((x) => x.st === 'Attention' || x.st === 'Review')
  const overall = cards.some((x) => x.st === 'Review') ? 'Review' : att.length ? 'Attention' : cards.every((x) => x.st === 'NC') ? 'NC' : 'Within'
  return (
    <div className="grid gap-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card"><div className="flex items-center gap-4"><div className="avatar"><span>{a.init}</span></div><div><div className="text-lg font-semibold">{a.name}</div><div className="text-xs text-[var(--mu)]">{a.role} · {a.id}</div></div></div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-[var(--mu)]">{[[a.mission, 'Mission'], [`${a.total} days`, 'Mission duration'], [`Day ${a.day}`, 'Current mission day'], [a.env, 'Environment']].map(([x, y]) => <div key={y}><b className="block text-[13px] text-[var(--tx)]">{x}</b>{y}</div>)}</div></div>
        <div className="card"><h3>Overall Health Summary<StatusBadge s={overall} /></h3>
          <div className="grid grid-cols-2 gap-3 text-xs text-[var(--mu)]">{[[ago(Math.max(...cards.map((x) => x.t))), 'Latest assessment'], [Object.keys(METRICS).length, 'Indicators recorded'], [att.length, 'Needing attention'], [c.user.length, 'Your saved assessments']].map(([x, y]) => <div key={y}><b className="block text-[13px] text-[var(--tx)]">{x}</b>{y}</div>)}</div>
          <div className="ins mt-3"><b>Upcoming (simulated schedule).</b> Daily assessment today 18:00 · Weekly review in 3 days</div>
          <button className="btn w-full" onClick={() => c.go('assessment')}>Start health assessment</button></div>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">{cards.map((d) => <HealthCard key={d.c} d={d} />)}</div>
      <p className="note">Reference ranges are illustrative and configurable (Settings). This is a self-assessment tool, not a medical diagnosis.</p>
    </div>
  )
}
