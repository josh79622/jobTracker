import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { useAuth } from '@/hooks/useAuth'
import { useUpdateUserPreferences, useUserPreferences } from '@/hooks/useUserPreferences'
import { AvatarUpload } from './AvatarUpload'

export function ProfileSection() {
  const { user } = useAuth()
  const { data: prefs, isLoading } = useUserPreferences()
  const { mutate: save, isPending } = useUpdateUserPreferences()

  // null = untouched → fall back to the fetched value; '' = user cleared it
  const [draft, setDraft] = useState<string | null>(null)
  const displayName = draft ?? prefs?.display_name ?? ''
  const dirty = displayName.trim() !== (prefs?.display_name ?? '')

  const fallback = (prefs?.display_name || user?.email || '?').charAt(0).toUpperCase()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>Your public profile and account details.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <Skeleton className="h-16 w-full" />
        ) : (
          <>
            <AvatarUpload avatarUrl={prefs?.avatar_url ?? null} fallback={fallback} />

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user?.email ?? ''} disabled readOnly />
            </div>

            <div className="space-y-2">
              <Label htmlFor="display-name">Display name</Label>
              <Input
                id="display-name"
                value={displayName}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="How should we call you?"
              />
            </div>

            <Button
              onClick={() => save({ display_name: displayName.trim() || null })}
              disabled={!dirty || isPending}
            >
              {isPending ? 'Saving…' : 'Save changes'}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}
