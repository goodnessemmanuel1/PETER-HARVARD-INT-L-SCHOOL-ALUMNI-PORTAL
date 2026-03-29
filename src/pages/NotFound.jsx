import { Link } from 'react-router-dom'
import { Home, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-8xl font-extrabold text-primary-600 dark:text-primary-500 mb-4 leading-none">404</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Page Not Found</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-3">
          <Link to="/" className="btn-primary flex items-center gap-2"><Home size={15} />Go Home</Link>
          <button onClick={() => window.history.back()} className="btn-outline flex items-center gap-2"><ArrowLeft size={15} />Go Back</button>
        </div>
      </div>
    </div>
  )
}
