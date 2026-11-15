import { dense } from '../data/astronauts'
import { METRICS } from '../data/healthMetrics'
export const SL = { Within: 'Within reference range', Attention: 'Attention recommended', Review: 'Prompt medical review', NC: 'Reference data not configured' }
export const SC = { Within: '#34d399', Attention: '#fbbf24', Review: '#f87171', NC: '#8b9bc7' }
const RANK = { NC: 0, Within: 1, Attention: 2, Review: 3 }
export const worst = (a) => a.reduce((x, y) => (RANK[y] > RANK[x] ? y : x), 'NC')
export function getStatus(v, r) {
  if (!r || r.lo == null || r.hi == null) return 'NC'
  if ((r.rlo != null && v < r.rlo) || (r.rhi != null && v > r.rhi)) return 'Review'
  return v < r.lo || v > r.hi ? 'Attention' : 'Within'
}
export const fmt = (v, k) => (+v).toFixed(METRICS[k].dec)
export const ago = (t) => { const m = Math.round((Date.now() - t) / 60000); return m < 1 ? 'just now' : m < 60 ? `${m} min ago` : m < 2880 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} d ago` }
export const WIN = { '1 hour': 36e5, '6 hours': 216e5, '24 hours': 864e5, '7 days': 6048e5, '30 days': 2592e6 }
export function reading(a, user, k) {
  const rec = user.filter((r) => r.v[k] != null), d = dense(a), sim = d[d.length - 1]
  const n = rec.length
  return { v: n ? rec[n - 1].v[k] : sim[k], pv: n > 1 ? rec[n - 2].v[k] : n === 1 ? sim[k] : d[d.length - 145][k], t: n ? rec[n - 1].t : sim.t, src: n ? 'Recorded by you' : 'Simulated' }
}
export function cardData(a, user, ranges, c) {
  const ks = c === 'bp' ? ['sys', 'dia'] : [c], rd = ks.map((k) => reading(a, user, k)), d = dense(a)
  const sl = c === 'sl', pts = (sl ? d.slice(-2016).filter((_, i) => i % 96 === 0) : d.slice(-288).filter((_, i) => i % 12 === 0)).map((p) => ({ v: p[ks[0]] }))
  const f = (x) => (c === 'bp' ? `${Math.round(rd[0][x])}/${Math.round(rd[1][x])}` : fmt(rd[0][x], c))
  const diff = rd[0].v - rd[0].pv
  return { c, k: ks[0], st: worst(ks.map((k, i) => getStatus(rd[i].v, ranges[k]))), value: f('v'), prev: f('pv'), t: rd[0].t, src: rd[0].src, spark: pts, trend: Math.abs(diff) < METRICS[ks[0]].tol ? 0 : diff > 0 ? 1 : -1 }
}
export function seriesFor(a, user, range) {
  const now = Date.now(), W = WIN[range], d = dense(a).filter((p) => p.t >= now - W), step = Math.max(1, Math.ceil(d.length / 60))
  const pts = d.filter((_, i) => i % step === 0).map((p) => ({ ...p }))
  user.filter((r) => r.t >= now - W).forEach((r) => pts.push({ t: r.t, ...r.v }))
  return pts.sort((x, y) => x.t - y.t)
}
const MSG = {
  Within: 'Within the configured reference range. Continue routine monitoring.',
  Attention: 'Outside the configured range. Rest, re-measure, and note it in your log. Follow your mission protocol if it continues.',
  Review: 'Well outside the configured range. Prompt review is recommended: contact the crew medical officer or flight surgeon per mission procedures.',
  NC: 'Reference data not configured. Add a mission-approved range in Settings to interpret this value.',
}
const URGENT = ['Breathing discomfort', 'Vision changes']
export function interpret(rec, ranges) {
  const rows = Object.entries(rec.v).map(([k, v]) => { const st = getStatus(v, ranges[k]); return { k, v, st, msg: MSG[st] } })
  const urgent = rec.sym.filter((s) => URGENT.includes(s))
  const sym = urgent.length ? `Urgent priority: ${urgent.join(' and ').toLowerCase()} should be reported immediately to the crew medical officer or flight surgeon per mission procedures.` : rec.sym.length ? 'Symptoms noted. Keep monitoring, and contact the flight surgeon if they persist or worsen.' : ''
  return { rows, sym, step: urgent.length || rows.some((r) => r.st === 'Review') ? 'Contact the flight surgeon now.' : rows.some((r) => r.st === 'Attention') ? 'Record another assessment after rest.' : 'Continue routine monitoring. Next assessment as scheduled.' }
}
export function analyze(a, user, ranges) {
  const cards = ['hr', 'sp', 'tp', 'bp', 'rr', 'sl'].map((c) => cardData(a, user, ranges, c)), out = []
  cards.filter((x) => x.trend).forEach((x) => out.push(`Your recorded ${METRICS[x.k].t.toLowerCase()} is ${x.trend > 0 ? 'higher' : 'lower'} than your previous reading (${x.prev} to ${x.value}).`))
  const sl = cards[5], flags = cards.filter((x) => x.st === 'Attention' || x.st === 'Review').map((x) => `${METRICS[x.k].t} (${SL[x.st].toLowerCase()})`)
  const last = user[user.length - 1], sym = last && last.sym.length ? last.sym : []
  return {
    summary: cards.map((x) => `${METRICS[x.k].t}: ${x.value} ${METRICS[x.k].u}`).join(' · '),
    changes: out.length ? out : ['No notable change compared with your previous readings.'],
    flags, sleep: sl.trend < 0 ? 'Your recorded sleep duration has decreased compared with your previous assessments. Changes in sleep patterns may affect fatigue and concentration. Consider following your mission-approved sleep routine and recording another assessment.' : '',
    sym, follow: flags.length ? 'Record another assessment after rest within a few hours, and report persistent changes to the flight surgeon.' : 'Keep to your scheduled daily assessment.',
  }
}
export function toCSV(rows) {
  const ks = Object.keys(METRICS)
  return [['time', ...ks.map((k) => METRICS[k].t + ' (' + METRICS[k].u + ')'), 'symptoms', 'data source'].join(','), ...rows.map((r) => [new Date(r.t).toISOString(), ...ks.map((k) => r.v[k] ?? ''), '"' + r.sym.join('; ') + '"', 'recorded'].join(','))].join('\n')
}
