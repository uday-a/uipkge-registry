'use client'

import * as React from 'react'
import { Building2, Check, ChevronsUpDown, Globe, LogOut, Plus, Settings, UserPlus } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface WorkspaceItem {
  id: string
  name: string
  slug?: string
  plan: string
  planTier: string
  members: number
  region: string
  regionCode: string
  role: 'Owner' | 'Admin' | 'Member' | 'Personal'
  color: string
  initials: string
}

export interface UserInfo {
  name: string
  email: string
  avatar?: string
}

export interface EnterpriseWorkspaceSwitcherProps {
  initialWorkspaces?: WorkspaceItem[]
  defaultActiveId?: string
  user?: UserInfo
  className?: string
  onChange?: (workspace: WorkspaceItem) => void
  onCreate?: (workspace: WorkspaceItem) => void
  onAction?: (key: 'settings' | 'billing' | 'invite' | 'logout') => void
}

const DEFAULT_WORKSPACES: WorkspaceItem[] = [
  {
    id: 'ws-1',
    name: 'UIPKGE Enterprise Inc.',
    slug: 'uipkge-enterprise',
    plan: 'Enterprise Scale',
    planTier: 'Enterprise Plan',
    members: 64,
    region: 'US East (N. Virginia)',
    regionCode: 'US-East',
    role: 'Owner',
    color: 'bg-primary/10 text-primary border border-primary/20',
    initials: 'UE',
  },
  {
    id: 'ws-2',
    name: 'Acme Design Systems Lab',
    slug: 'acme-design',
    plan: 'Pro Team',
    planTier: 'Pro Team',
    members: 18,
    region: 'EU Central (Frankfurt)',
    regionCode: 'EU-Central',
    role: 'Admin',
    color: 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
    initials: 'AD',
  },
  {
    id: 'ws-3',
    name: 'Personal Sandbox',
    slug: 'personal-sandbox',
    plan: 'Developer Tier',
    planTier: 'Free Developer Tier',
    members: 1,
    region: 'Global Edge',
    regionCode: 'Global',
    role: 'Personal',
    color: 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20',
    initials: 'PS',
  },
]

const DEFAULT_USER: UserInfo = {
  name: 'Elena Rostova',
  email: 'elena@uipkge.dev',
  avatar: '',
}

export function EnterpriseWorkspaceSwitcher({
  initialWorkspaces = DEFAULT_WORKSPACES,
  defaultActiveId = 'ws-1',
  user = DEFAULT_USER,
  className,
  onChange,
  onCreate,
  onAction,
}: EnterpriseWorkspaceSwitcherProps) {
  const [workspaces, setWorkspaces] = React.useState<WorkspaceItem[]>(initialWorkspaces)
  const [activeWorkspaceId, setActiveWorkspaceId] = React.useState<string>(defaultActiveId)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false)

  // Dialog Form State
  const [newOrgName, setNewOrgName] = React.useState('Stripe Developer Platform')
  const [newOrgRegion, setNewOrgRegion] = React.useState('us-east')
  const [newOrgPlan, setNewOrgPlan] = React.useState('pro')

  const activeWorkspace = React.useMemo(() => {
    return (
      workspaces.find((w) => w.id === activeWorkspaceId) ||
      workspaces[0] || {
        id: 'ws-fallback',
        name: 'Workspace',
        plan: 'Standard',
        planTier: 'Standard',
        members: 1,
        region: 'US-East',
        regionCode: 'US-East',
        role: 'Owner',
        color: 'bg-muted text-foreground border border-border',
        initials: 'WS',
      }
    )
  }, [workspaces, activeWorkspaceId])

  const slugPreview = React.useMemo(() => {
    const cleaned = newOrgName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
    return cleaned || 'stripe-dev'
  }, [newOrgName])

  const handleSelectWorkspace = (workspace: WorkspaceItem) => {
    setActiveWorkspaceId(workspace.id)
    onChange?.(workspace)
  }

  const handleCreateWorkspace = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newOrgName.trim()) return

    const regionMap: Record<string, { full: string; code: string }> = {
      'us-east': { full: 'US East (N. Virginia)', code: 'US-East' },
      'eu-central': { full: 'EU Central (Frankfurt)', code: 'EU-Central' },
      'ap-south': { full: 'AP South (Mumbai)', code: 'AP-South' },
    }

    const regionInfo = regionMap[newOrgRegion] || {
      full: 'US East (N. Virginia)',
      code: 'US-East',
    }

    const parts = newOrgName.trim().split(/\s+/)
    const initials =
      parts.length > 1
        ? `${parts[0]?.[0] || ''}${parts[1]?.[0] || ''}`.toUpperCase()
        : (parts[0]?.slice(0, 2) || 'WS').toUpperCase()

    const newWs: WorkspaceItem = {
      id: `ws-${Date.now()}`,
      name: newOrgName.trim(),
      slug: slugPreview,
      plan: newOrgPlan === 'enterprise' ? 'Enterprise Scale' : 'Pro Team',
      planTier: newOrgPlan === 'enterprise' ? 'Enterprise Custom' : 'Pro Team',
      members: 1,
      region: regionInfo.full,
      regionCode: regionInfo.code,
      role: 'Owner',
      color:
        newOrgPlan === 'enterprise'
          ? 'bg-primary/10 text-primary border border-primary/20'
          : 'bg-sky-500/10 text-sky-500 border border-sky-500/20',
      initials,
    }

    setWorkspaces((prev) => [newWs, ...prev])
    setActiveWorkspaceId(newWs.id)
    onCreate?.(newWs)
    onChange?.(newWs)

    setNewOrgName('')
    setIsCreateDialogOpen(false)
  }

  const userInitials = React.useMemo(() => {
    return (
      user.name
        .split(' ')
        .map((p) => p[0])
        .join('')
        .toUpperCase() || 'U'
    )
  }, [user.name])

  return (
    <div data-slot="enterprise-workspace-switcher" className={cn('w-full', className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="group border-border/80 bg-card hover:bg-accent/40 focus-visible:ring-ring flex w-full items-center gap-3 rounded-xl border p-2.5 text-left shadow-xs transition-all duration-150 focus-visible:ring-2 focus-visible:outline-none"
            aria-label="Select organization workspace"
          >
            {/* Org Avatar / Monogram with Emerald Ring */}
            <div className="relative size-10 shrink-0">
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-lg text-sm font-semibold shadow-2xs',
                  activeWorkspace.color,
                )}
              >
                {activeWorkspace.initials}
              </div>
              <span
                className="border-card absolute -top-0.5 -right-0.5 size-2.5 rounded-full border-2 bg-emerald-500"
                title="Active Organization"
                aria-label="Active workspace status: Online"
              />
            </div>

            {/* Active Org Info & Role Badge */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-foreground truncate text-sm font-semibold tracking-tight">
                  {activeWorkspace.name}
                </span>
                <Badge variant="secondary" className="shrink-0 px-1.5 py-0 text-xs font-medium">
                  {activeWorkspace.role}
                </Badge>
              </div>
              <div className="text-muted-foreground mt-0.5 flex items-center gap-1.5 truncate text-xs">
                <span className="truncate font-medium">Tier: {activeWorkspace.plan}</span>
                <span className="shrink-0">{activeWorkspace.regionCode}</span>
              </div>
            </div>

            {/* Chevron Icon */}
            <ChevronsUpDown className="text-muted-foreground/70 group-hover:text-foreground size-4 shrink-0 transition-colors" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="border-border bg-popover w-80 rounded-xl p-2 shadow-xl sm:w-96"
          align="start"
          sideOffset={6}
        >
          {/* User Header Profile Info */}
          <DropdownMenuLabel className="p-0 font-normal">
            <div className="bg-muted/40 flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-left">
              <Avatar className="size-8 rounded-full border">
                {user.avatar ? <AvatarImage src={user.avatar} alt={user.name} /> : null}
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="grid min-w-0 flex-1 text-left leading-tight">
                <span className="text-muted-foreground text-xs font-medium">Signed in as</span>
                <span className="text-foreground truncate text-xs font-semibold">{user.email}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="size-2 rounded-full bg-emerald-500" />
                <span className="text-muted-foreground text-xs font-medium">Ready</span>
              </div>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator className="my-1.5" />

          {/* Workspaces Section */}
          <div className="flex items-center justify-between px-2 py-1">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">Workspaces</span>
            <span className="text-muted-foreground/70 text-xs">{workspaces.length} total</span>
          </div>

          <div className="my-1 space-y-1">
            {workspaces.map((ws) => (
              <DropdownMenuItem
                key={ws.id}
                className="hover:bg-accent focus:bg-accent flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors"
                onSelect={() => handleSelectWorkspace(ws)}
              >
                <div
                  className={cn(
                    'flex size-8 shrink-0 items-center justify-center rounded-lg text-xs font-semibold shadow-2xs',
                    ws.color,
                  )}
                >
                  {ws.initials}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'truncate text-sm font-medium',
                        activeWorkspaceId === ws.id ? 'text-foreground font-semibold' : 'text-foreground/90',
                      )}
                    >
                      {ws.name}
                    </span>
                    {ws.role === 'Owner' && (
                      <Badge variant="secondary" className="shrink-0 px-1 py-0 text-xs font-medium">
                        Owner
                      </Badge>
                    )}
                    {ws.role === 'Admin' && (
                      <Badge variant="outline" className="shrink-0 px-1 py-0 text-xs font-medium">
                        Admin
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground truncate text-xs">
                    {ws.planTier} · {ws.members} Member{ws.members === 1 ? '' : 's'} · {ws.regionCode}
                  </p>
                </div>

                {activeWorkspaceId === ws.id && (
                  <Check className="size-4 shrink-0 text-emerald-500" aria-hidden="true" />
                )}
              </DropdownMenuItem>
            ))}
          </div>

          <DropdownMenuSeparator className="my-1.5" />

          {/* Actions */}
          <DropdownMenuGroup>
            <DropdownMenuItem
              className="text-foreground hover:bg-accent focus:bg-accent flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors"
              onSelect={() => setIsCreateDialogOpen(true)}
            >
              <div className="border-primary/30 bg-primary/10 text-primary flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-3.5" />
              </div>
              <span className="font-medium">Create New Workspace</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-muted-foreground hover:text-foreground hover:bg-accent focus:bg-accent flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors"
              onSelect={() => onAction?.('settings')}
            >
              <div className="border-border bg-muted flex size-6 items-center justify-center rounded-md border">
                <Settings className="size-3.5" />
              </div>
              <span>Organization Settings & Billing</span>
            </DropdownMenuItem>

            <DropdownMenuItem
              className="text-muted-foreground hover:text-foreground hover:bg-accent focus:bg-accent flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition-colors"
              onSelect={() => onAction?.('invite')}
            >
              <div className="border-border bg-muted flex size-6 items-center justify-center rounded-md border">
                <UserPlus className="size-3.5" />
              </div>
              <span>Invite Team Members</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator className="my-1.5" />

          {/* Logout */}
          <DropdownMenuItem
            className="text-destructive hover:bg-destructive/10 focus:bg-destructive/10 focus:text-destructive flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm font-medium transition-colors"
            onSelect={() => onAction?.('logout')}
          >
            <div className="border-destructive/20 bg-destructive/10 text-destructive flex size-6 items-center justify-center rounded-md border">
              <LogOut className="size-3.5" />
            </div>
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Create New Workspace Modal Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="border-border bg-background rounded-2xl p-6 shadow-sm sm:max-w-lg">
          <DialogHeader className="space-y-2 text-left">
            <div className="border-primary/20 bg-primary/10 text-primary flex size-10 items-center justify-center rounded-xl border shadow-xs">
              <Building2 className="size-5" />
            </div>
            <DialogTitle className="text-foreground text-lg font-bold tracking-tight">Create New Workspace</DialogTitle>
            <DialogDescription className="text-muted-foreground text-sm leading-relaxed">
              Spin up a dedicated organization workspace with multi-region routing and isolated billing.
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-4 py-2" onSubmit={handleCreateWorkspace}>
            {/* Workspace Name */}
            <div className="space-y-1.5">
              <label htmlFor="new-workspace-name-react" className="text-foreground text-sm font-medium">
                Workspace Name
              </label>
              <Input
                id="new-workspace-name-react"
                value={newOrgName}
                onChange={(e) => setNewOrgName(e.target.value)}
                placeholder="e.g. Stripe Developer Platform"
                autoComplete="off"
                className="h-10 text-sm"
                required
              />
            </div>

            {/* URL Slug Preview */}
            <div className="space-y-1.5">
              <label className="text-muted-foreground text-xs font-medium">Workspace URL Slug</label>
              <div className="border-border bg-muted/40 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs">
                <Globe className="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                <span className="text-muted-foreground">uipkge.dev/</span>
                <span className="text-foreground truncate font-semibold">{slugPreview}</span>
              </div>
            </div>

            {/* Primary Region Selection */}
            <div className="space-y-1.5">
              <label className="text-foreground text-sm font-medium">Primary Region</label>
              <Select value={newOrgRegion} onValueChange={setNewOrgRegion}>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Select primary region" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="us-east">US East (N. Virginia)</SelectItem>
                  <SelectItem value="eu-central">EU Central (Frankfurt)</SelectItem>
                  <SelectItem value="ap-south">AP South (Mumbai)</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-muted-foreground text-xs">
                Primary cluster location for low-latency queries and database replication.
              </p>
            </div>

            {/* Plan Selection Radios */}
            <div className="space-y-2">
              <label className="text-foreground text-sm font-medium">Choose Workspace Plan</label>
              <RadioGroup
                value={newOrgPlan}
                onValueChange={setNewOrgPlan}
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
              >
                <label
                  htmlFor="plan-pro-react"
                  className={cn(
                    'border-border/80 hover:border-primary/50 relative flex cursor-pointer flex-col justify-between rounded-xl border p-3.5 shadow-xs transition-all',
                    newOrgPlan === 'pro' && 'border-primary bg-primary/5 ring-primary/40 shadow-sm ring-1',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-foreground text-sm font-semibold">Pro Team</span>
                      <p className="text-primary text-xs font-medium">$29 / month</p>
                    </div>
                    <RadioGroupItem id="plan-pro-react" value="pro" className="mt-0.5" />
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                    Up to 25 members, standard 99.9% SLA, and daily automated backups.
                  </p>
                </label>

                <label
                  htmlFor="plan-enterprise-react"
                  className={cn(
                    'border-border/80 hover:border-primary/50 relative flex cursor-pointer flex-col justify-between rounded-xl border p-3.5 shadow-xs transition-all',
                    newOrgPlan === 'enterprise' && 'border-primary bg-primary/5 ring-primary/40 shadow-sm ring-1',
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-0.5">
                      <span className="text-foreground text-sm font-semibold">Enterprise Scale</span>
                      <p className="text-primary text-xs font-medium">Custom billing</p>
                    </div>
                    <RadioGroupItem id="plan-enterprise-react" value="enterprise" className="mt-0.5" />
                  </div>
                  <p className="text-muted-foreground mt-2 text-xs leading-relaxed">
                    Unlimited members, dedicated VPC peering, 99.99% uptime SLA & SSO.
                  </p>
                </label>
              </RadioGroup>
            </div>

            <DialogFooter className="border-border/60 flex gap-2 border-t pt-4 sm:justify-end">
              <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={!newOrgName.trim()}>
                Create Workspace
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default EnterpriseWorkspaceSwitcher
