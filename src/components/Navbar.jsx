import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'
import { useState } from 'react'

export default function Navbar() {
  const { user, isAdmin, signOut } = useAuth()
  const { dark, toggle } = useTheme()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const navLink = 'text-sm font-medium hover:text-primary-600 dark:hover:text-primary-400 transition-colors'
  const activeLink = 'text-primary-600 dark:text-primary-400 font-semibold'

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">PH</div>
          <span className="font-bold text-gray-900 dark:text-white hidden sm:block">Peter Harvard Alumni</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-6">
          <NavLink to="/" end className={({ isActive }) => isActive ? activeLink : navLink}>Home</NavLink>
          <NavLink to="/directory" className={({ isActive }) => isActive ? activeLink : navLink}>Directory</NavLink>
          <NavLink to="/events" className={({ isActive }) => isActive ? activeLink : navLink}>Events</NavLink>
          {isAdmin && <NavLink to="/admin" className={({ isActive }) => isActive ? activeLink : navLink}>Admin</NavLink>}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle theme">
            {dark ? '☀️' : '🌙'}
          </button>

          {user ? (
            <button onClick={handleSignOut} className="btn-outline text-sm py-1.5 px-4">Sign Out</button>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link to="/login" className="btn-outline text-sm py-1.5 px-4">Login</Link>
              <Link to="/register" className="btn-primary text-sm py-1.5 px-4">Register</Link>
            </div>
          )}

          {/* Mobile menu button */}
          <button onClick={() => setMenuOpen(o => !o)} className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
            <span className="sr-only">Menu</span>
            <div className="w-5 h-0.5 bg-gray-700 dark:bg-gray-300 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-700 dark:bg-gray-300 mb-1"></div>
            <div className="w-5 h-0.5 bg-gray-700 dark:bg-gray-300"></div>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 px-4 py-4 flex flex-col gap-4">
          <NavLink to="/" end onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? activeLink : navLink}>Home</NavLink>
          <NavLink to="/directory" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? activeLink : navLink}>Directory</NavLink>
          <NavLink to="/events" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? activeLink : navLink}>Events</NavLink>
          {isAdmin && <NavLink to="/admin" onClick={() => setMenuOpen(false)} className={({ isActive }) => isActive ? activeLink : navLink}>Admin</NavLink>}
          {!user && (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMenuOpen(false)} className="btn-outline text-sm py-1.5 px-4">Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} className="btn-primary text-sm py-1.5 px-4">Register</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}
