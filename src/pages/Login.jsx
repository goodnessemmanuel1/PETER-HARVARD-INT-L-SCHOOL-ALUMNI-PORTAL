import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogIn, Mail, Lock, Eye, EyeOff, KeyRound, AlertCircle } from 'lucide-react'
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
  if (m.includes('user not found'))
    return 'No alumni account found with this email.'
  return msg
}

function ErrorBox({ message }) {
  if (!message) return null
  return (
    <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
      <p className="text-sm font-medium leading-snug">{message}</p>
    </div>
  )
}

export default function Login() {
  const { signIn, signOut, updatePassword } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [newPassword, setNewPassword] = useState('')
  const [showNew, setShowNew] = useState(false)
  const [showPass, setShowPass] = useState(false)
  const [step, setStep] = useState('login') // 'login' | 'change-password'
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { data, error: err } = await signIn(form.email, form.password)
    if (err) { setError(friendlyError(err.message)); setLoading(false); return }

    if (data?.user?.user_metadata?.role === 'admin') {
      await signOut()
      setError('Admin accounts must use the Admin portal to log in.')
      setLoading(false)
      return
    }

    if (data?.user?.user_metadata?.must_change_password) {
      setStep('change-password')
      setLoading(false)
    } else {
      navigate('/dashboard')
    }
  }

  const handleChangePassword = async e => {
    e.preventDefault()
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    setError('')
    const { error: err } = await updatePassword(newPassword)
    if (err) { setError(friendlyError(err.message)); setLoading(false); return }
    navigate('/dashboard')
  }

  if (step === 'change-password') return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/assets/phislogo.png" alt="Peter Harvard" className="w-20 h-20 object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Welcome! Please set a new password for your account.
          </p>
        </div>
        <form onSubmit={handleChangePassword} className="card p-8 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <Lock size={13} />New Password
            </label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                minLength={8}
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="input pr-10"
                placeholder="Min. 8 characters"
              />
              <button type="button" onClick={() => setShowNew(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <ErrorBox message={error} />
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            <KeyRound size={15} />{loading ? <><Spinner size={14} /> Saving...</> : 'Set Password & Continue'}
          </button>
        </form>
      </div>
    </div>
  )

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/assets/phislogo.png" alt="Peter Harvard" className="w-20 h-20 object-contain mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alumni Login</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Sign in with the credentials sent to your email after approval
          </p>
        </div>

        <form onSubmit={handleLogin} className="card p-8 flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <Mail size={13} />Email
            </label>
            <input
              type="email"
              required
              className="input"
              value={form.email}
              onChange={e => { setForm(f => ({ ...f, email: e.target.value })); setError('') }}
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <Lock size={13} />Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required
                className="input pr-10"
                value={form.password}
                onChange={e => { setForm(f => ({ ...f, password: e.target.value })); setError('') }}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <ErrorBox message={error} />

          <div className="flex items-center justify-between">
            <Link to="/forgot-password" className="text-xs text-primary-600 dark:text-primary-400 hover:underline">Forgot password?</Link>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            <LogIn size={16} />{loading ? <><Spinner size={14} /> Signing in...</> : 'Sign In'}
          </button>
        </form>

        <div className="text-center mt-4 space-y-2">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Not registered yet?{' '}
            <Link to="/register" className="text-primary-600 dark:text-primary-400 hover:underline">Register as Alumni</Link>
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Your login credentials are sent to your email once your registration is approved.
          </p>
        </div>
      </div>
    </div>
  )
}
