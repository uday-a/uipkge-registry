<script setup lang="ts">
import Sidebar07 from '@/components/blocks/sidebar-07/Sidebar07.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
</script>

<template>
  <Story
    title="Sidebar with bottom action bar"
    description="Workspace pill + ⌘K search at the top, grouped nav (Dashboard / Management / Content) with badges, user pill above a five-icon action toolbar (Settings, Help, Notifications, Command, Log out)."
  >
    <div
      class="relative h-[640px] overflow-hidden rounded-lg border [&_.h-svh]:!h-full [&_[data-slot=sidebar-wrapper]]:!min-h-0"
      style="transform: translateZ(0)"
    >
      <SidebarProvider :default-open="true" class="h-full !min-h-0">
        <Sidebar07 />
        <SidebarInset>
          <header class="flex h-14 items-center gap-3 border-b px-4">
            <SidebarTrigger class="md:hidden" />
            <h1 class="text-sm font-semibold">Analytics</h1>
          </header>
          <div class="flex flex-1 flex-col gap-4 p-4">
            <div class="grid auto-rows-min gap-4 md:grid-cols-3">
              <div class="bg-muted/50 aspect-video rounded-xl" />
              <div class="bg-muted/50 aspect-video rounded-xl" />
              <div class="bg-muted/50 aspect-video rounded-xl" />
            </div>
            <div class="bg-muted/50 min-h-[100vh] flex-1 rounded-xl md:min-h-min" />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  </Story>
</template>
