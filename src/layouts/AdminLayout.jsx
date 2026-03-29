import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { PageLoader } from '../components/Loader'
import PageTransition from '../components/PageTransition'
import { LayoutDashboard, CheckSquare, Users, CalendarDays, ShieldCheck } from 'lucide-react'

export default function AdminLayout() {
  const { isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <PageLoader message="Verifying access..." />
  if (!isAdmin) return <Navigate to="/login" replace />

  const base = 'flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors'
  const active = 'flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary-600 text-white shadow-lg shadow-primary-500/20'

  const links = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} />, end: true },
    { to: '/admin/approvals', label: 'Approvals', icon: <CheckSquare size={16} /> },
    { to: '/admin/alumni', label: 'All Alumni', icon: <Users size={16} /> },
    { to: '/admin/events', label: 'Events', icon: <CalendarDays size={16} /> },
    { to: '/admin/manage', label: 'Manage Admins', icon: <ShieldCheck size={16} /> },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-gray-950">
      <Navbar />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        <aside className="w-56 flex-shrink-0 hidden md:block">
          <nav className="flex flex-col gap-1 sticky top-24">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Admin Panel</p>
            {links.map(l => (
              <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => isActive ? active : base}>
                {l.icon}{l.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <PageTransition key={location.pathname}>
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
