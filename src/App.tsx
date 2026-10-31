import { lazy,Suspense } from 'react'
import { HashRouter,Navigate,Route,Routes } from 'react-router-dom'
import { AuthProvider } from './auth/AuthContext'
import { RequireAuth } from './auth/RequireAuth'
import AppLayout from './components/AppLayout'
const LoginPage=lazy(()=>import('./pages/LoginPage'))
const HomePage=lazy(()=>import('./pages/HomePage'))
const DiaryEditorPage=lazy(()=>import('./pages/DiaryEditorPage'))
const DiaryListPage=lazy(()=>import('./pages/DiaryListPage'))
const DiaryDetailPage=lazy(()=>import('./pages/DiaryDetailPage'))
const TrendPage=lazy(()=>import('./pages/TrendPage'))
const GuidancePage=lazy(()=>import('./pages/GuidancePage'))
const AssessmentPage=lazy(()=>import('./pages/AssessmentPage'))
const ResourcesPage=lazy(()=>import('./pages/ResourcesPage'))
const SupportPage=lazy(()=>import('./pages/SupportPage'))
const AccountPage=lazy(()=>import('./pages/AccountPage'))
export default function App(){return <AuthProvider><HashRouter><div className="demo-notice">ENGLISH INTERACTIVE DEMO · Fictional samples · Browser-local entries · Keyword analysis, no live AI or counselor</div><Suspense fallback={<div className="page-loading">Opening your page…</div>}><Routes><Route path="/login" element={<LoginPage/>}/><Route element={<RequireAuth/>}><Route path="/app" element={<AppLayout/>}><Route index element={<HomePage/>}/><Route path="diaries" element={<DiaryListPage/>}/><Route path="diaries/new" element={<DiaryEditorPage/>}/><Route path="diaries/:id" element={<DiaryDetailPage/>}/><Route path="diaries/:id/edit" element={<DiaryEditorPage/>}/><Route path="trend" element={<TrendPage/>}/><Route path="guidance" element={<GuidancePage/>}/><Route path="assessments" element={<AssessmentPage/>}/><Route path="resources" element={<ResourcesPage/>}/><Route path="support" element={<SupportPage/>}/><Route path="account" element={<AccountPage/>}/></Route></Route><Route path="*" element={<Navigate to="/app" replace/>}/></Routes></Suspense></HashRouter></AuthProvider>}
