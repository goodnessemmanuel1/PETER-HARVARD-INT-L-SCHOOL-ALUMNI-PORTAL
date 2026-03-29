import { useEffect, useState } from 'react'
import { alumniService } from '../../services/api'
import AlumniCard from '../../components/AlumniCard'

export default function AdminAlumni() {
  const [alumni, setAlumni] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

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

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">🎓 All Alumni</h1>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Manage approved alumni and feature highlights.</p>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="input max-w-sm mb-6"
        placeholder="Search by name..."
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => <div key={i} className="card p-5 h-36 animate-pulse bg-gray-100 dark:bg-gray-800" />)}
        </div>
      ) : alumni.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">No alumni found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {alumni.map(a => (
            <AlumniCard
              key={a.id}
              alumni={a}
              actions={
                <button
                  onClick={() => toggleFeatured(a.id, a.featured)}
                  className={a.featured ? 'badge-green cursor-pointer' : 'badge-gray cursor-pointer'}
                >
                  {a.featured ? '⭐ Unfeature' : '☆ Feature'}
                </button>
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
