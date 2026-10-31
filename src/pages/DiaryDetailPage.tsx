import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { diaryApi, type Diary } from '../api'

function displayDate(value: string) {
  return value ? new Date(value).toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : ''
}

export default function DiaryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const diaryId = Number(id)
  const [loaded, setLoaded] = useState<{ id: number; diary: Diary | null; error: string } | null>(null)
  const [error, setError] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    let active = true
    if (!Number.isSafeInteger(diaryId) || diaryId < 1) return
    diaryApi.detail(diaryId).then((res) => {
      if (active) setLoaded({ id: diaryId, diary: res.data, error: '' })
    }).catch((e) => {
      if (active) setLoaded({ id: diaryId, diary: null, error: e instanceof Error ? e.message : 'We could not open this page. Please try again.' })
    })
    return () => { active = false }
  }, [diaryId])

  async function remove() {
    if (!currentDiary || !confirm('Delete this entry? This cannot be undone.')) return
    setDeleting(true)
    setError('')
    try {
      await diaryApi.remove(currentDiary.id)
      navigate('/app/diaries', { replace: true })
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete. Please try again.')
      setDeleting(false)
    }
  }

  const invalidId = !Number.isSafeInteger(diaryId) || diaryId < 1
  const currentDiary = loaded?.id === diaryId ? loaded.diary : null

  return <div className="diary-reading">
    <Link className="diary-reading-back" to="/app/diaries">← Back to my journal</Link>
    {invalidId ? <div className="error" role="alert">This journal link is invalid. <Link to="/app/diaries">Back to journal</Link></div> : loaded?.id !== diaryId ? <p className="journal-loading">Opening this page…</p> : loaded.error ? <div className="error" role="alert">{loaded.error} <Link to="/app/diaries">Back to journal</Link></div> : currentDiary && <>
      <article className="diary-reading-paper">
        <div className="diary-reading-top"><span>THE LITTLE BOOK OF FEELINGS</span><span>PRIVATE BY DEFAULT</span></div>
        <div className="diary-reading-date">{displayDate(currentDiary.createdAt)}</div>
        <h1>{currentDiary.title}</h1>
        <div className="diary-reading-meta"><span>{currentDiary.primaryEmotion || 'A feeling'}</span><span>Mood at the time {currentDiary.moodIntensity}/10</span><span>{currentDiary.privacy === 'SHARED' ? 'Summary marked shareable' : 'Private'}</span></div>
        <div className="diary-reading-content">{currentDiary.content}</div>
        <div className="diary-reading-end" aria-hidden="true">✳</div>
      </article>
      <div className="diary-reading-actions">
        <div><span>This entry stays in this browser's demo storage.</span>{currentDiary.privacy === 'SHARED' && <small>Sharing is simulated. No counselor receives this entry in the demo.</small>}</div>
        <div className="diary-reading-buttons"><Link to={`/app/diaries/${currentDiary.id}/edit`}>Edit page / sharing preference ↗</Link><button type="button" disabled={deleting} onClick={() => void remove()}>{deleting ? 'Deleting…' : 'Delete this page'}</button></div>
      </div>
      {error && <div className="error" role="alert">{error}</div>}
    </>}
  </div>
}
