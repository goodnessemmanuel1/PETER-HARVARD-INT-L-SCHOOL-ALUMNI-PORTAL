import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bug, X, Send, CheckCircle, AlertTriangle } from 'lucide-react'
import { bugService } from '../services/api'
import { Spinner } from './Loader'

const CATEGORIES = ['UI / Display Issue', 'Feature Not Working', 'Error / Crash', 'Performance', 'Other']

export default function ReportBug({ open, onClose }) {
  const [form, setForm] = useState({ name: '', email: '', category: '', description: '' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.description.trim()) { setError('Please describe the issue.'); return }
    setSending(true)
    setError('')
    const { error: err } = await bugService.submit({ ...form, status: 'open' })
    setSending(false)
    if (err) { setError('Failed to submit. Please try again.'); return }
    setSent(true)
    setForm({ name: '', email: '', category: '', description: '' })
  }

  const handleClose = () => { onClose(); setSent(false); setError('') }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
          onClick={handleClose}>
          <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 16 }}
            onClick={e => e.stopPropagation()}
            className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 dark:border-gray-800 overflow-hidden">

            <div className="bg-gradient-to-br from-primary-700 to-primary-800 px-6 py-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
                  <Bug size={18} className="text-white" />
                </div>
                <div>
                  <h2 className="text-white font-black text-lg">Report a Bug</h2>
                  <p className="text-white/70 text-xs">Help us improve the portal</p>
                </div>
              </div>
              <button onClick={handleClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors">
                <X size={16} />
              </button>
            </div>

            <div className="p-6">
              {sent ? (
                <div className="text-center py-6">
                  <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-2">Report Submitted!</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">Thank you. Our team will look into this.</p>
                  <button onClick={handleClose} className="btn-primary text-sm px-6">Close</button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Your Name</label>
                      <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="input text-sm py-2" placeholder="Optional" />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Email</label>
                      <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="input text-sm py-2" placeholder="Optional" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Category</label>
                    <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input text-sm py-2">
                      <option value="">Select a category</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Describe the Issue *</label>
                    <textarea required value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={4} className="input text-sm resize-none" placeholder="What happened? What were you doing when it occurred?" />
                  </div>
                  {error && (
                    <div className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                      <AlertTriangle size={14} />{error}
                    </div>
                  )}
                  <button type="submit" disabled={sending} className="btn-primary flex items-center justify-center gap-2 text-sm">
                    {sending ? <><Spinner size={14} />Submitting...</> : <><Send size={14} />Submit Report</>}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
