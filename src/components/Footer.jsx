import { Link } from 'react-router-dom'
import { Mail, ExternalLink, MessageCircle } from 'lucide-react'

const WA_GROUP = 'https://chat.whatsapp.com/BkEMJRD01MLCXzzGwCAgeJ'

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <img src="/assets/phislogo.png" alt="Peter Harvard" className="w-9 h-9 rounded-full object-cover" />
              <span className="font-bold text-gray-900 dark:text-white">Peter Harvard INT'L</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
              Connecting graduates with their alma mater through a centralized digital community.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
              {[['/', 'Home'], ['/directory', 'Alumni Directory'], ['/events', 'Events'], ['/about', 'About'], ['/contact', 'Contact']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-4 text-sm uppercase tracking-wider">Community</h4>
            <ul className="space-y-2.5 text-sm text-gray-500 dark:text-gray-400">
              {[['/register', 'Register'], ['/directory', 'Browse Directory'], ['/events', 'Announcements'], ['/login', 'Alumni Login']].map(([to, label]) => (
                <li key={to}><Link to={to} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{label}</Link></li>
              ))}
              <li>
                <a
                  href={WA_GROUP}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-medium transition-colors"
                >
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
          <a href={WA_GROUP} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-green-600 dark:text-green-400 hover:text-green-700 font-medium transition-colors">
            <MessageCircle size={13} />Join Alumni WhatsApp Group
          </a>
        </div>
      </div>
    </footer>
  )
}
