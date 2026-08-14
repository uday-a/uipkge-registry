<script setup lang="ts">
import DashboardLayout from '@/components/blocks/dashboard-layout/DashboardLayout.vue'
// DashboardLayout is the full app shell — sidebar-02 + sticky topbar
// (sidebar trigger, breadcrumb, command palette, theme switch,
// notifications) with a main content slot. In a real Nuxt project,
// drop this in a layout file: `<DashboardLayout><slot /></DashboardLayout>`.
//
// The wrapper below uses the same trick as the sidebar-02 demo to
// constrain the layout's `min-h-svh` to the preview box height instead
// of taking over the docs page.
const breadcrumbs = [{ label: 'Dashboard', href: '#' }, { label: 'Overview' }]
</script>

<template>
  <Story
    title="Dashboard Layout"
    description="Full dashboard shell: collapsible sidebar-02 + sticky topbar (sidebar trigger, breadcrumb, command palette, theme switch, notifications) + main content slot. Auto-pulls every transitive piece (sidebar-02, command-palette, notifications-popover, profile-menu, theme-switch)."
  >
    <div
      class="bg-background relative h-[640px] overflow-hidden rounded-lg border [&_.min-h-svh]:!min-h-0 [&_[data-slot=sidebar-wrapper]]:!min-h-0"
      style="transform: translateZ(0)"
    >
      <DashboardLayout :breadcrumbs="breadcrumbs">
        <div class="space-y-4">
          <div>
            <h2 class="text-xl font-semibold">Overview</h2>
            <p class="text-muted-foreground text-sm">Your main page content slots in here.</p>
          </div>
          <div class="grid gap-4 sm:grid-cols-3">
            <div class="bg-card rounded-lg border p-4">
              <p class="text-muted-foreground text-xs">Revenue</p>
              <p class="text-2xl font-semibold">$48,210</p>
            </div>
            <div class="bg-card rounded-lg border p-4">
              <p class="text-muted-foreground text-xs">Active users</p>
              <p class="text-2xl font-semibold">2,140</p>
            </div>
            <div class="bg-card rounded-lg border p-4">
              <p class="text-muted-foreground text-xs">Conversion</p>
              <p class="text-2xl font-semibold">3.8%</p>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </div>
  </Story>
</template>
