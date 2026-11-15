import { useState } from 'react'
import { METRICS, SYMPTOMS } from '../data/healthMetrics'
import { StatusBadge } from '../components/Health'
import { interpret, ago, fmt } from '../utils/healthCalculations'
const KEYS = Object.keys(METRICS)
export function Result({ rec, ranges }) {
  const r = interpret(rec, ranges)
  return (
    <div className="card ai"><h3>Assessment summary<span className="text-xs font-normal text-[var(--mu)]">{new Date(rec.t).toLocaleString('en-GB')}</span></h3>
      {r.rows.map((x) => <div key={x.k} className="ins"><div className="flex flex-wrap items-center justify-between gap-2"><b>{METRICS[x.k].t}: {fmt(x.v, x.k)} {METRICS[x.k].u}</b><StatusBadge s={x.st} /></div>{x.msg}</div>)}
      {r.sym && <div className="ins" style={{ borderLeft: '3px solid var(--wa)' }}>{r.sym}</div>}
      <div className="ins"><b>Recommended next step.</b> {r.step}</div>
      <div className="note">Reference ranges are illustrative. This is not a diagnosis. For concerning or persistent symptoms follow your mission medical protocol and contact the flight surgeon.</div></div>
  )
}
export default function HealthAssessment({ c }) {
  const [vals, setVals] = useState({}), [sym, setSym] = useState([]), [other, setOther] = useState(''), [errs, setErrs] = useState({}), [focus, setFocus] = useState(null), [res, setRes] = useState(null)
  const any = Object.values(vals).some((v) => v !== ''), cur = res ? 5 : any ? 4 : focus ? 2 : 1
  const submit = (e) => {
    e.preventDefault(); const er = {}, v = {}
    KEYS.forEach((k) => { const s = (vals[k] ?? '').trim(); if (!s) return; const n = Number(s), m = METRICS[k]; if (!Number.isFinite(n) || n < m.min || n > m.max) er[k] = `Enter a number between ${m.min} and ${m.max} ${m.u}`; else v[k] = n })
    if (v.sys != null && v.dia != null && v.dia >= v.sys) er.dia = 'Diastolic must be lower than systolic'
    if (!Object.keys(v).length && !sym.length) er.form = 'Enter at least one measurement or symptom'
    setErrs(er); if (Object.keys(er).length) return
    const rec = { id: Date.now(), t: Date.now(), v, sym, other }
    c.setUserAll((u) => ({ ...u, [c.a.id]: [...(u[c.a.id] || []), rec] })); setRes(rec); setVals({}); setSym([]); setOther(''); setFocus(null); c.toast('Assessment saved')
  }
  const info = focus && METRICS[focus]
  return (
    <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
      <form className="card" onSubmit={submit} noValidate>
        <div className="mb-4 flex flex-wrap gap-3">{['Select indicator', 'Read instructions', 'Enter value', 'Submit', 'Review'].map((s, i) => <span key={s} className={`step ${cur >= i + 1 ? 'on' : ''}`}><i>{i + 1}</i>{s}</span>)}</div>
        <div className="grid gap-3 sm:grid-cols-2">{KEYS.map((k) => <label key={k} className="text-xs text-[var(--mu)]">{METRICS[k].t} ({METRICS[k].u})
          <input inputMode="decimal" value={vals[k] ?? ''} onFocus={() => setFocus(k)} onChange={(e) => setVals({ ...vals, [k]: e.target.value })} placeholder={`${METRICS[k].min}–${METRICS[k].max}`} />{errs[k] && <div className="err">{errs[k]}</div>}</label>)}</div>
        <h3 className="mt-5 !mb-2">Symptom checklist</h3>
        <div className="grid gap-2 sm:grid-cols-3">{SYMPTOMS.map((s) => <label key={s} className="flex items-center gap-2 text-xs"><input type="checkbox" className="!w-4" checked={sym.includes(s)} onChange={() => setSym(sym.includes(s) ? sym.filter((x) => x !== s) : [...sym, s])} />{s}</label>)}</div>
        {sym.includes('Other symptoms') && <input className="mt-2" placeholder="Describe other symptoms" value={other} onChange={(e) => setOther(e.target.value)} />}
        {errs.form && <div className="err">{errs.form}</div>}
        <button className="btn mt-4 w-full" type="submit">Submit assessment</button>
        <p className="note">Entry checks only reject impossible values. They are not medical thresholds.</p>
      </form>
      <div className="grid content-start gap-4">
        <div className="card"><h3>{info ? info.t : 'Measurement guide'}</h3>{info ? <><div className="ins"><b>What it measures.</b> {info.what}</div><div className="ins"><b>How to measure.</b> {info.how}</div></> : <div className="ins">Select a field to read what it measures and how to measure it.</div>}</div>
        {res && <Result rec={res} ranges={c.ranges} />}
        <div className="card"><h3>Previous assessments</h3>{c.user.length ? [...c.user].reverse().slice(0, 8).map((r) => <div key={r.id} className="alert"><div className="flex-1"><b>{new Date(r.t).toLocaleString('en-GB')}</b>{ago(r.t)} · {Object.keys(r.v).length} values · {r.sym.length} symptoms</div><button type="button" className="btn ghost !px-3 !py-1 text-xs" onClick={() => setRes(r)}>Review</button></div>) : <div className="text-xs text-[var(--mu)]">No saved assessments yet. Records are stored in this browser.</div>}</div>
      </div>
    </div>
  )
}
