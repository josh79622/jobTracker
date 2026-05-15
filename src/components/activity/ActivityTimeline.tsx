import { useActivities } from "@/hooks/useActivities"
import type { ActivityType } from "@/types/database"

const ACTIVITY_LABEL: Record<ActivityType, string> = {
  applied: 'Applied',
  email: 'Email',
  call: 'Call',
  interview: 'Interview',
  offer: 'Offer',
  rejection: 'Rejection',
  follow_up: 'Follow Up',
  note: 'Note',
}

interface ActivityTimelineProps {
  applicationId: string
}

export function ActivityTimeline({ applicationId }: ActivityTimelineProps) {

  const { data: activities = [], isLoading } = useActivities(applicationId)

  if (isLoading) {
    return <div className="text-sm text-muted-foreground">Loading...</div>
  }

  if (activities.length === 0) {
    return <div className="text-sm text-muted-foreground">No activities yet.</div>
  }

  return <div className="space-y-4">
    {activities.map(activity => (
      <div key={activity.id} className="flex gap-3">
        <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
        <div>
          <div className="text-sm font-medium">{ACTIVITY_LABEL[activity.type]}</div>
            <div className="text-xs text-muted-foreground">{activity.date}</div>
          {activity.description && (
            <div className="mt-1 text-sm text-muted-foreground">{activity.description}</div>
          )}
        </div>
      </div>
    ))}
  </div>
}
