import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail, ExternalLink, MessageCircle, Globe, Bug, Zap } from 'lucide-react'
import ReportBug from './ReportBug'

const WA_GROUP = 'https://chat.whatsapp.com/BkEMJRD01MLCXzzGwCAgeJ'
const SCHOOL_WEBSITE = 'https://peterharvardschools.com/'

function scrollTop() { window.scrollTo({ top: 0, behavior: 'instant' }) }

function FooterLink({ to, children }) {
  return (
    <Link to={to} onClick={scrollTop} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
      {children}
    </Link>
  )
}

function openWhatsApp(e) {
  e.preventDefault()
  const deep = WA_GROUP.replace('https://', 'whatsapp://')
  const start = Date.now()
  window.location.href = deep
  setTimeout(() => { if (Date.now() - start < 1500) window.open(WA_GROUP, '_blank') }, 800)
}

export default function Footer() {
  const [bugOpen, setBugOpen] = useState(false)

  return (
    <>
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-3">
                <img src="/assets/phislogo.png" alt="Peter Harvard" className="w-10 h-10 object-contain" />
                <span className="font-bold text-gray-900 dark:text-white">Peter Harvard INT'L School</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                Connecting graduates with their alma mater through a centralized digital community.
              </p>
              <a href={SCHOOL_WEBSITE} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 transition-colors">
                <Globe size={14} />peterharvardschools.com
              </a>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Navigation</h4>
              <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
                {[['/', 'Home'], ['/directory', 'Alumni Directory'], ['/events', 'Events'], ['/gallery', 'Gallery'], ['/blog', 'Blog'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
                  <li key={to}><FooterLink to={to}>{label}</FooterLink></li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Community</h4>
              <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
                {[['/register', 'Register'], ['/directory', 'Browse Directory'], ['/events', 'Announcements'], ['/login', 'Alumni Login']].map(([to, label]) => (
                  <li key={to}><FooterLink to={to}>{label}</FooterLink></li>
                ))}
                <li>
                  <a href={WA_GROUP} onClick={openWhatsApp}
                    className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors">
                    <MessageCircle size={14} />Join WhatsApp Group
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-3 text-sm text-gray-500 dark:text-gray-400">
                <li className="flex items-start gap-2">
                  <Mail size={14} className="mt-0.5 flex-shrink-0 text-primary-500" />
                  <a href="mailto:anointedthedeveloper@gmail.com" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all">anointedthedeveloper@gmail.com</a>
                </li>
                <li className="flex items-start gap-2">
                  <ExternalLink size={14} className="mt-0.5 flex-shrink-0 text-primary-500" />
                  <a href="https://linkedin.com/in/emmanuelgoodness" target="_blank" rel="noreferrer" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">linkedin.com/in/emmanuelgoodness</a>
                </li>
                <li className="flex items-start gap-2">
                  <Mail size={14} className="mt-0.5 flex-shrink-0 text-primary-500" />
                  <a href="mailto:emmanuelgoodnesscj@gmail.com" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors break-all">emmanuelgoodnesscj@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
            <span>© {new Date().getFullYear()} Peter Harvard INT'L School Alumni Portal. All rights reserved.</span>

            <button
              onClick={() => setBugOpen(true)}
              className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 font-medium transition-colors"
            >
              <Bug size={13} /> Report a Bug
            </button>

            <a href="https://anobyte.online" target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-semibold transition-colors">
              <Zap size={13} /> Powered by Anobyte
            </a>
          </div>
        </div>
      </footer>

      <ReportBug open={bugOpen} onClose={() => setBugOpen(false)} />
    </>
  )
}
