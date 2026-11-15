import { RECS } from '../data/recommendations'
const day = (t) => new Date(t).toDateString()
export default function Recommendations({ c }) {
  const key = (r) => `${c.a.id}:${r}`, n = RECS.filter((r) => c.done[key(r.id)]).length, pts = n * 10 + c.user.length * 15
  const days = new Set(c.user.map((r) => day(r.t))); let streak = 0, d = new Date(); if (!days.has(day(d))) d.setDate(d.getDate() - 1)
  while (days.has(day(d))) { streak++; d.setDate(d.getDate() - 1) }
  const badges = [['First assessment', c.user.length >= 1], ['3-day streak', streak >= 3], ['Half the checklist', n >= 4], ['Full checklist', n === RECS.length]]
  return (
    <div className="grid gap-4">
      <div className="card"><h3>Health progress</h3>
        <div className="grid grid-cols-2 gap-3 text-xs text-[var(--mu)] sm:grid-cols-4">{[[pts, 'Health points'], [`${streak} days`, 'Assessment streak'], [`${n}/${RECS.length}`, 'Activities completed'], [`${Math.round((n / RECS.length) * 100)}%`, 'Progress']].map(([a, b]) => <div key={b}><b className="block text-xl text-[var(--tx)]">{a}</b>{b}</div>)}</div>
        <div className="my-3 h-2 overflow-hidden rounded bg-[rgba(0,0,0,.3)]"><div className="h-full bg-gradient-to-r from-cyan-400 to-violet-500 transition-all" style={{ width: `${(n / RECS.length) * 100}%` }} /></div>
        <div className="flex flex-wrap gap-2">{badges.map(([b, ok]) => <span key={b} className={`st ${ok ? 'Within' : 'NC'}`}>{ok ? '✓' : '○'} {b}</span>)}</div>
        <div className="note">Points: 10 per completed activity, 15 per saved assessment.</div></div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-4">{RECS.map((r) => <div key={r.id} className="card"><h3>{r.title}<span className="st NC">{r.cat}</span></h3>
        {[['Why it matters', r.why], ['Related system', r.sys], ['Related hazard', r.hz], ['Suggested activity', r.act]].map(([a, b]) => <div key={a} className="text-xs text-[var(--mu)] mb-1.5"><b className="text-[var(--tx)]">{a}: </b>{b}</div>)}
        <label className="mt-2 flex items-center gap-2 text-xs"><input type="checkbox" className="!w-4" checked={!!c.done[key(r.id)]} onChange={() => c.setDone({ ...c.done, [key(r.id)]: !c.done[key(r.id)] })} />{c.done[key(r.id)] ? 'Completed' : 'Mark as completed'}</label></div>)}</div>
    </div>
  )
}
