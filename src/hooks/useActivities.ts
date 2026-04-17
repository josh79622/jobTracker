import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Activity } from '@/types/database'

export const activitiesKey = (applicationId: string) =>
  ['activities', applicationId] as const

export function useActivities(applicationId: string | undefined) {
  return useQuery<Activity[]>({
    queryKey: activitiesKey(applicationId ?? ''),
    enabled: !!applicationId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('activities')
        .select('*')
        .eq('application_id', applicationId!)
        .order('date', { ascending: false })
      if (error) throw error
      return (data ?? []) as Activity[]
    },
  })
}
