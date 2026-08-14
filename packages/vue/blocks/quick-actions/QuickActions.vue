<script setup lang="ts">
import type { Component } from 'vue'
import { ArrowUpRight } from 'lucide-vue-next'
import { SectionCard } from '@/components/ui/section-card'
import { IconBox } from '@/components/ui/icon-box'

interface QuickAction {
  id: string | number
  label: string
  icon?: Component
  route: string
}

withDefaults(
  defineProps<{
    title?: string
    description?: string
    actions: QuickAction[]
    linkComponent?: string | Component
    class?: string
  }>(),
  { linkComponent: 'a' },
)
</script>

<template>
  <SectionCard
    data-slot="quick-actions"
    :title="title ?? 'Quick Actions'"
    :description="description"
    content-class="flex flex-col gap-2"
    :class="$props.class"
  >
    <component
      :is="linkComponent"
      v-for="action in actions"
      :key="action.id"
      :to="action.route"
      :href="action.route"
      class="hover:border-border hover:bg-muted/50 group flex cursor-pointer items-center gap-3 rounded-lg border border-transparent p-3 transition-all duration-200"
    >
      <IconBox v-if="action.icon" :icon="action.icon" />
      <span class="flex-1 text-sm font-medium">{{ action.label }}</span>
      <ArrowUpRight
        class="text-muted-foreground size-4 opacity-0 transition-all duration-200 group-hover:opacity-100"
      />
    </component>
  </SectionCard>
</template>
