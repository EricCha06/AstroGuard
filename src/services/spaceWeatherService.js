// Talks only to AstroGuard's own backend. The NASA API key lives on the server.
export async function fetchSummary({ startDate, endDate, refresh = false }) {
  const q = new URLSearchParams({ startDate, endDate })
  if (refresh) q.set('refresh', '1')
  let res, body = null
  try { res = await fetch(`/api/space-weather/summary?${q}`) } catch { throw new Error('Unable to retrieve NASA data. Please try again.') }
  try { body = await res.json() } catch { /* non-JSON error page */ }
  if (!res.ok || !body) throw new Error(body?.error || 'Unable to retrieve NASA data. Please try again.')
  return body
}
