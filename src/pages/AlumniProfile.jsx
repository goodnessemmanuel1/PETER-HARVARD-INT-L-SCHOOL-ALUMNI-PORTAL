import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { GraduationCap, Briefcase, Mail, Phone, Star, ArrowLeft, User } from 'lucide-react'
import { PageLoader } from '../components/Loader'

export default function AlumniProfile() {
  const { id } = useParams()
  const [alumni, setAlumni] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('alumni').select('*').eq('id', id).eq('status', 'approved').single()
      .then(({ data }) => { setAlumni(data); setLoading(false) })
  }, [id])

  if (loading) return <PageLoader message="Loading profile..." />

  if (!alumni) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <User size={48} className="mx-auto mb-4 text-gray-300" />
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Alumni not found</h2>
      <p className="text-gray-500 dark:text-gray-400 mb-6">This profile may not exist or hasn't been approved yet.</p>
      <Link to="/directory" className="btn-primary inline-flex items-center gap-2"><ArrowLeft size={15} />Back to Directory</Link>
    </div>
  )

  const initials = alumni.full_name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/directory" className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:gap-3 transition-all mb-8">
        <ArrowLeft size={18} /> Back to Directory
      </Link>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card overflow-hidden shadow-2xl border-none"
      >
        <div className="h-32 bg-gradient-to-r from-primary-600 to-primary-800" />
        <div className="px-6 md:px-10 pb-10">
          {/* Header */}
          <div className="relative flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 mb-10 text-center md:text-left">
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="w-32 h-32 rounded-3xl bg-white dark:bg-gray-900 p-2 shadow-xl shrink-0"
            >
              <div className="w-full h-full rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 text-white flex items-center justify-center font-black text-4xl shadow-inner">
                {initials}
              </div>
            </motion.div>
            
            <div className="flex-1 pb-2">
              <div className="flex flex-col md:flex-row md:items-center gap-3 mb-2">
                <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">{alumni.full_name}</h1>
                {alumni.featured && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800 w-fit mx-auto md:mx-0">
                    <Star size={12} className="fill-current" /> Featured
                  </span>
                )}
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-gray-500 dark:text-gray-400 font-bold uppercase tracking-widest text-xs">
                <span className="flex items-center gap-2"><GraduationCap size={16} className="text-primary-500" /> Class of {alumni.graduation_year}</span>
                {alumni.current_occupation && <span className="flex items-center gap-2"><Briefcase size={16} className="text-primary-500" /> {alumni.current_occupation}</span>}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Main Content */}
            <div className="md:col-span-2 space-y-8">
              {alumni.bio && (
                <div>
                  <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                    Professional Bio
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg italic bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                    "{alumni.bio}"
                  </p>
                </div>
              )}
            </div>

            {/* Sidebar Contact */}
            <div className="space-y-6">
              <h2 className="text-xl font-black text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <div className="w-1.5 h-6 bg-primary-600 rounded-full" />
                Contact Info
              </h2>
              <div className="flex flex-col gap-4">
                {alumni.email && (
                  <a href={`mailto:${alumni.email}`} className="group flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 hover:border-primary-500 transition-all">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-primary-500 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-sm">
                      <Mail size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Email Address</p>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate">{alumni.email}</p>
                    </div>
                  </a>
                )}
                {alumni.phone && (
                  <div className="group flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                    <div className="w-10 h-10 rounded-xl bg-white dark:bg-gray-900 flex items-center justify-center text-primary-500 shadow-sm">
                      <Phone size={20} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Phone Number</p>
                      <p className="text-sm font-bold text-gray-700 dark:text-gray-300 truncate">{alumni.phone}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
