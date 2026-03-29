import { useEffect, useState } from 'react'
import { eventsService } from '../services/api'
import EventCard from '../components/EventCard'

export default function Events() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    eventsService.getAll().then(({ data }) => {
      setEvents(data || [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">📅 Events & Announcements</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Stay updated with the latest from Peter Harvard INT'L School.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 h-32 animate-pulse bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">📢</div>
          <p>No events or announcements yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(e => <EventCard key={e.id} event={e} />)}
        </div>
      )}
    </div>
  )
}
