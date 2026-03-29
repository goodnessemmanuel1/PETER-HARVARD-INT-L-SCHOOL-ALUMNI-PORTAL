import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { eventsService } from '../services/api'
import EventCard from '../components/EventCard'
import { CardSkeleton } from '../components/Loader'
import { CalendarDays, Megaphone } from 'lucide-react'

const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } }
const fadeUp = { hidden: { opacity: 0, scale: 0.97 }, visible: { opacity: 1, scale: 1 } }

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    eventsService.getAll().then(({ data }) => { setEvents(data || []); setLoading(false) })
  }, [])

  const types = ['All', 'Announcement', 'Event', 'News']
  const filtered = filter === 'All' ? events : events.filter(e => e.type === filter)

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                <CalendarDays size={22} className="text-white" />
              </div>
              <span className="text-white/70 font-semibold text-sm">Stay Informed</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">Events & News</h1>
            <p className="text-white/75 text-lg">Stay updated on the latest happenings in our community.</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter tabs */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex items-center gap-2 mb-8 overflow-x-auto pb-1">
          {types.map(t => (
            <button key={t} onClick={() => setFilter(t)}
              className={`px-5 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
                filter === t
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-800 hover:border-primary-300 dark:hover:border-primary-700'
              }`}>
              {t}
              {t !== 'All' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({events.filter(e => e.type === t).length})
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {loading ? (
          <CardSkeleton count={6} />
        ) : filtered.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Megaphone size={28} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No {filter === 'All' ? '' : filter.toLowerCase()} items yet</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Check back later for updates.</p>
          </motion.div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div key={filter} variants={stagger} initial="hidden" animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(e => (
                <motion.div key={e.id} variants={fadeUp} layout>
                  <EventCard event={e} />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        )}
      </div>
    </div>
  )
}
