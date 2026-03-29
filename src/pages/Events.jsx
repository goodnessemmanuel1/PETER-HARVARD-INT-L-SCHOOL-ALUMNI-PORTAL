import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { eventsService } from '../services/api'
import EventCard from '../components/EventCard'
import { CardSkeleton } from '../components/Loader'
import { CalendarDays, Megaphone, Filter } from 'lucide-react'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 }
}

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    eventsService.getAll().then(({ data }) => {
      setEvents(data || [])
      setLoading(false)
    })
  }, [])

  const types = ['All', 'Announcement', 'Event', 'News']
  const filtered = filter === 'All' ? events : events.filter(e => e.type === filter)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
            <CalendarDays size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Events & News</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Stay informed about the latest happenings in our community.</p>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-2 mb-10 overflow-x-auto pb-2 scrollbar-hide"
      >
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 mr-2">
          <Filter size={14} className="text-gray-400" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filter</span>
        </div>
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              filter === t
                ? 'bg-primary-600 text-white shadow-lg shadow-primary-500/25 scale-105'
                : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            {t}
          </button>
        ))}
      </motion.div>

      {loading ? (
        <CardSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Megaphone size={32} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No updates found</h3>
          <p className="text-gray-500 dark:text-gray-400">There are no {filter.toLowerCase()} items at the moment. Check back later!</p>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {filtered.map(e => (
            <motion.div key={e.id} variants={itemVariants} layout>
              <EventCard event={e} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
