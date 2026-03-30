import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { supabase } from '../services/supabase'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sun, Moon, Menu, X, Home,
  Users, CalendarDays, LogOut, LogIn, UserPlus, Info, Phone, LayoutDashboard, UserCircle, Images, BookOpen, Inbox
} from 'lucide-react'

export default function Navbar() {
  const { user, isAdmin, signOut, avatarUrl } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [unread, setUnread] = useState(0)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Load unread count for alumni
  useEffect(() => {
    if (!user || isAdmin) return
    async function loadUnread() {
      const { data: alumni } = await supabase.from('alumni').select('id').eq('auth_user_id', user.id).maybeSingle()
      if (!alumni) return
      const { data: allMsgs } = await supabase.from('messages').select('id')
      const { data: readMsgs } = await supabase.from('message_reads').select('message_id').eq('alumni_id', alumni.id)
      const readIds = new Set((readMsgs || []).map(r => r.message_id))
      setUnread((allMsgs || []).filter(m => !readIds.has(m.id)).length)
    }
    loadUnread()
  }, [user, isAdmin])

  const handleSignOut = async () => { await signOut(); navigate('/') }

  const links = [
    { to: '/', label: 'Home', icon: <Home size={15} />, end: true },
    { to: '/directory', label: 'Directory', icon: <Users size={15} /> },
    { to: '/events', label: 'Events', icon: <CalendarDays size={15} /> },
    { to: '/gallery', label: 'Gallery', icon: <Images size={15} /> },
    { to: '/blog', label: 'Blog', icon: <BookOpen size={15} /> },
    { to: '/about', label: 'About', icon: <Info size={15} /> },
    { to: '/contact', label: 'Contact', icon: <Phone size={15} /> },
  ]

  const Avatar = () => (
    avatarUrl
      ? <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover ring-2 ring-primary-200 dark:ring-primary-700" />
      : <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-primary-200 dark:ring-primary-700">
          {user?.email?.[0].toUpperCase()}
        </div>
  )

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 shadow-sm'
        : 'bg-white dark:bg-gray-950 border-b border-gray-100 dark:border-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <img
            src="/assets/phislogo.png"
            alt="Peter Harvard"
            className="w-10 h-10 object-contain drop-shadow-sm group-hover:scale-105 transition-transform duration-200"
          />
          <div className="leading-none">
            <p className="font-extrabold text-sm tracking-tight text-gray-900 dark:text-white">Peter Harvard</p>
            <p className="text-[9px] font-bold tracking-widest uppercase text-primary-600 dark:text-primary-400">Alumni Portal</p>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1 flex-1 justify-center">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}>
                    {l.icon}
                  </span>
                  {l.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-lg bg-primary-50 dark:bg-primary-900/20 -z-10"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
          {user && !isAdmin && (
            <NavLink to="/inbox"
              className={({ isActive }) =>
                `relative flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/60'
                }`}>
              {({ isActive }) => (
                <>
                  <span className={isActive ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}>
                    <Inbox size={15} />
                  </span>
                  Inbox
                  {unread > 0 && <span className="bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">{unread}</span>}
                </>
              )}
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20'
                    : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                }`
              }
            >
              <LayoutDashboard size={15} />Admin
            </NavLink>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Theme toggle */}
          <button
            onClick={toggle}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle theme"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="hidden lg:flex items-center gap-2">
              <Link to={isAdmin ? '/admin/profile' : '/dashboard'}>
                <Avatar />
              </Link>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              >
                <LogOut size={15} />Sign Out
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-2">
              <Link
                to="/login"
                className="px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="btn-primary text-sm py-2 px-4 flex items-center gap-1.5 shadow-md shadow-primary-500/20"
              >
                <UserPlus size={15} />Register
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="lg:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden"
          >
            <div className="px-4 pt-3 pb-5 flex flex-col gap-1">
              {links.map(l => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  end={l.end}
                  onClick={() => setMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60'
                    }`
                  }
                >
                  {l.icon}{l.label}
                </NavLink>
              ))}

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 transition-all"
                >
                  <LayoutDashboard size={16} />Admin Dashboard
                </Link>
              )}

              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2">
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline w-full py-2.5 flex items-center justify-center gap-2 text-sm">
                      <LogIn size={16} />Login
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full py-2.5 flex items-center justify-center gap-2 text-sm">
                      <UserPlus size={16} />Register
                    </Link>
                  </>
                ) : (
                  <>
                    {!isAdmin && (
                      <>
                        <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all">
                          <LayoutDashboard size={16} />My Dashboard
                        </Link>
                        <Link to="/inbox" onClick={() => setMenuOpen(false)} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all">
                          <Inbox size={16} />Inbox{unread > 0 && <span className="ml-auto bg-green-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unread}</span>}
                        </Link>
                      </>
                    )}
                    <Link
                      to={isAdmin ? '/admin/profile' : '/profile'}
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-all"
                    >
                      <UserCircle size={16} />{isAdmin ? 'Admin Profile' : 'My Profile'}
                    </Link>
                    <button
                      onClick={handleSignOut}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all w-full text-left"
                    >
                      <LogOut size={16} />Sign Out
                    </button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
