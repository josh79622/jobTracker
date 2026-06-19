import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Skeleton } from '@/components/ui/skeleton'
import { APPLICATION_STATUSES } from '@/types/database'
import { STATUS_LABEL } from '@/lib/utils'
import { useUpdateUserPreferences, useUserPreferences } from '@/hooks/useUserPreferences'

// Drop empty overrides and normalise key order so dirty-checking is reliable
function normalize(obj: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const status of APPLICATION_STATUSES) {
    const value = (obj[status] ?? '').trim()
    if (value) out[status] = value
  }
  return out
}

export function StatusLabelEditor() {
  const { data: prefs, isLoading } = useUserPreferences()
  const { mutate: save, isPending } = useUpdateUserPreferences()

  const [draft, setDraft] = useState<Record<string, string> | null>(null)
  const saved = prefs?.custom_status_labels ?? {}
  const labels = draft ?? saved

  const dirty = JSON.stringify(normalize(labels)) !== JSON.stringify(normalize(saved))

  const setLabel = (status: string, value: string) => {
    setDraft({ ...labels, [status]: value })
  }

  const handleSave = () => {
    const cleaned = normalize(labels)
    save({ custom_status_labels: Object.keys(cleaned).length ? cleaned : null })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status labels</CardTitle>
        <CardDescription>
          Rename the pipeline stages to match your workflow. Leave blank to use the default.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-48 w-full" />
        ) : (
          <>
            <div className="space-y-3">
              {APPLICATION_STATUSES.map((status) => (
                <div key={status} className="grid grid-cols-[1fr_2fr] items-center gap-3">
                  <span className="text-sm text-muted-foreground">{STATUS_LABEL[status]}</span>
                  <Input
                    value={labels[status] ?? ''}
                    onChange={(e) => setLabel(status, e.target.value)}
                    placeholder={STATUS_LABEL[status]}
                  />
                </div>
              ))}
            </div>

            <Button onClick={handleSave} disabled={!dirty || isPending}>
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
