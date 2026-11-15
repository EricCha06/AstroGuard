import * as L from 'lucide-react'
import { SW, TYPES, fmtUTC } from '../data/spaceWeatherInfo'
export default function SpaceWeatherSummary({ types, events, loading }) {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-4">
      {TYPES.map((t) => {
        const info = SW[t], Icon = L[info.icon], st = types?.[t], list = events.filter((e) => e.type === t), failed = st?.status === 'error'
        return (
          <div key={t} className="card" style={{ borderColor: failed ? 'var(--cr)' : undefined }}>
            <div className="flex items-center justify-between text-[13px] text-[var(--mu)]"><span>{info.plural}</span><Icon size={20} color={info.color} /></div>
            <div className="my-2 text-[32px] font-bold">{loading || failed || !st ? '–' : list.length}<small className="ml-1 text-[13px] font-normal text-[var(--mu)]">events</small></div>
            <div className="text-xs text-[var(--mu)]">Latest: {failed || !list.length ? 'Not available' : fmtUTC(list[0].time)}</div>
            <div className="text-xs text-[var(--mu)]">Category: {info.label}</div>
            <div className="mt-2"><span className={`st ${loading ? 'Attention' : failed ? 'Review' : 'Within'}`}>● {loading ? 'Retrieving…' : failed ? 'Retrieval failed' : 'Retrieved'}</span></div>
            {failed && <div className="err">{st.error}</div>}
          </div>
        )
      })}
    </div>
  )
}
