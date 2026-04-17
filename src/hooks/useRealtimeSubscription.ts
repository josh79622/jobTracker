import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { applicationsKey } from './useApplications'

export function useRealtimeSubscription() {
  const queryClient = useQueryClient()

  useEffect(() => {
    const channel = supabase
      .channel('applications-realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'applications' },
        () => {
          queryClient.invalidateQueries({ queryKey: applicationsKey })
        },
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [queryClient])
}
