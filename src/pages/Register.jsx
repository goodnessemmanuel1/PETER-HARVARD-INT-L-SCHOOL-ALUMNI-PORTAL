import { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { alumniService } from '../services/api'
import { supabase } from '../services/supabase'
import { UserPlus, CheckCircle, User, Mail, Phone, Calendar, Briefcase, FileText, Lock, Eye, EyeOff, Camera, AlertCircle, GraduationCap, Heart, Globe } from 'lucide-react'
import { Spinner } from '../components/Loader'

const currentYear = new Date().getFullYear()
const START_YEAR = 2024
const YEARS = Array.from({ length: currentYear - START_YEAR + 1 }, (_, i) => START_YEAR + i).reverse()

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
    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const path = `pending-avatars/${Date.now()}.${ext}`
      const { error: upErr } = await supabase.storage.from('gallery').upload(path, avatarFile)
      if (upErr) { setError(upErr.message); setStatus(null); return }
      avatar_url = supabase.storage.from('gallery').getPublicUrl(path).data.publicUrl
    }

    const { full_name, email, phone, graduation_year, current_occupation, bio, password } = form

    const { data: existing } = await supabase.from('alumni').select('id, status').ilike('email', email.trim()).maybeSingle()
    if (existing) {
      const msg = existing.status === 'pending'
        ? 'You already have a pending registration. Please wait for admin approval.'
        : existing.status === 'approved'
        ? 'An account with this email already exists. Please log in instead.'
        : existing.status === 'rejected'
        ? 'This registration was previously rejected. Please contact an admin.'
        : 'This email is already registered.'
      setError(msg)
      setStatus(null)
      return
    }

    const { error: err } = await alumniService.register({
      full_name, email, phone, graduation_year, current_occupation, bio, avatar_url, password,
    })

    if (err) {
      const msg = err.message || ''
      setError(msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique')
        ? 'An account with this email already exists.'
        : msg || 'Registration failed. Please try again.')
      setStatus(null)
    } else {
      setStatus('success')
    }
  }

  if (status === 'success') return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center px-4 bg-gray-50 dark:bg-gray-950">
      <div className="card p-10 max-w-md w-full text-center shadow-xl">
        <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-5">
          <CheckCircle size={36} className="text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Registration Submitted!</h2>
        <p className="text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
          Your application is pending admin approval. Once approved, your login credentials will be sent to your email.
        </p>
        <Link to="/" className="btn-primary inline-flex items-center gap-2">Back to Home</Link>
      </div>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      {/* Hero Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary-700 to-primary-900 text-white p-12 w-[38%] flex-shrink-0 relative overflow-hidden">
        {/* Green decorative squares */}
        <div className="absolute top-10 right-8 w-16 h-16 bg-green-400/20 rounded-2xl rotate-12 pointer-events-none" />
        <div className="absolute top-32 right-16 w-8 h-8 bg-green-400/15 rounded-lg rotate-45 pointer-events-none" />
        <div className="absolute bottom-24 right-6 w-12 h-12 bg-green-500/20 rounded-xl -rotate-12 pointer-events-none" />
        <div className="absolute bottom-48 right-20 w-5 h-5 bg-green-300/20 rounded rotate-12 pointer-events-none" />
        <div className="absolute top-1/2 right-4 w-6 h-6 bg-green-400/10 rounded-md rotate-45 pointer-events-none" />
        <div className="flex items-center gap-3">
          <img src="/assets/phislogo.png" alt="PHIS" className="w-12 h-12 object-contain" />
          <div>
            <p className="font-black text-lg leading-none">Peter Harvard</p>
            <p className="text-white/60 text-xs font-bold tracking-widest uppercase">Alumni Portal</p>
          </div>
        </div>
        <div>
          <h2 className="text-3xl font-black leading-tight mb-4">
            Join the Peter Harvard Alumni Community
          </h2>
          <p className="text-white/70 leading-relaxed mb-8">
            Register to connect with fellow graduates, access the alumni directory, and stay updated on school news and events.
          </p>
          <div className="flex flex-col gap-4">
            {[
              { icon: <GraduationCap size={17} />, text: 'Connect with graduates across all years' },
              { icon: <Heart size={17} />, text: 'Stay connected to your alma mater' },
              { icon: <Globe size={17} />, text: 'Access events and announcements' },
            ].map(item => (
              <div key={item.text} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">{item.icon}</div>
                <span className="text-white/80 text-sm font-medium">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
        <p className="text-white/40 text-xs">© {new Date().getFullYear()} Peter Harvard INT'L School</p>
      </div>

      {/* Form Panel */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-6">
            <img src="/assets/phislogo.png" alt="PHIS" className="w-10 h-10 object-contain" />
            <div>
              <p className="font-black text-base text-gray-900 dark:text-white leading-none">Peter Harvard</p>
              <p className="text-primary-600 dark:text-primary-400 text-[10px] font-bold tracking-widest uppercase">Alumni Portal</p>
            </div>
          </div>

          <div className="mb-7">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">Alumni Registration</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Fill in your details to join the community. <span className="text-green-600 dark:text-green-400 font-semibold">It's free!</span></p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            {/* Avatar */}
            <div className="flex items-center gap-5 p-5 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border border-gray-100 dark:border-gray-800">
              <div className="relative flex-shrink-0">
                {avatarPreview
                  ? <img src={avatarPreview} alt="Preview" className="w-20 h-20 rounded-2xl object-cover border-2 border-primary-200 dark:border-primary-800" />
                  : <div className="w-20 h-20 rounded-2xl bg-primary-100 dark:bg-primary-900/30 border-2 border-primary-200 dark:border-primary-800 flex items-center justify-center">
                      <User size={28} className="text-primary-400" />
                    </div>
                }
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 hover:bg-primary-700 text-white flex items-center justify-center shadow-md transition-colors">
                  <Camera size={13} />
                </button>
                <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarPick} />
              </div>
              <div>
                <p className="font-semibold text-gray-900 dark:text-white text-sm mb-0.5">Profile Photo</p>
                <p className="text-xs text-gray-400">Optional — JPG, PNG or WebP</p>
                <button type="button" onClick={() => fileRef.current?.click()}
                  className="mt-2 text-xs font-semibold text-primary-600 dark:text-primary-400 hover:underline">
                  {avatarPreview ? 'Change photo' : 'Upload photo'}
                </button>
              </div>
            </div>

            {/* Personal Info */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-green-600 dark:text-green-400 mb-3">Personal Information</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><User size={12} />Full Name *</label>
                  <input name="full_name" value={form.full_name} onChange={handleChange} required className="input" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><Mail size={12} />Email *</label>
                  <input name="email" type="email" value={form.email} onChange={handleChange} required className="input" placeholder="john@example.com" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><Phone size={12} />Phone</label>
                  <input name="phone" value={form.phone} onChange={handleChange} className="input" placeholder="+234 800 000 0000" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><Calendar size={12} />Graduation Year *</label>
                  <select name="graduation_year" value={form.graduation_year} onChange={handleChange} required className="input">
                    <option value="">Select year</option>
                    {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Professional */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-green-600 dark:text-green-400 mb-3">Professional Details</p>
              <div className="flex flex-col gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><Briefcase size={12} />Current Occupation</label>
                  <input name="current_occupation" value={form.current_occupation} onChange={handleChange} className="input" placeholder="Software Engineer at Acme Corp" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5"><FileText size={12} />Short Bio</label>
                  <textarea name="bio" value={form.bio} onChange={handleChange} rows={3} className="input resize-none" placeholder="Tell us about yourself and your achievements..." />
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <p className="text-xs font-black uppercase tracking-widest text-green-600 dark:text-green-400 mb-3 flex items-center gap-1.5"><Lock size={11} />Set Your Password</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Password *</label>
                  <div className="relative">
                    <input name="password" type={showPass ? 'text' : 'password'} value={form.password} onChange={handleChange}
                      required minLength={8} className="input pr-10" placeholder="Min. 8 characters" />
                    <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                      {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Confirm Password *</label>
                  <input name="confirm_password" type="password" value={form.confirm_password} onChange={handleChange}
                    required className="input" placeholder="Repeat password" />
                </div>
              </div>
              <p className="text-xs text-green-600 dark:text-green-400 mt-2 flex items-center gap-1">✓ You'll use this password to log in once your registration is approved.</p>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" /><span>{error}</span>
              </div>
            )}

            <button type="submit" disabled={status === 'loading'} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {status === 'loading' ? <><Spinner size={15} />Submitting...</> : <><UserPlus size={16} />Submit Registration</>}
            </button>

            <p className="text-center text-sm text-gray-500 dark:text-gray-400">
              Already registered?{' '}
              <Link to="/login" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">Sign In</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
