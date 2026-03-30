import { useEffect, useState } from 'react'
import { supabase } from '../../services/supabase'
import { useAuth } from '../../context/AuthContext'
import { Send, MessageSquare, Trash2, ImagePlus, X, Clock } from 'lucide-react'
import { Spinner } from '../../components/Loader'

export default function AdminMessages() {
  const { user } = useAuth()
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [form, setForm] = useState({ subject: '', body: '' })
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleImage = e => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const removeImage = () => { setImageFile(null); setImagePreview(null) }

  const handleSend = async e => {
    e.preventDefault()
    setSending(true)
    setError('')
    setSuccess('')

    let image_url = null
    if (imageFile) {
      const ext = imageFile.name.split('.').pop()
      const path = `messages/${Date.now()}.${ext}`
      const { error: uploadErr } = await supabase.storage.from('avatars').upload(path, imageFile, { upsert: true })
      if (uploadErr) { setError('Image upload failed: ' + uploadErr.message); setSending(false); return }
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      image_url = urlData.publicUrl
    }

    const { error: insertErr } = await supabase.from('messages').insert([{
      subject: form.subject,
      body: form.body,
      image_url,
      sent_by: user.id,
    }])

    if (insertErr) { setError(insertErr.message); setSending(false); return }

    setSuccess('Message sent to all alumni!')
    setForm({ subject: '', body: '' })
    removeImage()
    setSending(false)
    load()
  }

  const handleDelete = async (id) => {
    await supabase.from('messages').delete().eq('id', id)
    setMessages(m => m.filter(x => x.id !== id))
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-1">
        <MessageSquare size={22} className="text-primary-600 dark:text-primary-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Send Message</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Broadcast a message to all alumni inboxes.</p>

      {/* Compose */}
      <div className="card p-6 mb-8 max-w-2xl">
        <form onSubmit={handleSend} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
            <input required value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              className="input" placeholder="e.g. Upcoming Alumni Reunion 2025" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
            <textarea required rows={6} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
              className="input resize-none" placeholder="Write your message to all alumni..." />
          </div>

          {/* Image upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Attach Image <span className="text-gray-400 font-normal">(optional)</span>
            </label>
            {imagePreview ? (
              <div className="relative inline-block">
                <img src={imagePreview} alt="preview" className="w-full max-h-48 object-cover rounded-xl border border-gray-200 dark:border-gray-700" />
                <button type="button" onClick={removeImage}
                  className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <label className="flex items-center gap-2 cursor-pointer w-fit px-4 py-2.5 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-primary-400 hover:text-primary-600 transition-colors text-sm font-medium">
                <ImagePlus size={16} /> Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={handleImage} />
              </label>
            )}
          </div>

          {error && <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">{error}</p>}
          {success && <p className="text-sm text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">{success}</p>}

          <button type="submit" disabled={sending} className="btn-primary self-start flex items-center gap-2">
            {sending ? <><Spinner size={14} />Sending...</> : <><Send size={15} />Send to All Alumni</>}
          </button>
        </form>
      </div>

      {/* Sent messages */}
      <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Sent Messages</h2>
      {loading ? (
        <p className="text-gray-400 text-sm">Loading...</p>
      ) : messages.length === 0 ? (
        <div className="card p-8 text-center text-gray-400 text-sm">No messages sent yet.</div>
      ) : (
        <div className="flex flex-col gap-3 max-w-2xl">
          {messages.map(msg => (
            <div key={msg.id} className="card p-4 flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{msg.subject}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-1 mt-0.5">{msg.body}</p>
                <p className="text-xs text-gray-400 flex items-center gap-1 mt-1">
                  <Clock size={10} />
                  {new Date(msg.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
              {msg.image_url && (
                <img src={msg.image_url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
              )}
              <button onClick={() => handleDelete(msg.id)}
                className="text-red-400 hover:text-red-600 transition-colors flex-shrink-0 p-1">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
