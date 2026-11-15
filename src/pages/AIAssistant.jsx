import { useState } from 'react'
import * as L from 'lucide-react'
import { analyze } from '../utils/healthCalculations'
const SAFE = ' This is general information, not a diagnosis. Follow your mission medical protocol and contact the flight surgeon about concerning or persistent symptoms. Never change medication or attempt procedures without professional authorization.'
const QS = ['Why is monitoring blood oxygen important?', 'How does microgravity affect bone health?', 'What should I do if I experience persistent dizziness?', 'Why should I monitor my sleep?']
function reply(q) {
  const s = q.toLowerCase()
  if (/oxygen|spo2/.test(s)) return 'Blood oxygen shows how well oxygen is reaching your blood. Cabin air changes, breathing problems or circulation changes can lower it, so regular readings help you spot a trend early.'
  if (/bone|microgravity/.test(s)) return 'In microgravity bones carry little load, and bone mineral density can decrease on long missions, especially in the hips and spine. Resistive exercise and nutrition plans approved by your mission team are the main countermeasures.'
  if (/dizz/.test(s)) return 'Dizziness can follow gravity transitions or fluid shifts, but persistent dizziness needs attention. Sit or hold a handrail, rest, record it in your assessment, and report it to the flight surgeon if it continues. If it comes with chest pain, fainting or confusion, prioritize immediate contact with the crew medical officer.'
  if (/sleep/.test(s)) return 'Sleep affects alertness, mood, and recovery. Confinement and schedule changes can disrupt it, so recording sleep duration lets you notice changes before they affect performance.'
  return 'I can only answer from a small set of demonstration topics: blood oxygen, bone health, dizziness and sleep. For anything else, consult your mission medical resources.'
}
export default function AIAssistant({ c }) {
  const an = analyze(c.a, c.user, c.ranges), [log, setLog] = useState([{ b: 1, t: 'Ask a question about your health monitoring. Answers come from fixed demonstration text.' }]), [q, setQ] = useState('')
  const ask = (t) => { if (!t.trim()) return; setLog((l) => [...l, { t }, { b: 1, t: reply(t) + SAFE }]); setQ('') }
  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <div className="card ai"><h3><span className="flex items-center gap-2"><L.Sparkles size={20} color="#22d3ee" />Health insights</span><span className="st" style={{ background: 'rgba(139,92,246,.2)', color: '#c4b5fd' }}>DEMONSTRATION · rule-based</span></h3>
        <div className="ins"><b>Summary of recent measurements.</b> {an.summary}</div>
        <div className="ins"><b>Changes.</b> {an.changes.join(' ')}</div>
        {an.sleep && <div className="ins">{an.sleep}</div>}
        <div className="ins"><b>Potential concerns worth monitoring.</b> {an.flags.length ? an.flags.join('; ') + '.' : 'None flagged against the configured reference ranges.'}{an.sym.length ? ` Symptoms in your latest assessment: ${an.sym.join(', ').toLowerCase()}.` : ''}</div>
        <div className="ins"><b>Suggested follow-up.</b> {an.follow}</div>
        <div className="note">Simulated logic, not a real AI model. Not a medical diagnosis. For urgent symptoms, contact the crew medical officer or flight surgeon immediately.</div></div>
      <div className="card"><h3>Ask the assistant<span className="st NC">demonstration</span></h3>
        <div className="mb-3 flex flex-wrap gap-2">{QS.map((x) => <button key={x} className="chip !py-1 text-left" onClick={() => ask(x)}>{x}</button>)}</div>
        <div className="chat">{log.map((m, i) => <div key={i} className={`msg ${m.b ? 'b' : 'u'}`}>{m.t}</div>)}</div>
        <form className="mt-3 flex gap-2" onSubmit={(e) => { e.preventDefault(); ask(q) }}><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Type a question" aria-label="Question" /><button className="btn" type="submit">Ask</button></form></div>
    </div>
  )
}
