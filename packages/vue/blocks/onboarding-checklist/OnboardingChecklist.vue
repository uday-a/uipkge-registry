<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Component } from 'vue'
import type { HTMLAttributes } from 'vue'
import { Bell, BookOpen, Building2, Check, ChevronRight, Database, Users, X } from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Task {
  id: string
  title: string
  description: string
  icon: Component
  done: boolean
}

const props = withDefaults(
  defineProps<{
    /** Seed every task as done so the success panel can be previewed in isolation. */
    initialComplete?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    initialComplete: false,
  },
)

const baseTasks: Omit<Task, 'done'>[] = [
  {
    id: 'workspace',
    title: 'Create workspace',
    description: 'Name your team space and pick a URL.',
    icon: Building2,
  },
  {
    id: 'teammates',
    title: 'Invite teammates',
    description: 'Bring in the people you work with.',
    icon: Users,
  },
  {
    id: 'data',
    title: 'Connect your data',
    description: 'Sync sources so insights flow in automatically.',
    icon: Database,
  },
  {
    id: 'alerts',
    title: 'Set up alerts',
    description: 'Get notified when metrics move.',
    icon: Bell,
  },
  {
    id: 'api',
    title: 'Explore API docs',
    description: 'Learn the endpoints and ship your first request.',
    icon: BookOpen,
  },
]

const tasks = ref<Task[]>(
  baseTasks.map((task, index) => ({
    ...task,
    done: props.initialComplete || index < 3,
  })),
)

const open = ref(true)

const completed = computed(() => tasks.value.filter((task) => task.done).length)
const total = computed(() => tasks.value.length)
const percent = computed(() => Math.round((completed.value / total.value) * 100))
const allDone = computed(() => completed.value === total.value)

function toggle(id: string) {
  const task = tasks.value.find((t) => t.id === id)
  if (task) task.done = !task.done
}

function dismiss() {
  open.value = false
}
</script>

<template>
  <div
    data-slot="onboarding-checklist"
    :class="
      cn(
        'mx-auto w-full max-w-md transition-all duration-200 ease-out motion-reduce:transition-none',
        !open && 'pointer-events-none translate-y-1 opacity-0',
        props.class,
      )
    "
  >
    <Card>
      <CardHeader>
        <CardTitle>Get started</CardTitle>
        <CardDescription>Finish these steps to unlock everything your workspace can do.</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="space-y-2">
          <div class="flex items-center justify-between">
            <p class="text-muted-foreground text-xs">
              <span class="text-foreground font-medium">{{ completed }} of {{ total }}</span>
              complete
            </p>
            <p class="text-muted-foreground text-xs tabular-nums">{{ percent }}%</p>
          </div>
          <Progress :model-value="percent" />
        </div>

        <div v-if="allDone" class="space-y-4 py-6 text-center">
          <div class="relative mx-auto size-16">
            <span class="bg-success/20 absolute inset-0 rounded-full blur-2xl" aria-hidden="true"></span>
            <span
              class="border-success/30 bg-success/10 text-success relative flex size-16 items-center justify-center rounded-full border shadow-xs"
            >
              <Check class="size-8" aria-hidden="true" />
            </span>
          </div>
          <div>
            <p class="text-lg font-semibold">You're all set</p>
            <p class="text-muted-foreground mt-1 text-sm">Every step is complete — your workspace is ready to go.</p>
          </div>
        </div>

        <div v-else class="-mx-2 divide-y">
          <button
            v-for="task in tasks"
            :key="task.id"
            type="button"
            role="checkbox"
            :aria-checked="task.done"
            class="group hover:bg-muted/50 focus-visible:ring-ring flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
            @click="toggle(task.id)"
          >
            <span
              v-if="task.done"
              class="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-md shadow-xs"
            >
              <Check class="size-4" aria-hidden="true" />
            </span>
            <span
              v-else
              class="border-border bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors"
            >
              <component :is="task.icon" class="size-4" aria-hidden="true" />
            </span>
            <span class="min-w-0 flex-1">
              <span :class="cn('block truncate text-sm font-medium', task.done && 'text-muted-foreground')">
                {{ task.title }}
              </span>
              <span class="text-muted-foreground mt-0.5 block truncate text-xs">{{ task.description }}</span>
            </span>
            <ChevronRight
              class="text-muted-foreground/50 size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </button>
        </div>
      </CardContent>
      <CardFooter class="justify-between">
        <Button v-if="!allDone" variant="ghost" size="sm" @click="dismiss">Skip for now</Button>
        <span v-else aria-hidden="true"></span>
        <button
          type="button"
          aria-label="Dismiss checklist"
          class="hover:bg-foreground/10 focus-visible:ring-ring rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          @click="dismiss"
        >
          <X class="text-muted-foreground size-4" aria-hidden="true" />
        </button>
      </CardFooter>
    </Card>
  </div>
</template>
