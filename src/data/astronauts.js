export const ASTRONAUTS = [
  { id: 'AG-2041', name: 'CMD. Lim Lee Xiang', init: 'EV', role: 'Mission Commander', mission: 'Expedition Meridian-7', env: 'ISS', day: 74, total: 180, seed: 1 },
  { id: 'AG-2057', name: 'Dr. Tan JC', init: 'KM', role: 'Flight Engineer', mission: 'Gateway Alpha', env: 'Spacecraft', day: 41, total: 120, seed: 2 },
  { id: 'AG-2063', name: 'Yang Kah Hin', init: 'AO', role: 'Science Officer', mission: 'Ares Habitat Trial', env: 'Mars habitat (analog)', day: 112, total: 240, seed: 3 },
]
const rng = (s) => () => ((s = (s * 16807) % 2147483647) - 1) / 2147483646
const BASE = { hr: [72, 3], sp: [97.6, 0.35], tp: [36.8, 0.1], sys: [118, 3], dia: [76, 2.5], rr: [15, 0.7], sl: [7.3, 0.5], stress: [38, 5], fat: [34, 5] }
const cache = {}
// 30 days of simulated readings, one every 5 minutes (illustrative data only)
export function dense(a) {
  if (cache[a.id]) return cache[a.id]
  const r = rng(a.seed * 7919 + 3), N = 8640, now = Date.now(), out = []
  let dn = 0
  for (let i = 0; i < N; i++) {
    const o = { t: now - (N - 1 - i) * 300000 }, e = Math.max(0, (i / N - 0.9) / 0.1)
    if (i % 288 === 0) dn = (r() - 0.5) * 1.2
    for (const k in BASE) o[k] = BASE[k][0] + (r() - 0.5) * BASE[k][1] * 2
    o.hr += (a.seed - 2) * 3 + 3 * Math.sin((2 * Math.PI * i) / 288)
    o.sl = BASE.sl[0] + dn + (a.seed - 2) * 0.3
    if (a.seed === 1) { o.sl -= 1.5 * e; o.hr += 9 * e; o.stress += 18 * e; o.fat += 15 * e }
    if (a.seed === 3) o.sp -= 3 * e
    for (const k in BASE) o[k] = +o[k].toFixed(1)
    out.push(o)
  }
  return (cache[a.id] = out)
}
