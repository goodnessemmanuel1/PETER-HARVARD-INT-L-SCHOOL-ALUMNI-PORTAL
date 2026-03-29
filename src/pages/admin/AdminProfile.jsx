import { useState, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../services/supabase'
import { Camera, KeyRound, Eye, EyeOff, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react'
import { Spinner } from '../../components/Loader'
import { uploadAvatar } from '../../services/uploadAvatar'

export default function AdminProfile() {
  const { user, updatePassword } = useAuth()
  const fileRef = useRef()

  const [avatarUrl, setAvatarUrl] = useState(user?.user_metadata?.avatar_url || null)
  const [uploading, setUploading] = useState(false)
  const [avatarMsg, setAvatarMsg] = useState({ type: '', text: '' })

  const [pwForm, setPwForm] = useState({ newPw: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })

  const initials = user?.email?.slice(0, 2).toUpperCase()

  const handleAvatarChange = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 5 * 1024 * 1024) {
      setAvatarMsg({ type: 'error', text: 'Image must be under 5MB' })
      return
    }
    setUploading(true)
    setAvatarMsg({ type: '', text: '' })
    try {
      const publicUrl = await uploadAvatar(file, 'admin-avatars')
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } })
      setAvatarUrl(publicUrl)
      setAvatarMsg({ type: 'success', text: 'Profile photo updated!' })
    } catch (err) {
      setAvatarMsg({ type: 'error', text: err.message })
    }
    setUploading(false)
  }

  const handlePasswordChange = async e => {
    e.preventDefault()
    if (pwForm.newPw !== pwForm.confirm) { setPwMsg({ type: 'error', text: 'Passwords do not match' }); return }
    if (pwForm.newPw.length < 8) { setPwMsg({ type: 'error', text: 'Min. 8 characters' }); return }
    setPwSaving(true)
    setPwMsg({ type: '', text: '' })
    const { error } = await updatePassword(pwForm.newPw)
    setPwSaving(false)
    setPwMsg(error ? { type: 'error', text: error.message } : { type: 'success', text: 'Password updated successfully!' })
    if (!error) setPwForm({ newPw: '', confirm: '' })
  }

  return (
    <div className="animate-fade-in w-full">
      <div className="flex items-center gap-3 mb-6">
        <ShieldCheck size={22} className="text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Profile</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Avatar Card */}
        <div className="card p-6 animate-fade-in-up flex flex-col items-center text-center gap-4">
          <div className="relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Admin"
                className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-primary-200 dark:border-primary-800 shadow-lg"
              />
            ) : (
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-4xl border-4 border-primary-200 dark:border-primary-800 shadow-lg">
                {initials}
              </div>
            )}
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute -bottom-1 -right-1 w-9 h-9 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-lg transition-colors border-2 border-white dark:border-gray-900"
            >
              {uploading ? <Spinner size={14} /> : <Camera size={15} />}
            </button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div>
            <p className="font-semibold text-gray-900 dark:text-white break-all">{user?.email}</p>
            <span className="badge-red text-xs mt-2 inline-flex items-center gap-1">
              <ShieldCheck size={10} />Admin
            </span>
          </div>

          {avatarMsg.text && (
            <div className={`w-full flex items-start gap-2 text-xs p-2.5 rounded-lg ${
              avatarMsg.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
            }`}>
              {avatarMsg.type === 'error' ? <AlertCircle size={13} className="flex-shrink-0 mt-0.5" /> : <CheckCircle size={13} className="flex-shrink-0 mt-0.5" />}
              {avatarMsg.text}
            </div>
          )}

          <p className="text-xs text-gray-400">JPG, PNG or WebP · Max 5MB</p>
          <button
            onClick={() => fileRef.current?.click()}
            disabled={uploading}
            className="btn-outline text-sm w-full flex items-center justify-center gap-2"
          >
            {uploading ? <><Spinner size={13} />Uploading...</> : <><Camera size={14} />Change Photo</>}
          </button>
        </div>

        {/* Password Card */}
        <form onSubmit={handlePasswordChange} className="card p-6 flex flex-col gap-5 animate-fade-in-up lg:col-span-2" style={{ animationDelay: '100ms' }}>
          <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
            <KeyRound size={16} className="text-primary-500" />Change Password
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password *</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'} minLength={8}
                  value={pwForm.newPw} onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))}
                  className="input pr-10" placeholder="Min. 8 characters"
                />
                <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password *</label>
              <input
                type="password" value={pwForm.confirm}
                onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                className="input" placeholder="Repeat password"
              />
            </div>
          </div>

          {pwMsg.text && (
            <div className={`flex items-center gap-2 text-sm p-3 rounded-lg ${
              pwMsg.type === 'error'
                ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
                : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
            }`}>
              {pwMsg.type === 'error' ? <AlertCircle size={15} /> : <CheckCircle size={15} />}
              {pwMsg.text}
            </div>
          )}

          <button type="submit" disabled={pwSaving} className="btn-primary self-start flex items-center gap-2">
            {pwSaving ? <><Spinner size={14} />Updating...</> : <><KeyRound size={14} />Update Password</>}
          </button>
        </form>
      </div>
    </div>
  )
}
