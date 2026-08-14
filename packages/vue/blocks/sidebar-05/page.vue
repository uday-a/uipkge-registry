<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/sidebar-05`.
// The dual-rail layout needs both width vars on SidebarProvider (see
// Sidebar05.vue for the why) -- they're inlined here so the route just
// works after install.
import Sidebar05 from '../components/blocks/Sidebar05.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../components/ui/sidebar'
</script>

<template>
  <SidebarProvider :style="{ '--sidebar-width': '19.5rem', '--sidebar-width-icon': '3.5rem' }">
    <Sidebar05 />
    <SidebarInset>
      <header class="border-border flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <SidebarTrigger class="size-7" />
        <h1 class="text-sm font-semibold">sidebar-05 demo</h1>
      </header>
      <div class="flex-1 p-6">
        <div class="grid auto-rows-min gap-4 md:grid-cols-3">
          <div class="bg-muted/50 aspect-video rounded-xl" />
          <div class="bg-muted/50 aspect-video rounded-xl" />
          <div class="bg-muted/50 aspect-video rounded-xl" />
        </div>
        <div class="bg-muted/50 mt-4 min-h-[60vh] rounded-xl" />
      </div>
    </SidebarInset>
  </SidebarProvider>
</template>
