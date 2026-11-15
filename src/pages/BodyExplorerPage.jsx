import { useState } from 'react'
import { BodyExplorer, BodySystemPanel } from '../components/BodyExplorer'
import { SYSTEMS } from '../data/bodySystems'
import { cardData } from '../utils/healthCalculations'
export default function BodyExplorerPage({ c }) {
  const [sel, setSel] = useState('heart'), [view, setView] = useState('front'), s = SYSTEMS.find((x) => x.id === sel)
  const rd = s.keys.map((k) => cardData(c.a, c.user, c.ranges, k))
  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
      <div className="card"><h3>Body Explorer<span className="tabs">{['front', 'back'].map((v) => <button key={v} className={v === view ? 'on' : ''} onClick={() => setView(v)}>{v === 'front' ? 'Front' : 'Back'}</button>)}</span></h3>
        <BodyExplorer sel={sel} setSel={setSel} view={view} />
        <div className="mt-3 flex flex-wrap justify-center gap-1.5">{SYSTEMS.map((x) => <button key={x.id} className="chip !px-2.5 !py-1" style={sel === x.id ? { borderColor: x.color, color: x.color } : {}} onClick={() => setSel(x.id)}>{x.name.split(' ')[0]}</button>)}</div></div>
      <BodySystemPanel s={s} rd={rd} />
    </div>
  )
}
