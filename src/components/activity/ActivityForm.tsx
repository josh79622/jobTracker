import { useState } from "react"
import { useCreateActivity } from "@/hooks/useCreateActivity"
import type { ActivityType } from "@/types/database"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

const ACTIVITY_TYPES: { value: ActivityType, label: string }[] = [
  { value: 'applied', label: 'Applied' },
  { value: 'email', label: 'Email' },
  { value: 'call', label: 'Call' },
  { value: 'interview', label: 'Interview' },
  { value: 'offer', label: 'Offer' },
  { value: 'rejection', label: 'Rejection' },
  { value: 'follow_up', label: 'Follow Up' },
  { value: 'note', label: 'Note' },
]

const getTodayString = () => new Date().toISOString().split('T')[0]

interface ActivityFormProps {
  applicationId: string
  // open: boolean
  // onOpenChange: (open: boolean) => void
}

export function ActivityForm({ applicationId }: ActivityFormProps) {

  const createActivity = useCreateActivity()
  const [type, setType] = useState<ActivityType>('note')
  const [description, setDescription] = useState('')
  const [date, setDate] = useState(getTodayString())

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    createActivity.mutate(
      { application_id: applicationId, type, description, date },
      {
        onSuccess: () => {
          toast.success('Activity added.')
          setDescription('')
          setDate(getTodayString())
        },
        onError: () => toast.error('Failed to add activity.'),
      }
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="space-y-1">
        <label className="text-sm font-medium">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as ActivityType)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        >
          {ACTIVITY_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Date</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <div className="space-y-1">
        <label className="text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
      </div>

      <Button type="submit" size="sm">Add Activity</Button>
    </form>
  )
}
