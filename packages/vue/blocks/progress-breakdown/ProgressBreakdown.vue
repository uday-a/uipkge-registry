<script setup lang="ts">
import type { Component } from 'vue'
import { SectionCard } from '@/components/ui/section-card'
import { ProgressItem } from '@/components/ui/progress-item'

interface BreakdownItem {
  name: string
  value: number
  secondaryLabel?: string
}

defineProps<{
  title?: string
  description?: string
  items: BreakdownItem[]
  headerIcon?: Component
  class?: string
}>()
</script>

<template>
  <SectionCard
    data-slot="progress-breakdown"
    :title="title ?? 'Breakdown'"
    :description="description"
    :class="$props.class"
    content-class="space-y-4"
  >
    <template v-if="headerIcon" #header-action>
      <component :is="headerIcon" class="text-muted-foreground size-5" />
    </template>
    <ProgressItem
      v-for="(item, index) in items"
      :key="item.name"
      :label="item.name"
      :value="item.value"
      :secondary-label="item.secondaryLabel"
      :color-index="index"
    />
  </SectionCard>
</template>
