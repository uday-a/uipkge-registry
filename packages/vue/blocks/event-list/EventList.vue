<script setup lang="ts">
import { Clock } from 'lucide-vue-next'
import { SectionCard } from '@/components/ui/section-card'
import { DataList, DataListItem } from '@/components/ui/data-list'
import { Badge } from '@/components/ui/badge'

interface EventItem {
  id: string | number
  title: string
  date: string
  status?: string
  statusVariant?: 'default' | 'secondary' | 'outline' | 'destructive'
}

defineProps<{
  title?: string
  description?: string
  events: EventItem[]
  class?: string
}>()
</script>

<template>
  <SectionCard
    data-slot="event-list"
    :title="title ?? 'Upcoming Events'"
    :description="description"
    :class="$props.class"
  >
    <DataList>
      <DataListItem v-for="event in events" :key="event.id" class="flex-col items-stretch">
        <div class="flex items-center justify-between">
          <p class="text-sm font-medium">{{ event.title }}</p>
          <Badge v-if="event.status" :variant="event.statusVariant ?? 'secondary'">{{ event.status }}</Badge>
        </div>
        <div class="text-muted-foreground mt-1 flex items-center gap-1.5 text-xs">
          <Clock class="size-3" />
          <span>{{ event.date }}</span>
        </div>
      </DataListItem>
    </DataList>
  </SectionCard>
</template>
