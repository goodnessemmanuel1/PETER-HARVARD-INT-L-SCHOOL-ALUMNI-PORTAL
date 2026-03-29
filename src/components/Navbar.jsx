import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Sun, Moon, Menu, X, Home,
  Users, CalendarDays, LogOut, LogIn, UserPlus, Info, Phone, LayoutDashboard, UserCircle
} from 'lucide-react'

export default function Navbar() {
  const { user, isAdmin, signOut, avatarUrl } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSignOut = async () => { await signOut(); navigate('/') }

  const base = 'relative flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors py-2'
  const active = 'relative flex items-center gap-1.5 text-sm font-bold text-primary-600 dark:text-primary-400 py-2'

  const links = [
    { to: '/', label: 'Home', icon: <Home size={16} />, end: true },
    { to: '/directory', label: 'Directory', icon: <Users size={16} /> },
    { to: '/events', label: 'Events', icon: <CalendarDays size={16} /> },
    { to: '/about', label: 'About', icon: <Info size={16} /> },
    { to: '/contact', label: 'Contact', icon: <Phone size={16} /> },
  ]

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-white/80 dark:bg-gray-950/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 shadow-lg' 
        : 'bg-white dark:bg-gray-950 border-b border-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <img src="/assets/phislogo.png" alt="Peter Harvard" className="w-14 h-14 object-contain" />
          <span className="font-extrabold text-xl tracking-tight text-gray-900 dark:text-white hidden sm:block leading-none">
            Peter Harvard <span className="text-primary-600 block text-xs font-bold tracking-widest uppercase mt-0.5">Alumni Portal</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => isActive ? active : base}>
              {({ isActive }) => (
                <>
                  {l.icon}{l.label}
                  {isActive && (
                    <motion.div 
                      layoutId="nav-underline"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-600 rounded-full"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-1.5 text-sm font-bold text-accent-600 hover:text-accent-500 transition-colors">
              <LayoutDashboard size={16} />Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={toggle} 
            className="p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50"
          >
            {dark ? <Sun size={20} /> : <Moon size={20} />}
          </motion.button>

          {user ? (
            <div className="flex items-center gap-3">
              {!isAdmin && (
                <Link to="/dashboard" className="hidden lg:flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover border-2 border-primary-200 dark:border-primary-700" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                </Link>
              )}
              {isAdmin && (
                <Link to="/admin/profile" className="hidden lg:flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="avatar" className="w-8 h-8 rounded-full object-cover border-2 border-primary-200 dark:border-primary-700" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                      {user.email?.[0].toUpperCase()}
                    </div>
                  )}
                </Link>
              )}
              <button 
                onClick={handleSignOut} 
                className="btn-outline border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 text-sm py-2 px-4 flex items-center gap-2"
              >
                <LogOut size={16} /> <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          ) : (
            <div className="hidden md:flex items-center gap-3">
              <Link to="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary-600 font-semibold text-sm px-4 py-2 transition-colors">Login</Link>
              <Link to="/register" className="btn-primary shadow-lg shadow-primary-500/25 text-sm py-2 px-5 flex items-center gap-2">
                <UserPlus size={16} />Register
              </Link>
            </div>
          )}

          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setMenuOpen(o => !o)} 
            className="md:hidden p-2.5 rounded-xl bg-gray-50 dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200/50 dark:border-gray-700/50"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 overflow-hidden shadow-2xl"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {links.map(l => (
                <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? active : base}>
                  {l.icon} <span className="text-base">{l.label}</span>
                </NavLink>
              ))}
              
              {isAdmin && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-1.5 text-base font-bold text-accent-600 py-2">
                  <LayoutDashboard size={18} /> Admin Dashboard
                </Link>
              )}

              <div className="pt-4 mt-2 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-3">
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline w-full py-3 flex items-center justify-center gap-2">
                      <LogIn size={18} />Login
                    </Link>
                    <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
                      <UserPlus size={18} />Register
                    </Link>
                  </>
                ) : (
                  <>
                    {!isAdmin && (
                      <Link to="/dashboard" onClick={() => setMenuOpen(false)} className="btn-outline w-full py-3 flex items-center justify-center gap-2">
                        <LayoutDashboard size={18} />My Dashboard
                      </Link>
                    )}
                    {!isAdmin && (
                      <Link to="/profile" onClick={() => setMenuOpen(false)} className="btn-outline w-full py-3 flex items-center justify-center gap-2">
                        <UserCircle size={18} />My Profile
                      </Link>
                    )}
                    {isAdmin && (
                      <Link to="/admin/profile" onClick={() => setMenuOpen(false)} className="btn-outline w-full py-3 flex items-center justify-center gap-2">
                        <UserCircle size={18} />Admin Profile
                      </Link>
                    )}
                    <button onClick={handleSignOut} className="btn-outline w-full py-3 flex items-center justify-center gap-2 text-red-600 border-red-100 bg-red-50">
                      <LogOut size={18} />Sign Out
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
