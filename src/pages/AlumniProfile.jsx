import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { supabase } from '../services/supabase'
import { GraduationCap, Briefcase, Mail, Phone, Star, ArrowLeft, User } from 'lucide-react'

export default function AlumniProfile() {
  const { id } = useParams()
  const [alumni, setAlumni] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('alumni').select('*').eq('id', id).eq('status', 'approved').single()
      .then(({ data }) => { setAlumni(data); setLoading(false) })
  }, [id])

  if (loading) return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="card p-8 animate-pulse">
        <div className="flex gap-5 mb-6">
          <div className="w-20 h-20 rounded-full bg-gray-200 dark:bg-gray-700" />
          <div className="flex-1 space-y-3">
            <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        </div>
      </div>
    </div>
  )

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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/directory" className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors mb-6">
        <ArrowLeft size={15} />Back to Directory
      </Link>

      <div className="card p-8">
        {/* Header */}
        <div className="flex items-start gap-5 mb-8">
          <div className="w-20 h-20 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-2xl flex-shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{alumni.full_name}</h1>
              {alumni.featured && (
                <span className="badge-green flex items-center gap-1"><Star size={11} />Featured Alumni</span>
              )}
            </div>
            <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1.5 text-sm">
              <GraduationCap size={14} />Class of {alumni.graduation_year}
            </p>
            {alumni.current_occupation && (
              <p className="text-gray-600 dark:text-gray-300 flex items-center gap-1.5 text-sm mt-1">
                <Briefcase size={14} className="text-gray-400" />{alumni.current_occupation}
              </p>
            )}
          </div>
        </div>

        {/* Bio */}
        {alumni.bio && (
          <div className="mb-8">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">About</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{alumni.bio}</p>
          </div>
        )}

        {/* Contact */}
        <div>
          <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Contact</h2>
          <div className="space-y-2">
            {alumni.email && (
              <a href={`mailto:${alumni.email}`} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors">
                <Mail size={15} className="text-gray-400" />{alumni.email}
              </a>
            )}
            {alumni.phone && (
              <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                <Phone size={15} className="text-gray-400" />{alumni.phone}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
