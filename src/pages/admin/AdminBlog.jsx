import { useEffect, useState } from 'react'
import { blogService } from '../../services/api'
import { BookOpen, PlusCircle, Trash2, X, CalendarDays } from 'lucide-react'
import { Spinner } from '../../components/Loader'
import { useAuth } from '../../context/AuthContext'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const EMPTY = { title: '', category: '', excerpt: '', content: '', cover_url: '' }

export default function AdminBlog() {
  const { user } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [confirmId, setConfirmId] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const [showForm, setShowForm] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await blogService.getAll()
    setPosts(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleSubmit = async e => {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) { setError('Title and content are required.'); return }
    setSaving(true)
    setError('')
    setSuccess('')
    const { error: err } = await blogService.create({
      ...form,
      author: user?.email?.split('@')[0] || 'Admin',
    })
    setSaving(false)
    if (err) { setError(err.message); return }
    setSuccess('Post published!')
    setForm(EMPTY)
    setShowForm(false)
    load()
  }

  const handleDelete = async id => {
    setDeletingId(id)
    await blogService.delete(id)
    setPosts(p => p.filter(x => x.id !== id))
    setDeletingId(null)
    setConfirmId(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <BookOpen size={22} className="text-primary-600 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
        </div>
        <button onClick={() => { setShowForm(s => !s); setError(''); setSuccess('') }}
          className="btn-primary text-sm flex items-center gap-2">
          {showForm ? <><X size={15} />Cancel</> : <><PlusCircle size={15} />New Post</>}
        </button>
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Publish and manage blog posts for the alumni community.</p>

      {/* Create Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="card p-6 mb-8 flex flex-col gap-4">
          <h2 className="font-semibold text-gray-900 dark:text-white">New Blog Post</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
              <input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="input" placeholder="Post title" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
              <input value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} className="input" placeholder="e.g. News, Events, Alumni" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Cover Image URL</label>
            <input value={form.cover_url} onChange={e => setForm(f => ({ ...f, cover_url: e.target.value }))} className="input" placeholder="https://..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Excerpt (short summary)</label>
            <input value={form.excerpt} onChange={e => setForm(f => ({ ...f, excerpt: e.target.value }))} className="input" placeholder="Brief description shown on the blog list..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Content *</label>
            <textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8} className="input resize-none" placeholder="Write your full post here..." required />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
          {success && <p className="text-sm text-green-600 dark:text-green-400">{success}</p>}
          <button type="submit" disabled={saving} className="btn-primary self-start flex items-center gap-2">
            {saving ? <><Spinner size={14} />Publishing...</> : <><PlusCircle size={14} />Publish Post</>}
          </button>
        </form>
      )}

      {/* Delete Confirm */}
      {confirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Delete Post?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
              "<span className="font-semibold text-gray-800 dark:text-gray-200">{posts.find(p => p.id === confirmId)?.title}</span>" will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmId(null)} className="flex-1 btn-outline py-2.5 text-sm">Cancel</button>
              <button onClick={() => handleDelete(confirmId)} disabled={deletingId === confirmId}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                <Trash2 size={14} />{deletingId === confirmId ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Posts List */}
      {loading ? (
        <div className="card p-12 text-center text-gray-400">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="card p-12 text-center text-gray-400">No blog posts yet. Create your first post above.</div>
      ) : (
        <div className="flex flex-col gap-4">
          {posts.map(post => (
            <div key={post.id} className="card p-5 flex items-start gap-4">
              {post.cover_url && (
                <img src={post.cover_url} alt={post.title} className="w-20 h-20 rounded-xl object-cover flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                {post.category && <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400">{post.category}</span>}
                <h3 className="font-bold text-gray-900 dark:text-white truncate">{post.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mt-0.5">{post.excerpt || post.content?.slice(0, 100)}</p>
                <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                  <CalendarDays size={11} />{formatDate(post.created_at)}
                  <span>·</span>
                  <span>By {post.author || 'Admin'}</span>
                </div>
              </div>
              <button onClick={() => setConfirmId(post.id)}
                className="flex-shrink-0 p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
