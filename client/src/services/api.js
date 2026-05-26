import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' }
})

api.interceptors.request.use(config => {
  const token = localStorage.getItem('vt_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('vt_token')
      localStorage.removeItem('vt_user')
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export const authAPI = {
  register: d => api.post('/auth/register', d),
  login: d => api.post('/auth/login', d),
  me: () => api.get('/auth/me'),
  changePassword: d => api.post('/auth/change-password', d)
}

export const stackAPI = {
  getAll: () => api.get('/stack'),
  add: d => api.post('/stack', d),
  update: (id, d) => api.put(`/stack/${id}`, d),
  delete: id => api.delete(`/stack/${id}`)
}

export const cveAPI = {
  scan: () => api.post('/cve/scan'),
  getResults: (params = '') => api.get(`/cve/results${params}`),
  getStats: () => api.get('/cve/stats'),
  markRead: id => api.patch(`/cve/${id}/read`),
  markAllRead: () => api.patch('/cve/read-all')
}

export const projectAPI = {
  getAll: () => api.get('/projects'),
  create: d => api.post('/projects', d),
  update: (id, d) => api.put(`/projects/${id}`, d),
  delete: id => api.delete(`/projects/${id}`),
  getRiskScore: () => api.get('/projects/risk-score')
}

export const exportAPI = {
  csv: () => api.get('/export/csv', { responseType: 'blob' }),
  json: () => api.get('/export/json', { responseType: 'blob' }),
  history: () => api.get('/export/history')
}

export const settingsAPI = {
  get: () => api.get('/settings'),
  save: d => api.post('/settings', d),
  parseFile: d => api.post('/settings/parse-file', d)
}

export default api
