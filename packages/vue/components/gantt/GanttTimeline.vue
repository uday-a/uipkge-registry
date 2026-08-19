<script setup lang="ts">
import type { HTMLAttributes } from "vue";
import { computed, inject, ref } from "vue";
import { cn } from "@/lib/utils";
import GanttBar from "./GanttBar.vue";
import GanttMilestone from "./GanttMilestone.vue";
import type { GanttTask } from "./types";

interface Props {
  showTodayLine?: boolean;
  showDependencies?: boolean;
  class?: HTMLAttributes["class"];
}

const props = withDefaults(defineProps<Props>(), {
  showTodayLine: true,
  showDependencies: true,
});

const context = inject<any>("ganttContext");

const timelineTasks = computed<GanttTask[]>(() => context?.tasks.value ?? []);

// Generate header date columns
const columns = computed(() => {
  if (!context) return [];
  const list: {
    date: Date;
    label: string;
    subLabel: string;
    isWeekend: boolean;
  }[] = [];
  const start = new Date(context.startDate.value);
  const total = context.totalDays.value;

  for (let i = 0; i < total; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dayOfWeek = d.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

    list.push({
      date: d,
      label: d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
      }),
      subLabel: d.toLocaleDateString(undefined, { weekday: "narrow" }),
      isWeekend,
    });
  }
  return list;
});

const timelineWidth = computed(() => {
  if (!context) return 800;
  return columns.value.length * context.columnWidth.value;
});

function getTaskCoordinates(task: GanttTask, index: number) {
  if (!context) return { left: 0, width: 100, top: 0, height: 28 };
  const start = new Date(context.startDate.value).getTime();
  const taskStart = new Date(task.startDate).getTime();
  const taskEnd = new Date(task.endDate).getTime();
  const oneDay = 1000 * 60 * 60 * 24;

  const startDiffDays = Math.max(0, (taskStart - start) / oneDay);
  const durationDays = Math.max(1, (taskEnd - taskStart) / oneDay);

  const left = startDiffDays * context.columnWidth.value;
  const width = durationDays * context.columnWidth.value;
  const rowHeight = context.rowHeight.value;
  const top = index * rowHeight + (rowHeight - 28) / 2;

  return { left, width, top, height: 28 };
}

const todayPosition = computed(() => {
  if (!context) return null;
  const start = new Date(context.startDate.value).getTime();
  const today = new Date().setHours(0, 0, 0, 0);
  const oneDay = 1000 * 60 * 60 * 24;
  const diffDays = (today - start) / oneDay;

  if (diffDays < 0 || diffDays > context.totalDays.value) return null;
  return diffDays * context.columnWidth.value + context.columnWidth.value / 2;
});

// Compute SVG Dependency curves between tasks
const dependencyPaths = computed(() => {
  if (!context || !props.showDependencies) return [];
  const tasksList: GanttTask[] = context.tasks.value ?? [];
  const taskMap = new Map<string, { task: GanttTask; index: number }>();
  tasksList.forEach((t, i) => taskMap.set(t.id, { task: t, index: i }));

  const paths: { d: string; fromId: string; toId: string }[] = [];

  tasksList.forEach((toTask, toIdx) => {
    if (!toTask.dependencies || toTask.dependencies.length === 0) return;
    toTask.dependencies.forEach((fromId) => {
      const fromEntry = taskMap.get(fromId);
      if (!fromEntry) return;

      const fromCoords = getTaskCoordinates(fromEntry.task, fromEntry.index);
      const toCoords = getTaskCoordinates(toTask, toIdx);

      const startX = fromEntry.task.isMilestone
        ? fromCoords.left
        : fromCoords.left + fromCoords.width;
      const startY = fromCoords.top + 14;

      const endX = toCoords.left;
      const endY = toCoords.top + 14;

      const deltaX = Math.max(16, (endX - startX) / 2);
      const d = `M ${startX} ${startY} C ${startX + deltaX} ${startY}, ${endX - deltaX} ${endY}, ${endX} ${endY}`;
      paths.push({ d, fromId, toId: toTask.id });
    });
  });

  return paths;
});
</script>

<template>
  <div
    data-uipkge
    data-slot="gantt-timeline"
    :class="
      cn(
        'bg-background relative flex-1 overflow-x-auto overflow-y-hidden select-none',
        props.class,
      )
    "
  >
    <div :style="{ width: `${timelineWidth}px` }" class="relative">
      <!-- Header Dates -->
      <div
        :style="{ height: `${context?.headerHeight.value ?? 48}px` }"
        class="border-border bg-muted/10 sticky top-0 z-20 flex border-b"
      >
        <div
          v-for="(col, i) in columns"
          :key="i"
          :style="{ width: `${context?.columnWidth.value ?? 44}px` }"
          :class="
            cn(
              'border-border/50 text-muted-foreground flex flex-col items-center justify-center border-r text-[10px]',
              col.isWeekend && 'bg-muted/20 text-muted-foreground/60',
            )
          "
        >
          <span class="text-foreground font-medium">{{ col.label }}</span>
          <span class="text-[9px]">{{ col.subLabel }}</span>
        </div>
      </div>

      <!-- Grid Background & Task Bars -->
      <div class="relative">
        <!-- Column grid lines -->
        <div class="pointer-events-none absolute inset-0 flex">
          <div
            v-for="(col, i) in columns"
            :key="i"
            :style="{ width: `${context?.columnWidth.value ?? 44}px` }"
            :class="
              cn(
                'border-border/30 h-full border-r',
                col.isWeekend && 'bg-muted/15',
              )
            "
          />
        </div>

        <!-- Today Marker Line -->
        <div
          v-if="showTodayLine && todayPosition != null"
          :style="{ left: `${todayPosition}px` }"
          class="pointer-events-none absolute inset-y-0 z-30 flex flex-col items-center"
        >
          <div
            class="bg-destructive text-destructive-foreground rounded-full px-1.5 py-0.5 text-[9px] font-bold shadow-xs"
          >
            Today
          </div>
          <div
            class="bg-destructive/60 h-full w-[1.5px] border-r border-dashed"
          />
        </div>

        <!-- SVG Dependencies Overlay -->
        <svg
          v-if="dependencyPaths.length > 0"
          :width="timelineWidth"
          :height="
            (context?.tasks.value.length ?? 0) *
            (context?.rowHeight.value ?? 40)
          "
          class="pointer-events-none absolute inset-0 z-10"
        >
          <defs>
            <marker
              id="gantt-arrow"
              viewBox="0 0 6 6"
              refX="5"
              refY="3"
              markerWidth="6"
              markerHeight="6"
              orient="auto"
            >
              <path d="M 0 0 L 6 3 L 0 6 z" class="fill-primary/60" />
            </marker>
          </defs>
          <path
            v-for="(p, i) in dependencyPaths"
            :key="i"
            :d="p.d"
            fill="none"
            class="stroke-primary/50"
            stroke-width="1.5"
            stroke-dasharray="3,3"
            marker-end="url(#gantt-arrow)"
          />
        </svg>

        <!-- Task Rows & Bars -->
        <div
          v-for="(task, idx) in timelineTasks"
          :key="task.id"
          :style="{ height: `${context?.rowHeight.value ?? 40}px` }"
          class="border-border/40 hover:bg-muted/10 relative border-b transition-colors"
        >
          <template v-if="task.isMilestone">
            <GanttMilestone
              :task="task"
              :left="getTaskCoordinates(task, idx).left"
              :top="(context?.rowHeight.value ?? 40) / 2"
              @click="context?.onTaskClick(task)"
            />
          </template>
          <template v-else>
            <GanttBar
              :task="task"
              :left="getTaskCoordinates(task, idx).left"
              :width="getTaskCoordinates(task, idx).width"
              :top="(getTaskCoordinates(task, idx).height - 28) / 2 + 6"
              :height="28"
              @click="context?.onTaskClick(task)"
            />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
