import { useEffect, useState } from 'react'
import { alumniService } from '../services/api'
import AlumniCard from '../components/AlumniCard'

const YEARS = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i)

export default function Directory() {
  const [alumni, setAlumni] = useState([])
  const [search, setSearch] = useState('')
  const [year, setYear] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeout = setTimeout(async () => {
      setLoading(true)
      const { data } = await alumniService.getAll({ search, year })
      setAlumni(data || [])
      setLoading(false)
    }, 300)
    return () => clearTimeout(timeout)
  }, [search, year])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🔍 Alumni Directory</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Search and connect with fellow graduates.</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input max-w-sm"
          placeholder="Search by name..."
        />
        <select value={year} onChange={e => setYear(e.target.value)} className="input max-w-[180px]">
          <option value="">All Years</option>
          {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="card p-5 h-36 animate-pulse bg-gray-100 dark:bg-gray-800" />
          ))}
        </div>
      ) : alumni.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🎓</div>
          <p>No alumni found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {alumni.map(a => <AlumniCard key={a.id} alumni={a} />)}
        </div>
      )}
    </div>
  )
}
