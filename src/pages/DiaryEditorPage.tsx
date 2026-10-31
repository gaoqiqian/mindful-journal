import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { diaryApi, type Diary } from '../api'

const prompts = ['One thing on my mind today is…', 'In my body, this feels like…', 'What I need right now is…']
const riskPattern = /suicid|self.harm|kill myself|end my life|hurt myself|hopeless/i

export default function DiaryEditorPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const editing = id !== undefined
  const diaryId = Number(id)
  const [params] = useSearchParams()
  const [form, setForm] = useState(() => {
    const selected = Number(params.get('mood'))
    return { title: '', content: '', moodIntensity: Number.isInteger(selected) && selected >= 1 && selected <= 10 ? selected : 5, privacy: 'PRIVATE' }
  })
  const [error, setError] = useState('')
  const [loadError, setLoadError] = useState<{ id: number; message: string } | null>(null)
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [loadedId, setLoadedId] = useState<number | null>(null)
  const riskDetected = riskPattern.test(`${form.title} ${form.content}`)
  useEffect(() => {
    if (!editing) return
    let active = true
    if (!Number.isSafeInteger(diaryId) || diaryId < 1) return
    diaryApi.detail(diaryId).then((res) => {
      if (active) {
        const diary: Diary = res.data
        setForm({ title: diary.title, content: diary.content, moodIntensity: diary.moodIntensity, privacy: diary.privacy })
        setLoadedId(diaryId)
      }
    }).catch((e) => {
      if (active) setLoadError({ id: diaryId, message: e instanceof Error ? e.message : 'We could not open this page. Please try again.' })
    })
    return () => { active = false }
  }, [editing, diaryId])

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (editing) {
        await diaryApi.update(diaryId, form)
        navigate(`/app/diaries/${diaryId}`, { replace: true })
      } else {
        const res = await diaryApi.create(form)
        setResult(res.data)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save. Please try again.')
    } finally {
      setLoading(false)
    }
  }
  const addPrompt = (prompt: string) => setForm((old) => {
    const next = old.content ? `${old.content}\n\n${prompt}` : prompt
    return next.length <= 10000 ? { ...old, content: next } : old
  })

  if (editing && (!Number.isSafeInteger(diaryId) || diaryId < 1)) return <div className="error" role="alert">This journal link is invalid. <Link to="/app/diaries">Back to journal</Link></div>
  if (editing && loadedId !== diaryId) return loadError?.id === diaryId ? <div className="error" role="alert">{loadError.message} <Link to="/app/diaries">Back to journal</Link></div> : <p className="journal-loading">Opening this page…</p>

  if (result) return <div>
    <div className="eyebrow">YOUR PAGE IS SAVED</div><h1 className="page-title">You made space for yourself.</h1><p className="page-sub">A gentle reflection on this moment, rather than a conclusion about you.</p>
    <section className="panel result-hero"><div className="eyebrow">THIS REFLECTION</div><h3>{result.title}</h3><div className="result-score">{result.primaryEmotion || 'Calm'}</div><p className="muted">Mood score {result.emotionScore ?? '—'} · A score is a reflection aid, never a judgment.</p><div>{(result.tags || []).map((t: any) => <span className="tag" key={t.tag}>{t.tag} · {(t.confidence * 100).toFixed(0)}% rule weight (not probability)</span>)}</div></section>
    {riskPattern.test(`${result.title || ''} ${result.content || ''}`) && <section className="panel safety-card" style={{ marginTop: 16 }}><h3>You do not have to face this alone</h3><p>If you feel at risk of harming yourself, reach out to a trusted person, your university support service or local emergency services. This journal cannot provide immediate help.</p></section>}
    <section className="panel support-card" style={{ marginTop: 16 }}><div className="eyebrow">ONE SMALL NEXT STEP</div><h3>Take a quiet moment</h3><p className="muted">Pause and notice your surroundings. Choose one small, manageable thing to do next.</p><div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}><button className="btn" onClick={() => navigate(`/app/guidance?tag=${encodeURIComponent(result.primaryEmotion || '')}`)}>Explore self-care prompts</button><button className="btn secondary" onClick={() => navigate('/app/diaries')}>Back to my entries</button></div></section>
  </div>

  return <div className="writing-page">
    <div className="writing-layout">
      <aside className="writing-intro"><span className="writing-overline">{editing ? 'REVISIT THIS PAGE · READ IT AGAIN' : 'A NEW PAGE · A NOTE TO YOURSELF'}</span><h1>{editing ? <>Make changes<br /><i>whenever you like.</i></> : <>This page<br /><i>can be imperfect.</i></>}</h1><p>{editing ? 'Your words belong to you. Add a thought or change the sharing preference.' : 'Put a little of today on the page: a moment, a thought, or a feeling you cannot quite name.'}</p><div className="writing-side-note"><span aria-hidden="true">✳</span><p>Honest words matter more than polished ones.</p></div><Link to={editing ? `/app/diaries/${diaryId}` : '/app/diaries'}>← {editing ? 'Back to this page' : 'Back to my journal'}</Link></aside>
      <div>
        {error && <div className="error" role="alert">{error}</div>}
        {riskDetected && <div className="error" role="alert">If these words reflect how you feel right now, consider reaching out to someone you trust or local emergency services if you feel unsafe. This demo does not notify anyone.<Link to="/app/support">Find support →</Link></div>}
        <form className="writing-paper" onSubmit={onSubmit}>
          <div className="writing-paper-head"><span>MINDFUL JOURNAL / {editing ? 'EDIT PAGE' : 'NEW ENTRY'}</span><span>YOUR WORDS, YOUR CHOICE</span></div>
          <div className="field"><label htmlFor="diary-title">A title for today</label><input id="diary-title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} maxLength={128} required placeholder="For example: The evening before my exam" /></div>
          <div className="field"><label htmlFor="diary-content">What happened? How did you feel?</label><textarea id="diary-content" rows={9} value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} maxLength={10000} required placeholder="Start with whatever you want to say…" /><span className="writing-count">{form.content.length} / 10000 characters</span></div>
          <div className="writing-prompt-label">Need a starting point? Try a prompt.</div><div className="writing-prompts">{prompts.map((prompt) => <button type="button" key={prompt} onClick={() => addPrompt(prompt)}>{prompt} ↗</button>)}</div>
          <div className="writing-settings"><div className="field"><label htmlFor="diary-mood">How you feel overall <strong>{form.moodIntensity}/10</strong></label><input id="diary-mood" type="range" min={1} max={10} value={form.moodIntensity} onChange={(e) => setForm({ ...form, moodIntensity: Number(e.target.value) })} /><div className="range-caption"><span>Very difficult</span><span>Somewhere in between</span><span>Very good</span></div></div><div className="field"><label htmlFor="diary-privacy">Sharing preference</label><select id="diary-privacy" value={form.privacy} onChange={(e) => setForm({ ...form, privacy: e.target.value })}><option value="PRIVATE">Private</option><option value="SHARED">Mark a summary as shareable (demo only)</option></select></div></div>
          <p className="writing-privacy-note">This browser demo never sends entries or alerts to a counselor. The sharing setting demonstrates the original application's consent workflow only.</p>
          <button className="writing-submit" disabled={loading}>{loading ? 'Saving your page…' : editing ? 'Save changes' : 'Save and reflect'} <span aria-hidden="true">↗</span></button>
        </form>
      </div>
    </div>
  </div>
}
