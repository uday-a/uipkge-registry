<script setup lang="ts">
import Sidebar02 from '@/components/blocks/sidebar-02/Sidebar02.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
</script>

<template>
  <Story
    title="Full app sidebar"
    description="TeamSwitcher header, primary nav, projects section, secondary support links, and a user dropdown footer."
  >
    <div
      class="relative h-[640px] overflow-hidden rounded-lg border [&_.h-svh]:!h-full [&_[data-slot=sidebar-wrapper]]:!min-h-0"
      style="transform: translateZ(0)"
    >
      <SidebarProvider :default-open="true" class="h-full !min-h-0">
        <Sidebar02 />
        <SidebarInset>
          <header class="flex h-14 items-center gap-3 border-b px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" class="h-5" />
            <h1 class="text-sm font-semibold">Workspace</h1>
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
