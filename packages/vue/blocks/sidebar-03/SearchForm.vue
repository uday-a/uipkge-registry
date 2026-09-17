<script setup lang="ts">
import { Search } from 'lucide-vue-next'
import { Label } from '@/components/ui/label'
import { SidebarGroup, SidebarGroupContent, SidebarInput } from '@/components/ui/sidebar'
</script>

<template>
  <form data-slot="sidebar-03">
    <SidebarGroup class="py-0">
      <SidebarGroupContent>
        <Label for="search" class="sr-only">Search</Label>
        <SidebarInput id="search" type="text" placeholder="Search the docs..." :allow-clear="true">
          <template #prefix>
            <Search class="text-muted-foreground size-3.5" />
          </template>
        </SidebarInput>
      </SidebarGroupContent>
    </SidebarGroup>
  </form>
</template>
