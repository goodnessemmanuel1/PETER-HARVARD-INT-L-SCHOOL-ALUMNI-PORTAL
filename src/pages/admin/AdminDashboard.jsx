import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { Clock, CheckCircle, Star, CalendarDays, ArrowRight, PlusCircle } from 'lucide-react'
import { PageLoader } from '../../components/Loader'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)

  useEffect(() => {
    async function load() {
      const [pending, approved, featured, events] = await Promise.all([
        supabase.from('alumni').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('alumni').select('id', { count: 'exact', head: true }).eq('status', 'approved'),
        supabase.from('alumni').select('id', { count: 'exact', head: true }).eq('featured', true),
        supabase.from('events').select('id', { count: 'exact', head: true }),
      ])
      setStats({
        pending: pending.count || 0,
        approved: approved.count || 0,
        featured: featured.count || 0,
        events: events.count || 0,
      })
    }
    load()
  }, [])

  if (!stats) return <PageLoader message="Loading dashboard..." />

  const cards = [
    { label: 'Pending Approvals', value: stats.pending, icon: <Clock size={22} />, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', to: '/admin/approvals' },
    { label: 'Approved Alumni', value: stats.approved, icon: <CheckCircle size={22} />, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', to: '/admin/alumni' },
    { label: 'Featured Alumni', value: stats.featured, icon: <Star size={22} />, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-100 dark:bg-primary-900/30', to: '/admin/alumni' },
    { label: 'Events Posted', value: stats.events, icon: <CalendarDays size={22} />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', to: '/admin/events' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Dashboard</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Welcome back, Admin.</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map(c => (
          <Link key={c.label} to={c.to} className="card p-6 hover:shadow-md transition-shadow">
            <div className={`w-10 h-10 rounded-lg ${c.bg} ${c.color} flex items-center justify-center mb-3`}>
              {c.icon}
            </div>
            <div className={`text-3xl font-bold ${c.color}`}>{c.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{c.label}</div>
          </Link>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/approvals" className="btn-primary text-sm flex items-center gap-2">
            <CheckCircle size={15} />Review Pending Registrations
            {stats.pending > 0 && <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">{stats.pending}</span>}
          </Link>
          <Link to="/admin/events" className="btn-outline text-sm flex items-center gap-2">
            <PlusCircle size={15} />Post New Event
          </Link>
          <Link to="/admin/alumni" className="btn-outline text-sm flex items-center gap-2">
            <ArrowRight size={15} />Manage Alumni
          </Link>
        </div>
      </div>
    </div>
  )
}
