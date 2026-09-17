<script setup lang="ts">
import EventCalendar from '@/components/blocks/event-calendar/EventCalendar.vue'
import { ref } from 'vue'
import { Headphones, Plane, GraduationCap, Wrench } from 'lucide-vue-next'
import type { CalendarEvent, EventTypeMeta } from '@/components/blocks/event-calendar'

const events = ref<CalendarEvent[]>([
  {
    id: '1',
    title: 'Q2 Roadmap Review',
    date: '2026-05-16',
    start: '10:00',
    end: '11:30',
    type: 'meeting',
    description: 'Review Design Engineering backlog and prioritize Sprint 25.',
    location: 'Conference Room A',
    attendees: ['Sarah Connor', 'Marcus Rivera', 'Alice Chen'],
    status: 'confirmed',
  },
  {
    id: '2',
    title: 'Customer call -- Northwind',
    date: '2026-05-16',
    start: '14:00',
    end: '14:45',
    type: 'meeting',
    description: 'Contract renewal discussion. Prepare usage report.',
    location: 'Zoom',
    attendees: ['Marcus Rivera'],
    status: 'confirmed',
  },
  {
    id: '3',
    title: 'Deploy window',
    date: '2026-05-16',
    start: '16:00',
    end: '17:00',
    type: 'task',
    description: 'Production deploy for dashboard v2.1. Zero-downtime expected.',
    status: 'confirmed',
  },
  {
    id: '4',
    title: 'Team standup',
    date: '2026-05-19',
    start: '09:30',
    end: '10:00',
    type: 'meeting',
    description: 'Daily sync. Blockers and wins.',
    location: 'Slack huddle',
    attendees: ['Design Engineering'],
    status: 'confirmed',
  },
  {
    id: '5',
    title: 'UX critique',
    date: '2026-05-20',
    start: '11:00',
    end: '12:00',
    type: 'meeting',
    description: 'Review new onboarding flow mockups.',
    location: 'Figma',
    attendees: ['Alice Chen', 'David Kim'],
    status: 'tentative',
  },
  {
    id: '6',
    title: 'Berlin trip -- Marcus',
    date: '2026-05-20',
    start: '08:00',
    end: '20:00',
    type: 'travel',
    description: 'Customer onsite at Sentinel Labs.',
    location: 'Berlin',
    status: 'confirmed',
  },
  {
    id: '7',
    title: 'Performance review deadline',
    date: '2026-05-22',
    start: '17:00',
    end: '17:00',
    type: 'reminder',
    description: 'Submit peer feedback via Lattice.',
    status: 'confirmed',
  },
  {
    id: '8',
    title: 'Vue Conf 2026',
    date: '2026-05-28',
    start: '09:00',
    end: '18:00',
    type: 'travel',
    description: 'Alice attending. Prepare talk slides.',
    location: 'San Francisco',
    attendees: ['Alice Chen'],
    status: 'confirmed',
  },
])

// Second variant: custom event types
const customEvents = ref<CalendarEvent[]>([
  { id: 'c1', title: 'Standup', date: '2026-05-18', start: '09:00', end: '09:15', type: 'standup' },
  { id: 'c2', title: 'Backlog grooming', date: '2026-05-19', start: '13:00', end: '14:00', type: 'standup' },
  { id: 'c3', title: 'Pair on auth bug', date: '2026-05-19', start: '15:00', end: '17:00', type: 'pairing' },
  { id: 'c4', title: 'Pair on data-table perf', date: '2026-05-21', start: '10:00', end: '12:00', type: 'pairing' },
  { id: 'c5', title: 'Vue Conf', date: '2026-05-28', start: '09:00', end: '18:00', type: 'travel' },
  {
    id: 'c6',
    title: 'Internal training: Drizzle ORM',
    date: '2026-05-22',
    start: '14:00',
    end: '16:00',
    type: 'training',
  },
])

const customTypes: Record<string, EventTypeMeta> = {
  standup: {
    label: 'Standup',
    icon: Headphones,
    chip: 'bg-chart-1/10 text-chart-1 ring-chart-1/20',
    bar: 'bg-chart-1',
    dot: 'bg-chart-1',
    glow: 'bg-chart-1/10',
    text: 'text-chart-1',
    ring: 'hover:ring-chart-1/30',
  },
  pairing: {
    label: 'Pairing',
    icon: Wrench,
    chip: 'bg-chart-2/10 text-chart-2 ring-chart-2/20',
    bar: 'bg-chart-2',
    dot: 'bg-chart-2',
    glow: 'bg-chart-2/10',
    text: 'text-chart-2',
    ring: 'hover:ring-chart-2/30',
  },
  travel: {
    label: 'Travel',
    icon: Plane,
    chip: 'bg-warning/10 text-warning ring-warning/20',
    bar: 'bg-warning',
    dot: 'bg-warning',
    glow: 'bg-warning/10',
    text: 'text-warning',
    ring: 'hover:ring-warning/30',
  },
  training: {
    label: 'Training',
    icon: GraduationCap,
    chip: 'bg-success/10 text-success ring-success/20',
    bar: 'bg-success',
    dot: 'bg-success',
    glow: 'bg-success/10',
    text: 'text-success',
    ring: 'hover:ring-success/30',
  },
}

const loading = ref(false)
</script>

<template>
  <Story
    title="Default theme"
    description="Standard meeting/task/reminder/travel event types using the registry's OKLCH chart-1..4, success, and warning tokens. Drag or shift-click to select a range; right-click cells or events for context actions."
  >
    <EventCalendar v-model:events="events" initial-date="2026-05-16" />
  </Story>

  <Story
    title="Custom event types"
    description="Replace the eventTypes map to wire your own categories. Each type maps to label / icon / chip / bar / dot / glow / text / ring class strings -- override per-type or replace the whole map."
  >
    <EventCalendar
      v-model:events="customEvents"
      :event-types="customTypes"
      initial-date="2026-05-16"
      title="Engineering calendar"
      description="Standups, pairing slots, conference trips, and training blocks."
    />
  </Story>

  <Story
    title="Loading state"
    description="Set :loading to render skeleton placeholders for the cells, the side rail rows, and the Up next pane while data fetches."
  >
    <EventCalendar :events="[]" :loading="true" initial-date="2026-05-16" />
  </Story>

  <Story
    title="Minimal -- grid only"
    description="Toggle the surrounding panes off when embedding in a tighter shell. show-stats / show-side-rail / show-search / show-view-select / show-legend / show-upcoming are independent booleans."
  >
    <EventCalendar
      v-model:events="events"
      initial-date="2026-05-16"
      :show-stats="false"
      :show-side-rail="false"
      :show-legend="false"
      title="Schedule"
      description=""
    />
  </Story>
</template>
