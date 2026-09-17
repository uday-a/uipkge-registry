import Story from '../../components/story/Story'
import { SettingsPage } from '@react-registry-blocks/settings-page/SettingsPage'
import { Building2, CreditCard } from 'lucide-react'

export default function SettingsPageDemo() {
  return (
    <>
      <Story title="Full page" description="Profile section active by default, with sticky save bar and nav rail.">
        <SettingsPage className="min-h-[560px]" />
      </Story>

      <Story title="Notifications" description="Switch rows for email, push and digest.">
        <SettingsPage initialSection="notifications" className="min-h-[420px]" />
      </Story>

      <Story title="Appearance" description="Theme cards plus a reduced-motion toggle.">
        <SettingsPage initialSection="appearance" className="min-h-[420px]" />
      </Story>

      <Story title="Workspace" description="Identity fields with an adorned URL slug input.">
        <SettingsPage initialSection="workspace" className="min-h-[420px]" />
      </Story>

      <Story title="Billing" description="Plan summary with manage-billing affordance.">
        <SettingsPage initialSection="billing" className="min-h-[360px]" />
      </Story>

      <Story title="Danger zone" description="Destructive panel; the Delete… button opens a type-to-confirm dialog.">
        <SettingsPage initialSection="danger" className="min-h-[360px]" />
      </Story>

      <Story title="Custom nav" description="sections prop reorders and trims the rail; ids map to built-in panels.">
        <SettingsPage
          sections={[
            { id: 'workspace', label: 'Workspace', icon: Building2 },
            { id: 'billing', label: 'Billing', icon: CreditCard },
          ]}
          initialSection="workspace"
          className="min-h-[380px]"
        />
      </Story>
    </>
  )
}
