import { Link, useLocation } from 'react-router-dom'
import { Settings, Bell } from 'lucide-react'

const navLinks = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/scans', label: 'Scans' },
  { path: '/assets', label: 'Assets' },
  { path: '/findings', label: 'Findings' },
]

export function Navigation() {
  const location = useLocation()

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <nav className="flex flex-wrap items-center justify-between mb-12 gap-4 px-4 md:px-8 py-4">
      {/* Logo */}
      <Link to="/dashboard" className="flex items-center gap-2 px-6 py-2 glass rounded-full shadow-sm">
        <div className="w-6 h-6 rounded-full bg-brand-yellow"></div>
        <span className="font-semibold text-lg tracking-tight">Reconny</span>
      </Link>

      {/* Navigation Links */}
      <ul className="hidden md:flex items-center gap-2 glass px-2 py-2 rounded-full shadow-sm">
        {navLinks.map((link) => (
          <li key={link.path}>
            <Link
              to={link.path}
              className={isActive(link.path) ? 'nav-link-active' : 'nav-link-inactive'}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white transition-colors shadow-sm">
          <Settings className="w-5 h-5 text-brand-dark" />
        </button>
        <button className="w-10 h-10 rounded-full glass flex items-center justify-center hover:bg-white transition-colors shadow-sm">
          <Bell className="w-5 h-5 text-brand-dark" />
        </button>
        <div className="w-10 h-10 rounded-full bg-brand-dark overflow-hidden ml-2 shadow-sm">
          <img
            alt="Avatar"
            className="w-full h-full object-cover"
            src="https://api.dicebear.com/7.x/avataaars/svg?seed=reconny"
          />
        </div>
      </div>
    </nav>
  )
}
