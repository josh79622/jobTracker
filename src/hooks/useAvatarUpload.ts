import { useState } from 'react'
import { supabase } from '@/lib/supabase'

const AVATAR_BUCKET = 'avatars'
const MAX_SIZE = 2 * 1024 * 1024 // 2 MB
const ACCEPTED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function useAvatarUpload() {
  const [uploading, setUploading] = useState(false)

  // Validates, uploads to the user's folder, returns the public URL
  const upload = async (file: File): Promise<string> => {
    if (!ACCEPTED_TYPES.includes(file.type)) {
      throw new Error('Only JPG, PNG, or WebP images are allowed')
    }
    if (file.size > MAX_SIZE) {
      throw new Error('Image must be 2MB or smaller')
    }

    const { data: auth } = await supabase.auth.getUser()
    const userId = auth.user?.id
    if (!userId) throw new Error('Not authenticated')

    // Folder must start with the user id so the storage RLS policy allows it.
    // Timestamp in the name busts the CDN cache so the new image shows at once.
    const ext = file.name.split('.').pop()?.toLowerCase() ?? 'png'
    const path = `${userId}/avatar-${Date.now()}.${ext}`

    setUploading(true)
    try {
      const { error: uploadError } = await supabase.storage
        .from(AVATAR_BUCKET)
        .upload(path, file, { cacheControl: '3600', upsert: true })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from(AVATAR_BUCKET).getPublicUrl(path)
      return data.publicUrl
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading }
}
