import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { alumniService } from '../services/api'
import { Search, Users, Filter, X } from 'lucide-react'
import AlumniCard from '../components/AlumniCard'
import { CardSkeleton } from '../components/Loader'

const YEARS = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i)
const stagger = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.05 } } }
const fadeUp = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

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

  const hasFilters = search || year

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-700 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center">
                <Users size={22} className="text-white" />
              </div>
              <span className="text-white/70 font-semibold text-sm">Alumni Network</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-3 tracking-tight">Alumni Directory</h1>
            <p className="text-white/75 text-lg">Search and connect with fellow graduates from across the years.</p>
          </motion.div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row gap-3 mb-8 p-5 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
          <div className="relative flex-1 group">
            <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl pl-11 pr-10 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none transition-all text-sm"
              placeholder="Search by name, occupation..." />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                <X size={15} />
              </button>
            )}
          </div>
          <div className="relative w-full md:w-56">
            <Filter size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select value={year} onChange={e => setYear(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl pl-11 pr-4 py-3 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none appearance-none text-sm">
              <option value="">All Graduation Years</option>
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          {hasFilters && (
            <button onClick={() => { setSearch(''); setYear('') }}
              className="flex items-center gap-1.5 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors whitespace-nowrap">
              <X size={14} />Clear
            </button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          {!loading && (
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
              {alumni.length} alumni found
            </motion.p>
          )}
        </AnimatePresence>

        {loading ? (
          <CardSkeleton count={6} />
        ) : alumni.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 bg-gray-50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={28} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No matching alumni</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">Try adjusting your search filters.</p>
            {hasFilters && (
              <button onClick={() => { setSearch(''); setYear('') }} className="text-sm font-bold text-primary-600 dark:text-primary-400 hover:underline">
                Clear all filters
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div variants={stagger} initial="hidden" animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {alumni.map(a => (
              <motion.div key={a.id} variants={fadeUp}><AlumniCard alumni={a} /></motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}
