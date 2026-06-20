import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useUpdateUserPreferences, useUserPreferences } from '@/hooks/useUserPreferences'

export function PreferencesSection() {
  const { data: prefs, isLoading } = useUserPreferences()
  const { mutate: save, isPending } = useUpdateUserPreferences()

  const [location, setLocation] = useState<string | null>(null)
  const [salaryMin, setSalaryMin] = useState<string | null>(null)
  const [salaryMax, setSalaryMax] = useState<string | null>(null)

  const locationValue = location ?? prefs?.default_location ?? ''
  const salaryMinValue = salaryMin ?? prefs?.default_salary_min?.toString() ?? ''
  const salaryMaxValue = salaryMax ?? prefs?.default_salary_max?.toString() ?? ''

  const dirty =
    locationValue.trim() !== (prefs?.default_location ?? '') ||
    salaryMinValue !== (prefs?.default_salary_min?.toString() ?? '') ||
    salaryMaxValue !== (prefs?.default_salary_max?.toString() ?? '')

  const handleSave = () => {
    save({
      default_location: locationValue.trim() || null,
      default_salary_min: salaryMinValue ? Number(salaryMinValue) : null,
      default_salary_max: salaryMaxValue ? Number(salaryMaxValue) : null,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Application defaults</CardTitle>
        <CardDescription>Pre-fill these values when you add a new application.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="default-location">Default location</Label>
              <Input
                id="default-location"
                value={locationValue}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Sydney, NSW"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="default-salary-min">Default min salary</Label>
                <Input
                  id="default-salary-min"
                  type="number"
                  value={salaryMinValue}
                  onChange={(e) => setSalaryMin(e.target.value)}
                  placeholder="80000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="default-salary-max">Default max salary</Label>
                <Input
                  id="default-salary-max"
                  type="number"
                  value={salaryMaxValue}
                  onChange={(e) => setSalaryMax(e.target.value)}
                  placeholder="120000"
                />
              </div>
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
