import Story from '../../components/story/Story'
import { useState } from 'react'
import {
  VerticalTabs,
  VerticalTabsContent,
  VerticalTabsList,
  VerticalTabsSection,
  VerticalTabsTrigger,
} from '@react-registry/vertical-tabs'
import { AlertTriangle, Bell, GitBranch, Key, Mail, RefreshCw, Settings, Shield, User } from 'lucide-react'
import { Input } from '@react-registry/input'
import { Label } from '@react-registry/label'
import { Textarea } from '@react-registry/textarea'
import { Switch } from '@react-registry/switch'
import { Button } from '@react-registry/button'
import { Separator } from '@react-registry/separator'

export default function VerticalTabsDemo() {
  // Settings-with-forms demo state. Mock save handler so the demo emits
  // to the console rather than hitting a backend.
  const [profile, setProfile] = useState({
    name: 'Alex Morgan',
    email: 'alex@example.com',
    bio: 'Frontend engineer working on dashboards and design systems.',
  })
  const [security, setSecurity] = useState({
    twoFactor: true,
    sessionTimeout: '30',
  })
  const [notifications, setNotifications] = useState({
    productUpdates: true,
    weeklyDigest: false,
    securityAlerts: true,
  })

  function onSave(section: string) {
    // eslint-disable-next-line no-console
    console.log(`saved ${section}`, { profile, security, notifications })
  }

  return (
    <>
      <Story
        title="With forms (settings page)"
        description="Canonical settings-page pattern: left rail with Profile / Security / Notifications, right pane holds the form for the active section. Each panel composes Input + Label + Textarea + Switch + Save button. Bind your own v-models and submit handler."
      >
        <div className="bg-card rounded-lg border p-6">
          <VerticalTabs defaultValue="profile">
            <VerticalTabsList>
              <VerticalTabsTrigger value="profile">
                <User />
                Profile
              </VerticalTabsTrigger>
              <VerticalTabsTrigger value="security">
                <Shield />
                Security
              </VerticalTabsTrigger>
              <VerticalTabsTrigger value="notifications">
                <Bell />
                Notifications
              </VerticalTabsTrigger>
            </VerticalTabsList>

            <VerticalTabsContent value="profile">
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault()
                  onSave('profile')
                }}
              >
                <div>
                  <h3 className="text-lg font-semibold">Profile</h3>
                  <p className="text-muted-foreground mt-0.5 text-sm">How your account appears to teammates.</p>
                </div>
                <Separator />
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="grid gap-1.5">
                    <Label htmlFor="settings-name">Full name</Label>
                    <Input
                      id="settings-name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>
                  <div className="grid gap-1.5">
                    <Label htmlFor="settings-email">Email</Label>
                    <Input
                      id="settings-email"
                      type="email"
                      prefixIcon={<Mail />}
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="settings-bio">Bio</Label>
                  <Textarea
                    id="settings-bio"
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                  <p className="text-muted-foreground text-xs">Markdown supported. Shows on your public profile.</p>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            </VerticalTabsContent>

            <VerticalTabsContent value="security">
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault()
                  onSave('security')
                }}
              >
                <div>
                  <h3 className="text-lg font-semibold">Security</h3>
                  <p className="text-muted-foreground mt-0.5 text-sm">Sign-in protection and session lifetime.</p>
                </div>
                <Separator />
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-0.5">
                    <Label className="font-medium">Two-factor authentication</Label>
                    <p className="text-muted-foreground text-xs">Require a one-time code on every new device.</p>
                  </div>
                  <Switch
                    checked={security.twoFactor}
                    onCheckedChange={(v) => setSecurity({ ...security, twoFactor: v })}
                  />
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor="settings-timeout">Session timeout (minutes)</Label>
                  <Input
                    id="settings-timeout"
                    type="number"
                    min={5}
                    max={240}
                    value={security.sessionTimeout}
                    onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })}
                  />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            </VerticalTabsContent>

            <VerticalTabsContent value="notifications">
              <form
                className="space-y-5"
                onSubmit={(e) => {
                  e.preventDefault()
                  onSave('notifications')
                }}
              >
                <div>
                  <h3 className="text-lg font-semibold">Notifications</h3>
                  <p className="text-muted-foreground mt-0.5 text-sm">
                    Which emails we send to <span className="text-foreground font-medium">{profile.email}</span>.
                  </p>
                </div>
                <Separator />
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Product updates</Label>
                      <p className="text-muted-foreground text-xs">Feature releases, breaking changes, deprecations.</p>
                    </div>
                    <Switch
                      checked={notifications.productUpdates}
                      onCheckedChange={(v) => setNotifications({ ...notifications, productUpdates: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Weekly digest</Label>
                      <p className="text-muted-foreground text-xs">Activity summary every Monday morning.</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyDigest}
                      onCheckedChange={(v) => setNotifications({ ...notifications, weeklyDigest: v })}
                    />
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="space-y-0.5">
                      <Label className="font-medium">Security alerts</Label>
                      <p className="text-muted-foreground text-xs">
                        New sign-ins, password changes. We recommend keeping these on.
                      </p>
                    </div>
                    <Switch
                      checked={notifications.securityAlerts}
                      onCheckedChange={(v) => setNotifications({ ...notifications, securityAlerts: v })}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="ghost">
                    Cancel
                  </Button>
                  <Button type="submit">Save changes</Button>
                </div>
              </form>
            </VerticalTabsContent>
          </VerticalTabs>
        </div>
      </Story>

      <Story title="Default" description="Settings-style left rail with section labels and icon-prefixed items.">
        <div className="bg-card rounded-lg border p-6">
          <VerticalTabs defaultValue="general">
            <VerticalTabsList>
              <VerticalTabsSection label="Project" />
              <VerticalTabsTrigger value="general">
                <Settings />
                General
              </VerticalTabsTrigger>
              <VerticalTabsTrigger value="sync">
                <RefreshCw />
                Sync
              </VerticalTabsTrigger>
              <VerticalTabsSection label="Integrations" />
              <VerticalTabsTrigger value="git-sync">
                <GitBranch />
                Git Sync
              </VerticalTabsTrigger>
              <VerticalTabsTrigger value="api-key">
                <Key />
                API Key
              </VerticalTabsTrigger>
              <VerticalTabsSection label="Danger" />
              <VerticalTabsTrigger value="danger" className="text-destructive hover:text-destructive">
                <AlertTriangle />
                Danger Zone
              </VerticalTabsTrigger>
            </VerticalTabsList>

            <VerticalTabsContent value="general">
              <h3 className="text-lg font-semibold">General</h3>
              <p className="text-muted-foreground mt-1 text-sm">Basic project information and settings.</p>
            </VerticalTabsContent>
            <VerticalTabsContent value="sync">
              <h3 className="text-lg font-semibold">Sync</h3>
              <p className="text-muted-foreground mt-1 text-sm">Configure scheduled translation sync.</p>
            </VerticalTabsContent>
            <VerticalTabsContent value="git-sync">
              <h3 className="text-lg font-semibold">Git Sync</h3>
              <p className="text-muted-foreground mt-1 text-sm">Connect your repository for two-way sync.</p>
            </VerticalTabsContent>
            <VerticalTabsContent value="api-key">
              <h3 className="text-lg font-semibold">API Key</h3>
              <p className="text-muted-foreground mt-1 text-sm">Manage credentials used by your app.</p>
            </VerticalTabsContent>
            <VerticalTabsContent value="danger">
              <h3 className="text-destructive text-lg font-semibold">Danger Zone</h3>
              <p className="text-muted-foreground mt-1 text-sm">Permanently delete this project.</p>
            </VerticalTabsContent>
          </VerticalTabs>
        </div>
      </Story>

      <Story title="Without sections" description="Drop VerticalTabsSection for a flat list of items.">
        <div className="bg-card rounded-lg border p-6">
          <VerticalTabs defaultValue="profile">
            <VerticalTabsList>
              <VerticalTabsTrigger value="profile">
                <User />
                Profile
              </VerticalTabsTrigger>
              <VerticalTabsTrigger value="security">
                <Shield />
                Security
              </VerticalTabsTrigger>
              <VerticalTabsTrigger value="notifications">
                <Settings />
                Notifications
              </VerticalTabsTrigger>
            </VerticalTabsList>
            <VerticalTabsContent value="profile">
              <p className="text-muted-foreground text-sm">Profile preferences.</p>
            </VerticalTabsContent>
            <VerticalTabsContent value="security">
              <p className="text-muted-foreground text-sm">Two-factor and password options.</p>
            </VerticalTabsContent>
            <VerticalTabsContent value="notifications">
              <p className="text-muted-foreground text-sm">Email + in-app notification controls.</p>
            </VerticalTabsContent>
          </VerticalTabs>
        </div>
      </Story>

      <Story title="Disabled item" description="Set disabled on a trigger to prevent selection.">
        <div className="bg-card rounded-lg border p-6">
          <VerticalTabs defaultValue="active">
            <VerticalTabsList>
              <VerticalTabsTrigger value="active">
                <Settings />
                Active option
              </VerticalTabsTrigger>
              <VerticalTabsTrigger value="locked" disabled>
                <Shield />
                Locked option
              </VerticalTabsTrigger>
              <VerticalTabsTrigger value="other">
                <User />
                Other
              </VerticalTabsTrigger>
            </VerticalTabsList>
            <VerticalTabsContent value="active">
              <p className="text-muted-foreground text-sm">Selectable.</p>
            </VerticalTabsContent>
            <VerticalTabsContent value="other">
              <p className="text-muted-foreground text-sm">Also selectable.</p>
            </VerticalTabsContent>
          </VerticalTabs>
        </div>
      </Story>

      <Story title="Compact (no icons)" description="Drop the leading icon for a tighter list.">
        <div className="bg-card rounded-lg border p-6">
          <VerticalTabs defaultValue="overview">
            <VerticalTabsList className="w-44">
              <VerticalTabsTrigger value="overview">Overview</VerticalTabsTrigger>
              <VerticalTabsTrigger value="usage">Usage</VerticalTabsTrigger>
              <VerticalTabsTrigger value="billing">Billing</VerticalTabsTrigger>
              <VerticalTabsTrigger value="invoices">Invoices</VerticalTabsTrigger>
            </VerticalTabsList>
            <VerticalTabsContent value="overview">
              <p className="text-muted-foreground text-sm">Account summary.</p>
            </VerticalTabsContent>
            <VerticalTabsContent value="usage">
              <p className="text-muted-foreground text-sm">Resource usage breakdown.</p>
            </VerticalTabsContent>
            <VerticalTabsContent value="billing">
              <p className="text-muted-foreground text-sm">Plan and payment method.</p>
            </VerticalTabsContent>
            <VerticalTabsContent value="invoices">
              <p className="text-muted-foreground text-sm">Past invoices.</p>
            </VerticalTabsContent>
          </VerticalTabs>
        </div>
      </Story>

      <Story
        title="Static indicator"
        description="Pass animated={false} on VerticalTabsList to disable the sliding active surface. Active chrome (muted fill + primary rail) paints on the trigger instead."
      >
        <div className="bg-card rounded-lg border p-6">
          <VerticalTabs defaultValue="profile">
            <VerticalTabsList animated={false}>
              <VerticalTabsTrigger value="profile">
                <User />
                Profile
              </VerticalTabsTrigger>
              <VerticalTabsTrigger value="security">
                <Shield />
                Security
              </VerticalTabsTrigger>
              <VerticalTabsTrigger value="notifications">
                <Bell />
                Notifications
              </VerticalTabsTrigger>
            </VerticalTabsList>
            <VerticalTabsContent value="profile">
              <p className="text-muted-foreground text-sm">Static chrome — no slide between items.</p>
            </VerticalTabsContent>
            <VerticalTabsContent value="security">
              <p className="text-muted-foreground text-sm">Active styles snap instantly.</p>
            </VerticalTabsContent>
            <VerticalTabsContent value="notifications">
              <p className="text-muted-foreground text-sm">Useful when motion is undesired.</p>
            </VerticalTabsContent>
          </VerticalTabs>
        </div>
      </Story>
    </>
  )
}
