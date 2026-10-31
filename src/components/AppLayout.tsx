import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

type NavItem = { to: string; label: string; icon: string; end?: boolean }

const studentLinks: NavItem[] = [
  { to: '/app', end: true, label: 'Today', icon: '⌂' },
  { to: '/app/diaries', end: true, label: 'My journal', icon: '▤' },
  { to: '/app/diaries/new', label: 'Write a page', icon: '✎' },
  { to: '/app/trend', label: 'Mood patterns', icon: '◔' },
  { to: '/app/guidance', label: 'Self-care', icon: '✳' },
  { to: '/app/assessments', label: 'Check-in', icon: '◫' },
  { to: '/app/resources', label: 'Resources', icon: '▦' },
  { to: '/app/support', label: 'Find support', icon: '♡' },
]

const counselorLinks: NavItem[] = [
  { to: '/app/counselor/alerts', label: 'Alert follow-up', icon: '◉' },
  { to: '/app/resources', label: 'Resources', icon: '▦' },
  { to: '/app/support', label: 'Find support', icon: '♡' },
  { to: '/app/account', label: 'Account & data', icon: '⚙' },
]

const adminLinks: NavItem[] = [
  { to: '/app/admin', end: true, label: 'System overview', icon: '⌂' },
  { to: '/app/admin/users', label: 'Users', icon: '♧' },
  { to: '/app/admin/resources', label: 'Manage resources', icon: '▦' },
  { to: '/app/admin/school-contacts', label: 'School settings', icon: '⌘' },
  { to: '/app/support', label: 'Support', icon: '♡' },
  { to: '/app/account', label: 'Account & data', icon: '⚙' },
]

export default function AppLayout() {
  const { user, logout, isRole } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const readingDiary = /^\/app\/diaries\/\d+(?:\/edit)?$/.test(location.pathname)

  useEffect(() => { window.scrollTo(0, 0) }, [location.pathname])

  function signOut() {
    logout()
    navigate('/login')
  }

  if (isRole('STUDENT')) {
    return (
      <div className="student-shell">
        <a className="skip-link" href="#" onClick={e => { e.preventDefault(); document.getElementById("main-content")?.focus() }}>Skip to content</a>
        <header className="student-header">
          <div className="student-header-inner">
            <NavLink to="/app" className="student-wordmark" aria-label="Mindful Journal home"><span aria-hidden="true">✳</span><strong>Mindful Journal</strong><small>YOUR QUIET PLACE</small></NavLink>
            <nav className="student-nav" aria-label="Main navigation">
              {studentLinks.map((item) => <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => `student-nav-link${isActive || (item.to === '/app/diaries' && readingDiary) ? ' active' : ''}`}>{item.label}</NavLink>)}
            </nav>
            <div className="student-account"><NavLink to="/app/account" className="student-avatar" aria-label="Account & data">{Array.from(user?.nickname || 'Me')[0]}</NavLink><button type="button" onClick={signOut}>Sign out</button></div>
          </div>
        </header>
        <main className="student-main" id="main-content" tabIndex={-1}><Outlet /></main>
        <footer className="student-footer"><span>Mindful Journal · A place to pause with your feelings</span><Link to="/app/support">Find support here ↗</Link></footer>
      </div>
    )
  }

  const links = isRole('ADMIN') ? adminLinks : counselorLinks
  const roleLabel = isRole('ADMIN') ? 'Administrator' : 'Counselor'

  return (
    <div className="app-shell">
      <a className="skip-link" href="#" onClick={e => { e.preventDefault(); document.getElementById("main-content")?.focus() }}>Skip to content</a>
      <aside className="sidebar">
        <div className="brand sidebar-brand">
          <span className="brand-mark" aria-hidden="true">✿</span>
          <span>Mindful Journal<small>Make space for yourself</small></span>
        </div>
        <nav className="nav-list" aria-label="Main navigation">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon" aria-hidden="true">{l.icon}</span>
              <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">
          <div className="role-label">
            {user?.nickname} · {roleLabel}
          </div>
          <button
            className="btn ghost"
            onClick={signOut}
          >
            Sign out
          </button>
        </div>
      </aside>
      <main className="main" id="main-content" tabIndex={-1}>
        <Outlet />
      </main>
    </div>
  )
}
