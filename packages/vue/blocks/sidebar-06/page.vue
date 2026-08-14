<script setup lang="ts">
// Demo page wired by `npx shadcn-vue add @uipkge/sidebar-06`.
// Visit /sidebar-06-demo after install to see the block without
// editing your own pages. Free to edit or delete me.
import Sidebar06 from '../components/blocks/Sidebar06.vue'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '../components/ui/sidebar'
</script>

<template>
  <SidebarProvider>
    <Sidebar06 />
    <SidebarInset>
      <header class="border-border flex h-14 shrink-0 items-center gap-3 border-b px-4">
        <SidebarTrigger class="size-7" />
        <h1 class="text-sm font-semibold">sidebar-06 demo</h1>
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
