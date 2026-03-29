import { useEffect, useState } from 'react'
import { eventsService } from '../services/api'
import EventCard from '../components/EventCard'
import { CardSkeleton } from '../components/Loader'
import { CalendarDays, Megaphone } from 'lucide-react'

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
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <CalendarDays size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Events & Announcements</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Stay updated with the latest from Peter Harvard INT'L School.</p>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {types.map(t => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === t
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <CardSkeleton count={6} />
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Megaphone size={48} className="mx-auto mb-4 opacity-30" />
          <p>No events or announcements yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  )
}
