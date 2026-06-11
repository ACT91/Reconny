import axios from 'axios'
import type { Job, Project, ScanResults } from '@/types'

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Scan APIs
export const scanApi = {
  startScan: async (data: { target_domain: string; user_id: string; project_id?: string }) => {
    const response = await api.post<{ job_id: string; status: string; message: string }>('/scan/start', data)
    return response.data
  },

  getScanStatus: async (jobId: string) => {
    const response = await api.get<Job>(`/scan/${jobId}`)
    return response.data
  },

  getScanLogs: async (jobId: string) => {
    const response = await api.get<{ job_id: string; logs: string }>(`/scan/${jobId}/logs`)
    return response.data
  },

  getScanResults: async (jobId: string) => {
    const response = await api.get<ScanResults>(`/results/${jobId}`)
    return response.data
  },
}

// Project APIs
export const projectApi = {
  createProject: async (data: { user_id: string; name: string; description?: string }) => {
    const response = await api.post<Project>('/projects', data)
    return response.data
  },

  listProjects: async (userId: string) => {
    const response = await api.get<Project[]>('/projects', { params: { user_id: userId } })
    return response.data
  },
}

// Add request interceptor for auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
