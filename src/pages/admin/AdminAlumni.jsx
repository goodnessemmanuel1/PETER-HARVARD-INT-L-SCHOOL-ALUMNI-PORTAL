import { useEffect, useState } from 'react'
import { alumniService } from '../../services/api'
import AlumniCard from '../../components/AlumniCard'
import { Users, Search, Star, Trash2 } from 'lucide-react'
import { CardSkeleton } from '../../components/Loader'

export default function AdminAlumni() {
  const [alumni, setAlumni] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const [deleteError, setDeleteError] = useState('')

  useEffect(() => {
    const t = setTimeout(async () => {
      setLoading(true)
      const { data } = await alumniService.getAll({ search })
      setAlumni(data || [])
      setLoading(false)
    }, 300)
    return () => clearTimeout(t)
  }, [search])

  const toggleFeatured = async (id, current) => {
    await alumniService.setFeatured(id, !current)
    setAlumni(a => a.map(x => x.id === id ? { ...x, featured: !current } : x))
  }

  const handleDelete = async (id) => {
    setDeletingId(id)
    setDeleteError('')
    const { data, error } = await alumniService.delete(id)
    if (error || data?.error) {
      setDeleteError(error?.message || data?.error || 'Delete failed')
      setDeletingId(null)
      return
    }
    setAlumni(a => a.filter(x => x.id !== id))
    setDeletingId(null)
    setConfirmId(null)
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <Users size={22} className="text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Alumni</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Manage approved alumni and feature highlights.</p>

      <div className="relative max-w-sm mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" placeholder="Search by name..." />
      </div>

      {/* Delete Confirm Modal */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Delete Alumni?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              This will permanently remove <span className="font-semibold text-gray-800 dark:text-gray-200">{alumni.find(a => a.id === confirmId)?.full_name}</span> from the database. This cannot be undone.
            </p>
            {deleteError && <p className="text-sm text-red-500 text-center mb-3">{deleteError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmId(null)}
                className="flex-1 btn-outline py-2.5 text-sm"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmId)}
                disabled={deletingId === confirmId}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
              >
                <Trash2 size={14} />{deletingId === confirmId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <CardSkeleton count={6} />
      ) : alumni.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">No alumni found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {alumni.map(a => (
            <AlumniCard
              key={a.id}
              alumni={a}
              actions={
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleFeatured(a.id, a.featured)}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                      a.featured
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Star size={11} />{a.featured ? 'Unfeature' : 'Feature'}
                  </button>
                  <button
                    onClick={() => setConfirmId(a.id)}
                    className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors"
                  >
                    <Trash2 size={11} />Delete
                  </button>
                </div>
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
