import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { alumniService, eventsService } from '../services/api'
import AlumniCard from '../components/AlumniCard'
import EventCard from '../components/EventCard'
import { CardSkeleton } from '../components/Loader'
import {
  GraduationCap, Users, CalendarDays, Star, ArrowRight,
  ClipboardList, CheckCircle, Search, Megaphone, LayoutDashboard, ChevronRight
} from 'lucide-react'

const features = [
  { icon: <ClipboardList size={22} />, title: 'Alumni Registration', desc: 'Sign up and create your alumni profile in minutes.' },
  { icon: <CheckCircle size={22} />, title: 'Admin Approval', desc: 'Admins review and approve registrations for a trusted community.' },
  { icon: <Search size={22} />, title: 'Alumni Directory', desc: 'Search graduates by name or graduation year.' },
  { icon: <Star size={22} />, title: 'Featured Alumni', desc: 'Showcase notable graduates and their achievements.' },
  { icon: <Megaphone size={22} />, title: 'Events & Announcements', desc: 'Stay updated with school news and upcoming events.' },
  { icon: <LayoutDashboard size={22} />, title: 'Admin Dashboard', desc: 'Central control panel for all admin operations.' },
]

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
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-green-500/20 text-green-300 border border-green-500/30 px-3 py-1 rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Version 1.0 MVP — In Development
            </span>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-5">
              Welcome to the<br />
              <span className="text-white/90">Peter Harvard INT'L</span><br />
              Alumni Portal
            </h1>
            <p className="text-lg text-white/75 mb-8 leading-relaxed">
              A centralized digital community connecting graduates with their alma mater. Register, connect, and stay updated with your school community.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-gray-100 font-semibold px-6 py-3 rounded-lg transition-colors">
                <GraduationCap size={18} />Join as Alumni
              </Link>
              <Link to="/directory" className="inline-flex items-center gap-2 border border-white/40 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
                <Users size={18} />Browse Directory
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { label: 'Registered Alumni', value: '500+', icon: <GraduationCap size={24} className="text-primary-500" /> },
            { label: 'Graduation Years', value: '20+', icon: <CalendarDays size={24} className="text-primary-500" /> },
            { label: 'Featured Alumni', value: '50+', icon: <Star size={24} className="text-primary-500" /> },
            { label: 'Events Posted', value: '100+', icon: <Megaphone size={24} className="text-primary-500" /> },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-2">
              {s.icon}
              <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">{s.value}</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">Everything you need</h2>
          <p className="text-gray-500 dark:text-gray-400 max-w-xl mx-auto">A full-featured platform built for the Peter Harvard INT'L School community.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(f => (
            <div key={f.title} className="card p-6 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mb-4">
                {f.icon}
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{f.title}</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Alumni */}
      {featured.length > 0 && (
        <section className="bg-gray-50 dark:bg-gray-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Star size={22} className="text-primary-500" />Featured Alumni
                </h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Notable graduates and their achievements</p>
              </div>
              <Link to="/directory" className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center gap-1">
                View all<ArrowRight size={14} />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map(a => <AlumniCard key={a.id} alumni={a} />)}
            </div>
          </div>
        </section>
      )}

      {/* Events */}
      {events.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <CalendarDays size={22} className="text-primary-500" />Latest Events
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Stay updated with school news</p>
            </div>
            <Link to="/events" className="text-sm text-primary-600 dark:text-primary-400 hover:underline font-medium flex items-center gap-1">
              View all<ArrowRight size={14} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-primary-600 dark:bg-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to reconnect?</h2>
          <p className="text-white/75 mb-8 max-w-xl mx-auto">Join hundreds of Peter Harvard INT'L School graduates already on the platform.</p>
          <Link to="/register" className="inline-flex items-center gap-2 bg-white text-primary-700 hover:bg-gray-100 font-semibold px-8 py-3 rounded-lg transition-colors text-base">
            Register Now — It's Free<ChevronRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
