import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Application } from '@/types/database'

export const applicationsKey = ['applications'] as const

export function useApplications() {
  return useQuery<Application[]>({
    queryKey: applicationsKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('applied_date', { ascending: false })
      if (error) throw error
      return (data ?? []) as Application[]
    },
  })
}
