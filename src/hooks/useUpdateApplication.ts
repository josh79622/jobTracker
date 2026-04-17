import { useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Application } from '@/types/database'
import { applicationsKey } from './useApplications'
import { applicationKey } from './useApplication'

export type ApplicationPatch = Partial<Omit<Application, 'id' | 'user_id'>> & {
  id: string
}

export function useUpdateApplication() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (patch: ApplicationPatch) => {
      const { id, ...rest } = patch
      const { data, error } = await supabase
        .from('applications')
        .update({ ...rest, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data as Application
    },
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey: applicationsKey })
      await queryClient.cancelQueries({ queryKey: applicationKey(patch.id) })
      const prevList = queryClient.getQueryData<Application[]>(applicationsKey)
      const prevOne = queryClient.getQueryData<Application>(
        applicationKey(patch.id),
      )
      queryClient.setQueryData<Application[]>(applicationsKey, (old) =>
        (old ?? []).map((a) => (a.id === patch.id ? { ...a, ...patch } : a)),
      )
      if (prevOne) {
        queryClient.setQueryData<Application>(applicationKey(patch.id), {
          ...prevOne,
          ...patch,
        })
      }
      return { prevList, prevOne }
    },
    onError: (_err, patch, ctx) => {
      if (ctx?.prevList) queryClient.setQueryData(applicationsKey, ctx.prevList)
      if (ctx?.prevOne)
        queryClient.setQueryData(applicationKey(patch.id), ctx.prevOne)
    },
    onSettled: (_data, _err, patch) => {
      queryClient.invalidateQueries({ queryKey: applicationsKey })
      queryClient.invalidateQueries({ queryKey: applicationKey(patch.id) })
    },
  })
}
