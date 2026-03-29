import { useEffect, useState } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'
import { eventsService } from '../services/api'
import {
  GraduationCap, Briefcase, CalendarDays, Users, Star,
  ChevronRight, Camera, Clock, CheckCircle, AlertCircle, Edit
} from 'lucide-react'
import { PageLoader } from '../components/Loader'
import EventCard from '../components/EventCard'

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const STATUS_CONFIG = {
  approved: { label: 'Approved', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <CheckCircle size={14} /> },
  pending:  { label: 'Pending Approval', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <Clock size={14} /> },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <AlertCircle size={14} /> },
}

export default function Dashboard() {
  const { user, avatarUrl } = useAuth()
  const [alumni, setAlumni] = useState(null)
  const [events, setEvents] = useState([])
  const [totalAlumni, setTotalAlumni] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const [alumniRes, eventsRes, countRes] = await Promise.all([
        supabase.from('alumni').select('*').eq('auth_user_id', user.id).single(),
        eventsService.getAll(),
        supabase.from('alumni').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
      ])
      setAlumni(alumniRes.data || null)
      setEvents((eventsRes.data || []).slice(0, 3))
      setTotalAlumni(countRes.count || 0)
      setLoading(false)
    }
    load()
  }, [user])

  if (!user) return <Navigate to="/login" replace />
  if (loading) return <PageLoader message="Loading dashboard..." />

  const initials = alumni?.full_name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
  const status = alumni?.status || 'pending'
  const statusCfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const displayAvatar = avatarUrl || alumni?.avatar_url

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="flex flex-col gap-8">

        {/* Welcome Banner */}
        <motion.div variants={itemVariants} className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white p-8 md:p-10 flex flex-col md:flex-row items-center gap-6">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,white/10,transparent_60%)] pointer-events-none" />

          {/* Avatar */}
          <div className="relative flex-shrink-0">
            {displayAvatar ? (
              <img src={displayAvatar} alt={alumni?.full_name} className="w-24 h-24 md:w-28 md:h-28 rounded-2xl object-cover border-4 border-white/30 shadow-xl" />
            ) : (
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white/20 text-white flex items-center justify-center font-bold text-3xl border-4 border-white/30 shadow-xl">
                {initials}
              </div>
            )}
            <Link to="/profile" className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-white text-primary-700 flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
              <Camera size={14} />
            </Link>
          </div>

          <div className="flex-1 text-center md:text-left">
            <p className="text-white/70 text-sm font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
              {alumni?.full_name || user.email}
            </h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mt-3">
              {alumni?.graduation_year && (
                <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
                  <GraduationCap size={14} /> Class of {alumni.graduation_year}
                </span>
              )}
              {alumni?.current_occupation && (
                <span className="inline-flex items-center gap-1.5 bg-white/15 px-3 py-1 rounded-full text-sm font-medium">
                  <Briefcase size={14} /> {alumni.current_occupation}
                </span>
              )}
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold ${statusCfg.color}`}>
                {statusCfg.icon} {statusCfg.label}
              </span>
            </div>
          </div>

          <Link to="/profile" className="flex-shrink-0 inline-flex items-center gap-2 bg-white text-primary-700 font-bold px-5 py-3 rounded-xl hover:bg-gray-100 transition-all hover:scale-105 shadow-lg text-sm">
            <Edit size={15} /> Edit Profile
          </Link>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Your Status', value: statusCfg.label, icon: <CheckCircle size={20} className="text-primary-500" />, sub: 'Account status' },
            { label: 'Total Alumni', value: totalAlumni, icon: <Users size={20} className="text-primary-500" />, sub: 'Registered members' },
            { label: 'Events', value: events.length > 0 ? `${events.length}+` : '0', icon: <CalendarDays size={20} className="text-primary-500" />, sub: 'Upcoming & past' },
            { label: 'Featured', value: alumni?.featured ? 'Yes ⭐' : 'No', icon: <Star size={20} className="text-primary-500" />, sub: 'Featured alumni' },
          ].map((s, i) => (
            <motion.div key={s.label} variants={itemVariants} className="card p-5 flex flex-col gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
                {s.icon}
              </div>
              <div>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{s.value}</div>
                <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">{s.sub}</div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile Summary */}
          <motion.div variants={itemVariants} className="card p-6 flex flex-col gap-5">
            <h2 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
              <GraduationCap size={18} className="text-primary-500" /> My Profile
            </h2>
            <div className="space-y-3">
              {[
                { label: 'Full Name', value: alumni?.full_name },
                { label: 'Email', value: user.email },
                { label: 'Graduation Year', value: alumni?.graduation_year ? `Class of ${alumni.graduation_year}` : null },
                { label: 'Occupation', value: alumni?.current_occupation },
                { label: 'Phone', value: alumni?.phone },
              ].map(({ label, value }) => value ? (
                <div key={label} className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">{value}</span>
                </div>
              ) : null)}
              {alumni?.bio && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Bio</span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 italic">"{alumni.bio}"</p>
                </div>
              )}
            </div>
            <Link to="/profile" className="btn-outline text-sm flex items-center justify-center gap-2 mt-auto">
              <Edit size={14} /> Update Profile
            </Link>
          </motion.div>

          {/* Quick Links + Events */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Quick Links */}
            <motion.div variants={itemVariants} className="card p-6">
              <h2 className="font-bold text-gray-900 dark:text-white text-lg mb-4">Quick Links</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { to: '/directory', icon: <Users size={20} />, label: 'Alumni Directory', desc: 'Browse all graduates' },
                  { to: '/events', icon: <CalendarDays size={20} />, label: 'Events', desc: 'School events & news' },
                  { to: '/profile', icon: <Edit size={20} />, label: 'Edit Profile', desc: 'Update your info' },
                ].map(l => (
                  <Link key={l.to} to={l.to} className="group flex flex-col gap-2 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 border border-gray-100 dark:border-gray-800 hover:border-primary-200 dark:hover:border-primary-800 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-800 text-primary-600 dark:text-primary-400 flex items-center justify-center shadow-sm group-hover:bg-primary-600 group-hover:text-white transition-all">
                      {l.icon}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-gray-900 dark:text-white">{l.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">{l.desc}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Latest Events */}
            {events.length > 0 && (
              <motion.div variants={itemVariants} className="card p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg flex items-center gap-2">
                    <CalendarDays size={18} className="text-primary-500" /> Latest Events
                  </h2>
                  <Link to="/events" className="text-sm font-bold text-primary-600 dark:text-primary-400 inline-flex items-center gap-1 hover:gap-2 transition-all">
                    View all <ChevronRight size={15} />
                  </Link>
                </div>
                <div className="flex flex-col gap-3">
                  {events.map(e => (
                    <EventCard key={e.id} event={e} compact />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Pending notice */}
            {status === 'pending' && (
              <motion.div variants={itemVariants} className="rounded-2xl border border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20 p-5 flex items-start gap-3">
                <Clock size={20} className="text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-yellow-800 dark:text-yellow-300 text-sm">Account Pending Approval</p>
                  <p className="text-yellow-700 dark:text-yellow-400 text-sm mt-0.5">Your registration is under review. You'll get full access once an admin approves your account.</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  )
}
