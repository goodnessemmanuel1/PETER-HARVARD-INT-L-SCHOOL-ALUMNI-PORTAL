import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogIn, Mail, Lock, Eye, EyeOff, KeyRound, AlertCircle, GraduationCap, Users, Star } from 'lucide-react'
import { Spinner } from '../components/Loader'

function friendlyError(msg) {
  if (!msg) return 'Something went wrong. Please try again.'
  const m = msg.toLowerCase()
  if (m.includes('invalid login') || m.includes('invalid credentials') || m.includes('wrong password'))
    return 'Incorrect email or password. Please check your credentials and try again.'
  if (m.includes('email not confirmed'))
    return 'Your email has not been confirmed. Please check your inbox.'
  if (m.includes('email') && m.includes('not found'))
    return 'No account found with this email address.'
  if (m.includes('too many requests') || m.includes('rate limit'))
    return 'Too many login attempts. Please wait a few minutes and try again.'
  if (m.includes('network') || m.includes('fetch'))
    return 'Network error. Please check your internet connection.'
  return msg
}

export default function Login() {
  const { signIn, signOut, updatePassword, user, isAdmin, loading } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [newPassword, setNewPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [step, setStep] = useState('login')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!loading && user && !isAdmin) navigate('/dashboard', { replace: true })
  }, [user, isAdmin, loading])

  const handleLogin = async e => {
    e.preventDefault()
    setSubmitting(true)
    setError('')
    const { data, error: err } = await signIn(form.email, form.password)
    if (err) { setError(friendlyError(err.message)); setSubmitting(false); return }
    if (data?.user?.user_metadata?.role === 'admin') {
      await signOut()
      setError('Admin accounts must use the Admin portal to log in.')
      setSubmitting(false)
      return
    }
    if (data?.user?.user_metadata?.must_change_password) {
      setStep('change-password')
      setSubmitting(false)
    } else {
      navigate('/dashboard', { replace: true })
    }
  }

  const handleChangePassword = async e => {
    e.preventDefault()
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return }
    setSubmitting(true)
    setError('')
    const { error: err } = await updatePassword(newPassword)
    if (err) { setError(friendlyError(err.message)); setSubmitting(false); return }
    navigate('/dashboard', { replace: true })
  }

  const HeroPanel = () => (
    <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-primary-700 to-primary-900 text-white p-12 w-[45%] flex-shrink-0 relative overflow-hidden">
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
        <h2 className="text-4xl font-black leading-tight mb-4">
          Welcome back to your alumni community
        </h2>
        <p className="text-white/70 leading-relaxed mb-10">
          Sign in to access your profile, connect with fellow graduates, and stay updated on school news and events.
        </p>
        <div className="flex flex-col gap-4">
          {[
            { icon: <GraduationCap size={18} />, text: 'Access your alumni profile' },
            { icon: <Users size={18} />, text: 'Connect with fellow graduates' },
            { icon: <Star size={18} />, text: 'Stay updated on school events' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/15 flex items-center justify-center flex-shrink-0">
                {item.icon}
              </div>
              <span className="text-white/80 text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-white/40 text-xs">© {new Date().getFullYear()} Peter Harvard INT'L School</p>
    </div>
  )

  if (step === 'change-password') return (
    <div className="min-h-[calc(100vh-64px)] flex">
      <HeroPanel />
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <div className="w-12 h-12 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-4">
              <KeyRound size={22} className="text-primary-600 dark:text-primary-400" />
            </div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white mb-1">Set New Password</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Welcome! Please set a new password for your account.</p>
          </div>
          <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">New Password</label>
              <div className="relative">
                <input type={showNew ? 'text' : 'password'} required minLength={8} value={newPassword}
                  onChange={e => setNewPassword(e.target.value)} className="input pr-10" placeholder="Min. 8 characters" />
                <button type="button" onClick={() => setShowNew(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />{error}
              </div>
            )}
            <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <><Spinner size={14} />Saving...</> : <><KeyRound size={15} />Set Password & Continue</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-[calc(100vh-64px)] flex">
      <HeroPanel />
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <img src="/assets/phislogo.png" alt="PHIS" className="w-10 h-10 object-contain" />
            <div>
              <p className="font-black text-base text-gray-900 dark:text-white leading-none">Peter Harvard</p>
              <p className="text-primary-600 dark:text-primary-400 text-[10px] font-bold tracking-widest uppercase">Alumni Portal</p>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-1">Sign In</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Use the credentials sent to your email after approval.
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                <Mail size={13} />Email Address
              </label>
              <input type="email" required className="input" value={form.email}
                onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError('') }}
                placeholder="your@email.com" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                  <Lock size={13} />Password
                </label>
                <Link to="/forgot-password" className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} required className="input pr-10" value={form.password}
                  onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError('') }}
                  placeholder="••••••••" />
                <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />{error}
              </div>
            )}

            <button type="submit" disabled={submitting} className="btn-primary w-full flex items-center justify-center gap-2 py-3 mt-1">
              {submitting ? <><Spinner size={14} />Signing in...</> : <><LogIn size={16} />Sign In</>}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 text-center space-y-2">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Not registered yet?{' '}
              <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">Register as Alumni</Link>
            </p>
            <p className="text-xs text-gray-400">
              Login credentials are sent to your email once approved.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
