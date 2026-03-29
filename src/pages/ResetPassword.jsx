import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Lock, Eye, EyeOff, KeyRound } from 'lucide-react'
import { Spinner } from '../components/Loader'

export default function ResetPassword() {
  const { updatePassword } = useAuth()
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    setLoading(true)
    setError('')
    const { error: err } = await updatePassword(password)
    if (err) { setError(err.message); setLoading(false); return }
    navigate('/login')
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <img src="/favicon.ico" alt="Peter Harvard" className="w-14 h-14 rounded-full object-cover mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Set New Password</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Choose a strong password for your account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-5 animate-scale-in">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <Lock size={13} />New Password
            </label>
            <div className="relative">
              <input
                type={showPass ? 'text' : 'password'} required minLength={8}
                value={password} onChange={e => setPassword(e.target.value)}
                className="input pr-10" placeholder="Min. 8 characters"
              />
              <button type="button" onClick={() => setShowPass(s => !s)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
              <Lock size={13} />Confirm Password
            </label>
            <input
              type="password" required value={confirm}
              onChange={e => setConfirm(e.target.value)}
              className="input" placeholder="Repeat password"
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
            {loading ? <><Spinner size={14} />Saving...</> : <><KeyRound size={15} />Update Password</>}
          </button>
        </form>
      </div>
    </div>
  )
}
