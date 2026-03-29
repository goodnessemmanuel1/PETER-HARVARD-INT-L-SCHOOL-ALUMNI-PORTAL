import { useState } from 'react'
import { alumniService } from '../services/api'
import { UserPlus, CheckCircle, User, Mail, Phone, Calendar, Briefcase, FileText } from 'lucide-react'
import { Spinner } from '../components/Loader'

const YEARS = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i)

export default function Register() {
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', graduation_year: '',
    current_occupation: '', bio: '',
  })
  const [status, setStatus] = useState(null)
  const [error, setError] = useState('')

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    setStatus('loading')
    setError('')
    const { error: err } = await alumniService.register(form)
    if (err) { setError(err.message); setStatus('error') }
    else setStatus('success')
  }

  if (status === 'success') return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="card p-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Submitted!</h2>
        <p className="text-gray-500 dark:text-gray-400">Your application is pending admin approval. You'll be notified once reviewed.</p>
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <UserPlus size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alumni Registration</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Fill in your details to join the Peter Harvard INT'L School alumni community.</p>
      </div>

      <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-5">
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
          <textarea name="bio" value={form.bio} onChange={handleChange} rows={4} className="input resize-none" placeholder="Tell us about yourself and your achievements..." />
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={status === 'loading'} className="btn-primary w-full flex items-center justify-center gap-2">
          {status === 'loading' ? <><Spinner size={15} />Submitting...</> : <><UserPlus size={16} />Submit Registration</>}
        </button>
      </form>
    </div>
  )
}
