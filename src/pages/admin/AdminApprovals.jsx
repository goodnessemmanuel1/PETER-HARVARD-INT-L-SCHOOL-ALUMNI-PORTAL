import { useEffect, useState } from 'react'
import { alumniService } from '../../services/api'
import AlumniCard from '../../components/AlumniCard'
import { CheckSquare, Check, X, Loader } from 'lucide-react'
import { CardSkeleton } from '../../components/Loader'

export default function AdminApprovals() {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState({}) // { [id]: 'approving' | 'rejecting' }
  const [errors, setErrors] = useState({})

  const load = async () => {
    const { data } = await alumniService.getPending()
    setPending(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleApprove = async (id) => {
    setProcessing(p => ({ ...p, [id]: 'approving' }))
    setErrors(e => ({ ...e, [id]: null }))
    const { error } = await alumniService.approve(id)
    if (error) {
      setErrors(e => ({ ...e, [id]: 'Failed to approve. Try again.' }))
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
        Approving will create their account and email them their login credentials.
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pending.map(a => (
            <div key={a.id}>
              <AlumniCard
                alumni={a}
                actions={
                  <>
                    <button
                      onClick={() => handleApprove(a.id)}
                      disabled={!!processing[a.id]}
                      className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1 disabled:opacity-60"
                    >
                      {processing[a.id] === 'approving'
                        ? <><Loader size={11} className="animate-spin" />Approving...</>
                        : <><Check size={12} />Approve & Send Email</>
                      }
                    </button>
                    <button
                      onClick={() => handleReject(a.id)}
                      disabled={!!processing[a.id]}
                      className="border border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1 disabled:opacity-60"
                    >
                      {processing[a.id] === 'rejecting'
                        ? <><Loader size={11} className="animate-spin" />Rejecting...</>
                        : <><X size={12} />Reject</>
                      }
                    </button>
                  </>
                }
              />
              {errors[a.id] && <p className="text-xs text-red-500 mt-1 px-1">{errors[a.id]}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
