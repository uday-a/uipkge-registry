<script setup lang="ts">
import { ref } from "vue";
import Story from "../../components/story/Story.vue";
import {
  EventCalendar,
  type CalendarEvent,
} from "@/components/ui/event-calendar";

// Base reference date for predictable demo presentation
const selectedDate = ref("2026-05-18");

const demoEvents = ref<CalendarEvent[]>([
  {
    id: "1",
    title: "Q2 Product Roadmap Review",
    start: "2026-05-18 09:00",
    end: "2026-05-18 10:30",
    color: "primary",
    location: "Conference Room A",
    category: "room-alpha",
  },
  {
    id: "2",
    title: "Design System Polish",
    start: "2026-05-18 10:00",
    end: "2026-05-18 11:30",
    color: "purple",
    location: "Design Studio",
    category: "room-beta",
  },
  {
    id: "3",
    title: "Customer Onboarding Sync",
    start: "2026-05-18 14:00",
    end: "2026-05-18 15:00",
    color: "info",
    location: "Zoom",
    category: "room-alpha",
  },
  {
    id: "4",
    title: "Company Hackathon 2026",
    start: "2026-05-18",
    allDay: true,
    color: "success",
  },
  {
    id: "5",
    title: "Infrastructure Maintenance",
    start: "2026-05-19 11:00",
    end: "2026-05-19 12:30",
    color: "warning",
    location: "DevOps War Room",
    category: "boardroom",
  },
  {
    id: "6",
    title: "Sprint Retrospective",
    start: "2026-05-20 15:00",
    end: "2026-05-20 16:00",
    color: "rose",
    category: "room-beta",
  },
  {
    id: "7",
    title: "Weekly Leadership Sync",
    start: "2026-05-18 16:30",
    end: "2026-05-18 17:30",
    color: "destructive",
    category: "boardroom",
  },
  {
    id: "8",
    title: "Architecture Review",
    start: "2026-05-18 10:45",
    end: "2026-05-18 11:45",
    color: "secondary",
    category: "room-alpha",
  },
]);

const demoCategories = [
  { id: "room-alpha", name: "Room Alpha", color: "rgb(59, 130, 246)" },
  { id: "room-beta", name: "Studio Beta", color: "rgb(168, 85, 247)" },
  { id: "boardroom", name: "Executive Boardroom", color: "rgb(245, 158, 11)" },
];
</script>

<template>
  <Story
    title="Month View"
    description="Full month grid featuring multi-day pills, timed chips, and overflow popovers for busy dates."
  >
    <EventCalendar
      v-model="selectedDate"
      view="month"
      :events="demoEvents"
      :max-events-per-day="3"
    />
  </Story>

  <Story
    title="Week View with Intervals"
    description="7-day schedule with hourly time intervals, pinned all-day row, and automatic side-by-side lane splitting for overlapping events."
  >
    <EventCalendar
      v-model="selectedDate"
      view="week"
      :events="demoEvents"
      :first-interval="8"
      :interval-count="11"
    />
  </Story>

  <Story
    title="Day View"
    description="Single-day agenda focusing on detailed hourly intervals and precise event durations."
  >
    <EventCalendar
      v-model="selectedDate"
      view="day"
      :events="demoEvents"
      :first-interval="8"
      :interval-count="11"
    />
  </Story>

  <Story
    title="Category / Resource View"
    description="Side-by-side multi-column scheduling across conference rooms, team members, or equipment."
  >
    <EventCalendar
      v-model="selectedDate"
      view="category"
      :events="demoEvents"
      :categories="demoCategories"
      :first-interval="8"
      :interval-count="11"
    />
  </Story>

  <Story
    title="Custom Event Template"
    description="Custom event rendering using the scoped #event slot with visual pins and badges."
  >
    <EventCalendar v-model="selectedDate" view="month" :events="demoEvents">
      <template #event="{ event }">
        <div
          class="border-primary/30 bg-primary/10 text-primary hover:bg-primary/20 flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-medium transition-colors"
        >
          <span class="bg-primary size-1.5 shrink-0 rounded-full" />
          <span class="truncate font-semibold">{{ event.title }}</span>
          <span
            v-if="event.location"
            class="ml-auto hidden text-[10px] opacity-75 sm:inline"
          >
            {{ event.location }}
          </span>
        </div>
      </template>
    </EventCalendar>
  </Story>
</template>
