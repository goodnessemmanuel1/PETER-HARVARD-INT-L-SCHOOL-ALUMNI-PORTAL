import { useState, useRef } from 'react'
import { alumniService } from '../services/api'
import { supabase } from '../services/supabase'
import { UserPlus, CheckCircle, User, Mail, Phone, Calendar, Briefcase, FileText, Lock, Eye, EyeOff, Camera } from 'lucide-react'
import { Spinner } from '../components/Loader'

const currentYear = new Date().getFullYear()
// Years from current year down to 40 years ago — updates automatically every year
const YEARS = Array.from({ length: currentYear - (currentYear - 40) + 1 }, (_, i) => currentYear - i)

export default function Register() {
  const fileRef = useRef()
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', graduation_year: '',
    current_occupation: '', bio: '', password: '', confirm_password: '',
  })
  const [avatarFile, setAvatarFile] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [showPass, setShowPass] = useState(false)
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleAvatarPick = e => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async e => {
    e.preventDefault()
    if (form.password !== form.confirm_password) { setError('Passwords do not match'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setStatus('loading')
    setError('')

    let avatar_url = null

    // Upload photo if provided
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `pending-avatars/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('profiles').upload(path, avatarFile)
      if (upErr) { setError(upErr.message); setStatus('error'); return }
      const { data: { publicUrl } } = supabase.storage.from('profiles').getPublicUrl(path)
      avatar_url = publicUrl
    }

    const { full_name, email, phone, graduation_year, current_occupation, bio, password } = form
    const { error: err } = await alumniService.register({
      full_name, email, phone, graduation_year, current_occupation, bio, avatar_url, password,
    })

    if (err) { setError(err.message); setStatus('error') }
    else setStatus('success')
  }

  if (status === 'success') return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="card p-10 max-w-md w-full text-center animate-scale-in">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Submitted!</h2>
        <p className="text-gray-500 dark:text-gray-400">Your application is pending admin approval. Once approved, your login credentials will be sent to your email.</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 animate-fade-in">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <UserPlus size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alumni Registration</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Fill in your details to join the Peter Harvard INT'L School alumni community.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-6">

        {/* Profile Photo */}
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Preview" className="w-24 h-24 rounded-full object-cover border-4 border-primary-200 dark:border-primary-800" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-primary-100 dark:bg-primary-900/30 border-4 border-primary-200 dark:border-primary-800 flex items-center justify-center">
                <User size={32} className="text-primary-400" />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-md transition-colors"
            >
              <Camera size={14} />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
          </div>
          <p className="text-xs text-gray-400">Upload profile photo (optional)</p>
        </div>

        {/* Name & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <User size={13} />Full Name *
            </label>
            <input name="full_name" value={form.full_name} onChange={handleChange} required className="input" placeholder="John Doe" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <Mail size={13} />Email *
            </label>
            <input name="email" type="email" value={form.email} onChange={handleChange} required className="input" placeholder="john@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <Phone size={13} />Phone
            </label>
            <input name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="+1 234 567 8900" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <Calendar size={13} />Graduation Year *
            </label>
            <select name="graduation_year" value={form.graduation_year} onChange={handleChange} required className="input">
              <option value="">Select year</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
            <Briefcase size={13} />Current Occupation
          </label>
          <input name="current_occupation" value={form.current_occupation} onChange={handleChange} className="input" placeholder="Software Engineer at Acme Corp" />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
            <FileText size={13} />Short Bio
          </label>
          <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="input resize-none" placeholder="Tell us about yourself and your achievements..." />
        </div>

        {/* Password */}
        <div className="border-t border-gray-100 dark:border-gray-800 pt-5">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4 flex items-center gap-1.5">
            <Lock size={14} />Set Your Password
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password *</label>
              <div className="relative">
                <input
                  name="password" type={showPass ? 'text' : 'password'}
                  value={form.password} onChange={handleChange}
                  required minLength={8} className="input pr-10" placeholder="Min. 8 characters"
                />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Confirm Password *</label>
              <input
                name="confirm_password" type="password"
                value={form.confirm_password} onChange={handleChange}
                required className="input" placeholder="Repeat password"
              />
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">You'll use this password to log in once your registration is approved.</p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full flex items-center justify-center gap-2">
          {status === 'loading' ? <><Spinner size={15} />Submitting...</> : <><UserPlus size={16} />Submit Registration</>}
        </button>
      </form>
    </div>
  )
}
