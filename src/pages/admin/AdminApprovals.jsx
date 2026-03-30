import { useEffect, useState } from 'react'
import { alumniService } from '../../services/api'
import { supabase } from '../../services/supabase'
import { CheckSquare, Check, X, Loader, GraduationCap, Briefcase, Mail, Phone } from 'lucide-react'
import { CardSkeleton } from '../../components/Loader'

export default function AdminApprovals() {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState({})
  const [errors, setErrors] = useState({})

  const load = async () => {
    const { data } = await alumniService.getPending()
    setPending(data || [])
    setLoading(false)
  }

  useEffect(() => {
    load()

    // Realtime subscription — auto-updates when new pending registrations arrive
    const channel = supabase
      .channel('pending-approvals')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'alumni',
        filter: 'status=eq.pending',
      }, () => load())
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [])

  const handleApprove = async (id) => {
    setProcessing(p => ({ ...p, [id]: 'approving' }))
    setErrors(e => ({ ...e, [id]: null }))
    const { error } = await alumniService.approve(id)
    if (error) {
      setErrors(e => ({ ...e, [id]: error.message || 'Failed to approve. Try again.' }))
      setProcessing(p => ({ ...p, [id]: null }))
    } else {
      setPending(p => p.filter(a => a.id !== id))
    }
  }

  const handleReject = async (id) => {
    setProcessing(p => ({ ...p, [id]: 'rejecting' }))
    await alumniService.reject(id)
    setPending(p => p.filter(a => a.id !== id))
  }

  if (loading) return <CardSkeleton count={3} />

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <CheckSquare size={22} className="text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Approvals</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        {pending.length} registration{pending.length !== 1 ? 's' : ''} awaiting review.
        Approving creates their account and emails them their login credentials.
      </p>

      {pending.length === 0 ? (
        <div className="card p-12 text-center">
          <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <Check size={28} className="text-green-600 dark:text-green-400" />
          </div>
          <p className="font-semibold text-gray-900 dark:text-white mb-1">All caught up!</p>
          <p className="text-gray-400 text-sm">No pending registrations.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {pending.map(a => {
            const initials = a.full_name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
            const isProcessing = !!processing[a.id]
            return (
              <div key={a.id} className="card p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start gap-5">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {a.avatar_url ? (
                      <img src={a.avatar_url} alt={a.full_name} className="w-16 h-16 rounded-full object-cover border-2 border-primary-200 dark:border-primary-800" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center font-bold text-xl border-2 border-primary-200 dark:border-primary-800">
                        {initials}
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg">{a.full_name}</h3>
                      <span className="badge-gray text-xs">Pending</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3">
                      <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <GraduationCap size={13} className="text-gray-400 flex-shrink-0" />
                        Class of {a.graduation_year}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                        <Mail size={13} className="text-gray-400 flex-shrink-0" />
                        <span className="truncate">{a.email}</span>
                      </p>
                      {a.phone && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                          <Phone size={13} className="text-gray-400 flex-shrink-0" />{a.phone}
                        </p>
                      )}
                      {a.current_occupation && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                          <Briefcase size={13} className="text-gray-400 flex-shrink-0" />
                          <span className="truncate">{a.current_occupation}</span>
                        </p>
                      )}
                    </div>

                    {a.bio && (
                      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2 italic">"{a.bio}"</p>
                    )}

                    <p className="text-xs text-gray-400 mb-4">
                      Submitted {new Date(a.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleApprove(a.id)}
                        disabled={isProcessing}
                        className="btn-primary text-sm flex items-center gap-2 disabled:opacity-60"
                      >
                        {processing[a.id] === 'approving'
                          ? <><Loader size={14} className="animate-spin" />Approving & Sending Email...</>
                          : <><Check size={14} />Approve & Send Credentials</>
                        }
                      </button>
                      <button
                        onClick={() => handleReject(a.id)}
                        disabled={isProcessing}
                        className="border border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm py-2 px-4 rounded-lg transition-colors flex items-center gap-2 disabled:opacity-60"
                      >
                        {processing[a.id] === 'rejecting'
                          ? <><Loader size={14} className="animate-spin" />Rejecting...</>
                          : <><X size={14} />Reject</>
                        }
                      </button>
                    </div>

                    {errors[a.id] && (
                      <p className="text-xs text-red-500 mt-2 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
                        {errors[a.id]}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
