import { useState } from 'react'
import * as L from 'lucide-react'
export const NAV = [
  ['overview', 'Mission Overview', L.LayoutDashboard], ['assessment', 'Health Assessment', L.ClipboardCheck], ['body', 'Body Explorer', L.PersonStanding],
  ['analytics', 'Health Analytics', L.TrendingUp], ['ai', 'AI Health Assistant', L.Sparkles], ['hazards', 'Spaceflight Hazards', L.TriangleAlert],
  ['recs', 'Health Recommendations', L.ListChecks], ['spaceweather', 'Space Weather Intelligence', L.Satellite], ['reports', 'Reports', L.FileText], ['settings', 'Settings', L.Settings],
]
export function Sidebar({ page, go, open, col, setCol }) {
  return (
    <aside className={`side ${open ? 'open' : ''} ${col ? 'col' : ''}`}>
      <nav className="nav flex flex-1 flex-col gap-1">
        {NAV.map(([k, label, Icon]) => <a key={k} title={label} className={page === k ? 'on' : ''} onClick={() => go(k)}><Icon size={18} className="shrink-0" /><span className="lbl">{label}</span></a>)}
      </nav>
      <button className="ib mb-3 hidden lg:grid" onClick={() => setCol(!col)} aria-label="Collapse sidebar">{col ? <L.ChevronsRight size={18} /> : <L.ChevronsLeft size={18} />}</button>
      <div className="flex items-center gap-2.5 rounded-xl border border-[var(--line)] p-3 text-xs text-[var(--mu)]"><span className="dot" /><div className="lbl"><b className="text-[var(--tx)]">MISSION ACTIVE</b></div></div>
    </aside>
  )
}
export function NotificationPanel({ items, read, markRead, markAll }) {
  return (
    <div className="absolute right-0 top-12 z-50 w-80 rounded-2xl border border-[var(--line)] bg-[#0b1433] p-3 text-xs shadow-2xl">
      <div className="mb-2 flex items-center justify-between"><b>Notifications</b><button className="text-[var(--cy)]" onClick={markAll}>Mark all as read</button></div>
      {items.map((n) => <div key={n.id} className={`alert ${read.includes(n.id) ? 'opacity-50' : ''}`}><div className="flex-1"><b>{n.type}</b>{n.txt}</div>{!read.includes(n.id) && <button className="btn ghost !px-2 !py-1 text-[11px]" onClick={() => markRead(n.id)}>Read</button>}</div>)}
    </div>
  )
}
export function Topbar({ a, who, setWho, astronauts, onMenu, notif }) {
  const [open, setOpen] = useState(false), unread = notif.items.filter((n) => !notif.read.includes(n.id)).length
  return (
    <header className="topbar">
      <button className="ib lg:hidden" onClick={onMenu} aria-label="Open menu"><L.Menu size={18} /></button>
      <div className="flex items-center gap-2 font-bold"><i className="grid size-8 place-items-center rounded-[9px] bg-gradient-to-br from-cyan-400 to-violet-500"><L.Orbit size={18} color="#04101f" /></i><span className="hidden sm:inline">AstroGuard</span></div>
      <span className="chip hidden md:block"><span className="dot mr-2 inline-block" />MISSION ACTIVE · {a.env}</span>
      <div className="ml-auto flex items-center gap-2.5">
        <select className="!w-44" value={who} onChange={(e) => setWho(+e.target.value)} aria-label="Astronaut profile">{astronauts.map((x, i) => <option key={x.id} value={i}>{x.name}</option>)}</select>
        <span className="chip hidden sm:block">Day {a.day}/{a.total}</span>
        <div className="relative"><button className="ib" onClick={() => setOpen(!open)} aria-label="Notifications"><L.Bell size={18} />{unread > 0 && <span className="absolute -right-1 -top-1 rounded-full bg-[var(--cr)] px-1.5 text-[10px]">{unread}</span>}</button>{open && <NotificationPanel {...notif} />}</div>
        <div className="avatar !size-10 !p-0.5"><span className="!text-[13px]">{a.init}</span></div>
      </div>
    </header>
  )
}
