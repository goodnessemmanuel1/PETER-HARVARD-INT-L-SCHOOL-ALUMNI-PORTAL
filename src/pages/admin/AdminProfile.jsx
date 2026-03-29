import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'
import { Camera, Save, KeyRound, Eye, EyeOff, ShieldCheck } from 'lucide-react'
import { Spinner } from '../../components/Loader'

export default function AdminProfile() {
  const { user, updatePassword } = useAuth()
  const fileRef = useRef()

  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || null)
  const [uploading, setUploading] = useState(false)
  const [avatarMsg, setAvatarMsg] = useState('')

  const [pwForm, setPwForm] = useState({ newPw: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })

  const initials = user?.email?.slice(0, 2).toUpperCase()

  const handleAvatarChange = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setAvatarMsg('')
    const ext = file.name.split('.').pop()
    const path = `admin-avatars/${user.id}.${ext}`
    const { error: upErr } = await supabase.storage.from('profiles').upload(path, file, { upsert: true })
    if (upErr) { setAvatarMsg(upErr.message); setUploading(false); return }
    const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(path)
    await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
    setAvatarUrl(publicUrl)
    setUploading(false)
    setAvatarMsg('Photo updated!')
  }

  const handlePasswordChange = async e => {
    e.preventDefault()
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg({ type: 'error', text: 'Passwords do not match' }); return }
    if (pwForm.newPw.length < 8) { setPwMsg({ type: 'error', text: 'Min. 8 characters' }); return }
    setPwSaving(true)
    setPwMsg({ type: '', text: '' })
    const { error } = await updatePassword(pwForm.newPw)
    setPwSaving(false)
    setPwMsg(error ? { type: 'error', text: error.message } : { type: 'success', text: 'Password updated!' })
    if (!error) setPwForm({ newPw: '', confirm: '' })
  }

  return (
    <div className="max-w-lg animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck size={22} className="text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Profile</h1>
      </div>

      <div className="flex flex-col gap-6">
        {/* Avatar */}
        <div className="card p-6 animate-fade-in-up">
          <div className="flex items-center gap-5">
            <div className="relative">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Admin" className="w-20 h-20 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800" />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-2xl border-2 border-primary-200 dark:border-primary-800">
                  {initials}
                </div>
              )}
              <button
                onClick={() => fileRef.current?.click()}
                disabled={uploading}
                className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-md transition-colors"
              >
                {uploading ? <Spinner size={12} /> : <Camera size={13} />}
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">{user?.email}</p>
              <span className="badge-red text-xs mt-1 inline-flex items-center gap-1">
                <ShieldCheck size={10} />Admin
              </span>
              {avatarMsg && <p className="text-xs text-green-600 dark:text-green-400 mt-1">{avatarMsg}</p>}
            </div>
          </div>
        </div>

        {/* Change Password */}
        <form onSubmit={handlePasswordChange} className="card p-6 flex flex-col gap-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <KeyRound size={16} className="text-primary-500" />Change Password
          </h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
            <div className="relative">
              <input type={showPw ? 'text' : 'password'} minLength={8} value={pwForm.newPw}
                onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))}
                className="input pr-9" placeholder="Min. 8 characters" />
              <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPw ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
            <input type="password" value={pwForm.confirm}
              onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
              className="input" placeholder="Repeat password" />
          </div>
          {pwMsg.text && <p className={`text-sm ${pwMsg.type === 'error' ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>{pwMsg.text}</p>}
          <button type="submit" disabled={pwSaving} className="btn-primary self-start flex items-center gap-2">
            {pwSaving ? <><Spinner size={14} />Updating...</> : <><KeyRound size={14} />Update Password</>}
          </button>
        </form>
      </div>
    </div>
  )
}
