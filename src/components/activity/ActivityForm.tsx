interface ActivityFormProps {
  applicationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActivityForm(_props: ActivityFormProps) {
  return <div data-slot="activity-form">ActivityForm stub</div>
}
