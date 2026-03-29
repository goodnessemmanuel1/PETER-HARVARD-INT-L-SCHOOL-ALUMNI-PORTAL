import { useState } from 'react'
import { Mail, Send, CheckCircle, Globe, Phone } from 'lucide-react'
import { contactService } from '../services/api'

const founder = {
  name: 'Dr. Peter Oyedotun Agunloye',
  role: 'Founder, Peter Harvard INT\'L School',
  photo: '/assets/founders/DrPeter.png',
  phones: ['08033570685'],
  email: null,
  linkedin: 'https://ng.linkedin.com/in/dr-peter-oyedotun-agunloye',
}

const team = [
  {
    name: 'Anointed Agunloye',
    role: 'Senior Dev & Operations Engineer',
    photo: '/assets/Developers/anointed.png',
    email: 'anointedthedeveloper@gmail.com',
    phones: ['+2348101209470', '+2349016471351'],
    links: [
      { label: 'GitHub', href: 'https://github.com/anointedthedeveloper', icon: 'github' },
      { label: 'Dev.to', href: 'https://dev.to/anointedthedeveloper', icon: 'devto' },
      { label: 'Website', href: 'https://anobyte.online', icon: 'globe' },
    ],
  },
  {
    name: 'Goodness Emmanuel',
    role: 'Frontend Developer',
    photo: '/assets/Developers/goodness.png',
    email: 'emmanuelgoodnesscj@gmail.com',
    phones: ['+2347018621884'],
    links: [
      { label: 'GitHub', href: 'https://github.com/goodnessemmanuel1', icon: 'github' },
      { label: 'LinkedIn', href: 'https://linkedin.com/in/emmanuelgoodness', icon: 'linkedin' },
    ],
  },
]

function SocialIcon({ type, size = 15 }) {
  if (type === 'github') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
  if (type === 'devto') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M7.42 10.05c-.18-.16-.46-.23-.84-.23H6l.02 2.44.04 2.45.56-.02c.41 0 .63-.07.83-.26.24-.24.26-.36.26-2.2 0-1.91-.02-1.96-.29-2.18zM0 4.94v14.12h24V4.94H0zM8.56 15.3c-.44.58-1.06.77-2.53.77H4.71V8.53h1.4c1.67 0 2.16.18 2.6.9.27.43.29.6.32 2.57.05 2.23-.02 2.73-.47 3.3zm5.09-5.47h-2.47v1.77h1.52v1.28l-.72.04-.75.03v1.77l1.22.03 1.2.04v1.28h-1.6c-1.53 0-1.6-.01-1.87-.3l-.3-.28v-3.16c0-3.02.01-3.18.25-3.48.23-.31.25-.31 1.88-.31h1.64v1.29zm4.68 5.45c-.17.43-.64.79-1 .79-.18 0-.45-.15-.67-.39-.32-.32-.45-.63-.82-2.08l-.9-3.39-.45-1.67h.76c.4 0 .75.02.75.05 0 .06 1.16 4.54 1.26 4.83.04.15.32-.7.73-2.3l.66-2.52.74-.04c.4-.02.73 0 .73.04 0 .14-1.67 6.38-1.8 6.68z" />
    </svg>
  )
  if (type === 'linkedin') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
  return <Globe size={size} />
}

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async e => {
    e.preventDefault()
    setSending(true)
    setError('')

    // Save to DB (admin inbox)
    const { error: dbErr } = await contactService.submit(form)
    if (dbErr) {
      setError('Failed to send. Please try again.')
      setSending(false)
      return
    }

    // Also send email notification via Formspree to school email
    try {
      await fetch('https://formspree.io/f/meepanev', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          name: form.name,
          _replyto: form.email,
          subject: `[PHIS Alumni Portal] ${form.subject}`,
          message: `From: ${form.name} <${form.email}>\n\n${form.message}`,
        }),
      })
    } catch {
      // Email notification failed silently — message is still saved to DB
    }

    setSent(true)
    setForm({ name: '', email: '', subject: '', message: '' })
    setSending(false)
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
        <p className="text-gray-500 dark:text-gray-400 mt-2">Have questions or need help? Reach out to us.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Contact Cards */}
        <div className="flex flex-col gap-5">

          {/* Founder Card */}
          <div className="card p-5 border-2 border-primary-100 dark:border-primary-900/40">
            <p className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-3">School Contact</p>
            <div className="flex items-center gap-3 mb-3">
              <img src={founder.photo} alt={founder.name}
                className="w-14 h-14 rounded-xl object-cover border-2 border-primary-200 dark:border-primary-800 flex-shrink-0" />
              <div>
                <p className="font-bold text-gray-900 dark:text-white text-sm">{founder.name}</p>
                <p className="text-xs text-primary-600 dark:text-primary-400">{founder.role}</p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {founder.phones.map(p => (
                <a key={p} href={`tel:${p}`}
                  className="flex items-center gap-2 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                  <Phone size={13} className="text-primary-500 flex-shrink-0" />{p}
                </a>
              ))}
              <a href={founder.linkedin} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 transition-colors font-medium w-fit mt-1">
                <SocialIcon type="linkedin" size={11} /> LinkedIn
              </a>
            </div>
          </div>

          {/* Developer Cards */}
          {team.map(m => (
            <div key={m.name} className="card p-5">
              <div className="flex items-center gap-3 mb-3">
                <img src={m.photo} alt={m.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-primary-100 dark:border-primary-900/40" />
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white text-sm">{m.name}</p>
                  <p className="text-xs text-primary-600 dark:text-primary-400">{m.role}</p>
                </div>
              </div>
              <a href={`mailto:${m.email}`}
                className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-2 break-all">
                <Mail size={12} className="flex-shrink-0" />{m.email}
              </a>
              {m.phones.map(p => (
                <a key={p} href={`tel:${p}`}
                  className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-1">
                  <Phone size={12} className="flex-shrink-0" />{p}
                </a>
              ))}
              <div className="flex items-center gap-2 flex-wrap mt-2">
                {m.links.map(l => (
                  <a key={l.label} href={l.href} target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-700 dark:hover:text-primary-400 transition-colors">
                    <SocialIcon type={l.icon} size={12} />{l.label}
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          {sent ? (
            <div className="card p-10 text-center h-full flex flex-col items-center justify-center">
              <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={28} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Message Sent!</h3>
              <p className="text-gray-500 dark:text-gray-400">Your message has been received. We'll get back to you soon.</p>
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
              {error && <p className="text-sm text-red-500">{error}</p>}
              <button type="submit" disabled={sending} className="btn-primary self-start flex items-center gap-2">
                {sending
                  ? <><svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.25"/><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/></svg>Sending...</>
                  : <><Send size={15} />Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
