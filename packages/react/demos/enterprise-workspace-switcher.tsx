import * as React from 'react'
import Story from '../../components/story/Story'
import { EnterpriseWorkspaceSwitcher } from '@react-registry-blocks/enterprise-workspace-switcher/EnterpriseWorkspaceSwitcher'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Bell, FolderGit2, Layers, LayoutGrid, Search, Settings, Shield } from 'lucide-react'

export default function EnterpriseWorkspaceSwitcherDemo() {
  return (
    <>
      <Story
        title="Default Workspace Switcher"
        description="Multi-tier enterprise workspace switcher dropdown inspired by Portico / Riter. Displays active organization status with emerald ring, team role badge, plan tiers, and organization creation modal."
      >
        <div className="flex w-full max-w-sm justify-start">
          <EnterpriseWorkspaceSwitcher />
        </div>
      </Story>

      <Story
        title="Active Pro Team"
        description="Pre-selected with Acme Design Systems Lab under the Pro Team plan in EU-Central with Admin privileges."
      >
        <div className="flex w-full max-w-sm justify-start">
          <EnterpriseWorkspaceSwitcher defaultActiveId="ws-2" />
        </div>
      </Story>

      <Story title="Personal Sandbox Tier" description="Pre-selected with Personal Sandbox on the Developer Tier.">
        <div className="flex w-full max-w-sm justify-start">
          <EnterpriseWorkspaceSwitcher defaultActiveId="ws-3" />
        </div>
      </Story>

      <Story
        title="In Enterprise Sidebar Header"
        description="Realistic multi-tenant sidebar with the workspace switcher at top, navigation groups, and usage meter."
      >
        <div className="border-border bg-card mx-auto w-full max-w-xs rounded-2xl border p-4 shadow-sm">
          <div className="space-y-4">
            {/* Top workspace switcher */}
            <EnterpriseWorkspaceSwitcher />

            <Separator />

            {/* Nav items */}
            <div className="space-y-1">
              <div className="text-muted-foreground px-2 py-1 text-xs font-semibold tracking-wider uppercase">
                Platform
              </div>
              <button
                type="button"
                className="hover:bg-accent text-accent-foreground flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors"
              >
                <LayoutGrid className="text-primary size-4" />
                <span>Overview</span>
              </button>
              <button
                type="button"
                className="hover:bg-accent text-muted-foreground hover:text-foreground flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors"
              >
                <FolderGit2 className="size-4" />
                <span>Repositories & Code</span>
              </button>
              <button
                type="button"
                className="hover:bg-accent text-muted-foreground hover:text-foreground flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors"
              >
                <Layers className="size-4" />
                <span>Deployments</span>
                <Badge variant="secondary" className="ml-auto text-xs">
                  12 live
                </Badge>
              </button>
              <button
                type="button"
                className="hover:bg-accent text-muted-foreground hover:text-foreground flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors"
              >
                <Shield className="size-4" />
                <span>Audit & Compliance</span>
              </button>
            </div>

            <Separator />

            {/* Usage card */}
            <div className="border-border/60 bg-muted/40 rounded-xl border p-3">
              <div className="flex items-center justify-between text-xs font-medium">
                <span className="text-muted-foreground">Cluster CPU Usage</span>
                <span className="text-foreground font-semibold">42%</span>
              </div>
              <div className="bg-muted mt-2 h-1.5 w-full overflow-hidden rounded-full">
                <div className="bg-primary h-full w-[42%] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </Story>

      <Story
        title="In Global Header Bar"
        description="Horizontal header bar with quick search, notification badge, and the switcher dropdown trigger."
      >
        <div className="border-border bg-card w-full rounded-2xl border p-3 shadow-xs">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="w-full sm:w-80">
              <EnterpriseWorkspaceSwitcher />
            </div>

            <div className="hidden max-w-sm flex-1 items-center md:flex">
              <div className="border-border bg-muted/30 text-muted-foreground flex w-full items-center gap-2 rounded-xl border px-3 py-1.5 text-xs">
                <Search className="size-3.5" />
                <span>Search workspaces, clusters, logs...</span>
                <kbd className="border-border bg-background ml-auto rounded border px-1.5 py-0.5 font-mono text-xs">
                  ⌘K
                </kbd>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="size-9 p-0">
                <Bell className="size-4" />
              </Button>
              <Button variant="ghost" size="sm" className="size-9 p-0">
                <Settings className="size-4" />
              </Button>
            </div>
          </div>
        </div>
      </Story>
    </>
  )
}
