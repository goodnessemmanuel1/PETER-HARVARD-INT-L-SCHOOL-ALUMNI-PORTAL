import { useEffect, useState, useRef } from 'react'
import { supabase } from '../../services/supabase'
import { Images, Upload, Trash2, X, Tag } from 'lucide-react'
import { Spinner } from '../../components/Loader'

export default function AdminGallery() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [confirmName, setConfirmName] = useState(null)
  const [deletingName, setDeletingName] = useState(null)
  // Upload modal state
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [pendingFiles, setPendingFiles] = useState([]) // [{ file, preview, caption }]
  const fileRef = useRef()

  const load = async () => {
    setLoading(true)
    const { data, error } = await supabase.storage.from('gallery').list('', {
      limit: 200,
      sortBy: { column: 'created_at', order: 'desc' },
    })
    if (!error && data) {
      setImages(
        data
          .filter(f => {
            if (f.name === '.emptyFolderPlaceholder') return false
            if (f.name.includes('/')) return false
            const ext = f.name.split('.').pop()?.toLowerCase()
            return ['jpg','jpeg','png','gif','webp','avif','svg'].includes(ext)
          })
          .map(f => ({
            name: f.name,
            caption: decodeCaption(f.name),
            url: supabase.storage.from('gallery').getPublicUrl(f.name).data.publicUrl,
          }))
      )
    }
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  // Caption is encoded after the random slug: {timestamp}-{slug}--{caption}.{ext}
  function decodeCaption(filename) {
    const noExt = filename.replace(/\.[^.]+$/, '')
    const parts = noExt.split('--')
    if (parts.length >= 2) return decodeURIComponent(parts.slice(1).join('--').replace(/-/g, ' '))
    return ''
  }

  const handleFilePick = e => {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    const items = files.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      caption: '',
    }))
    setPendingFiles(items)
    setShowUploadModal(true)
    fileRef.current.value = ''
  }

  const handleUpload = async () => {
    setUploading(true)
    setUploadError('')
    for (const item of pendingFiles) {
      if (item.file.size > 10 * 1024 * 1024) { setUploadError(`${item.file.name} exceeds 10MB.`); continue }
      const ext = item.file.name.split('.').pop()
      const slug = Math.random().toString(36).slice(2)
      const captionSlug = item.caption.trim()
        ? '--' + encodeURIComponent(item.caption.trim().replace(/\s+/g, '-'))
        : ''
      const fileName = `${Date.now()}-${slug}${captionSlug}.${ext}`
      const { error } = await supabase.storage.from('gallery').upload(fileName, item.file, { upsert: false })
      if (error) setUploadError(error.message)
    }
    setUploading(false)
    setShowUploadModal(false)
    setPendingFiles([])
    load()
  }

  const handleDelete = async name => {
    setDeletingName(name)
    setUploadError('')
    const { error } = await supabase.storage.from('gallery').remove([name])
    if (error) {
      setUploadError(`Delete failed: ${error.message}`)
      setDeletingName(null)
      setConfirmName(null)
      return
    }
    setImages(imgs => imgs.filter(i => i.name !== name))
    setDeletingName(null)
    setConfirmName(null)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-3">
          <Images size={22} className="text-primary-600 dark:text-primary-400" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h1>
        </div>
        <button onClick={() => fileRef.current?.click()} disabled={uploading}
          className="btn-primary text-sm flex items-center gap-2">
          {uploading ? <><Spinner size={14} />Uploading...</> : <><Upload size={15} />Upload Photos</>}
        </button>
        <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFilePick} />
      </div>
      <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Upload and manage school gallery photos. Add captions like "Graduation Day 2024".</p>

      {uploadError && (
        <div className="mb-4 flex items-center gap-2 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          <X size={14} className="flex-shrink-0" />{uploadError}
        </div>
      )}

      {/* Upload Modal with captions */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-2xl w-full border border-gray-100 dark:border-gray-800 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Tag size={18} className="text-primary-500" /> Add Captions
              </h3>
              <button onClick={() => { setShowUploadModal(false); setPendingFiles([]) }}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">Optionally add a caption to each photo (e.g. "Graduation Day 2024", "Sports Day").</p>
            <div className="overflow-y-auto flex-1 space-y-4 pr-1">
              {pendingFiles.map((item, idx) => (
                <div key={idx} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
                  <img src={item.preview} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-400 truncate mb-1.5">{item.file.name}</p>
                    <input
                      type="text"
                      value={item.caption}
                      onChange={e => setPendingFiles(prev => prev.map((p, i) => i === idx ? { ...p, caption: e.target.value } : p))}
                      placeholder="e.g. Graduation Day 2024 (optional)"
                      className="input text-sm py-1.5"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-5 pt-4 border-t border-gray-100 dark:border-gray-800">
              <button onClick={() => { setShowUploadModal(false); setPendingFiles([]) }} className="flex-1 btn-outline py-2.5 text-sm">Cancel</button>
              <button onClick={handleUpload} disabled={uploading}
                className="flex-1 btn-primary py-2.5 text-sm flex items-center justify-center gap-2">
                {uploading ? <><Spinner size={14} />Uploading...</> : <><Upload size={14} />Upload {pendingFiles.length} Photo{pendingFiles.length > 1 ? 's' : ''}</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {confirmName && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 max-w-sm w-full border border-gray-100 dark:border-gray-800">
            <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 dark:text-white text-center mb-2">Delete Photo?</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">This photo will be permanently removed from the gallery.</p>
            <div className="flex gap-3">
              <button onClick={() => setConfirmName(null)} className="flex-1 btn-outline py-2.5 text-sm">Cancel</button>
              <button onClick={() => handleDelete(confirmName)} disabled={deletingName === confirmName}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                <Trash2 size={14} />{deletingName === confirmName ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="card p-12 text-center text-gray-400">Loading gallery...</div>
      ) : images.length === 0 ? (
        <div className="card p-16 text-center">
          <Images size={40} className="text-gray-300 mx-auto mb-4" />
          <p className="text-gray-400">No photos uploaded yet. Click "Upload Photos" to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {images.map(img => (
            <div key={img.name} className="group relative rounded-2xl overflow-hidden aspect-square bg-gray-100 dark:bg-gray-800">
              <img src={img.url} alt={img.caption || img.name} className="w-full h-full object-cover" loading="lazy" />
              {img.caption && (
                <div className="absolute inset-x-0 bottom-0 px-2 pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <div className="bg-black/75 backdrop-blur-sm rounded-lg px-2.5 py-1.5">
                    <p className="text-white text-xs font-bold leading-snug">{img.caption}</p>
                  </div>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                <button
                  onClick={() => setConfirmName(img.name)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity w-9 h-9 rounded-full bg-red-600 hover:bg-red-700 text-white flex items-center justify-center shadow-lg"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
