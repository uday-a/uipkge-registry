<script setup lang="ts">
import { GanttChart } from "@/components/ui/charts";

const launch = [
  {
    name: "Design",
    start: "2026-09-01",
    end: "2026-09-18",
    progress: 1,
    group: "Product",
  },
  {
    name: "API build",
    start: "2026-09-10",
    end: "2026-10-09",
    progress: 0.65,
    group: "Eng",
  },
  {
    name: "Mobile app",
    start: "2026-09-22",
    end: "2026-10-23",
    progress: 0.3,
    group: "Eng",
  },
  {
    name: "QA & launch",
    start: "2026-10-12",
    end: "2026-10-30",
    progress: 0.1,
    group: "Product",
  },
];
</script>

<template>
  <Story
    title="Launch plan"
    description="Date ranges on a time axis; darker fill marks progress."
  >
    <GanttChart :tasks="launch" height="300" />
  </Story>

  <Story
    title="Machine schedule"
    description="Groups share palette slots automatically."
  >
    <GanttChart
      :tasks="[
        {
          name: 'Press A',
          start: '2026-09-05',
          end: '2026-09-09',
          progress: 1,
          group: 'Line 1',
        },
        {
          name: 'Press B',
          start: '2026-09-07',
          end: '2026-09-14',
          progress: 0.5,
          group: 'Line 2',
        },
      ]"
      height="200"
    />
  </Story>

  <Story
    title="Milestones"
    description="Diamond markers pinned to tasks for gates and releases."
  >
    <GanttChart
      :tasks="launch"
      :milestones="[
        { task: 'API build', date: '2026-09-30', label: 'Beta' },
        { task: 'QA & launch', date: '2026-10-30', label: 'GA' },
      ]"
      height="320"
    />
  </Story>

  <Story
    title="Today line"
    description="Dashed reference for the current date (pass explicitly for SSR-safe renders)."
  >
    <GanttChart :tasks="launch" today="2026-09-25" height="300" />
  </Story>

  <Story
    title="Peak charter program"
    description="Freighter rotations locked for peak season, with the rate-gate milestone."
  >
    <GanttChart
      :tasks="[
        {
          name: 'PVG–LAX extra rotation',
          start: '2026-09-08',
          end: '2026-12-20',
          progress: 0.4,
          group: 'Transpacific',
        },
        {
          name: 'ICN–ORD upgrade',
          start: '2026-10-01',
          end: '2026-12-15',
          progress: 0.15,
          group: 'Transpacific',
        },
        {
          name: 'DXB–SIN charter',
          start: '2026-09-15',
          end: '2026-11-30',
          progress: 0.55,
          group: 'Intra-Asia',
        },
      ]"
      :milestones="[
        {
          task: 'PVG–LAX extra rotation',
          date: '2026-10-20',
          label: 'Rate gate',
        },
      ]"
      today="2026-10-05"
      height="280"
    />
  </Story>
</template>
