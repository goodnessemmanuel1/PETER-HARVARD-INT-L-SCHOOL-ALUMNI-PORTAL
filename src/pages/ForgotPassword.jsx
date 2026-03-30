import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'
import { Mail, ArrowLeft, CheckCircle, AlertCircle, KeyRound } from 'lucide-react'
import { Spinner } from '../components/Loader'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [code, setCode] = useState('')

  // Generate a 8-digit display code for reference
  useEffect(() => {
    setCode(Math.floor(10000000 + Math.random() * 90000000).toString())
  }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Check if email exists in alumni table
    const { data } = await supabase
      .from('alumni')
      .select('id')
      .eq('email', email.trim().toLowerCase())
      .eq('status', 'approved')
      .maybeSingle()

    if (!data) {
      setError('No approved alumni account found with this email address.')
      setLoading(false)
      return
    }

    const { error: err } = await resetPassword(email)
    if (err) { setError(err.message); setLoading(false); return }
    setSent(true)
    setLoading(false)
  }

  if (sent) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-scale-in">
        <div className="card overflow-hidden">
          {/* Green header */}
          <div className="bg-gradient-to-br from-green-500 to-green-700 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="/assets/phislogo.png" alt="PHIS" className="w-10 h-10 object-contain rounded-full" />
            </div>
            <h2 className="text-white font-black text-xl">Check Your Email</h2>
            <p className="text-white/80 text-sm mt-1">Reset link sent successfully</p>
          </div>

          <div className="p-8">
            <div className="flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
              <CheckCircle size={20} className="text-green-600 dark:text-green-400 flex-shrink-0" />
              <p className="text-sm text-green-800 dark:text-green-300">
                We sent a password reset link to <strong>{email}</strong>
              </p>
            </div>

            {/* Reference code */}
            <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-5 mb-6 text-center">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex items-center justify-center gap-1.5">
                <KeyRound size={12} /> Your Reference Code
              </p>
              <p className="text-2xl font-black tracking-[0.3em] text-gray-900 dark:text-white">{code}</p>
              <p className="text-xs text-gray-400 mt-2">Alternatively, enter this code if prompted</p>
            </div>

            <p className="text-xs text-gray-400 text-center mb-6 leading-relaxed">
              Didn't receive it? Check your spam folder or contact us at{' '}
              <a href="mailto:anointedthedeveloper@gmail.com" className="text-primary-600 dark:text-primary-400 hover:underline">
                anointedthedeveloper@gmail.com
              </a>
            </p>

            <Link to="/login" className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
              <ArrowLeft size={14} /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="card overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-br from-primary-600 to-primary-800 p-8 text-center relative overflow-hidden">
            {/* Green accent squares */}
            <div className="absolute top-3 right-4 w-8 h-8 bg-green-400/30 rounded-lg rotate-12" />
            <div className="absolute bottom-4 left-6 w-5 h-5 bg-green-400/20 rounded rotate-45" />
            <div className="absolute top-8 left-10 w-3 h-3 bg-green-300/25 rounded-sm rotate-12" />
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
              <img src="/assets/phislogo.png" alt="PHIS" className="w-10 h-10 object-contain rounded-full" />
            </div>
            <h1 className="text-white font-black text-xl relative z-10">Forgot Password?</h1>
            <p className="text-white/75 text-sm mt-1 relative z-10">Enter your email to receive a reset link</p>
          </div>

          <div className="p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Mail size={13} /> Email Address
                </label>
                <input
                  type="email" required value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  className="input" placeholder="your@email.com"
                />
              </div>

              {error && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />{error}
                </div>
              )}

              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {loading ? <><Spinner size={14} />Checking...</> : <><Mail size={15} />Send Reset Link</>}
              </button>

              <Link to="/login" className="text-sm text-center text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center justify-center gap-1 transition-colors">
                <ArrowLeft size={13} /> Back to Login
              </Link>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
