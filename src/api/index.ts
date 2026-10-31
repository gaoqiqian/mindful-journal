import api from './client'

export type Role = 'STUDENT' | 'COUNSELOR' | 'ADMIN'

export interface UserInfo {
  userId: number
  username: string
  nickname: string
  role: Role
  token?: string
}

export interface Diary {
  id: number
  title: string
  content: string
  moodIntensity: number
  privacy: string
  primaryEmotion?: string
  emotionScore?: number
  createdAt: string
  tags?: { tag: string; confidence: number }[]
}

export const authApi = {
  login: (username: string, password: string) =>
    api.post('/auth/login', { username, password }) as Promise<{ data: UserInfo & { token: string } }>,
  register: (payload: { email: string; password: string; nickname: string }) =>
    api.post('/auth/register', payload) as Promise<{ data: UserInfo & { token: string } }>,
  me: () => api.get('/auth/me') as Promise<{ data: UserInfo }>,
  changePassword: (currentPassword: string, newPassword: string) => api.put('/auth/password', { currentPassword, newPassword }),
  exportMyData: () => api.get('/auth/data-export') as Promise<{ data: any }>,
  privacyActivity: () => api.get('/auth/privacy-activity') as Promise<{ data: any[] }>,
  deleteMyAccount: (currentPassword: string) => api.delete('/auth/account', { data: { currentPassword } }),
}

export const diaryApi = {
  list: () => api.get('/diaries') as Promise<{ data: Diary[] }>,
  detail: (id: number) => api.get(`/diaries/${id}`) as Promise<{ data: Diary }>,
  create: (payload: Partial<Diary> & { title: string; content: string }) =>
    api.post('/diaries', payload) as Promise<{ data: Diary; message: string }>,
  update: (id: number, payload: Partial<Diary>) =>
    api.put(`/diaries/${id}`, payload) as Promise<{ data: Diary }>,
  remove: (id: number) => api.delete(`/diaries/${id}`),
}

export const analysisApi = {
  trend: (days = 7) => api.get(`/analysis/trend?days=${days}`) as Promise<{ data: any }>,
  overview: () => api.get('/analysis/overview') as Promise<{ data: any }>,
}

export const guidanceApi = {
  recommend: (emotionTag?: string) =>
    api.get('/guidance/recommend', { params: { emotionTag } }) as Promise<{ data: any }>,
  resources: (params?: { category?: string; emotionTag?: string; keyword?: string }) =>
    api.get('/resources', { params }) as Promise<{ data: any[] }>,
  resourceDetail: (id: number) => api.get(`/resources/${id}`) as Promise<{ data: any }>,
}

export const assessmentApi = {
  list: () => api.get('/assessments') as Promise<{ data: any[] }>,
  detail: (id: number) => api.get(`/assessments/${id}`) as Promise<{ data: any }>,
  submit: (assessmentId: number, answers: Record<string, number>) =>
    api.post('/assessments/submit', { assessmentId, answers }) as Promise<{ data: any }>,
  history: () => api.get('/assessments/history/me') as Promise<{ data: any[] }>,
}

export const counselorApi = {
  alerts: (status?: string) =>
    api.get('/counselor/alerts', { params: { status } }) as Promise<{ data: any[] }>,
  handleAlert: (id: number, payload: { status: string; handleNote?: string }) =>
    api.put(`/counselor/alerts/${id}`, payload) as Promise<{ data: any }>,
  assignAlert: (id: number, payload: { counselorId: number; dueAt?: string }) =>
    api.put(`/counselor/alerts/${id}/assignment`, payload) as Promise<{ data: any }>,
  overdueAlerts: () => api.get('/counselor/alerts/overdue') as Promise<{ data: any[] }>,
  alertTimeline: (id: number) => api.get(`/counselor/alerts/${id}/timeline`) as Promise<{ data: any[] }>,
  alertOperations: () => api.get('/counselor/alerts/operations') as Promise<{ data: any }>,
  studentSummary: (id: number) =>
    api.get(`/counselor/students/${id}/summary`) as Promise<{ data: any }>,
}

export const adminApi = {
  overview: () => api.get('/admin/overview') as Promise<{ data: any }>,
  integrationStatus: () => api.get('/admin/integration-status') as Promise<{ data: any }>,
  schoolContacts: () => api.get('/admin/school-contacts') as Promise<{ data: any[] }>,
  saveSchoolContact: (item: any) => item.id ? api.put('/admin/school-contacts/' + item.id, item) : api.post('/admin/school-contacts', item),
  deleteSchoolContact: (id: number) => api.delete('/admin/school-contacts/' + id),
  users: () => api.get('/admin/users') as Promise<{ data: any[] }>,
  updateStatus: (id: number, status: number) =>
    api.put(`/admin/users/${id}/status?status=${status}`),
  updateRole: (id: number, role: Role) =>
    api.put(`/admin/users/${id}/role?role=${role}`),
  resources: () => api.get('/admin/resources') as Promise<{ data: any[] }>,
  saveResource: (item: any) =>
    item.id
      ? (api.put(`/admin/resources/${item.id}`, item) as Promise<{ data: any }>)
      : (api.post('/admin/resources', item) as Promise<{ data: any }>),
  deleteResource: (id: number) => api.delete(`/admin/resources/${id}`),
}
