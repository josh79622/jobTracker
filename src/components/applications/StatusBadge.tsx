import { Badge } from '@/components/ui/badge'
import { STATUS_COLOR, cn } from '@/lib/utils'
import { useStatusLabel } from '@/hooks/useStatusLabel'
import type { ApplicationStatus } from '@/types/database'

interface StatusBadgeProps {
  status: ApplicationStatus
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusLabel = useStatusLabel()
  return (
    <Badge variant="secondary" className={cn(STATUS_COLOR[status], className)}>
      {getStatusLabel(status)}
    </Badge>
  )
}
