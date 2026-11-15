
const API_BASE_URL = 'https://astroguard-rpy3.onrender.com';

export async function fetchSummary({ startDate, endDate, refresh = false }) {
  const q = new URLSearchParams({ startDate, endDate });

  if (refresh) q.set('refresh', '1');

  let res, body = null;

  try {
    res = await fetch(`${API_BASE_URL}/api/space-weather/summary?${q}`);
  } catch {
    throw new Error('Unable to retrieve NASA data. Please try again.');
  }

  try {
    body = await res.json();
  } catch {
    // Non-JSON error response
  }

  if (!res.ok || !body) {
    throw new Error(body?.error || 'Unable to retrieve NASA data. Please try again.');
  }

  return body;
}

