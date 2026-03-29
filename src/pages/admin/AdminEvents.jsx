import { useEffect, useState } from 'react'
import { eventsService } from '../../services/api'
import EventCard from '../../components/EventCard'
import { CalendarDays, PlusCircle } from 'lucide-react'

const EMPTY = { title: '', description: '', event_date: '', type: 'Announcement' }

export default function AdminEvents() {
  const [events, setEvents] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    const { data } = await eventsService.getAll()
    setEvents(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    await eventsService.create(form)
    setForm(EMPTY)
    await load()
    setSaving(false)
  }

  const handleDelete = async id => {
    await eventsService.delete(id)
    setEvents(ev => ev.filter(e => e.id !== id))
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <CalendarDays size={22} className="text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Events & Announcements</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Post and manage school events and announcements.</p>

      <div className="card p-6 mb-8">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <PlusCircle size={17} className="text-primary-500" />Post New Event
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
              <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input" placeholder="Event title" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Type</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} className="input">
                <option>Announcement</option>
                <option>Event</option>
                <option>News</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Date *</label>
            <input required type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} className="input max-w-xs" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} className="input resize-none" placeholder="Event details..." />
          </div>
          <button type="submit" disabled={saving} className="btn-primary self-start flex items-center gap-2">
            <PlusCircle size={15} />{saving ? 'Posting...' : 'Post Event'}
          </button>
        </form>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(3)].map((_, i) => <div key={i} className="card p-5 h-32 animate-pulse bg-gray-100 dark:bg-gray-800" />)}
        </div>
      ) : events.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">No events posted yet.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {events.map(e => <EventCard key={e.id} event={e} onDelete={handleDelete} />)}
        </div>
      )}
    </div>
  )
}
