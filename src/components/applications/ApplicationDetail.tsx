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
    <SheetContent className="w-[480px] overflow-y-auto">
      {isLoading || !application ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : (
        <>
          <SheetHeader>
            <SheetTitle>{application.company}</SheetTitle>
            <p className="text-muted-foreground">{application.role}</p>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            <div>
              <span className="text-sm font-medium">Status</span>
              <p className="text-sm text-muted-foreground">{STATUS_LABEL[application.status]}</p>
            </div>

            {application.location && (
                <div>
                  <span className="text-sm font-medium">Location</span>
                  <p className="text-sm text-muted-foreground">{application.location}</p>
                </div>
              )}
              {(application.salary_min || application.salary_max) && (
                <div>
                  <span className="text-sm font-medium">Salary</span>
                  <p className="text-sm text-muted-foreground">
                    {application.salary_min} – {application.salary_max}
                  </p>
                </div>
              )}
              {application.notes && (
                <div>
                  <span className="text-sm font-medium">Notes</span>
                  <p className="text-sm text-muted-foreground">{application.notes}</p>
                </div>
              )}
          </div>
          <div className="mt-8">
            <h3 className="mb-4 font-medium">Activity</h3>
            <ActivityForm applicationId={applicationId} />
            <div className="mt-6">
              <ActivityTimeline applicationId={applicationId} />
            </div>
          </div>
        </>
      )}
    </SheetContent>
  </Sheet>
}
