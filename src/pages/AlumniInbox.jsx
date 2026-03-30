import { useEffect, useState } from 'react'
import { supabase } from '../services/supabase'
import { useAuth } from '../context/AuthContext'
import { Inbox, Mail, MailOpen, Clock } from 'lucide-react'
import { CardSkeleton } from '../components/Loader'
import { Navigate } from 'react-router-dom'

export default function AlumniInbox() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [selected, setSelected] = useState(null)
  const [reads, setReads] = useState(new Set())
  const [loading, setLoading] = useState(true)
  const [alumniId, setAlumniId] = useState(null)

  if (!user) return <Navigate to="/login" replace />

  useEffect(() => {
    async function load() {
      const { data: alumni } = await supabase
        .from('alumni').select('id').eq('auth_user_id', user.id).maybeSingle()
      if (!alumni) { setLoading(false); return }
      setAlumniId(alumni.id)

      const [msgRes, readRes] = await Promise.all([
        supabase.from('messages').select('*').order('created_at', { ascending: false }),
        supabase.from('message_reads').select('message_id').eq('alumni_id', alumni.id),
      ])
      setMessages(msgRes.data || [])
      setReads(new Set((readRes.data || []).map(r => r.message_id)))
      setLoading(false)
    }
    load()

    const channel = supabase
      .channel('inbox-messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' },
        payload => setMessages(prev => [payload.new, ...prev]))
      .subscribe()

    return () => supabase.removeChannel(channel)
  }, [user])

  const openMessage = async (msg) => {
    setSelected(msg)
    if (!reads.has(msg.id) && alumniId) {
      await supabase.from('message_reads').upsert({ message_id: msg.id, alumni_id: alumniId })
      setReads(prev => new Set([...prev, msg.id]))
    }
  }

  const unreadCount = messages.filter(m => !reads.has(m.id)).length

  if (loading) return (
    <div className="max-w-4xl mx-auto px-4 py-10"><CardSkeleton count={4} /></div>
  )

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Inbox size={22} className="text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Inbox</h1>
        {unreadCount > 0 && (
          <span className="bg-green-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">{unreadCount} new</span>
        )}
      </div>

      {messages.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4">
            <Inbox size={24} className="text-gray-400" />
          </div>
          <p className="font-semibold text-gray-900 dark:text-white mb-1">No messages yet</p>
          <p className="text-gray-400 text-sm">Messages from the admin will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Message list */}
          <div className="lg:col-span-1 flex flex-col gap-2">
            {messages.map(msg => {
              const isRead = reads.has(msg.id)
              const isSelected = selected?.id === msg.id
              return (
                <button key={msg.id} onClick={() => openMessage(msg)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    isSelected
                      ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800'
                      : 'card hover:border-gray-300 dark:hover:border-gray-700'
                  }`}>
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex-shrink-0 ${isRead ? 'text-gray-400' : 'text-green-500'}`}>
                      {isRead ? <MailOpen size={16} /> : <Mail size={16} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm truncate ${isRead ? 'font-medium text-gray-600 dark:text-gray-400' : 'font-bold text-gray-900 dark:text-white'}`}>
                        {msg.subject}
                      </p>
                      <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                        <Clock size={10} />
                        {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                    {!isRead && <div className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0 mt-1.5" />}
                  </div>
                </button>
              )
            })}
          </div>

          {/* Message detail */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="card p-6">
                <div className="border-b border-gray-100 dark:border-gray-800 pb-4 mb-5">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{selected.subject}</h2>
                  <p className="text-xs text-gray-400 flex items-center gap-1">
                    <Clock size={11} />
                    {new Date(selected.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                </div>
                {selected.image_url && (
                  <img src={selected.image_url} alt="attachment" className="w-full rounded-xl mb-5 object-cover max-h-64" />
                )}
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-wrap">{selected.body}</p>
              </div>
            ) : (
              <div className="card p-16 text-center h-full flex flex-col items-center justify-center">
                <MailOpen size={32} className="text-gray-300 dark:text-gray-700 mb-3" />
                <p className="text-gray-400 text-sm">Select a message to read</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
