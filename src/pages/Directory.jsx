import { useEffect, useState } from 'react'
import { alumniService } from '../services/api'
import { Search, Users, Filter } from 'lucide-react'
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
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <Users size={20} className="text-primary-600 dark:text-primary-400" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Alumni Directory</h1>
        </div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Search and connect with fellow graduates.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8">
        <div className="relative max-w-sm w-full">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-9" placeholder="Search by name..." />
        </div>
        <div className="relative max-w-[180px] w-full">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <select value={year} onChange={e => setYear(e.target.value)} className="input pl-8">
            <option value="">All Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </div>

      {!loading && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
          {alumni.length} alumni found
        </p>
      )}

      {loading ? (
        <CardSkeleton count={6} />
      ) : alumni.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <Users size={48} className="mx-auto mb-4 opacity-30" />
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
