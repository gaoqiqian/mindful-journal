import { useEffect, useState } from 'react'
import { guidanceApi } from '../api'

export default function SupportPage() {
  const [hotlines, setHotlines] = useState<any[]>([])
  const [error, setError] = useState('')
  useEffect(() => { guidanceApi.resources({ category: 'HOTLINE' }).then((res) => setHotlines(res.data || [])).catch((e) => setError(e.message)) }, [])
  return <div>
    <div className="eyebrow">REAL-WORLD SUPPORT</div><h1 className="page-title">You do not have to face this alone</h1><p className="page-sub">If you feel unsafe, seek real-world help from someone who can be with you or from local emergency services.</p>
    <section className="support-urgent"><div className="support-symbol">✦</div><div><h3>Put your immediate safety first</h3><ol className="steps"><li>Move away from anything that could hurt you and try to stay with someone.</li><li>Reach out to someone you trust and tell them you need company.</li><li>If there is immediate danger, contact local emergency services or go to the nearest emergency department.</li></ol></div></section>
    {error && <div className="error" style={{ marginTop: 16 }}>{error}</div>}
    <div className="grid grid-2" style={{ marginTop: 18 }}><section className="panel"><div className="eyebrow">ON CAMPUS</div><h3>University support service</h3><p className="muted">Use your university's official website to find its support service. No university service is connected to this demo. Do not rely on an online message in an emergency.</p></section><section className="panel"><div className="eyebrow">EXTERNAL SUPPORT</div><h3>Support resources</h3>{hotlines.length === 0 ? <p className="muted">No local support contacts are configured in this demo. In an emergency, contact local emergency services directly.</p> : hotlines.map((item) => <div className="list-item" key={item.id}><strong>{item.title}</strong><p className="muted">{item.summary}</p>{item.linkUrl && <a className="btn secondary" href={item.linkUrl} target="_blank" rel="noreferrer">View contact information</a>}</div>)}</section></div>
    <p className="tiny-note">Mindful Journal is a reflection prototype. It does not provide medical diagnosis, monitoring or crisis response.</p>
  </div>
}
