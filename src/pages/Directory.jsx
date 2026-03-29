import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { alumniService } from '../services/api'
import { Search, Users, Filter, X } from 'lucide-react'
import AlumniCard from '../components/AlumniCard'
import { CardSkeleton } from '../components/Loader'

const YEARS = Array.from({ length: 40 }, (_, i) => new Date().getFullYear() - i)

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}

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
      <div className="mb-12">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4 mb-4"
        >
          <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
            <Users size={24} />
          </div>
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Alumni Directory</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium">Search and connect with fellow graduates from across the years.</p>
          </div>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col md:flex-row gap-4 mb-10 p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800"
      >
        <div className="relative flex-1 group">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
          <input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl pl-12 pr-4 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none" 
            placeholder="Search by name, occupation, or bio..." 
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
              <X size={16} />
            </button>
          )}
        </div>
        
        <div className="relative w-full md:w-64">
          <Filter size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <select 
            value={year} 
            onChange={e => setYear(e.target.value)} 
            className="w-full bg-gray-50 dark:bg-gray-800 border-none rounded-xl pl-12 pr-4 py-3.5 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 transition-all outline-none appearance-none"
          >
            <option value="">All Graduation Years</option>
            {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
      </motion.div>

      <div className="flex items-center justify-between mb-6">
        <AnimatePresence mode="wait">
          {!loading && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest"
            >
              {alumni.length} alumni discovered
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {loading ? (
        <CardSkeleton count={6} />
      ) : alumni.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-24 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Users size={32} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No matching alumni</h3>
          <p className="text-gray-500 dark:text-gray-400">Try adjusting your search filters to find what you're looking for.</p>
          <button 
            onClick={() => { setSearch(''); setYear('') }}
            className="mt-6 text-primary-600 dark:text-primary-400 font-bold hover:underline"
          >
            Clear all filters
          </button>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {alumni.map(a => (
            <motion.div key={a.id} variants={itemVariants}>
              <AlumniCard alumni={a} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  )
}
