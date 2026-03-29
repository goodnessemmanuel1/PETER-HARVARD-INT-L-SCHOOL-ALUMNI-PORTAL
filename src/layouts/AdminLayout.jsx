import { NavLink, Outlet, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function AdminLayout() {
  const { isAdmin, loading } = useAuth()

  if (loading) return <div className="min-h-screen flex items-center justify-center"><span className="text-gray-400">Loading...</span></div>
  if (!isAdmin) return <Navigate to="/login" replace />

  const link = 'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors'
  const activeLink = 'flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary-600 text-white'

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
        {/* Sidebar */}
        <aside className="w-56 flex-shrink-0 hidden md:block">
          <nav className="flex flex-col gap-1 sticky top-24">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Admin Panel</p>
            <NavLink to="/admin" end className={({ isActive }) => isActive ? activeLink : link}>📊 Dashboard</NavLink>
            <NavLink to="/admin/approvals" className={({ isActive }) => isActive ? activeLink : link}>✅ Approvals</NavLink>
            <NavLink to="/admin/alumni" className={({ isActive }) => isActive ? activeLink : link}>🎓 All Alumni</NavLink>
            <NavLink to="/admin/events" className={({ isActive }) => isActive ? activeLink : link}>📅 Events</NavLink>
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
