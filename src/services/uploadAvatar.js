import { supabase } from './supabase'

export async function uploadAvatar(file, folder = 'avatars') {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not authenticated')

  const formData = new FormData()
  formData.append('file', file)
  formData.append('folder', folder)

  const res = await fetch(
    `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/upload-avatar`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${session.access_token}` },
      body: formData,
    }
  )

  const json = await res.json()
  if (!res.ok || json.error) throw new Error(json.error || 'Upload failed')
  return json.publicUrl
}
