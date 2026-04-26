import { useApplication } from '@/hooks/useApplication'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { STATUS_LABEL } from "@/lib/utils"
import { ActivityTimeline } from '@/components/activity/ActivityTimeline'

import { ActivityForm } from '@/components/activity/ActivityForm'

interface ApplicationDetailProps {
  applicationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ApplicationDetail({ applicationId, open, onOpenChange }: ApplicationDetailProps) {

  const { data: application, isLoading } = useApplication(applicationId)

  return <Sheet open={open} onOpenChange={onOpenChange}>
    <SheetContent className="w-[480px] sm:max-w-[480px] overflow-y-auto p-6">
      {isLoading || !application ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : (
        <>
          <SheetHeader>
            <SheetTitle>{application.company}</SheetTitle>
            <p className="text-muted-foreground">{application.role}</p>
          </SheetHeader>
          <hr className="my-1" />
          <div className="mt-2 space-y-4">
            <div>
              <span className="text-xs uppercase tracking-wide text-muted-foreground">Status</span>
              <p className="text-sm font-medium">{STATUS_LABEL[application.status]}</p>
            </div>

            {application.location && (
                <div>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Location</span>
                  <p className="text-sm font-medium">{application.location}</p>
                </div>
              )}
              {(application.salary_min && application.salary_min > 0 || application.salary_max && application.salary_max > 0) && (

                <div>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Salary</span>
                  <p className="text-sm font-medium">
                    {application.salary_min ? `$${application.salary_min.toLocaleString()}` : ''} ～ {application.salary_max ? `$${application.salary_max.toLocaleString()}` : ''}
                  </p>
                </div>
              )}
              {application.notes && (
                <div>
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">Notes</span>
                  <p className="text-sm font-medium">{application.notes}</p>
                </div>
              )}
          </div>
          <hr className="my-1" />
          <div className="mt-1">
            <h3 className="mb-4 font-medium">Activity</h3>
            <ActivityForm applicationId={applicationId} />

            <hr className="my-6" />
            <div className="mt-2">
              <ActivityTimeline applicationId={applicationId} />
            </div>
          </div>
        </>
      )}
    </SheetContent>
  </Sheet>
}
