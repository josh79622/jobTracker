import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Contact } from '@/types/database'

export const contactsKey = (applicationId?: string) =>
  applicationId ? (['contacts', applicationId] as const) : (['contacts'] as const)

export function useContacts(applicationId?: string) {
  return useQuery<Contact[]>({
    queryKey: contactsKey(applicationId),
    queryFn: async () => {
      let query = supabase.from('contacts').select('*')
      if (applicationId) query = query.eq('application_id', applicationId)
      const { data, error } = await query
      if (error) throw error
      return (data ?? []) as Contact[]
    },
  })
}
