<script setup lang="ts">
import EnterpriseWorkspaceSwitcher from '@/components/blocks/enterprise-workspace-switcher/EnterpriseWorkspaceSwitcher.vue'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Bell, FolderGit2, Layers, LayoutGrid, Search, Settings, Shield } from 'lucide-vue-next'
</script>

<template>
  <Story
    title="Default Workspace Switcher"
    description="Multi-tier enterprise workspace switcher dropdown inspired by Portico / Riter. Displays active organization status with emerald ring, team role badge, plan tiers, and organization creation modal."
  >
    <div class="flex w-full max-w-sm justify-start">
      <EnterpriseWorkspaceSwitcher />
    </div>
  </Story>

  <Story
    title="Active Pro Team"
    description="Pre-selected with Acme Design Systems Lab under the Pro Team plan in EU-Central with Admin privileges."
  >
    <div class="flex w-full max-w-sm justify-start">
      <EnterpriseWorkspaceSwitcher default-active-id="ws-2" />
    </div>
  </Story>

  <Story title="Personal Sandbox Tier" description="Pre-selected with Personal Sandbox on the Developer Tier.">
    <div class="flex w-full max-w-sm justify-start">
      <EnterpriseWorkspaceSwitcher default-active-id="ws-3" />
    </div>
  </Story>

  <Story
    title="In Enterprise Sidebar Header"
    description="Realistic multi-tenant sidebar with the workspace switcher at top, navigation groups, and usage meter."
  >
    <div class="border-border bg-card mx-auto w-full max-w-xs rounded-2xl border p-4 shadow-sm">
      <div class="space-y-4">
        <!-- Top workspace switcher -->
        <EnterpriseWorkspaceSwitcher />

        <Separator />

        <!-- Nav items -->
        <div class="space-y-1">
          <div class="text-muted-foreground px-2 py-1 text-xs font-semibold tracking-wider uppercase">Platform</div>
          <button
            type="button"
            class="hover:bg-accent text-accent-foreground flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors"
          >
            <LayoutGrid class="text-primary size-4" />
            <span>Overview</span>
          </button>
          <button
            type="button"
            class="hover:bg-accent text-muted-foreground hover:text-foreground flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors"
          >
            <FolderGit2 class="size-4" />
            <span>Repositories & Code</span>
          </button>
          <button
            type="button"
            class="hover:bg-accent text-muted-foreground hover:text-foreground flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors"
          >
            <Layers class="size-4" />
            <span>Deployments</span>
            <Badge variant="secondary" class="ml-auto text-xs">12 live</Badge>
          </button>
          <button
            type="button"
            class="hover:bg-accent text-muted-foreground hover:text-foreground flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left text-sm font-medium transition-colors"
          >
            <Shield class="size-4" />
            <span>Audit & Compliance</span>
          </button>
        </div>

        <Separator />

        <!-- Usage card -->
        <div class="border-border/60 bg-muted/40 rounded-xl border p-3">
          <div class="flex items-center justify-between text-xs font-medium">
            <span class="text-muted-foreground">Cluster CPU Usage</span>
            <span class="text-foreground font-semibold">42%</span>
          </div>
          <div class="bg-muted mt-2 h-1.5 w-full overflow-hidden rounded-full">
            <div class="bg-primary h-full w-[42%] rounded-full" />
          </div>
        </div>
      </div>
    </div>
  </Story>

  <Story
    title="In Global Header Bar"
    description="Horizontal header bar with quick search, notification badge, and the switcher dropdown trigger."
  >
    <div class="border-border bg-card w-full rounded-2xl border p-3 shadow-xs">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <div class="w-full sm:w-80">
          <EnterpriseWorkspaceSwitcher />
        </div>

        <div class="hidden max-w-sm flex-1 items-center md:flex">
          <div
            class="border-border bg-muted/30 text-muted-foreground flex w-full items-center gap-2 rounded-xl border px-3 py-1.5 text-xs"
          >
            <Search class="size-3.5" />
            <span>Search workspaces, clusters, logs...</span>
            <kbd class="border-border bg-background ml-auto rounded border px-1.5 py-0.5 font-mono text-xs">⌘K</kbd>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <Button variant="ghost" size="sm" class="size-9 p-0">
            <Bell class="size-4" />
          </Button>
          <Button variant="ghost" size="sm" class="size-9 p-0">
            <Settings class="size-4" />
          </Button>
        </div>
      </div>
    </div>
  </Story>
</template>
