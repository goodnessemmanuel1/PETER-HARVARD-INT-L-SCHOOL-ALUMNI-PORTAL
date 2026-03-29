import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ pending: 0, approved: 0, featured: 0, events: 0 })

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

  const cards = [
    { label: 'Pending Approvals', value: stats.pending, icon: '⏳', color: 'text-yellow-600 dark:text-yellow-400', to: '/admin/approvals' },
    { label: 'Approved Alumni', value: stats.approved, icon: '✅', color: 'text-green-600 dark:text-green-400', to: '/admin/alumni' },
    { label: 'Featured Alumni', value: stats.featured, icon: '⭐', color: 'text-primary-600 dark:text-primary-400', to: '/admin/alumni' },
    { label: 'Events Posted', value: stats.events, icon: '📅', color: 'text-blue-600 dark:text-blue-400', to: '/admin/events' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">📊 Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map(c => (
          <Link key={c.label} to={c.to} className="card p-6 hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">{c.icon}</div>
            <div className={`text-3xl font-bold ${c.color}`}>{c.value}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{c.label}</div>
          </Link>
        ))}
      </div>
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/approvals" className="btn-primary text-sm">Review Pending Registrations</Link>
          <Link to="/admin/events" className="btn-outline text-sm">Post New Event</Link>
        </div>
      </div>
    </div>
  )
}
