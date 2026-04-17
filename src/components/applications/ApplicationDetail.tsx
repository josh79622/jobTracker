interface ApplicationDetailProps {
  applicationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplicationDetail(_props: ApplicationDetailProps) {
  return <div data-slot="application-detail">ApplicationDetail stub</div>
}
