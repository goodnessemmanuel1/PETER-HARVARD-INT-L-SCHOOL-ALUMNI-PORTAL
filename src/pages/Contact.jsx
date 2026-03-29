import { useState } from 'react'
import { Mail, Send, CheckCircle, ExternalLink } from 'lucide-react'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()
    // Opens default mail client as a simple contact solution
    const mailto = `mailto:emmanuelgoodnesscj@gmail.com?subject=${encodeURIComponent(form.subject)}&body=${encodeURIComponent(`From: ${form.name} (${form.email})\n\n${form.message}`)}`
    window.location.href = mailto
    setSent(true)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Mail size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Us</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Have questions or need help? Reach out to the team.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Info */}
        <div className="flex flex-col gap-5">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Frontend Developer</p>
                  <a href="mailto:emmanuelgoodnesscj@gmail.com" className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all">
                    emmanuelgoodnesscj@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <Mail size={15} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">Backend Developer</p>
                  <a href="mailto:anointedthedeveloper@gmail.com" className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all">
                    anointedthedeveloper@gmail.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
                  <ExternalLink size={15} className="text-primary-600 dark:text-primary-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-400 mb-0.5">LinkedIn</p>
                  <a href="https://linkedin.com/in/emmanuelgoodness" target="_blank" rel="noreferrer" className="text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                    linkedin.com/in/emmanuelgoodness
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6 bg-primary-600 dark:bg-primary-700 border-primary-600">
            <h3 className="font-semibold text-white mb-2">Join the Community</h3>
            <p className="text-white/75 text-sm mb-4">Register as an alumni to access the full directory and stay connected.</p>
            <a href="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-gray-100 font-semibold px-4 py-2 rounded-lg text-sm transition-colors">
              Register Now
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="card p-10 text-center h-full flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
              <p className="text-gray-500 dark:text-gray-400">Your email client should have opened. We'll get back to you soon.</p>
              <button onClick={() => setSent(false)} className="btn-outline mt-6 text-sm">Send Another</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="card p-8 flex flex-col gap-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="input" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
                  <input required type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} className="input" placeholder="john@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Subject *</label>
                <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} className="input" placeholder="How can we help?" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Message *</label>
                <textarea required value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={6} className="input resize-none" placeholder="Write your message here..." />
              </div>
              <button type="submit" className="btn-primary self-start flex items-center gap-2">
                <Send size={15} />Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
