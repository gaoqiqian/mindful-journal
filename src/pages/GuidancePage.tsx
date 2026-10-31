import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { guidanceApi } from '../api'

const TAGS = ['Anxious', 'Low mood', 'Angry', 'Tired', 'Happy', 'Lonely', 'Stressed']

export default function GuidancePage() {
  const [params] = useSearchParams()
  const [tag, setTag] = useState(params.get('tag') || 'Anxious')
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    guidanceApi
      .recommend(tag)
      .then((res) => setData(res.data))
      .catch((e) => setError(e.message))
  }, [tag])

  return (
    <div>
      <div className="eyebrow">START SMALL, START HERE</div>
      <h1 className="page-title">A little space for self-care</h1>
      <p className="page-sub">Choose a short reflection prompt for the feeling closest to yours. There is no need to feel better on demand.</p>
      {error && <div className="error">{error}</div>}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {TAGS.map((t) => (
          <button key={t} className={`btn ${tag === t ? '' : 'secondary'}`} onClick={() => setTag(t)}>
            {t}
          </button>
        ))}
      </div>
      <div className="grid grid-2">
        {(data?.plans || []).map((p: any) => (
          <div className="panel practice-card" key={p.id}>
            <div className="tag">{p.technique}</div>
            <h3 style={{ marginTop: 10 }}>{p.title}</h3>
            <p className="muted">{p.summary}</p>
            <ol className="steps">
              {(p.steps || []).map((s: string, idx: number) => (
                <li key={idx}>{s}</li>
              ))}
            </ol>
          </div>
        ))}
      </div>
      <div className="panel" style={{ marginTop: 16 }}>
        <div className="eyebrow">EXPLORE A LITTLE MORE</div>
        <h3>Related resources</h3>
        {(data?.resources || []).length === 0 && <p className="muted">No matching resources yet</p>}
        {(data?.resources || []).map((r: any) => (
          <div className="list-item" key={r.id}>
            <strong>{r.title}</strong>
            <div className="muted">{r.summary}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
