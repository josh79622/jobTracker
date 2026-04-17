export type ApplicationStatus =
  | 'applied'
  | 'phone_screen'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn'

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
