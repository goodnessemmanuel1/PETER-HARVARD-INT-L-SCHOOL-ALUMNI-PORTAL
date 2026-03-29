export default function EventCard({ event, onDelete }) {
  const date = new Date(event.event_date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })

  return (
    <div className="card p-5 flex flex-col gap-2 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-gray-900 dark:text-white">{event.title}</h3>
        <span className="badge-red flex-shrink-0">{event.type || 'Announcement'}</span>
      </div>
      <p className="text-xs text-gray-400 dark:text-gray-500">{date}</p>
      {event.description && (
        <p className="text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
      )}
      {onDelete && (
        <button onClick={() => onDelete(event.id)} className="self-start text-xs text-red-500 hover:text-red-700 mt-1 transition-colors">
          Delete
        </button>
      )}
    </div>
  )
}
