import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../../services/supabase'
import { Clock, CheckCircle, Star, CalendarDays, ArrowRight, PlusCircle, ShieldCheck, UserPlus, Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { PageLoader, Spinner } from '../../components/Loader'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [adminMsg, setAdminMsg] = useState({ type: '', text: '' })

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

  const handleCreateAdmin = async e => {
    e.preventDefault()
    setSaving(true)
    setAdminMsg({ type: '', text: '' })
    const { data, error } = await supabase.functions.invoke('create-admin', {
      body: { email: form.email, password: form.password },
    })
    if (error || data?.error) {
      setAdminMsg({ type: 'error', text: error?.message || data?.error })
    } else {
      setAdminMsg({ type: 'success', text: `Admin account created for ${form.email}` })
      setForm({ email: '', password: '' })
    }
    setSaving(false)
  }

  if (!stats) return <PageLoader message="Loading dashboard..." />

  const cards = [
    { label: 'Pending Approvals', value: stats.pending, icon: <Clock size={22} />, color: 'text-yellow-600 dark:text-yellow-400', bg: 'bg-yellow-100 dark:bg-yellow-900/30', to: '/admin/approvals' },
    { label: 'Approved Alumni', value: stats.approved, icon: <CheckCircle size={22} />, color: 'text-green-600 dark:text-green-400', bg: 'bg-green-100 dark:bg-green-900/30', to: '/admin/alumni' },
    { label: 'Featured Alumni', value: stats.featured, icon: <Star size={22} />, color: 'text-primary-600 dark:text-primary-400', bg: 'bg-primary-100 dark:bg-primary-900/30', to: '/admin/alumni' },
    { label: 'Events Posted', value: stats.events, icon: <CalendarDays size={22} />, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', to: '/admin/events' },
  ]

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome back, Admin.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
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

      {/* Quick Actions */}
      <div className="card p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link to="/admin/approvals" className="btn-primary text-sm flex items-center gap-2">
            <CheckCircle size={15} />Review Pending
            {stats.pending > 0 && <span className="bg-white/20 text-white text-xs px-1.5 py-0.5 rounded-full">{stats.pending}</span>}
          </Link>
          <Link to="/admin/events" className="btn-outline text-sm flex items-center gap-2">
            <PlusCircle size={15} />Post New Event
          </Link>
          <Link to="/admin/alumni" className="btn-outline text-sm flex items-center gap-2">
            <ArrowRight size={15} />Manage Alumni
          </Link>
          <Link to="/admin/manage" className="btn-outline text-sm flex items-center gap-2">
            <ShieldCheck size={15} />Manage Admins
          </Link>
        </div>
      </div>

      {/* Create Admin */}
      <div className="card p-6 max-w-lg">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-1 flex items-center gap-2">
          <UserPlus size={17} className="text-primary-500" />Create Admin Account
        </h2>
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">New admin will have full access to this dashboard.</p>
        <form onSubmit={handleCreateAdmin} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <Mail size={12} />Email *
              </label>
              <input
                required type="email" value={form.email}
                onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                className="input" placeholder="admin@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <Lock size={12} />Password *
              </label>
              <div className="relative">
                <input
                  required minLength={6}
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  className="input pr-9" placeholder="Min. 6 chars"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>
          </div>

          {adminMsg.text && (
            <p className={`text-sm ${adminMsg.type === 'error' ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
              {adminMsg.text}
            </p>
          )}

          <div className="flex items-center gap-3">
            <button type="submit" disabled={saving} className="btn-primary text-sm flex items-center gap-2">
              {saving ? <><Spinner size={13} />Creating...</> : <><UserPlus size={14} />Create Admin</>}
            </button>
            <Link to="/admin/manage" className="text-sm text-primary-600 dark:text-primary-400 hover:underline flex items-center gap-1">
              <ShieldCheck size={13} />View all admins
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
