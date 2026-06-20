import { DownloadIcon } from 'lucide-react'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useApplications } from '@/hooks/useApplications'
import { exportApplicationsAsCsv, exportApplicationsAsJson } from '@/lib/export'
import type { Application } from '@/types/database'

export function ExportDataButton() {
  const { data: applications = [], isLoading } = useApplications()

  const run = (exporter: (apps: Application[]) => void) => {
    if (applications.length === 0) {
      toast.error('No applications to export')
      return
    }
    exporter(applications)
    toast.success(`Exported ${applications.length} applications`)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Export data</CardTitle>
        <CardDescription>Download all your applications as CSV or JSON.</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-3">
        <Button variant="outline" disabled={isLoading} onClick={() => run(exportApplicationsAsCsv)}>
          <DownloadIcon className="size-4" />
          Export CSV
        </Button>
        <Button variant="outline" disabled={isLoading} onClick={() => run(exportApplicationsAsJson)}>
          <DownloadIcon className="size-4" />
          Export JSON
        </Button>
      </CardContent>
    </Card>
  )
}
