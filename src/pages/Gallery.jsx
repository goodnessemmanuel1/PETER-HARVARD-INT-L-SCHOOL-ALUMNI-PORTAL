import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../services/supabase'
import { Images, X, ChevronLeft, ChevronRight, ZoomIn, Tag } from 'lucide-react'
import { PageLoader } from '../components/Loader'

function decodeCaption(filename) {
  const noExt = filename.replace(/\.[^.]+$/, '')
  const parts = noExt.split('--')
  if (parts.length >= 2) return decodeURIComponent(parts.slice(1).join('--').replace(/-/g, ' '))
  return ''
}

export default function Gallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [lightbox, setLightbox] = useState(null)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    async function load() {
      const { data, error } = await supabase.storage.from('gallery').list('', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' },
      })
      if (!error && data) {
        const imgs = data
          .filter(f => f.name !== '.emptyFolderPlaceholder')
          .map((f, idx) => {
            const caption = decodeCaption(f.name) || `Photo ${idx + 1}`
            return {
              name: f.name,
              caption,
              hasCaption: !!decodeCaption(f.name),
              url: supabase.storage.from('gallery').getPublicUrl(f.name).data.publicUrl,
            }
          })
        setImages(imgs)
      }
      setLoading(false)
    }
    load()
  }, [])

  const prev = () => setLightbox(i => (i - 1 + images.length) % images.length)
  const next = () => setLightbox(i => (i + 1) % images.length)

  useEffect(() => {
    const handler = e => {
      if (lightbox === null) return
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'Escape') setLightbox(null)
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [lightbox, images.length])

  // Unique captions for filter tabs
  const captionTags = ['all', ...Array.from(new Set(images.filter(i => i.hasCaption).map(i => i.caption)))]
  const filtered = filter === 'all' ? images : images.filter(i => i.caption === filter)

  if (loading) return <PageLoader message="Loading gallery..." />

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-500/20">
          <Images size={24} />
        </div>
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Gallery</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium">
            Memories from Peter Harvard INT'L School
            {images.length > 0 && <span className="ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">{images.length} photos</span>}
          </p>
        </div>
      </motion.div>

      {/* Filter tabs */}
      {captionTags.length > 2 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 flex-wrap mb-8">
          <Tag size={14} className="text-gray-400 flex-shrink-0" />
          {captionTags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilter(tag)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all capitalize ${
                filter === tag
                  ? 'bg-primary-600 text-white shadow-md shadow-primary-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {tag === 'all' ? `All (${images.length})` : tag}
            </button>
          ))}
        </motion.div>
      )}

      {filtered.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 bg-gray-50/50 dark:bg-gray-900/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-800"
        >
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <Images size={32} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No photos yet</h3>
          <p className="text-gray-500 dark:text-gray-400">Gallery photos will appear here once uploaded by an admin.</p>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
        >
          {filtered.map((img, idx) => (
            <motion.div
              key={img.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.03 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => setLightbox(images.indexOf(img))}
              className="group relative break-inside-avoid rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <img
                src={img.url}
                alt={img.caption}
                className="w-full object-cover"
                loading="lazy"
              />
              {/* Caption bar */}
              {img.hasCaption && (
                <div className="absolute inset-x-0 bottom-0 px-3 pb-3">
                  <div className="bg-black/75 backdrop-blur-sm rounded-xl px-3 py-2">
                    <p className="text-white text-sm font-bold leading-snug tracking-wide">{img.caption}</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300 flex items-center justify-center">
                <ZoomIn size={28} className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 drop-shadow-lg" />
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center px-4"
            onClick={() => setLightbox(null)}
          >
            <button
              onClick={e => { e.stopPropagation(); setLightbox(null) }}
              className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors z-10"
            >
              <X size={20} />
            </button>

            <button
              onClick={e => { e.stopPropagation(); prev() }}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-10"
            >
              <ChevronLeft size={24} />
            </button>

            <motion.div
              key={lightbox}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              className="flex flex-col items-center gap-4 max-w-[90vw]"
              onClick={e => e.stopPropagation()}
            >
              <img
                src={images[lightbox]?.url}
                alt={images[lightbox]?.caption}
                className="max-h-[78vh] max-w-[90vw] object-contain rounded-xl shadow-2xl"
              />
              {/* Caption in lightbox */}
              {images[lightbox]?.hasCaption && (
                <div className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-black/70 backdrop-blur-sm border border-white/10">
                  <Tag size={14} className="text-primary-400 flex-shrink-0" />
                  <p className="text-white text-base font-bold tracking-wide">{images[lightbox]?.caption}</p>
                </div>
              )}
            </motion.div>

            <button
              onClick={e => { e.stopPropagation(); next() }}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center transition-colors z-10"
            >
              <ChevronRight size={24} />
            </button>

            <p className="absolute bottom-4 text-white/40 text-xs">{lightbox + 1} / {images.length}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
