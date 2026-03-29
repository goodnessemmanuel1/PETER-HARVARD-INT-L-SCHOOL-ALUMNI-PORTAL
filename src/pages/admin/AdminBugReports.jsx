import { useEffect, useState } from 'react'
import { bugService } from '../../services/api'
import { Bug, Trash2, CheckCircle, Clock, AlertTriangle, RefreshCw, X } from 'lucide-react'
import { Spinner } from '../../components/Loader'

const STATUS_CONFIG = {
  open:     { label: 'Open',     color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',    icon: <AlertTriangle size={12} /> },
  reviewing:{ label: 'Reviewing',color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400', icon: <Clock size={12} /> },
  resolved: { label: 'Resolved', color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400', icon: <CheckCircle size={12} /> },
}

export default function AdminBugReports() {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [confirmId, setConfirmId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [updatingId, setUpdatingId] = useState(null)

  const load = async () => {
    setLoading(true)
    const { data } = await bugService.getAll()
    setReports(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleStatus = async (id, status) => {
    setUpdatingId(id)
    await bugService.updateStatus(id, status)
    setReports(r => r.map(x => x.id === id ? { ...x, status } : x))
    setUpdatingId(null)
  }

  const handleDelete = async id => {
    setDeletingId(id)
    await bugService.delete(id)
    setReports(r => r.filter(x => x.id !== id))
    setDeletingId(null)
    setConfirmId(null)
  }

  const filtered = filter === 'all' ? reports : reports.filter(r => r.status === filter)

  const counts = {
    all: reports.length,
    open: reports.filter(r => r.status === 'open').length,
    reviewing: reports.filter(r => r.status === 'reviewing').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <Bug size={22} className="text-primary-600 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bug Reports</h1>
        </div>
        <button onClick={load} disabled={loading} className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />Refresh
        </button>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">User-submitted bug reports and issues.</p>

      {/* Filter tabs */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {Object.entries(counts).map(([key, count]) => (
          <button key={key} onClick={() => setFilter(key)}
            className={`px-4 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
              filter === key
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}>
            {key} ({count})
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
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Delete Report?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">This bug report will be permanently deleted.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmId(null)} className="flex-1 btn-outline py-2.5 text-sm">Cancel</button>
              <button onClick={() => handleDelete(confirmId)} disabled={deletingId === confirmId}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                {deletingId === confirmId ? <><Spinner size={13} />Deleting...</> : <><Trash2 size={13} />Delete</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card p-12 text-center text-gray-400">Loading reports...</div>
      ) : filtered.length === 0 ? (
        <div className="card p-12 text-center">
          <Bug size={36} className="text-gray-300 mx-auto mb-3" />
          <p className="text-gray-400 font-medium">No {filter === 'all' ? '' : filter} reports.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {filtered.map(r => {
            const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.open
            return (
              <div key={r.id} className="card p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${cfg.color}`}>
                      {cfg.icon}{cfg.label}
                    </span>
                    {r.category && (
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                        {r.category}
                      </span>
                    )}
                    <span className="text-xs text-gray-400">
                      {new Date(r.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <button onClick={() => setConfirmId(r.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex-shrink-0">
                    <X size={15} />
                  </button>
                </div>

                {(r.name || r.email) && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    {r.name && <span className="font-semibold">{r.name}</span>}
                    {r.name && r.email && ' · '}
                    {r.email && <a href={`mailto:${r.email}`} className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors">{r.email}</a>}
                  </p>
                )}

                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-4 whitespace-pre-wrap">{r.description}</p>

                {/* Status actions */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold text-gray-400 mr-1">Mark as:</span>
                  {Object.entries(STATUS_CONFIG).map(([key, val]) => (
                    <button key={key} onClick={() => handleStatus(r.id, key)}
                      disabled={r.status === key || updatingId === r.id}
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold transition-all disabled:opacity-40 ${
                        r.status === key ? val.color : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                      }`}>
                      {updatingId === r.id && r.status !== key ? <Spinner size={10} /> : val.icon}
                      {val.label}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
