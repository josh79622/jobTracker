import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase"
import type { Activity, ActivityType } from "@/types/database";
import { activitiesKey } from "./useActivities";

export type NewActivity = {
  application_id: string
  type: ActivityType
  description: string | null
  date: string
}

export function useCreateActivity() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (input: NewActivity) => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      
        const { data, error } = await supabase
          .from('activities')
          .insert({
            ...input,
            user_id: user.id,
          })
          .select()
          .single()
        
        if (error) throw error
        return data as Activity
    },
    onSettled: (_data, _err, input) => {
      queryClient.invalidateQueries({ queryKey: activitiesKey(input.application_id) })
    },
  })
}