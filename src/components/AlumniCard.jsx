import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Briefcase, Star, GraduationCap, ChevronRight } from 'lucide-react'

export default function AlumniCard({ alumni, actions }) {
  const initials = alumni.full_name
    ?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group card overflow-hidden flex flex-col h-full hover:shadow-xl transition-all duration-300 border-gray-100 dark:border-gray-800"
    >
      <div className="p-6 flex flex-col gap-4 flex-1">
        <div className="flex items-start gap-4">
          <motion.div whileHover={{ scale: 1.1 }} className="flex-shrink-0">
            {alumni.avatar_url ? (
              <img
                src={alumni.avatar_url}
                alt={alumni.full_name}
                className="w-14 h-14 rounded-2xl object-cover shadow-lg"
              />
            ) : (
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-bold text-xl shadow-lg shadow-primary-500/20">
                {initials}
              </div>
            )}
          </motion.div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h3 className="font-bold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {alumni.full_name}
              </h3>
              {alumni.featured && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800">
                  <Star size={10} className="fill-current" />Featured
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
              <GraduationCap size={15} className="text-primary-500" />Class of {alumni.graduation_year}
            </p>
          </div>
        </div>

        <div className="space-y-3 mt-2">
          {alumni.current_occupation && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-800">
              <Briefcase size={14} className="text-primary-500 flex-shrink-0" />
              <span className="truncate">{alumni.current_occupation}</span>
            </div>
          )}
          {alumni.bio && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed italic">
              "{alumni.bio}"
            </p>
          )}
        </div>
      </div>

      <div className="px-6 py-4 bg-gray-50/50 dark:bg-gray-800/20 border-t border-gray-100 dark:border-gray-800 mt-auto flex items-center justify-between">
        <Link to={`/alumni/${alumni.id}`} className="inline-flex items-center gap-1 text-sm font-bold text-primary-600 dark:text-primary-400 hover:gap-2 transition-all">
          View Profile <ChevronRight size={16} />
        </Link>
        {actions}
      </div>
    </motion.div>
  )
}
