import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { analysisApi } from '../api'
import type { Diary } from '../api'
import { useAuth } from '../auth/AuthContext'

const moods = [
  { value: 2, icon: '☁', label: 'Low' },
  { value: 4, icon: '☾', label: 'Tired' },
  { value: 5, icon: '◌', label: 'Calm' },
  { value: 7, icon: '✿', label: 'Good' },
  { value: 9, icon: '☀', label: 'Happy' },
]

export default function HomePage() {
  const { user } = useAuth()
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState('')
  const [selectedMood, setSelectedMood] = useState<number | null>(null)

  useEffect(() => { analysisApi.overview().then((res) => setData(res.data)).catch((e) => setError(e.message)) }, [])

  const recent: Diary[] = data?.recentDiaries || []
  const trend = data?.trend7
  const average = trend?.avgScore
  const insight = trend?.diaryCount === 0 || average == null
    ? 'There is no need to tell the whole story. One sentence is a beginning.'
    : average >= 1
      ? 'There were brighter moments this week. Keep a little space for the things that helped.'
      : 'This week may have been difficult. One small act of kindness toward yourself is enough.'

  return <div className="home-page">
    <section className="home-lead">
      <div className="home-lead-copy"><span className="home-overline">WELCOME BACK · A little room for today</span><h1>Hello, {user?.nickname}.<br /><i>Take today at your own pace.</i></h1><p>No perfect answers needed. There is room here for every feeling.</p><Link to="/app/diaries/new" className="home-write-link">Write a page for today <span aria-hidden="true">↗</span></Link></div>
      <div className="home-lead-art" aria-hidden="true"><div className="home-art-circle"><span>one day<br />at a time</span></div><div className="home-art-flower">✿</div><div className="home-art-stroke">⌒</div><div className="home-art-caption">One page a day. No need for perfection.</div></div>
    </section>

    {error && <div className="error" role="alert" style={{ marginTop: 18 }}>{error}</div>}

    <section className="home-checkin" aria-labelledby="home-checkin-title">
      <div className="home-section-label"><span>01 / RIGHT NOW</span><span>TAKE A PAUSE</span></div>
      <div className="home-checkin-content"><div><h2 id="home-checkin-title">What is your inner weather?</h2><p>Choose a feeling. Then decide whether to write about it.</p></div><div className="home-mood-list">{moods.map((mood) => <button type="button" key={mood.value} className={selectedMood === mood.value ? 'selected' : ''} aria-pressed={selectedMood === mood.value} onClick={() => setSelectedMood(mood.value)}><span aria-hidden="true">{mood.icon}</span><small>{mood.label}</small></button>)}</div></div>
      <div className="home-checkin-foot"><span>This check-in stays on this page unless you write an entry.</span>{selectedMood !== null && <Link to={`/app/diaries/new?mood=${selectedMood}`}>Write with this feeling ↗</Link>}</div>
    </section>

    <div className="home-columns">
      <section className="home-week" aria-labelledby="home-week-title"><div className="home-section-label"><span>02 / LOOKING BACK</span><span>THIS WEEK</span></div><h2 id="home-week-title">Your week, in pages</h2><div className="home-week-number"><strong>{trend?.diaryCount ?? '—'}</strong><span>entries<br />Every one counts</span></div><p>{insight}</p><Link to="/app/trend">Explore your mood patterns ↗</Link></section>
      <section className="home-recent" aria-labelledby="home-recent-title"><div className="home-section-label"><span>03 / KEEPING MOMENTS</span><span>RECENT PAGES</span></div><h2 id="home-recent-title">Recent pages</h2>{recent.length === 0 ? <div className="home-no-pages"><span aria-hidden="true">✎</span><p>Your first page is waiting for you.</p><Link to="/app/diaries/new">Start with “Today, I…” ↗</Link></div> : <div className="home-recent-list">{recent.slice(0, 2).map((diary, index) => <div key={diary.id}><span>{String(index + 1).padStart(2, '0')}</span><div><Link to={`/app/diaries/${diary.id}`}><strong>{diary.title}</strong></Link><p>{(diary.content || '').slice(0, 76)}{(diary.content || '').length > 76 ? '…' : ''}</p></div></div>)}</div>}<Link className="home-all-link" to="/app/diaries">Open your journal ↗</Link></section>
    </div>
  </div>
}
