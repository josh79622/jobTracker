import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Application } from '@/types/database'

export const applicationKey = (id: string) => ['application', id] as const

export function useApplication(id: string | undefined) {
  return useQuery<Application>({
    queryKey: applicationKey(id ?? ''),
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('id', id!)
        .single()
      if (error) throw error
      return data as Application
    },
  })
}
