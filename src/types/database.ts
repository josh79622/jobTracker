export const APPLICATION_STATUSES = ['applied', 'phone_screen', 'interview', 'offer', 'rejected', 'withdrawn'] as const
export type ApplicationStatus = typeof APPLICATION_STATUSES[number]

export type ActivityType =
  | 'applied'
  | 'email'
  | 'call'
  | 'interview'
  | 'offer'
  | 'rejection'
  | 'follow_up'
  | 'note'

export interface Application {
  id: string
  company: string
  role: string
  url: string | null
  status: ApplicationStatus
  salary_min: number | null
  salary_max: number | null
  location: string | null
  notes: string | null
  applied_date: string
  updated_at: string
  user_id: string
}

export interface Contact {
  id: string
  name: string
  email: string | null
  role: string | null
  company: string | null
  linkedin_url: string | null
  application_id: string
  user_id: string
}

export interface Activity {
  id: string
  application_id: string
  type: ActivityType
  description: string | null
  date: string
  user_id: string
}

export interface UserPreferences {
  id: string
  user_id: string
  display_name: string | null
  avatar_url: string | null
  default_location: string | null
  default_salary_min: number | null
  default_salary_max: number | null
  custom_status_labels: Record<string, string> | null
  theme: string
  created_at: string
  updated_at: string
}
