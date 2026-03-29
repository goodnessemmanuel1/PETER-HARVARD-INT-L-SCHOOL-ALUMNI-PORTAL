import { CalendarDays, Tag, Trash2, ChevronRight, Clock } from 'lucide-react'
import { motion } from 'framer-motion'

export default function EventCard({ event, onDelete }) {
  const dateObj = new Date(event.event_date)
  const date = dateObj.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  
  const day = dateObj.getDate()
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()

  return (
    <motion.div 
      whileHover={{ y: -4 }}
      className="group card overflow-hidden flex h-full hover:shadow-xl transition-all duration-300 border-gray-100 dark:border-gray-800"
    >
      {/* Date Stripe */}
      <div className="w-20 bg-primary-600 dark:bg-primary-700 flex flex-col items-center justify-center text-white shrink-0">
        <span className="text-sm font-bold opacity-80">{month}</span>
        <span className="text-3xl font-black">{day}</span>
      </div>

      <div className="flex-1 p-6 flex flex-col gap-3">
        <div className="flex items-start justify-between gap-4">
          <h3 className="font-bold text-gray-900 dark:text-white leading-tight text-lg group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {event.title}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-3 mt-1">
          <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded border border-primary-100 dark:border-primary-800">
            <Tag size={10} />{event.type || 'General'}
          </span>
          <span className="text-xs font-medium text-gray-400 flex items-center gap-1.5">
            <CalendarDays size={14} />{date}
          </span>
        </div>

        {event.description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-2 mt-1 italic">
            {event.description}
          </p>
        )}

        <div className="pt-2 mt-auto flex items-center justify-between">
          <button className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 group-hover:gap-2 transition-all">
            Details <ChevronRight size={14} />
          </button>
          
          {onDelete && (
            <button
              onClick={() => onDelete(event.id)}
              className="p-2 rounded-lg text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
              title="Delete Event"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>
    </motion.div>
  )
}
