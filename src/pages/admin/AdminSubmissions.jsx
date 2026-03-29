import { useEffect, useState } from 'react'
import { contactService } from '../../services/api'
import { Inbox, Trash2, Mail, Clock, CheckCircle, RefreshCw, X } from 'lucide-react'

function formatDate(d) {
  return new Date(d).toLocaleString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function AdminSubmissions() {
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [filter, setFilter] = useState('all') // 'all' | 'unread' | 'read'

  const load = async () => {
    setLoading(true)
    const { data } = await contactService.getAll()
    setSubmissions(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleOpen = async (sub) => {
    setSelected(sub)
    if (!sub.read) {
      await contactService.markRead(sub.id)
      setSubmissions(s => s.map(x => x.id === sub.id ? { ...x, read: true } : x))
    }
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    await contactService.delete(id)
    setSubmissions(s => s.filter(x => x.id !== id))
    setDeletingId(null)
    setConfirmId(null)
    if (selected?.id === id) setSelected(null)
  }

  const filtered = submissions.filter(s =>
    filter === 'all' ? true : filter === 'unread' ? !s.read : s.read
  )
  const unreadCount = submissions.filter(s => !s.read).length

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <Inbox size={22} className="text-primary-600 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Form Submissions</h1>
          {unreadCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-primary-600 text-white">{unreadCount} new</span>
          )}
        </div>
        <button onClick={load} disabled={loading}
          className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Messages submitted through the Contact Us form.</p>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {[['all', 'All'], ['unread', 'Unread'], ['read', 'Read']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              filter === val
                ? 'bg-primary-600 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}>
            {label}
            {val === 'unread' && unreadCount > 0 && ` (${unreadCount})`}
          </button>
        ))}
      </div>

      {/* Delete Confirm */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Delete Submission?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">This message will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmId(null)} className="flex-1 btn-outline py-2.5 text-sm">Cancel</button>
              <button onClick={() => handleDelete(confirmId)} disabled={deletingId === confirmId}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                <Trash2 size={14} />{deletingId === confirmId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="flex flex-col gap-3">
          {loading ? (
            <div className="card p-12 text-center text-gray-400">Loading submissions...</div>
          ) : filtered.length === 0 ? (
            <div className="card p-12 text-center">
              <Inbox size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">No {filter !== 'all' ? filter : ''} submissions found.</p>
            </div>
          ) : (
            filtered.map(sub => (
              <div key={sub.id}
                onClick={() => handleOpen(sub)}
                className={`card p-4 cursor-pointer hover:shadow-md transition-all border-l-4 ${
                  !sub.read ? 'border-l-primary-500 bg-primary-50/30 dark:bg-primary-900/10' : 'border-l-transparent'
                } ${selected?.id === sub.id ? 'ring-2 ring-primary-500' : ''}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      {!sub.read
                        ? <span className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0" />
                        : <CheckCircle size={12} className="text-gray-300 flex-shrink-0" />}
                      <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{sub.name}</p>
                    </div>
                    <p className="text-xs font-medium text-primary-600 dark:text-primary-400 truncate ml-4">{sub.subject}</p>
                    <p className="text-xs text-gray-400 truncate ml-4 mt-0.5">{sub.message}</p>
                    <div className="flex items-center gap-1.5 ml-4 mt-1.5 text-xs text-gray-400">
                      <Clock size={10} />{formatDate(sub.created_at)}
                    </div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); setConfirmId(sub.id) }}
                    className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Detail Panel */}
        <div className="lg:sticky lg:top-24 h-fit">
          {selected ? (
            <div className="card p-6">
              <div className="flex items-start justify-between gap-3 mb-5">
                <div>
                  <h2 className="font-bold text-gray-900 dark:text-white text-lg">{selected.subject}</h2>
                  <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-medium text-gray-700 dark:text-gray-300">{selected.name}</span>
                    <a href={`mailto:${selected.email}`} className="flex items-center gap-1 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                      <Mail size={12} />{selected.email}
                    </a>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1"><Clock size={10} />{formatDate(selected.created_at)}</p>
                </div>
                <button onClick={() => setSelected(null)}
                  className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors flex-shrink-0">
                  <X size={15} />
                </button>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap border border-gray-100 dark:border-gray-800">
                {selected.message}
              </div>
              <div className="flex gap-3 mt-4">
                <a href={`mailto:${selected.email}?subject=Re: ${selected.subject}`}
                  className="btn-primary text-sm flex items-center gap-2">
                  <Mail size={14} />Reply via Email
                </a>
                <button onClick={() => setConfirmId(selected.id)}
                  className="btn-outline text-sm flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50 dark:border-red-800 dark:hover:bg-red-900/20">
                  <Trash2 size={14} />Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <Inbox size={36} className="text-gray-300 mx-auto mb-3" />
              <p className="text-gray-400 text-sm">Select a message to read it</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
