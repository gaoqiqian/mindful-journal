import { useEffect, useState } from 'react'
import { guidanceApi } from '../api'

const categoryMeta: Record<string, { label: string; icon: string }> = { ARTICLE: { label: 'Reading', icon: '◫' }, EXERCISE: { label: 'Reflection prompts', icon: '◌' }, HOTLINE: { label: 'External support', icon: '☎' }, AUDIO: { label: 'Audio', icon: '♪' } }

export default function ResourcesPage() {
  const [keyword, setKeyword] = useState('')
  const [category, setCategory] = useState('')
  const [list, setList] = useState<any[]>([])
  const [detail, setDetail] = useState<any>(null)
  const [error, setError] = useState('')
  async function load(filters = { keyword, category }) { try { const res = await guidanceApi.resources({ keyword: filters.keyword || undefined, category: filters.category || undefined }); setList(res.data || []) } catch (e: any) { setError(e.message) } }
  useEffect(() => { load() }, [])
  const meta = (item: any) => categoryMeta[item.category] || { label: item.category || 'Resource', icon: '·' }
  return <div>
    <div className="eyebrow">A LITTLE SUPPORT, WHEN YOU NEED IT</div><h1 className="page-title">Your resource shelf</h1><p className="page-sub">Explore short reflections and prompts. Choose what feels useful today.</p>
    {error && <div className="error">{error}</div>}
    <section className="resource-filter"><input className="search-input" placeholder="Search feelings, rest, reflection…" value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && load()} /><div className="category-row"><button className={`filter-chip ${!category ? 'active' : ''}`} onClick={() => { setCategory(''); load({ keyword, category: '' }) }}>All</button>{Object.entries(categoryMeta).map(([value, item]) => <button key={value} className={`filter-chip ${category === value ? 'active' : ''}`} onClick={() => { setCategory(value); load({ keyword, category: value }) }}>{item.icon} {item.label}</button>)}</div><button className="btn" onClick={() => load()}>Search resources</button></section>
    {detail ? <section className="panel resource-detail"><button className="btn secondary" onClick={() => setDetail(null)} style={{ marginBottom: 18 }}>← Back to resources</button><div className="resource-icon">{meta(detail).icon}</div><div className="eyebrow">{meta(detail).label}{detail.emotionTag ? ` · ${detail.emotionTag}` : ''}</div><h1 className="page-title" style={{ fontSize: '1.65rem' }}>{detail.title}</h1><p style={{ whiteSpace: 'pre-wrap', lineHeight: 1.85 }}>{detail.content}</p>{detail.linkUrl && <a href={detail.linkUrl} target="_blank" rel="noreferrer" className="btn">Open external resource</a>}</section> : <div className="grid grid-3" style={{ marginTop: 20 }}>{list.map((r) => <article className="panel resource-card" key={r.id}><div className="resource-icon">{meta(r).icon}</div><div className="tag">{meta(r).label}</div>{r.emotionTag && <span className="tag">{r.emotionTag}</span>}<h3>{r.title}</h3><p className="muted">{r.summary}</p><button className="btn secondary" onClick={() => setDetail(r)}>Read more →</button></article>)}{list.length === 0 && <section className="panel empty-state"><div>⌕</div><h3>No matching resources</h3><p className="muted">Try another keyword, or browse all resources.</p></section>}</div>}
  </div>
}
