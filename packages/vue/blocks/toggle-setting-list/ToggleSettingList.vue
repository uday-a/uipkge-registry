<script setup lang="ts">
import type { Component } from 'vue'
import { SectionCard } from '@/components/ui/section-card'

interface SettingRow {
  key: string
  label: string
  desc?: string
}

const props = defineProps<{
  title?: string
  description?: string
  headerIcon?: Component
  items: SettingRow[]
  modelValue: Record<string, boolean>
  class?: string
}>()

const emit = defineEmits<{ 'update:modelValue': [Record<string, boolean>] }>()

function toggle(key: string) {
  emit('update:modelValue', { ...props.modelValue, [key]: !props.modelValue[key] })
}
</script>

<template>
  <SectionCard
    data-slot="toggle-setting-list"
    :title="title ?? 'Notifications'"
    :description="description"
    :class="$props.class"
  >
    <template v-if="headerIcon" #header-action>
      <component :is="headerIcon" class="text-muted-foreground size-5" />
    </template>
    <ul class="-my-4 divide-y">
      <li
        v-for="(row, i) in items"
        :key="row.key"
        class="flex items-center justify-between gap-4 py-4"
        :class="i === 0 ? 'pt-0' : ''"
      >
        <div>
          <p class="text-sm font-medium">{{ row.label }}</p>
          <p v-if="row.desc" class="text-muted-foreground text-xs">{{ row.desc }}</p>
        </div>
        <button
          type="button"
          role="switch"
          :aria-label="row.label"
          :aria-checked="modelValue[row.key]"
          class="focus-visible:ring-ring relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none focus-visible:ring-2"
          :class="modelValue[row.key] ? 'bg-primary' : 'bg-muted-foreground/30'"
          @click="toggle(row.key)"
        >
          <span
            class="bg-background inline-block size-4 translate-y-0.5 rounded-full shadow transition-transform"
            :class="modelValue[row.key] ? 'translate-x-[18px]' : 'translate-x-0.5'"
          />
        </button>
      </li>
    </ul>
  </SectionCard>
</template>
