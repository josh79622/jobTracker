import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'

export function useDeleteAccount() {
  const [isDeleting, setIsDeleting] = useState(false)
  const navigate = useNavigate()

  const deleteAccount = async () => {
    setIsDeleting(true)
    try {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth.user?.id

      // 1. Storage isn't cascaded by the DB, so remove avatar files first
      //    (best-effort — must happen while still authenticated).
      if (userId) {
        const { data: files } = await supabase.storage.from('avatars').list(userId)
        if (files && files.length > 0) {
          await supabase.storage
            .from('avatars')
            .remove(files.map((f) => `${userId}/${f.name}`))
        }
      }

      // 2. Delete the auth user; cascading FKs wipe all DB rows.
      const { error } = await supabase.rpc('delete_user')
      if (error) throw error

      // 3. Clear the local session and leave.
      await supabase.auth.signOut()
      navigate('/login', { replace: true })
    } finally {
      setIsDeleting(false)
    }
  }

  return { deleteAccount, isDeleting }
}
