import { CalendarDays, Tag, Trash2 } from 'lucide-react'

export default function EventCard({ event, onDelete }) {
  const date = new Date(event.event_date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="card p-5 flex flex-col gap-3 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-white leading-snug">{event.title}</h3>
        <span className="badge-red flex items-center gap-1 flex-shrink-0">
          <Tag size={10} />{event.type || 'Announcement'}
        </span>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500 flex items-center gap-1.5">
        <CalendarDays size={12} />{date}
      </p>
      {event.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{event.description}</p>
      )}
      {onDelete && (
        <button
          onClick={() => onDelete(event.id)}
          className="self-start flex items-center gap-1 text-xs text-red-500 hover:text-red-700 transition-colors mt-1"
        >
          <Trash2 size={12} />Delete
        </button>
      )}
    </div>
  )
}
