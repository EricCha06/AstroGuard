import { RefreshCw, RotateCw } from 'lucide-react'
import { fmtUTC } from '../data/spaceWeatherInfo'
export default function SpaceWeatherStatus({ status, err, lastOk, cached, onRefresh }) {
  const ok = status === 'ok', bad = status === 'error'
  return (
    <div className="card">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`st ${ok ? 'Within' : bad ? 'Review' : 'Attention'}`}>● {ok ? 'NASA DONKI connected' : bad ? 'Connection failed' : 'Connecting…'}</span>
          <span className="text-xs text-[var(--mu)]">Last successful update: {lastOk ? lastOk.toLocaleTimeString('en-GB') : 'None yet'}{ok && cached ? ' (server cache)' : ''}</span>
        </div>
        <div className="flex gap-2">
          {bad && <button className="btn" onClick={() => onRefresh(false)}><RotateCw size={14} className="mr-1.5 inline" />Retry</button>}
          <button className="btn ghost" disabled={status === 'loading'} onClick={() => onRefresh(true)}><RefreshCw size={14} className={`mr-1.5 inline ${status === 'loading' ? 'animate-spin' : ''}`} />Refresh</button>
        </div>
      </div>
      <p className="mb-0 mt-2 text-xs" role="status" style={{ color: ok ? 'var(--ok)' : bad ? 'var(--cr)' : 'var(--mu)' }}>
        {ok ? 'NASA DONKI data successfully retrieved.' : bad ? `Unable to retrieve NASA data. Please try again.${err ? ' (' + err + ')' : ''}` : 'Retrieving space-weather information from NASA...'}
      </p>
    </div>
  )
}
