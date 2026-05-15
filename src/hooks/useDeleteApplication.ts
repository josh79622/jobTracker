import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Application } from '@/types/database'
import { applicationsKey } from './useApplications'
import { toast } from 'sonner'


export function useDeleteApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('applications').delete().eq('id', id)
      if (error) throw error
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: applicationsKey })
      const prev = queryClient.getQueryData<Application[]>(applicationsKey)
      queryClient.setQueryData<Application[]>(applicationsKey, (old) =>
        (old ?? []).filter((a) => a.id !== id),
      )
      return { prev }
    },
    onSuccess: () => {
      toast.success('Application deleted')
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(applicationsKey, ctx.prev)
      toast.error('Failed to delete application')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: applicationsKey })
    },
  })
}
