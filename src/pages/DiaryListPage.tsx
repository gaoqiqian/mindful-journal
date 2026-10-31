import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { diaryApi } from '../api'
import type { Diary } from '../api'

type DiaryFilter = 'ALL' | 'PRIVATE' | 'SHARED'

const emotionMarks: Record<string, string> = {
  Happy: '☀', Calm: '✿', Anxious: '◕', Tired: '☾', Sad: '☂', Angry: '✳', Stressed: '◔',
}

function diaryDate(value: string) {
  const [date = '', time = ''] = (value || '').replace('T', ' ').split(' ')
  return `${date.replaceAll('-', '.')} ${time.slice(0, 5)}`.trim()
}

export default function DiaryListPage() {
  const [list, setList] = useState<Diary[]>([])
  const [filter, setFilter] = useState<DiaryFilter>('ALL')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  async function load() {
    setLoading(true)
    try {
      const res = await diaryApi.list()
      setList(res.data || [])
      setError('')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not load your journal. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { void load() }, [])

  async function remove(id: number) {
    if (!confirm('Delete this entry? This cannot be undone.')) return
    try {
      await diaryApi.remove(id)
      await load()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not delete. Please try again.')
    }
  }

  const visible = filter === 'ALL' ? list : list.filter((diary) => filter === 'PRIVATE' ? diary.privacy !== 'SHARED' : diary.privacy === 'SHARED')
  const privateCount = list.filter((diary) => diary.privacy !== 'SHARED').length
  const sharedCount = list.length - privateCount
  const filters: { value: DiaryFilter; label: string; count: number }[] = [
    { value: 'ALL', label: 'All pages', count: list.length },
    { value: 'PRIVATE', label: 'Private pages', count: privateCount },
    { value: 'SHARED', label: 'Shareable pages', count: sharedCount },
  ]

  return (
    <div className="journal-page">
      <section className="journal-cover" aria-labelledby="journal-title">
        <div className="journal-cover-top"><span>THE LITTLE BOOK OF FEELINGS</span><span>VOL. 01 / MINDFUL JOURNAL</span></div>
        <div className="journal-cover-content">
          <div className="journal-cover-copy">
            <span className="journal-overline">A page for your feelings</span>
            <h1 id="journal-title">One day,<br /><i>one page at a time.</i></h1>
            <p>Some words are just for you. Keep the joy, the tiredness, and everything in between here.</p>
            <Link to="/app/diaries/new" className="journal-primary-link">Write about today <span aria-hidden="true">↗</span></Link>
          </div>
          <div className="journal-cover-art" aria-hidden="true">
            <div className="journal-cover-sun">✳</div>
            <div className="journal-art-book"><div className="journal-art-page left"><span>dear me,</span><i /><i /><i /></div><div className="journal-art-page right"><b>✿</b><i /><i /><small>today is a new page</small></div></div>
            <div className="journal-art-note">Every page<br />counts.<span>♡</span></div>
          </div>
        </div>
        <div className="journal-cover-bottom"><span>PRIVATE BY DEFAULT</span><span>Your story. Your choice.</span><span aria-hidden="true">↓ Explore below</span></div>
      </section>

      <div className="journal-layout">
        <aside className="journal-index" aria-label="Journal index">
          <div className="journal-index-top"><span>INDEX</span><strong>{String(list.length).padStart(2, '0')}</strong></div>
          <h2>My pages</h2>
          <p>Which moment would you like to revisit?</p>
          <div className="journal-filter-list" role="group" aria-label="Filter by sharing preference">
            {filters.map((item) => <button key={item.value} type="button" className={filter === item.value ? 'active' : ''} aria-pressed={filter === item.value} onClick={() => setFilter(item.value)}><span>{item.label}</span><small>{String(item.count).padStart(2, '0')}</small></button>)}
          </div>
          <div className="journal-index-note"><span aria-hidden="true">✦</span><p>This is a place to understand yourself,<br />one feeling at a time.</p></div>
        </aside>

        <section className="journal-content" aria-label="Journal entries">
          <div className="journal-content-head"><div><span>YOUR STORIES · {filter === 'ALL' ? 'ALL' : filter}</span><h2>{filter === 'ALL' ? 'Every page means something.' : filter === 'PRIVATE' ? 'Pages just for you.' : 'Moments marked shareable.'}</h2></div><span className="journal-content-count">Total: {visible.length} entries</span></div>
          {error && <div className="error" role="alert">{error}{list.length === 0 && <button className="journal-retry" type="button" onClick={() => void load()}>Try again</button>}</div>}
          {loading ? <div className="journal-loading">Opening your journal…</div> : error && list.length === 0 ? null : visible.length === 0 ? (
            <div className="journal-empty">
              <div className="journal-empty-paper" aria-hidden="true"><div className="journal-empty-pin">✳</div><span>DATE ________</span><i /><i /><i /><i /><b>write your first line here.</b></div>
              <div className="journal-empty-copy"><span>AN OPEN PAGE</span><h3>{list.length === 0 ? 'Your first page starts here.' : 'This chapter is still open.'}</h3><p>{list.length === 0 ? 'A sentence or a small moment is a good place to begin.' : 'Try another filter, or leave a page for today.'}</p><Link to="/app/diaries/new">Write your first line <span aria-hidden="true">↗</span></Link></div>
            </div>
          ) : (
            <div className="journal-entries">
              {visible.map((diary, index) => <article className="journal-entry" key={diary.id}>
                <div className="journal-entry-rail"><span>{String(index + 1).padStart(2, '0')}</span><i /></div>
                <div className="journal-entry-body">
                  <div className="journal-entry-meta"><time>{diaryDate(diary.createdAt)}</time><span>{diary.privacy === 'SHARED' ? 'Summary marked shareable' : 'Private entry'}</span></div>
                  <div className="journal-entry-main"><div><h3><Link to={`/app/diaries/${diary.id}`}>{diary.title}</Link></h3><p>{(diary.content || '').slice(0, 150)}{(diary.content || '').length > 150 ? '…' : ''}</p></div><span className="journal-emotion-mark" aria-label={`Main feeling: ${diary.primaryEmotion || 'Not classified'}`}>{emotionMarks[diary.primaryEmotion || ''] || '✧'}</span></div>
                  <div className="journal-entry-foot"><div className="journal-entry-tags"><span>{diary.primaryEmotion || 'A feeling'}</span>{(diary.tags || []).filter((tag) => tag.tag !== diary.primaryEmotion).slice(0, 2).map((tag) => <span key={tag.tag}>{tag.tag}</span>)}</div><div className="journal-entry-actions"><Link to={`/app/diaries/${diary.id}`}>Read this page ↗</Link><Link to={`/app/diaries/${diary.id}/edit`}>Edit</Link><button type="button" onClick={() => void remove(diary.id)} aria-label={`Delete entry: ${diary.title}`}>Delete</button></div></div>
                </div>
              </article>)}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
