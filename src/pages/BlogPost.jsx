import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogService } from '../services/api'
import { BookOpen, CalendarDays, User, ArrowLeft } from 'lucide-react'
import { PageLoader } from '../components/Loader'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function BlogPost() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    blogService.getAll().then(({ data }) => {
      setPost((data || []).find(p => String(p.id) === String(id)) || null)
      setLoading(false)
    })
  }, [id])

  if (loading) return <PageLoader message="Loading post..." />

  if (!post) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <BookOpen size={48} className="mx-auto mb-4 text-gray-300" />
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Post not found</h2>
      <Link to="/blog" className="btn-primary inline-flex items-center gap-2 mt-4"><ArrowLeft size={15} />Back to Blog</Link>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <Link to="/blog" className="inline-flex items-center gap-2 text-sm font-bold text-primary-600 dark:text-primary-400 hover:gap-3 transition-all mb-8">
        <ArrowLeft size={16} /> Back to Blog
      </Link>

      <motion.article initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Cover image */}
        {post.cover_url && (
          <div className="rounded-2xl overflow-hidden mb-8 shadow-lg">
            <img src={post.cover_url} alt={post.title} className="w-full max-h-96 object-cover" />
          </div>
        )}

        {/* Meta */}
        <div className="mb-6">
          {post.category && (
            <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2 block">
              {post.category}
            </span>
          )}
          <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white leading-tight mb-4">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><User size={14} />{post.author || 'Admin'}</span>
            <span className="flex items-center gap-1.5"><CalendarDays size={14} />{formatDate(post.created_at)}</span>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 dark:border-gray-800 mb-8" />

        {/* Excerpt */}
        {post.excerpt && (
          <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed italic mb-8 border-l-4 border-primary-500 pl-4">
            {post.excerpt}
          </p>
        )}

        {/* Content */}
        <div className="text-gray-700 dark:text-gray-300 leading-relaxed text-base whitespace-pre-wrap">
          {post.content}
        </div>
      </motion.article>
    </div>
  )
}
