'use client'

import * as React from 'react'
import { Bell, Building2, CreditCard, Palette, TriangleAlert, User } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { SectionCard } from '@/components/ui/section-card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

type SectionId = 'profile' | 'notifications' | 'appearance' | 'workspace' | 'billing' | 'danger'

export interface SettingsSection {
  id: SectionId
  label: string
  icon: React.ComponentType<{ className?: string }>
}

export interface SettingsPageProps {
  /** Override the nav. Ids must still match the built-in panels. */
  sections?: SettingsSection[]
  /** Initially active section id. */
  initialSection?: SectionId
  className?: string
}

const defaultSections: SettingsSection[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
  { id: 'workspace', label: 'Workspace', icon: Building2 },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'danger', label: 'Danger zone', icon: TriangleAlert },
]

function ToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string
  description: string
  checked: boolean
  onCheckedChange: (value: boolean) => void
}) {
  return (
    <li data-slot="settings-page" className="flex items-center justify-between gap-4 py-4">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-xs">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} aria-label={`Toggle ${title.toLowerCase()}`} />
    </li>
  )
}

export function SettingsPage({ sections = defaultSections, initialSection = 'profile', className }: SettingsPageProps) {
  const [active, setActive] = React.useState<SectionId>(initialSection)

  const [notifyEmail, setNotifyEmail] = React.useState(true)
  const [notifyPush, setNotifyPush] = React.useState(false)
  const [notifyDigest, setNotifyDigest] = React.useState(true)
  const [themeChoice, setThemeChoice] = React.useState<'light' | 'dark' | 'system'>('system')
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [deleteConfirm, setDeleteConfirm] = React.useState('')

  return (
    <div className={cn('bg-background border-border flex min-h-svh flex-col rounded-xl border lg:flex-row', className)}>
      {/* Nav rail */}
      <nav
        className="border-border shrink-0 border-b p-3 lg:w-56 lg:border-r lg:border-b-0"
        aria-label="Settings sections"
      >
        <div className="flex [scrollbar-width:none] gap-1 overflow-x-auto lg:flex-col lg:overflow-visible [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => {
            const Icon = section.icon
            const isActive = active === section.id
            return (
              <button
                key={section.id}
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => setActive(section.id)}
                className={cn(
                  'focus-visible:ring-ring flex shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:ring-2 focus-visible:outline-none',
                  isActive
                    ? section.id === 'danger'
                      ? 'text-destructive bg-destructive/10'
                      : 'bg-accent text-accent-foreground'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                )}
              >
                <Icon className="size-4" />
                {section.label}
              </button>
            )
          })}
        </div>
      </nav>

      {/* Content pane */}
      <div className="flex min-w-0 flex-1 flex-col">
        {active === 'profile' && (
          <section className="flex flex-1 flex-col">
            <div className="flex-1 space-y-6 p-6">
              <SectionCard title="Public profile" description="How teammates see you across the workspace.">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="sp-name">Display name</Label>
                    <Input id="sp-name" defaultValue="Amara Osei" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sp-email">Email</Label>
                    <Input id="sp-email" defaultValue="amara@acme.com" type="email" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sp-bio">Bio</Label>
                    <Textarea
                      id="sp-bio"
                      defaultValue="Design engineer. Builds systems, breaks assumptions."
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="sp-role">Role</Label>
                    <Select defaultValue="editor">
                      <SelectTrigger id="sp-role" className="w-full sm:w-56">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="editor">Editor</SelectItem>
                        <SelectItem value="viewer">Viewer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </SectionCard>
            </div>
            <div className="border-border flex items-center justify-end gap-2 border-t p-4">
              <Button variant="ghost" size="sm">
                Discard
              </Button>
              <Button size="sm">Save changes</Button>
            </div>
          </section>
        )}

        {active === 'notifications' && (
          <section className="flex-1 p-6">
            <SectionCard title="Notifications" description="Choose what reaches you and where.">
              <ul className="-my-4 divide-y">
                <ToggleRow
                  title="Email notifications"
                  description="Mentions, assignments and approvals."
                  checked={notifyEmail}
                  onCheckedChange={setNotifyEmail}
                />
                <ToggleRow
                  title="Push notifications"
                  description="Real-time browser alerts while you work."
                  checked={notifyPush}
                  onCheckedChange={setNotifyPush}
                />
                <ToggleRow
                  title="Weekly digest"
                  description="A summary of everything, every Monday."
                  checked={notifyDigest}
                  onCheckedChange={setNotifyDigest}
                />
              </ul>
            </SectionCard>
          </section>
        )}

        {active === 'appearance' && (
          <section className="flex-1 p-6">
            <SectionCard title="Appearance" description="Theme follows your system by default.">
              <div className="space-y-5">
                <div className="grid grid-cols-3 gap-3">
                  {(['light', 'dark', 'system'] as const).map((theme) => (
                    <button
                      key={theme}
                      type="button"
                      onClick={() => setThemeChoice(theme)}
                      className={cn(
                        'focus-visible:ring-ring rounded-lg border p-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none',
                        themeChoice === theme ? 'border-primary ring-primary/20 ring-2' : 'hover:bg-accent/50',
                      )}
                    >
                      <span className="block text-sm font-medium capitalize">{theme}</span>
                      <span className="text-muted-foreground block text-xs">
                        {theme === 'light'
                          ? 'Bright surfaces'
                          : theme === 'dark'
                            ? 'Low-light friendly'
                            : 'Match device'}
                      </span>
                    </button>
                  ))}
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Reduced motion</p>
                    <p className="text-muted-foreground text-xs">Collapse animations to instant transitions.</p>
                  </div>
                  <Switch defaultChecked={false} aria-label="Toggle reduced motion" />
                </div>
              </div>
            </SectionCard>
          </section>
        )}

        {active === 'workspace' && (
          <section className="flex-1 p-6">
            <SectionCard title="Workspace" description="Identity and defaults for everyone here.">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sp-ws-name">Workspace name</Label>
                  <Input id="sp-ws-name" defaultValue="Acme Inc" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sp-ws-url">URL slug</Label>
                  <div className="flex">
                    <span className="border-border bg-muted text-muted-foreground flex items-center rounded-l-md border px-3 font-mono text-xs">
                      acme.uipkge.app
                    </span>
                    <Input id="sp-ws-url" defaultValue="acme" className="rounded-l-none font-mono text-xs" />
                  </div>
                </div>
                <p className="text-muted-foreground text-xs">16 members · 4 pending invites</p>
              </div>
            </SectionCard>
          </section>
        )}

        {active === 'billing' && (
          <section className="flex-1 p-6">
            <SectionCard title="Billing" description="Plan, seats and invoices.">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">Team plan · $12 / seat / month</p>
                  <p className="text-muted-foreground mt-1 text-xs">Next invoice Sep 1, 2026 · 18 seats</p>
                </div>
                <Button variant="outline" size="sm">
                  Manage billing
                </Button>
              </div>
            </SectionCard>
          </section>
        )}

        {active === 'danger' && (
          <section className="flex-1 p-6">
            <div className="border-destructive/40 rounded-xl border p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-destructive text-sm font-medium">Delete this workspace</p>
                  <p className="text-muted-foreground mt-1 text-xs">
                    All projects, members and data will be permanently removed.
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
                  Delete…
                </Button>
              </div>
            </div>
          </section>
        )}
      </div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete workspace?</DialogTitle>
            <DialogDescription>
              This removes Acme Inc and all of its data for every member. This cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={deleteConfirm}
            onChange={(e) => setDeleteConfirm(e.target.value)}
            placeholder='Type "DELETE" to confirm'
          />
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDeleteOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={deleteConfirm !== 'DELETE'}
              onClick={() => setDeleteOpen(false)}
            >
              Delete forever
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
