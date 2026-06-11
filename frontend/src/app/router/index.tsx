import { Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from '../layouts/MainLayout'
import { Dashboard } from '@/pages/dashboard'
import { ProjectsPage, ScansPage, AssetsPage, EndpointsPage, FindingsPage, AIAnalysisPage, ReportsPage, SettingsPage } from '@/pages'
import { LoginPage } from '@/pages/auth/LoginPage'

export function AppRouter() {
  const isAuthenticated = true // TODO: Implement auth check

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/scans" element={<ScansPage />} />
        <Route path="/scans/:scanId" element={<ScansPage />} />
        <Route path="/assets" element={<AssetsPage />} />
        <Route path="/assets/:assetId" element={<AssetsPage />} />
        <Route path="/endpoints" element={<EndpointsPage />} />
        <Route path="/findings" element={<FindingsPage />} />
        <Route path="/ai-analysis" element={<AIAnalysisPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}
