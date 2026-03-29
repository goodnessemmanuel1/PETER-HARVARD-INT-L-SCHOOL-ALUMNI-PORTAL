import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm">PH</div>
              <span className="font-bold text-gray-900 dark:text-white">Peter Harvard INT'L School</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Connecting graduates with their alma mater through a centralized digital community.</p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Quick Links</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li><Link to="/" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/directory" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Alumni Directory</Link></li>
              <li><Link to="/events" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Events & Announcements</Link></li>
              <li><Link to="/register" className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">Register as Alumni</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">Contact</h4>
            <ul className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
              <li>Goodness Emmanuel — <a href="mailto:emmanuelgoodnesscj@gmail.com" className="hover:text-primary-600 dark:hover:text-primary-400">emmanuelgoodnesscj@gmail.com</a></li>
              <li>Anointed Agunloye — <a href="mailto:anointedthedeveloper@gmail.com" className="hover:text-primary-600 dark:hover:text-primary-400">anointedthedeveloper@gmail.com</a></li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Peter Harvard INT'L School Alumni Portal. Built with ❤️ for the community.
        </div>
      </div>
    </footer>
  )
}
