import { useState, useCallback } from 'react'
import { ASTRONAUTS } from './data/astronauts'
import { CARD_KEYS, DEFAULT_RANGES, METRICS } from './data/healthMetrics'
import { useLocal } from './utils/storage'
import { cardData, SL } from './utils/healthCalculations'
import { Sidebar, Topbar } from './components/Layout'
import Overview from './pages/Overview'
import HealthAssessment from './pages/HealthAssessment'
import BodyExplorerPage from './pages/BodyExplorerPage'
import HealthAnalytics from './pages/HealthAnalytics'
import AIAssistant from './pages/AIAssistant'
import SpaceflightHazards from './pages/SpaceflightHazards'
import Recommendations from './pages/Recommendations'
import Reports from './pages/Reports'
import Settings from './pages/Settings'
import SpaceWeather from './pages/SpaceWeather'

const PAGES = { overview: Overview, assessment: HealthAssessment, body: BodyExplorerPage, analytics: HealthAnalytics, ai: AIAssistant, hazards: SpaceflightHazards, recs: Recommendations, spaceweather: SpaceWeather, reports: Reports, settings: Settings }
export default function App() {
  const [page, setPage] = useState('overview'), [who, setWho] = useState(0), [open, setOpen] = useState(false), [col, setCol] = useState(false), [msg, setMsg] = useState('')
  const [userAll, setUserAll] = useLocal('ag_assessments', {}), [ranges, setRanges] = useLocal('ag_ranges', DEFAULT_RANGES), [done, setDone] = useLocal('ag_done', {}), [read, setRead] = useLocal('ag_read', [])
  const a = ASTRONAUTS[who], user = userAll[a.id] || []
  const toast = useCallback((t) => { setMsg(t); setTimeout(() => setMsg(''), 2400) }, [])
  const go = (k) => { setPage(k); setOpen(false); window.scrollTo(0, 0) }
  const p = (id) => `${a.id}:${id}`
  const items = [{ id: p('n1'), type: 'Upcoming assessment', txt: 'Daily health assessment due at 18:00 (simulated schedule)' }, { id: p('n2'), type: 'Follow-up reminder', txt: 'Weekly exercise log review in 3 days (simulated)' }]
  if (!user.some((r) => new Date(r.t).toDateString() === new Date().toDateString())) items.push({ id: p('miss-' + new Date().toDateString()), type: 'Missing measurement', txt: 'No assessment recorded today' })
  CARD_KEYS.map((k) => cardData(a, user, ranges, k)).filter((d) => d.st === 'Attention' || d.st === 'Review').forEach((d) => items.push({ id: p('chg-' + d.c), type: 'Change requiring attention', txt: `${d.c === 'bp' ? 'Blood Pressure' : METRICS[d.k].t}: ${SL[d.st].toLowerCase()}` }))
  const nDone = Object.keys(done).filter((k) => k.startsWith(a.id) && done[k]).length
  if (nDone) items.push({ id: p('done' + nDone), type: 'Activity completed', txt: `${nDone} health activit${nDone > 1 ? 'ies' : 'y'} completed` })
  const ctx = { a, user, ranges, setRanges, userAll, setUserAll, done, setDone, toast, go }, Page = PAGES[page]
  return (
    <>
      <Topbar a={a} who={who} setWho={setWho} astronauts={ASTRONAUTS} onMenu={() => setOpen(!open)} notif={{ items, read, markRead: (id) => setRead([...read, id]), markAll: () => setRead([...read, ...items.map((n) => n.id)]) }} />
      <Sidebar page={page} go={go} open={open} col={col} setCol={setCol} />
      <main className={`main ${col ? 'col' : ''}`}>
        <div className="sim">SIMULATED DATA – FOR DEMONSTRATION ONLY · Self-assessment tool, not a medical diagnosis or a substitute for professional medical assessment</div>
        <Page key={page + who} c={ctx} />
      </main>
      {msg && <div className="toast">{msg}</div>}
    </>
  )
}
