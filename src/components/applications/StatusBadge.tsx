import { Badge } from '@/components/ui/badge'
import { STATUS_COLOR, STATUS_LABEL, cn } from '@/lib/utils'
import type { ApplicationStatus } from '@/types/database'

interface StatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant="secondary" className={cn(STATUS_COLOR[status], className)}>
      {STATUS_LABEL[status]}
    </Badge>
  )
}
