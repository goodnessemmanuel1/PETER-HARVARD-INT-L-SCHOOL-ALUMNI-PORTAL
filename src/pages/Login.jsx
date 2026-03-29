import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { LogIn, Mail, Lock, Eye, EyeOff, KeyRound } from 'lucide-react'
import { Spinner } from '../components/Loader'

export default function Login() {
  const { signIn, updatePassword } = useAuth()
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
    if (err) { setError(err.message); setLoading(false); return }

    // If user has the temp_password flag, prompt to change
    if (data?.user?.user_metadata?.must_change_password) {
      setStep('change-password')
      setLoading(false)
    } else {
      navigate(data?.user?.user_metadata?.role === 'admin' ? '/admin' : '/directory')
    }
  }

  const handleChangePassword = async e => {
    e.preventDefault()
    if (newPassword.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    const { error: err } = await updatePassword(newPassword)
    if (err) { setError(err.message); setLoading(false); return }
    navigate('/directory')
  }

  if (step === 'change-password') return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <img src="/assets/phislogo.png" alt="Peter Harvard" className="w-14 h-14 rounded-full object-cover mx-auto mb-4" />
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
          {error && <p className="text-sm text-red-500">{error}</p>}
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
          <img src="/assets/phislogo.png" alt="Peter Harvard" className="w-14 h-14 rounded-full object-cover mx-auto mb-4" />
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
            <input type="email" required className="input" value={form.email}
              onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
              placeholder="your@email.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <Lock size={13} />Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'}
                required className="input pr-10" value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

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
