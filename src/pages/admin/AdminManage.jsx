import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { ShieldCheck, UserPlus, Mail, Lock, Trash2, Eye, EyeOff } from 'lucide-react'
import { Spinner } from '../../components/Loader'

export default function AdminManage() {
  const [admins, setAdmins] = useState([])
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPass, setShowPass] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const loadAdmins = async () => {
    // Fetch all users with admin role via edge function
    const { data, error } = await supabase.functions.invoke('list-admins')
    if (!error && data?.admins) setAdmins(data.admins)
  }

  useEffect(() => { loadAdmins() }, [])

  const handleCreate = async e => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess('')

    const { data, error: err } = await supabase.functions.invoke('create-admin', {
      body: { email: form.email, password: form.password },
    })

    if (err || data?.error) {
      setError(err?.message || data?.error)
    } else {
      setSuccess(`Admin account created for ${form.email}`)
      setForm({ email: '', password: '' })
      loadAdmins()
    }
    setSaving(false)
  }

  const handleRemove = async (userId) => {
    if (!confirm('Remove admin role from this user?')) return
    await supabase.functions.invoke('remove-admin', { body: { userId } })
    loadAdmins()
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
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
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

          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}

          <button type="submit" disabled={saving} className="btn-primary self-start flex items-center gap-2">
            {saving ? <><Spinner size={14} />Creating...</> : <><UserPlus size={15} />Create Admin</>}
          </button>
        </form>
      </div>

      {/* Admins List */}
      <div>
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Current Admins</h2>
        {admins.length === 0 ? (
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
                    <p className="text-xs text-gray-400">Admin</p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemove(a.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors p-1"
                  title="Remove admin role"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
