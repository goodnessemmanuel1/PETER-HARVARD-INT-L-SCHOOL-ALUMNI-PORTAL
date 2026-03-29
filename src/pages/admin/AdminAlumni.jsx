import { useEffect, useState } from 'react'
import { alumniService } from '../../services/api'
import AlumniCard from '../../components/AlumniCard'
import { Users, Search, Star } from 'lucide-react'

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
      <div className="flex items-center gap-3 mb-1">
        <Users size={22} className="text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">All Alumni</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Manage approved alumni and feature highlights.</p>

      <div className="relative max-w-sm mb-6">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" placeholder="Search by name..." />
      </div>

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
                  className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-full font-medium transition-colors ${
                    a.featured
                      ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-200'
                      : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <Star size={11} />{a.featured ? 'Unfeature' : 'Feature'}
                </button>
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
