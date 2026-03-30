import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Lock, Eye, EyeOff, KeyRound, CheckCircle, AlertCircle } from 'lucide-react'
import { Spinner } from '../components/Loader'

export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    setError('')
    const { error: err } = await updatePassword(password)
    if (err) { setError(err.message); setLoading(false); return }
    setDone(true)
    setTimeout(() => navigate('/login'), 2500)
  }

  if (done) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="card overflow-hidden">
          <div className="bg-gradient-to-br from-green-500 to-green-700 p-10 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-white" />
            </div>
            <h2 className="text-white font-black text-xl">Password Updated!</h2>
            <p className="text-white/80 text-sm mt-1">Redirecting you to login...</p>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-fade-in">
        <div className="card overflow-hidden">
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-center relative overflow-hidden">
            <div className="absolute top-3 right-4 w-8 h-8 bg-green-400/30 rounded-lg rotate-12" />
            <div className="absolute bottom-4 left-6 w-5 h-5 bg-green-400/20 rounded rotate-45" />
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
              <img src="/assets/phislogo.png" alt="PHIS" className="w-10 h-10 object-contain rounded-full" />
            </div>
            <h1 className="text-white font-black text-xl relative z-10">Set New Password</h1>
            <p className="text-white/75 text-sm mt-1 relative z-10">Choose a strong password for your account</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Lock size={13} /> New Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'} required minLength={8}
                    value={password} onChange={e => { setPassword(e.target.value); setError('') }}
                    className="input pr-10" placeholder="Min. 8 characters"
                  />
                  <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Lock size={13} /> Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirm ? 'text' : 'password'} required
                    value={confirm} onChange={e => { setConfirm(e.target.value); setError('') }}
                    className="input pr-10" placeholder="Repeat password"
                  />
                  <button type="button" onClick={() => setShowConfirm(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                    {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Password match indicator */}
              {confirm.length > 0 && (
                <p className={`text-xs flex items-center gap-1.5 ${password === confirm ? 'text-green-600 dark:text-green-400' : 'text-red-500'}`}>
                  {password === confirm
                    ? <><CheckCircle size={12} /> Passwords match</>
                    : <><AlertCircle size={12} /> Passwords do not match</>}
                </p>
              )}

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />{error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {loading ? <><Spinner size={14} />Saving...</> : <><KeyRound size={15} />Update Password</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
