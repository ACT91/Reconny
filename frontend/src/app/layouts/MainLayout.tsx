import { Outlet } from 'react-router-dom'
import { Navigation } from '@/components/layouts/Navigation'

export function MainLayout() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main className="p-4 md:p-8">
        <Outlet />
      </main>
    </div>
  )
}
