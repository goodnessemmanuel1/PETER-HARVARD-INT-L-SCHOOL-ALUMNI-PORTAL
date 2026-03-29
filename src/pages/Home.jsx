import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { alumniService, eventsService } from '../services/api'
import AlumniCard from '../components/AlumniCard'
import EventCard from '../components/EventCard'

export default function Home() {
  const [featured, setFeatured] = useState([])
  const [events, setEvents] = useState([])

  useEffect(() => {
    alumniService.getFeatured().then(({ data }) => setFeatured(data || []))
    eventsService.getAll().then(({ data }) => setEvents((data || []).slice(0, 3)))
  }, [])

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-700 via-primary-600 to-primary-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <span className="badge-green mb-4 inline-block">🟢 Version 1.0 MVP — In Development</span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
              Welcome to the<br />
              <span className="text-white/90">Peter Harvard INT'L</span><br />
              Alumni Portal
            </h1>
            <p className="text-lg text-white/80 mb-8">
              A centralized digital community connecting graduates with their alma mater. Register, connect, and stay updated.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="bg-white text-primary-700 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors">
                Join as Alumni
              </Link>
              <Link to="/directory" className="border border-white/50 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                Browse Directory
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Registered Alumni', value: '500+', icon: '🎓' },
            { label: 'Graduation Years', value: '20+', icon: '📅' },
            { label: 'Featured Alumni', value: '50+', icon: '⭐' },
            { label: 'Events Posted', value: '100+', icon: '📢' },
          ].map(s => (
            <div key={s.label}>
              <div className="text-3xl mb-1">{s.icon}</div>
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Alumni */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">⭐ Featured Alumni</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Notable graduates and their achievements</p>
            </div>
            <Link to="/directory" className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">View all →</Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured.map(a => <AlumniCard key={a.id} alumni={a} />)}
          </div>
        </section>
      )}

      {/* Events */}
      {events.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">📅 Latest Events & Announcements</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Stay updated with school news</p>
              </div>
              <Link to="/events" className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium">View all →</Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map(e => <EventCard key={e.id} event={e} />)}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Ready to reconnect?</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-8 max-w-xl mx-auto">Join hundreds of Peter Harvard INT'L School graduates already on the platform.</p>
        <Link to="/register" className="btn-primary text-base px-8 py-3">Register Now — It's Free</Link>
      </section>
    </div>
  )
}
