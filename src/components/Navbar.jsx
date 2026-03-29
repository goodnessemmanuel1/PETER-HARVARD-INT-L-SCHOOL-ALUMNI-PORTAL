import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useState } from 'react'
import {
  Sun, Moon, Menu, X, GraduationCap, 
  Users, CalendarDays, LogOut, LogIn, UserPlus, Info, Phone
} from 'lucide-react'

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => { await signOut(); navigate('/') }

  const base = 'flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
  const active = 'flex items-center gap-1.5 text-sm font-semibold text-primary-600 dark:text-primary-400'

  const links = [
    { to: '/', label: 'Home', icon: <GraduationCap size={15} />, end: true },
    { to: '/directory', label: 'Directory', icon: <Users size={15} /> },
    { to: '/events', label: 'Events', icon: <CalendarDays size={15} /> },
    { to: '/about', label: 'About', icon: <Info size={15} /> },
    { to: '/contact', label: 'Contact', icon: <Phone size={15} /> },
  ]
  // Admin link intentionally omitted — access /admin directly

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center">
            <GraduationCap size={16} className="text-white" />
          </div>
          <span className="font-bold text-gray-900 dark:text-white hidden sm:block leading-tight">
            Peter Harvard <span className="text-primary-600">Alumni</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-5">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} className={({ isActive }) => isActive ? active : base}>
              {l.icon}{l.label}
            </NavLink>
          ))}

        </div>

        <div className="flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-500 dark:text-gray-400">
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <button onClick={handleSignOut} className="btn-outline text-sm py-1.5 px-3 flex items-center gap-1.5">
              <LogOut size={14} />Sign Out
            </button>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-outline text-sm py-1.5 px-3 flex items-center gap-1.5"><LogIn size={14} />Login</Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1.5"><UserPlus size={14} />Register</Link>
            </div>
          )}

          <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400">
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 flex flex-col gap-3">
          {links.map(l => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? active : base}>
              {l.icon}{l.label}
            </NavLink>
          ))}

          {!user && (
            <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-sm py-1.5 px-3 flex items-center gap-1.5"><LogIn size={14} />Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm py-1.5 px-3 flex items-center gap-1.5"><UserPlus size={14} />Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
