import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react'
import { Spinner } from '../components/Loader'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error: err } = await resetPassword(email)
    if (err) { setError(err.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <img src="/assets/phislogo.png" alt="Peter Harvard" className="w-14 h-14 rounded-full object-cover mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot Password</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
            Enter your email and we'll send a reset link
          </p>
        </div>

        {sent ? (
          <div className="card p-8 text-center animate-scale-in">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
            </div>
            <h2 className="font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
              We sent a password reset link to <span className="font-medium text-gray-700 dark:text-gray-300">{email}</span>
            </p>
            <Link to="/login" className="btn-primary inline-flex items-center gap-2 text-sm">
              <ArrowLeft size={14} />Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-5 animate-scale-in">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 flex items-center gap-1.5">
                <Mail size={13} />Email address
              </label>
              <input
                type="email" required value={email}
                onChange={e => setEmail(e.target.value)}
                className="input" placeholder="your@email.com"
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2">
              {loading ? <><Spinner size={14} />Sending...</> : <><Mail size={15} />Send Reset Link</>}
            </button>
            <Link to="/login" className="text-sm text-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center justify-center gap-1 transition-colors">
              <ArrowLeft size={13} />Back to Login
            </Link>
          </form>
        )}
      </div>
    </div>
  )
}
