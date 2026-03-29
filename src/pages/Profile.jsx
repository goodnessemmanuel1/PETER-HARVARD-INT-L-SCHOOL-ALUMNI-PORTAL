import { useEffect, useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'
import { User, Phone, Briefcase, FileText, Camera, Save, KeyRound, Eye, EyeOff, GraduationCap, AlertCircle, CheckCircle } from 'lucide-react'
import { Spinner, PageLoader } from '../components/Loader'
import { Navigate } from 'react-router-dom'
import { uploadAvatar } from '../services/uploadAvatar'

export default function Profile() {
  const { user, updatePassword } = useAuth()
  const fileRef = useRef()

  const [alumni, setAlumni] = useState(null)
  const [form, setForm] = useState({})
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState(null)
  const [msg, setMsg] = useState({ type: '', text: '' })
  const [avatarMsg, setAvatarMsg] = useState({ type: '', text: '' })

  const [pwForm, setPwForm] = useState({ newPw: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [pwSaving, setPwSaving] = useState(false)
  const [pwMsg, setPwMsg] = useState({ type: '', text: '' })

  useEffect(() => {
    if (!user) return
    supabase.from('alumni').select('*').eq('auth_user_id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setAlumni(data)
          setForm({
            full_name: data.full_name || '',
            phone: data.phone || '',
            current_occupation: data.current_occupation || '',
            bio: data.bio || '',
          })
          if (data.avatar_url) setAvatarUrl(data.avatar_url)
        }
      })
  }, [user])

  if (!user) return <Navigate to="/login" replace />
  if (!alumni) return <PageLoader message="Loading profile..." />

  const initials = alumni.full_name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

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
      const publicUrl = await uploadAvatar(file, 'avatars')
      await supabase.from('alumni').update({ avatar_url: publicUrl }).eq('id', alumni.id)
      setAvatarUrl(publicUrl)
      setAvatarMsg({ type: 'success', text: 'Profile photo updated!' })
    } catch (err) {
      setAvatarMsg({ type: 'error', text: err.message })
    }
    setUploading(false)
  }

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    setMsg({ type: '', text: '' })
    const { error } = await supabase.from('alumni').update(form).eq('id', alumni.id)
    setSaving(false)
    setMsg(error ? { type: 'error', text: error.message } : { type: 'success', text: 'Profile updated successfully!' })
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

  const MsgBox = ({ msg }) => msg.text ? (
    <div className={`flex items-start gap-2 text-sm p-3 rounded-lg ${
      msg.type === 'error'
        ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400'
        : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
    }`}>
      {msg.type === 'error' ? <AlertCircle size={15} className="flex-shrink-0 mt-0.5" /> : <CheckCircle size={15} className="flex-shrink-0 mt-0.5" />}
      {msg.text}
    </div>
  ) : null

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">My Profile</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Avatar + Info */}
        <div className="flex flex-col gap-5">
          {/* Avatar Card */}
          <div className="card p-6 flex flex-col items-center text-center gap-4 animate-fade-in-up">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={alumni.full_name}
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
              <h2 className="font-bold text-gray-900 dark:text-white text-lg">{alumni.full_name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-1.5 mt-1">
                <GraduationCap size={13} />Class of {alumni.graduation_year}
              </p>
              <p className="text-xs text-gray-400 mt-1 break-all">{user.email}</p>
            </div>

            <MsgBox msg={avatarMsg} />
            <p className="text-xs text-gray-400">JPG, PNG or WebP · Max 5MB</p>
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-outline text-sm w-full flex items-center justify-center gap-2"
            >
              {uploading ? <><Spinner size={13} />Uploading...</> : <><Camera size={14} />Change Photo</>}
            </button>
          </div>
        </div>

        {/* Right — Edit + Password */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Edit Profile */}
          <form onSubmit={handleSave} className="card p-5 sm:p-6 flex flex-col gap-5 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <User size={16} className="text-primary-500" />Edit Profile
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5"><User size={12} />Full Name</label>
                <input value={form.full_name || ''} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} className="input" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5"><Phone size={12} />Phone</label>
                <input value={form.phone || ''} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} className="input" placeholder="+1 234 567 8900" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5"><Briefcase size={12} />Current Occupation</label>
              <input value={form.current_occupation || ''} onChange={e => setForm(f => ({ ...f, current_occupation: e.target.value }))} className="input" placeholder="Software Engineer at Acme" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5"><FileText size={12} />Bio</label>
              <textarea value={form.bio || ''} onChange={e => setForm(f => ({ ...f, bio: e.target.value }))} rows={4} className="input resize-none" placeholder="Tell us about yourself..." />
            </div>
            <MsgBox msg={msg} />
            <button type="submit" disabled={saving} className="btn-primary self-start flex items-center gap-2">
              {saving ? <><Spinner size={14} />Saving...</> : <><Save size={14} />Save Changes</>}
            </button>
          </form>

          {/* Change Password */}
          <form onSubmit={handlePasswordChange} className="card p-5 sm:p-6 flex flex-col gap-5 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h2 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
              <KeyRound size={16} className="text-primary-500" />Change Password
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">New Password</label>
                <div className="relative">
                  <input type={showPw ? 'text' : 'password'} minLength={8} value={pwForm.newPw}
                    onChange={e => setPwForm(f => ({ ...f, newPw: e.target.value }))}
                    className="input pr-10" placeholder="Min. 8 characters" />
                  <button type="button" onClick={() => setShowPw(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password</label>
                <input type="password" value={pwForm.confirm}
                  onChange={e => setPwForm(f => ({ ...f, confirm: e.target.value }))}
                  className="input" placeholder="Repeat password" />
              </div>
            </div>
            <MsgBox msg={pwMsg} />
            <button type="submit" disabled={pwSaving} className="btn-primary self-start flex items-center gap-2">
              {pwSaving ? <><Spinner size={14} />Updating...</> : <><KeyRound size={14} />Update Password</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
