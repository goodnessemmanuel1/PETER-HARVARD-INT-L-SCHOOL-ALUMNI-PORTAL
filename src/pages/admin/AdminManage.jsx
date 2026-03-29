import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { adminService } from '../../services/api'
import { useAuth } from '../../context/AuthContext'
import { ShieldCheck, UserPlus, Mail, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react'
import { Spinner } from '../../components/Loader'

export default function AdminManage() {
  const { user } = useAuth()
  const [admins, setAdmins] = useState([])
  const [loadingAdmins, setLoadingAdmins] = useState(true)
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadAdmins = async () => {
    setLoadingAdmins(true)
    const { data, error } = await adminService.listAdmins()
    if (error) {
      console.error('listAdmins error:', error)
    } else if (data?.admins) {
      setAdmins(data.admins)
    } else {
      console.warn('listAdmins unexpected response:', data)
    }
    setLoadingAdmins(false)
  }

  useEffect(() => { loadAdmins() }, [])

  const handleCreate = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const emailLower = form.email.trim().toLowerCase()

    // Check if already an admin
    const alreadyAdmin = admins.some(a => a.email?.toLowerCase() === emailLower)
    if (alreadyAdmin) {
      setError('An admin account with this email already exists.')
      setSaving(false)
      return
    }

    // Check if already an alumni user in the DB
    const { data: alumniCheck } = await supabase
      .from('alumni')
      .select('id, full_name')
      .ilike('email', emailLower)
      .maybeSingle()
    if (alumniCheck) {
      setError(`This email belongs to an existing alumni user (${alumniCheck.full_name}). Cannot create admin with this email.`)
      setSaving(false)
      return
    }

    const { data, error: err } = await adminService.createAdmin(form.email, form.password)

    if (err || data?.error) {
      const msg = err?.message || data?.error || ''
      if (msg.toLowerCase().includes('already') || msg.toLowerCase().includes('exists')) {
        setError('An account with this email already exists.')
      } else {
        setError(msg || 'Failed to create admin.')
      }
    } else {
      setSuccess(`Admin account created for ${form.email}`)
      setForm({ email: '', password: '' })
      await loadAdmins()
    }
    setSaving(false)
  }

  const handleRemove = async (userId) => {
    if (!confirm('Remove admin role from this user?')) return
    await adminService.removeAdmin(userId)
    await loadAdmins()
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <ShieldCheck size={22} className="text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Manage Admins</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Create and manage admin accounts.</p>

      {/* Create Admin Form */}
      <div className="card p-6 mb-8 max-w-lg">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <UserPlus size={17} className="text-primary-500" />Create New Admin
        </h2>
        <form onSubmit={handleCreate} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <Mail size={13} />Email *
            </label>
            <input
              required type="email" value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError(''); setSuccess('') }}
              className="input" placeholder="admin@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <Lock size={13} />Password *
            </label>
            <div className="relative">
              <input
                required minLength={6}
                type={showPass ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                className="input pr-10" placeholder="Min. 6 characters"
              />
              <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          {error && (
            <div className="text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg px-3 py-2">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg px-3 py-2">
              {success}
            </div>
          )}

          <button type="submit" disabled={saving} className="btn-primary self-start flex items-center gap-2">
            {saving ? <><Spinner size={14} />Creating...</> : <><UserPlus size={15} />Create Admin</>}
          </button>
        </form>
      </div>

      {/* Admins List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">Current Admins</h2>
          <button
            onClick={loadAdmins}
            disabled={loadingAdmins}
            className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            <RefreshCw size={13} className={loadingAdmins ? 'animate-spin' : ''} />
            {loadingAdmins ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        {loadingAdmins ? (
          <div className="card p-8 text-center text-gray-400 text-sm">Loading admins...</div>
        ) : admins.length === 0 ? (
          <div className="card p-8 text-center text-gray-400 text-sm">No admins found or unable to load list.</div>
        ) : (
          <div className="flex flex-col gap-3 max-w-lg">
            {admins.map(a => (
              <div key={a.id} className="card p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <ShieldCheck size={16} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">{a.email}</p>
                    <p className="text-xs text-gray-400">{a.id === user?.id ? 'Admin (You)' : 'Admin'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
