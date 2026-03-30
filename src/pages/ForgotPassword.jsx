import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../services/supabase'
import { Mail, ArrowLeft, CheckCircle, AlertCircle, KeyRound, Hash } from 'lucide-react'
import { Spinner } from '../components/Loader'

export default function ForgotPassword() {
  const { resetPassword } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  // OTP verification state
  const [otp, setOtp] = useState('')
  const [verifying, setVerifying] = useState(false)
  const [otpError, setOtpError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setLoading(true)
    setError('')

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

  const handleVerifyOtp = async e => {
    e.preventDefault()
    if (otp.trim().length < 6) { setOtpError('Please enter the full code from your email.'); return }
    setVerifying(true)
    setOtpError('')

    const { error: err } = await supabase.auth.verifyOtp({
      email,
      token: otp.trim(),
      type: 'recovery',
    })

    if (err) {
      setOtpError('Invalid or expired code. Please check your email and try again.')
      setVerifying(false)
      return
    }

    // OTP verified — session is now active, redirect to reset password page
    navigate('/reset-password')
  }

  if (sent) return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md animate-scale-in">
        <div className="card overflow-hidden">
          <div className="bg-gradient-to-br from-green-500 to-green-700 p-8 text-center">
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <img src="/assets/phislogo.png" alt="PHIS" className="w-10 h-10 object-contain rounded-full" />
            </div>
            <h2 className="text-white font-black text-xl">Check Your Email</h2>
            <p className="text-white/80 text-sm mt-1">Reset link & code sent to <strong>{email}</strong></p>
          </div>

          <div className="p-8">
            <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4 mb-6">
              <CheckCircle size={18} className="text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-800 dark:text-green-300">
                Click the <strong>Reset password</strong> link in your email, or enter the code below to continue here.
              </p>
            </div>

            {/* OTP entry */}
            <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 flex items-center gap-1.5">
                  <Hash size={13} /> Enter Code from Email
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={8}
                  value={otp}
                  onChange={e => { setOtp(e.target.value.replace(/\D/g, '')); setOtpError('') }}
                  className="input text-center text-2xl font-black tracking-[0.4em] py-4"
                  placeholder="········"
                  autoFocus
                />
                <p className="text-xs text-gray-400 mt-1.5">The code is in your email — e.g. <span className="font-mono font-bold">20177914</span></p>
              </div>

              {otpError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle size={15} className="flex-shrink-0 mt-0.5" />{otpError}
                </div>
              )}

              <button type="submit" disabled={verifying || otp.length < 6} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {verifying ? <><Spinner size={14} />Verifying...</> : <><KeyRound size={15} />Verify & Set New Password</>}
              </button>
            </form>

            <div className="mt-5 pt-5 border-t border-gray-100 dark:border-gray-800 flex flex-col gap-2 text-center">
              <p className="text-xs text-gray-400">
                Didn't receive it? Check your spam folder or{' '}
                <button onClick={() => setSent(false)} className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
                  try again
                </button>
              </p>
              <Link to="/login" className="text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 flex items-center justify-center gap-1 transition-colors">
                <ArrowLeft size={13} /> Back to Login
              </Link>
            </div>
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
            <div className="absolute top-8 left-10 w-3 h-3 bg-green-300/25 rounded-sm rotate-12" />
            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 relative z-10">
              <img src="/assets/phislogo.png" alt="PHIS" className="w-10 h-10 object-contain rounded-full" />
            </div>
            <h1 className="text-white font-black text-xl relative z-10">Forgot Password?</h1>
            <p className="text-white/75 text-sm mt-1 relative z-10">Enter your email to receive a reset link & code</p>
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
