import { useState, useEffect } from 'react'
import { Cookie, X } from 'lucide-react'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem('cookie_consent')) setVisible(true)
  }, [])

  const accept = () => { localStorage.setItem('cookie_consent', 'accepted'); setVisible(false) }
  const decline = () => { localStorage.setItem('cookie_consent', 'declined'); setVisible(false) }

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
          <Cookie size={20} className="text-primary-600 dark:text-primary-400" />
        </div>
        <p className="flex-1 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
          We use cookies and local storage to keep you signed in and remember your preferences.
          By continuing, you agree to our use of session cookies.
        </p>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={decline} className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <X size={16} />
          </button>
          <button onClick={decline} className="text-sm px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium">
            Decline
          </button>
          <button onClick={accept} className="text-sm px-4 py-2 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold transition-colors">
            Accept
          </button>
        </div>
      </div>
    </div>
  )
}
