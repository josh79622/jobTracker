import { useCallback } from 'react'
import { getStatusLabel } from '@/lib/utils'
import type { ApplicationStatus } from '@/types/database'
import { useUserPreferences } from './useUserPreferences'

// Returns a resolver that maps a status to its label, applying the user's
// custom overrides on top of the defaults.
export function useStatusLabel() {
  const { data: prefs } = useUserPreferences()
  const custom = prefs?.custom_status_labels ?? null

  return useCallback(
    (status: ApplicationStatus) => getStatusLabel(status, custom),
    [custom],
  )
}
