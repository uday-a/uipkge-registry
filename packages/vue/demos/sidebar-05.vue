<script setup lang="ts">
import Sidebar05 from '@/components/blocks/sidebar-05/Sidebar05.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
</script>

<template>
  <Story
    title="Dual-rail sidebar"
    description="A thin icon column on the far left holds quick shortcuts; the wider main panel carries the full nav, sections, and footer. Modeled on a HRMS admin shell."
  >
    <div
      class="relative h-[640px] overflow-hidden rounded-lg border [&_.h-svh]:!h-full [&_[data-slot=sidebar-wrapper]]:!min-h-0"
      style="transform: translateZ(0)"
    >
      <SidebarProvider
        :default-open="true"
        class="h-full !min-h-0"
        :style="{ '--sidebar-width': '19.5rem', '--sidebar-width-icon': '3.5rem' }"
      >
        <Sidebar05 />
        <SidebarInset>
          <header class="flex h-14 items-center gap-3 border-b px-4">
            <SidebarTrigger />
            <Separator orientation="vertical" class="h-5" />
            <h1 class="text-sm font-semibold">Overview</h1>
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
