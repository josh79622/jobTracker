import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase'
import type { UserPreferences } from '@/types/database'

export const userPreferencesKey = ['user-preferences'] as const

// Read the current user's preferences row (null if they have none yet)
export function useUserPreferences() {
  return useQuery<UserPreferences | null>({
    queryKey: userPreferencesKey,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_preferences')
        .select('*')
        .maybeSingle()
      if (error) throw error
      return (data ?? null) as UserPreferences | null
    },
  })
}

export type UserPreferencesPatch = Partial<
  Omit<UserPreferences, 'id' | 'user_id' | 'created_at' | 'updated_at'>
>

// Insert-or-update the row, keyed on the unique user_id
export function useUpdateUserPreferences() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (patch: UserPreferencesPatch) => {
      const { data: auth } = await supabase.auth.getUser()
      const userId = auth.user?.id
      if (!userId) throw new Error('Not authenticated')

      const { data, error } = await supabase
        .from('user_preferences')
        .upsert({ user_id: userId, ...patch }, { onConflict: 'user_id' })
        .select()
        .single()
      if (error) throw error
      return data as UserPreferences
    },
    onMutate: async (patch) => {
      await queryClient.cancelQueries({ queryKey: userPreferencesKey })
      const prev = queryClient.getQueryData<UserPreferences | null>(userPreferencesKey)
      queryClient.setQueryData<UserPreferences | null>(userPreferencesKey, (old) =>
        old ? { ...old, ...patch } : old,
      )
      return { prev }
    },
    onSuccess: () => {
      toast.success('Preferences saved')
    },
    onError: (_err, _patch, ctx) => {
      if (ctx?.prev !== undefined) {
        queryClient.setQueryData(userPreferencesKey, ctx.prev)
      }
      toast.error('Failed to save preferences')
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: userPreferencesKey })
    },
  })
}
