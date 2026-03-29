import { Link } from 'react-router-dom'
import { Briefcase, Star, GraduationCap } from 'lucide-react'

export default function AlumniCard({ alumni, actions }) {
  const initials = alumni.full_name
    ?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-lg flex-shrink-0">
          {initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{alumni.full_name}</h3>
            {alumni.featured && (
              <span className="badge-green flex items-center gap-1"><Star size={10} />Featured</span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1 mt-0.5">
            <GraduationCap size={13} />Class of {alumni.graduation_year}
          </p>
        </div>
      </div>

      {alumni.current_occupation && (
        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
          <Briefcase size={13} className="text-gray-400 flex-shrink-0" />{alumni.current_occupation}
        </p>
      )}
      {alumni.bio && (
        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{alumni.bio}</p>
      )}

      <div className="flex items-center gap-2 pt-1 flex-wrap">
        <Link to={`/alumni/${alumni.id}`} className="text-xs text-primary-600 dark:text-primary-400 hover:underline font-medium">
          View Profile →
        </Link>
        {actions}
      </div>
    </div>
  )
}
