import { NavLink, Outlet, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'
import { PageLoader } from '../components/Loader'
import PageTransition from '../components/PageTransition'
import { LayoutDashboard, CheckSquare, Users, CalendarDays, ShieldCheck, UserCircle, Images, BookOpen, Inbox, Menu, X, Bug, MessageSquare } from 'lucide-react'
import { useState } from 'react'

export default function AdminLayout() {
  const { isAdmin, loading } = useAuth()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (loading) return <PageLoader message="Verifying access..." />
  if (!isAdmin) return <Navigate to="/admin/login" replace />

  const base = 'flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700 dark:hover:text-primary-400 transition-colors'
  const active = 'flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-medium bg-primary-600 text-white shadow-lg shadow-primary-500/20'

  const links = [
    { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={16} />, end: true },
    { to: '/admin/approvals', label: 'Approvals', icon: <CheckSquare size={16} /> },
    { to: '/admin/alumni', label: 'All Alumni', icon: <Users size={16} /> },
    { to: '/admin/events', label: 'Events', icon: <CalendarDays size={16} /> },
    { to: '/admin/blog', label: 'Blog', icon: <BookOpen size={16} /> },
    { to: '/admin/gallery', label: 'Gallery', icon: <Images size={16} /> },
    { to: '/admin/submissions', label: 'Submissions', icon: <Inbox size={16} /> },
    { to: '/admin/bug-reports', label: 'Bug Reports', icon: <Bug size={16} /> },
    { to: '/admin/messages', label: 'Messages', icon: <MessageSquare size={16} /> },
    { to: '/admin/manage', label: 'Manage Admins', icon: <ShieldCheck size={16} /> },
    { to: '/admin/profile', label: 'My Profile', icon: <UserCircle size={16} /> },
  ]

  const NavLinks = ({ onClick }) => (
    <>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-4 mb-2">Admin Panel</p>
      {links.map(l => (
        <NavLink key={l.to} to={l.to} end={l.end} onClick={onClick}
          className={({ isActive }) => isActive ? active : base}>
          {l.icon}{l.label}
        </NavLink>
      ))}
    </>
  )

  return (
    <div className="min-h-screen flex flex-col bg-gray-50/50 dark:bg-gray-950">
      <Navbar />

      {/* Mobile top bar */}
      <div className="md:hidden flex items-center gap-3 px-4 py-3 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
        <button onClick={() => setMobileOpen(true)}
          className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
          <Menu size={20} />
        </button>
        <span className="font-semibold text-gray-900 dark:text-white text-sm">Admin Panel</span>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 z-50 w-64 bg-white dark:bg-gray-900 shadow-2xl flex flex-col md:hidden">
              <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <img src="/assets/phislogo.png" alt="PHIS" className="w-8 h-8 object-contain" />
                  <span className="font-bold text-sm text-gray-900 dark:text-white">Admin Panel</span>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                  <X size={18} />
                </button>
              </div>
              <nav className="flex flex-col gap-1 p-3 overflow-y-auto flex-1">
                <NavLinks onClick={() => setMobileOpen(false)} />
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 gap-8">
        {/* Desktop Sidebar */}
        <aside className="w-56 flex-shrink-0 hidden md:block">
          <nav className="flex flex-col gap-1 sticky top-24">
            <NavLinks />
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
