// NASA DONKI client. The API key is read from process.env at call time and is never logged or returned.
const BASE = 'https://ccmc.gsfc.nasa.gov/DONKI-API/get'
const SITE = 'https://ccmc.gsfc.nasa.gov/DONKI/'
const TTL = 10 * 60 * 1000, MIN_REFRESH = 60 * 1000, TIMEOUT = 15000, MAX_SPAN_DAYS = 120
const cache = new Map(), inflight = new Map()

export class DonkiError extends Error { constructor(msg, status = 502) { super(msg); this.status = status } }
export const KINDS = { flares: 'FLR', cmes: 'CME', sep: 'SEP', 'geomagnetic-storms': 'GST' }
export const NOTIF_TYPES = ['all', 'FLR', 'SEP', 'CME', 'IPS', 'MPC', 'GST', 'RBE', 'report']

const iso = (d) => d.toISOString().slice(0, 10)
const validDate = (s) => { try { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s) && iso(new Date(s + 'T00:00:00Z')) === s } catch { return false } }
export function parseRange(q = {}) {
  const end = q.endDate ?? iso(new Date())
  if (!validDate(end) || (q.startDate !== undefined && !validDate(q.startDate))) throw new DonkiError('Dates must use the format YYYY-MM-DD.', 400)
  const start = q.startDate ?? iso(new Date(Date.parse(end) - 7 * 864e5))
  if (!validDate(start)) throw new DonkiError('Dates must use the format YYYY-MM-DD.', 400)
  if (start > end) throw new DonkiError('startDate must not be after endDate.', 400)
  if ((Date.parse(end) - Date.parse(start)) / 864e5 > MAX_SPAN_DAYS) throw new DonkiError(`Date range must not exceed ${MAX_SPAN_DAYS} days.`, 400)
  return { startDate: start, endDate: end }
}


async function request(path, params, refresh = false) {
  const ck = `${path}?${new URLSearchParams(params)}`;
  const hit = cache.get(ck);
  const age = hit ? Date.now() - hit.t : Infinity;

  // Check cache first
  if (hit && age < TTL && !(refresh && age >= MIN_REFRESH)) {
    return {
      data: hit.data,
      cached: true,
      fetchedAt: hit.t
    };
  }

  // Prevent duplicate requests
  if (inflight.has(ck)) {
    return inflight.get(ck);
  }

  const job = (async () => {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), TIMEOUT);

    try {
      const url = `${BASE}/${path}?${new URLSearchParams(params)}`;

      const res = await fetch(url, {
        signal: ac.signal,
        headers: {
          Accept: 'application/json'
        }
      });

      if (res.status === 429) {
        throw new DonkiError(
          'NASA rate limit reached. Please try again later.',
          429
        );
      }

      if (!res.ok) {
        throw new DonkiError(
          `NASA DONKI returned status ${res.status}.`,
          502
        );
      }

      const txt = await res.text();
      let data = [];

      if (txt.trim()) {
        try {
          data = JSON.parse(txt);
        } catch {
          throw new DonkiError(
            'NASA DONKI returned unreadable data.',
            502
          );
        }
      }

      if (!Array.isArray(data)) {
        data = [];
      }

      const entry = {
        data,
        t: Date.now()
      };

      cache.set(ck, entry);

      return {
        data,
        cached: false,
        fetchedAt: entry.t
      };

    } catch (e) {
      if (e instanceof DonkiError) {
        throw e;
      }

      throw new DonkiError(
        e?.name === 'AbortError'
          ? 'NASA DONKI timed out.'
          : 'Could not reach NASA DONKI.',
        e?.name === 'AbortError' ? 504 : 502
      );

    } finally {
      clearTimeout(timer);
      inflight.delete(ck);
    }
  })();

  inflight.set(ck, job);

  return job;
}


const arr = (x) => (Array.isArray(x) ? x : [])
const s = (x) => (x === undefined || x === null || x === '' ? null : x)
const inst = (l) => { const n = arr(l).map((i) => i?.displayName).filter(Boolean); return n.length ? n.join(', ') : null }
const linked = (l) => arr(l).map((x) => x?.activityID).filter(Boolean)
const base = (type, id, time, o) => ({ type, id: s(id), time: s(time), t: Date.parse(time) || null, endTime: null, peakTime: null, classification: null, location: null, source: null, link: SITE, linked: [], note: null, submitted: null, ...o })
const NORMALIZE = {
  FLR: (e) => base('FLR', e.flrID, e.beginTime, { peakTime: s(e.peakTime), endTime: s(e.endTime), classification: s(e.classType), location: s(e.sourceLocation), source: inst(e.instruments), link: e.link || SITE, linked: linked(e.linkedEvents), note: s(e.note), activeRegion: s(e.activeRegionNum), submitted: s(e.submissionTime), description: `${e.classType ? `Class ${e.classType} solar flare` : 'Solar flare'}${e.sourceLocation ? ` from ${e.sourceLocation}` : ''}` }),
  CME: (e) => { const an = arr(e.cmeAnalyses).find((a) => a?.isMostAccurate) || arr(e.cmeAnalyses)[0] || {}, sp = Number(an.speed); return base('CME', e.activityID, e.startTime, { classification: s(an.type) ? `Type ${an.type}` : null, location: s(e.sourceLocation), source: inst(e.instruments) || s(e.catalog), link: e.link || SITE, linked: linked(e.linkedEvents), note: s(an.note) || s(e.note), activeRegion: s(e.activeRegionNum), submitted: s(e.submissionTime), speed: Number.isFinite(sp) && an.speed !== null ? sp : null, halfAngle: s(an.halfAngle), analysisCount: arr(e.cmeAnalyses).length, description: `Coronal mass ejection${e.sourceLocation ? ` from ${e.sourceLocation}` : ''}${Number.isFinite(sp) && an.speed !== null ? `, estimated speed ${Math.round(sp)} km/s` : ''}` }) },
  SEP: (e) => base('SEP', e.sepID, e.eventTime, { source: inst(e.instruments), link: e.link || SITE, linked: linked(e.linkedEvents), submitted: s(e.submissionTime), description: 'Solar energetic particle event' }),
  GST: (e) => { const kp = arr(e.allKpIndex).map((k) => Number(k?.kpIndex)).filter(Number.isFinite), mx = kp.length ? Math.max(...kp) : null; return base('GST', e.gstID, e.startTime, { classification: mx !== null ? `Max observed Kp ${mx}` : null, source: [...new Set(arr(e.allKpIndex).map((k) => k?.source).filter(Boolean))].join(', ') || null, link: e.link || SITE, linked: linked(e.linkedEvents), submitted: s(e.submissionTime), description: `Geomagnetic storm${mx !== null ? ` (max observed Kp ${mx})` : ''}` }) },
}
export async function getEvents(kind, query = {}, refresh = false) {
  const type = KINDS[kind]; if (!type) throw new DonkiError('Unknown event type.', 400)
  const range = parseRange(query), r = await request(type, range, refresh)
  const events = r.data.filter((e) => e && typeof e === 'object').map(NORMALIZE[type]).sort((a, b) => (b.t || 0) - (a.t || 0))
  return { ...range, fetchedAt: r.fetchedAt, cached: r.cached, count: events.length, events }
}
export async function getNotifications(query = {}, refresh = false) {
  const type = query.type ?? 'all'; if (!NOTIF_TYPES.includes(type)) throw new DonkiError(`type must be one of: ${NOTIF_TYPES.join(', ')}.`, 400)
  const range = parseRange(query), r = await request('notifications', { ...range, type }, refresh)
  const items = r.data.map((n) => ({ id: s(n?.messageID), type: s(n?.messageType), time: s(n?.messageIssueTime), url: n?.messageURL || SITE, body: typeof n?.messageBody === 'string' ? n.messageBody.slice(0, 600) : null })).sort((a, b) => (Date.parse(b.time) || 0) - (Date.parse(a.time) || 0))
  return { ...range, type, fetchedAt: r.fetchedAt, cached: r.cached, count: items.length, notifications: items }
}
export async function getSummary(query = {}, refresh = false) {
  const range = parseRange(query), res = await Promise.allSettled(Object.keys(KINDS).map((k) => getEvents(k, range, refresh))), types = {}, events = []
  Object.values(KINDS).forEach((t, i) => {
    const r = res[i]
    if (r.status === 'fulfilled') { types[t] = { status: 'ok', count: r.value.count, latest: r.value.events[0]?.time ?? null, fetchedAt: r.value.fetchedAt, cached: r.value.cached }; events.push(...r.value.events) }
    else types[t] = { status: 'error', count: null, latest: null, error: r.reason instanceof DonkiError ? r.reason.message : 'Unable to retrieve NASA data.', code: r.reason?.status }
  })
  if (Object.values(types).every((t) => t.status === 'error')) { const f = Object.values(types)[0]; throw new DonkiError(f.error, f.code || 502) }
  events.sort((a, b) => (b.t || 0) - (a.t || 0))
  return { source: 'NASA DONKI', ...range, fetchedAt: Date.now(), types, count: events.length, events }
}
