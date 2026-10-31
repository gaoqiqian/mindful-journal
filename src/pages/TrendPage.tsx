import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import ReactECharts from 'echarts-for-react'
import { analysisApi } from '../api'

type TrendData = {
  dates: string[]
  scores: Array<number | null>
  emotionDistribution: Array<{ emotion: string; cnt: number }>
  diaryCount: number
}

type LoadState = { key: string; data: TrendData | null; error: string }

function trendMessage(scores: Array<number | null>) {
  const valid = scores.filter((value): value is number => typeof value === 'number')
  if (valid.length < 2) return 'More entries can help reveal patterns. One feeling never defines you.'
  const change = valid[valid.length - 1] - valid[0]
  if (change >= 1) return 'Recent scores are higher than at the start. Notice what may have helped.'
  if (change <= -1) return 'Recent scores are lower than at the start. Give yourself a little room to pause.'
  return 'Scores have stayed fairly steady. Your own context matters more than a number.'
}

export default function TrendPage() {
  const [days, setDays] = useState(7)
  const [retry, setRetry] = useState(0)
  const [state, setState] = useState<LoadState | null>(null)
  const requestKey = `${days}-${retry}`

  useEffect(() => {
    let active = true
    analysisApi.trend(days).then((res) => {
      if (active) setState({ key: requestKey, data: res.data, error: '' })
    }).catch((e) => {
      if (active) setState({ key: requestKey, data: null, error: e instanceof Error ? e.message : 'Could not load mood patterns' })
    })
    return () => { active = false }
  }, [days, requestKey])

  const loading = state?.key !== requestKey
  const data = loading ? null : state.data
  const scores = data?.scores || []
  const validScores = scores.filter((value): value is number => typeof value === 'number')
  const average = validScores.length ? (validScores.reduce((sum, value) => sum + value, 0) / validScores.length).toFixed(1) : '—'
  const dist = data?.emotionDistribution || []
  const option = { color: ['#2c8c81'], tooltip: { trigger: 'axis' }, grid: { left: 40, right: 20, top: 30, bottom: 30 }, xAxis: { type: 'category', data: data?.dates || [], axisLine: { lineStyle: { color: '#9bb8b8' } } }, yAxis: { type: 'value', min: -5, max: 5, axisLine: { show: false }, splitLine: { lineStyle: { color: 'rgba(20,54,56,0.08)' } } }, series: [{ name: 'Mood score', type: 'line', smooth: true, connectNulls: false, symbolSize: 8, areaStyle: { color: 'rgba(44,140,129,0.16)' }, data: scores }] }
  const pieOption = { color: ['#2c8c81', '#6fb8a0', '#e9c46a', '#7f9cc7', '#d96f68', '#a59bcf', '#89afa6'], tooltip: { trigger: 'item' }, series: [{ type: 'pie', radius: ['42%', '68%'], data: dist.map((item) => ({ name: item.emotion, value: Number(item.cnt) })), label: { color: '#193534', formatter: '{b}\n{d}%' } }] }

  return <div>
    <div className="eyebrow">NOTICE, WITHOUT JUDGMENT</div><h1 className="page-title">Mood patterns</h1><p className="page-sub">Scores are only a reflection aid. Read them alongside your own words and experiences.</p>
    <div className="period-switch" role="group" aria-label="Choose a time period">{[7, 30].map((value) => <button type="button" key={value} className={`btn ${days === value ? '' : 'secondary'}`} aria-pressed={days === value} onClick={() => setDays(value)}>Last {value} days</button>)}</div>
    {loading ? <p className="journal-loading" role="status">Gathering your pages…</p> : state.error ? <div className="error" role="alert">{state.error} <button type="button" className="journal-retry" onClick={() => setRetry((value) => value + 1)}>Try again</button></div> : data && data.diaryCount === 0 ? <section className="panel trend-insight"><div><div className="eyebrow">A PATTERN BEGINS WITH ONE PAGE</div><h3>There are no entries here yet. Take your time.</h3><p className="muted">Write about a moment. Patterns can emerge over time.</p><Link className="home-all-link" to="/app/diaries/new">Write about today ↗</Link></div></section> : data && <>
      <section className="panel trend-insight"><div><div className="eyebrow">THIS PERIOD</div><h3>{trendMessage(scores)}</h3><p className="muted">Total: {data.diaryCount} entries across {validScores.length} days with entries. Average daily mood score: <strong>{average}</strong> / 5</p></div><div className="trend-badge">{validScores.length}<small>days recorded</small></div></section>
      <div className="grid grid-2" style={{ marginTop: 18 }}><section className="panel"><div className="chart-heading"><div><div className="eyebrow">OVER TIME</div><h3>Mood score over time</h3></div><span className="tag">-5 to 5</span></div><ReactECharts option={option} style={{ height: 320 }} /></section><section className="panel"><div className="eyebrow">FEELINGS YOU NOTICED</div><h3>Main feelings</h3>{dist.length === 0 ? <p className="muted">Not enough data yet</p> : <ReactECharts option={pieOption} style={{ height: 320 }} />}</section></div>
    </>}
  </div>
}
