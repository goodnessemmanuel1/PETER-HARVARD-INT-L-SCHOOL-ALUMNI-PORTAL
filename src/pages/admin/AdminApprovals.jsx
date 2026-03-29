import { useEffect, useState } from 'react'
import { alumniService } from '../../services/api'
import AlumniCard from '../../components/AlumniCard'
import { CheckSquare, Check, X } from 'lucide-react'

export default function AdminApprovals() {
  const [pending, setPending] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const { data } = await alumniService.getPending()
    setPending(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handle = async (id, status) => {
    await alumniService.updateStatus(id, status)
    setPending(p => p.filter(a => a.id !== id))
  }

  if (loading) return <div className="text-gray-400">Loading...</div>

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <CheckSquare size={22} className="text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pending Approvals</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
        {pending.length} registration{pending.length !== 1 ? 's' : ''} awaiting review
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
            <AlumniCard
              key={a.id}
              alumni={a}
              actions={
                <>
                  <button onClick={() => handle(a.id, 'approved')} className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1">
                    <Check size={12} />Approve
                  </button>
                  <button onClick={() => handle(a.id, 'rejected')} className="border border-red-400 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 text-xs py-1.5 px-3 rounded-lg transition-colors flex items-center gap-1">
                    <X size={12} />Reject
                  </button>
                </>
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
