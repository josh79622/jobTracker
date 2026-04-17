import type { Application } from '@/types/database'

interface ApplicationFormProps {
  application?: Application
  onSubmit?: (values: Partial<Application>) => void
}

export function ApplicationForm(_props: ApplicationFormProps) {
  return <div data-slot="application-form">ApplicationForm stub</div>
}
