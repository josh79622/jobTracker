import { AppLayout } from '@/components/layout/AppLayout'
import { ProfileSection } from '@/components/settings/ProfileSection'
import { AppearanceSection } from '@/components/settings/AppearanceSection'
import { PreferencesSection } from '@/components/settings/PreferencesSection'
import { StatusLabelEditor } from '@/components/settings/StatusLabelEditor'
import { ExportDataButton } from '@/components/settings/ExportDataButton'
import { DataAccountSection } from '@/components/settings/DataAccountSection'


export default function SettingsPage() {
  return (
    <AppLayout>
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-muted-foreground">Manage your account and preferences.</p>
        </div>
        <ProfileSection />
        <PreferencesSection />
        <StatusLabelEditor />
        <AppearanceSection />
        <ExportDataButton />
        <DataAccountSection />
      </div>
    </AppLayout>
  )
}
