import { CalendarDays, Tag, Trash2, ChevronRight, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'

export default function EventCard({ event, onDelete }) {
  const [open, setOpen] = useState(false)
  const dateObj = new Date(event.event_date)
  const date = dateObj.toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
  const day = dateObj.getDate()
  const month = dateObj.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()

  return (
    <>
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
            <button
              onClick={() => setOpen(true)}
              className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:gap-2 transition-all"
            >
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

      {/* Detail Modal */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              onClick={e => e.stopPropagation()}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl max-w-lg w-full border border-gray-100 dark:border-gray-800 overflow-hidden"
            >
              {/* Header stripe */}
              <div className="bg-primary-600 px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="bg-white/20 rounded-xl px-3 py-2 text-center">
                    <p className="text-white/80 text-xs font-bold">{month}</p>
                    <p className="text-white text-2xl font-black leading-none">{day}</p>
                  </div>
                  <div>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest bg-white/20 text-white px-2 py-0.5 rounded mb-1">
                      <Tag size={10} />{event.type || 'General'}
                    </span>
                    <h2 className="text-white font-black text-xl leading-tight">{event.title}</h2>
                  </div>
                </div>
                <button
                  onClick={() => setOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Date</p>
                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-5 flex items-center gap-2">
                  <CalendarDays size={15} className="text-primary-500" />{date}
                </p>

                {event.description ? (
                  <>
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Details</p>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">{event.description}</p>
                  </>
                ) : (
                  <p className="text-gray-400 italic text-sm">No additional details provided.</p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
