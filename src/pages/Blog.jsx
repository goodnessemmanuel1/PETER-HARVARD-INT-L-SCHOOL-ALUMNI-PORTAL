import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { blogService } from '../services/api'
import { BookOpen, CalendarDays, User, ChevronRight } from 'lucide-react'
import { PageLoader } from '../components/Loader'

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export default function Blog() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    blogService.getAll().then(({ data }) => {
      setPosts(data || [])
      setLoading(false)
    })
  }, [])

  if (loading) return <PageLoader message="Loading blog..." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-10">
        <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
          <BookOpen size={24} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Blog</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">News, stories and updates from Peter Harvard INT'L School</p>
        </div>
      </motion.div>

      {posts.length === 0 ? (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-center py-32 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800">
          <BookOpen size={40} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No posts yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Blog posts will appear here once published by an admin.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, i) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -4 }}
              className="group card overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300"
            >
              {post.cover_url ? (
                <div className="h-48 overflow-hidden">
                  <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
              ) : (
                <div className="h-48 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                  <BookOpen size={40} className="text-white/40" />
                </div>
              )}
              <div className="p-6 flex flex-col flex-1">
                {post.category && (
                  <span className="text-xs font-bold uppercase tracking-wider text-primary-600 dark:text-primary-400 mb-2">{post.category}</span>
                )}
                <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2">
                  {post.title}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed line-clamp-3 flex-1">
                  {post.excerpt || post.content?.slice(0, 150)}
                </p>
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><User size={11} />{post.author || 'Admin'}</span>
                    <span className="flex items-center gap-1"><CalendarDays size={11} />{formatDate(post.created_at)}</span>
                  </div>
                  <Link
                    to={`/blog/${post.id}`}
                    className="text-xs font-bold text-primary-600 dark:text-primary-400 flex items-center gap-1 hover:gap-2 transition-all"
                  >
                    Read <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </div>
  )
}
