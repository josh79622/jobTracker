import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Application } from '@/types/database'
import { applicationsKey } from './useApplications'
import { toast } from 'sonner'


export type NewApplication = Omit<Application, 'id' | 'updated_at' | 'user_id'>

export function useCreateApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (input: NewApplication) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
      const { data, error } = await supabase
        .from('applications')
        .insert({ ...input, user_id: user.id })
        .select()
        .single()
      if (error) throw error
      return data as Application
    },
    onMutate: async (input) => {
      await queryClient.cancelQueries({ queryKey: applicationsKey })
      const prev = queryClient.getQueryData<Application[]>(applicationsKey)
      const optimistic: Application = {
        ...input,
        id: `temp-${Date.now()}`,
        updated_at: new Date().toISOString(),
        user_id: 'optimistic',
      }
      queryClient.setQueryData<Application[]>(applicationsKey, (old) => [
        optimistic,
        ...(old ?? []),
      ])
      return { prev }
    },
    onSuccess: () => {
      toast.success('Application created')
    },
    onError: (_err, _input, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(applicationsKey, ctx.prev)
      toast.error('Failed to create application')

    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: applicationsKey })
    },
  })
}
