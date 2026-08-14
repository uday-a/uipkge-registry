<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  BarChart3,
  Check,
  Flame,
  Headphones,
  ListTodo,
  Music2,
  Pause,
  Play,
  Plus,
  RotateCcw,
  SkipForward,
  Sparkles,
  Target,
  Trash2,
  Trees,
  Volume2,
  VolumeX,
  Waves,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export interface FocusTask {
  id: string
  title: string
  tag: string
  done: boolean
  currentPomodoros: number
  targetPomodoros: number
}

export type TimerMode = 'focus' | 'shortBreak' | 'longBreak'

interface Props {
  initialMode?: TimerMode
  initialTime?: number
  initialSound?: string
  initialSession?: number
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  initialMode: 'focus',
  initialTime: 1485, // 24:45
  initialSound: 'lofi',
  initialSession: 3,
})

const MODE_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

const currentMode = ref<TimerMode>(props.initialMode)
const remainingSeconds = ref<number>(props.initialTime)
const isRunning = ref<boolean>(false)
const currentSession = ref<number>(props.initialSession)
const completedSessionsToday = ref<number>(8)
const selectedSound = ref<string>(props.initialSound)
const isSoundMuted = ref<boolean>(false)
const newTaskTitle = ref<string>('')
const newTaskEstimate = ref<number>(2)

let timerInterval: ReturnType<typeof setInterval> | null = null

const ambientSounds = [
  { id: 'off', name: 'Off / Mute', icon: VolumeX, label: 'Silent' },
  { id: 'whitenoise', name: 'Deep Focus White Noise', icon: Waves, label: 'White Noise' },
  { id: 'lofi', name: 'Lofi Beats', icon: Music2, label: 'Lofi Beats' },
  { id: 'rainforest', name: 'Rainforest', icon: Trees, label: 'Rainforest' },
]

const tasks = ref<FocusTask[]>([
  {
    id: 'task-1',
    title: 'Refactor OKLCH color-mix utilities in Tailwind v4',
    tag: 'Design System',
    done: false,
    currentPomodoros: 2,
    targetPomodoros: 3,
  },
  {
    id: 'task-2',
    title: 'Audit ARIA accessibility roles on interactive primitives',
    tag: 'Accessibility',
    done: true,
    currentPomodoros: 2,
    targetPomodoros: 2,
  },
  {
    id: 'task-3',
    title: 'Draft technical RFC for component variant registry',
    tag: 'Architecture',
    done: false,
    currentPomodoros: 0,
    targetPomodoros: 2,
  },
  {
    id: 'task-4',
    title: 'Benchmark Astro island hydration bundle sizes',
    tag: 'Performance',
    done: false,
    currentPomodoros: 1,
    targetPomodoros: 4,
  },
])

const activeTaskId = ref<string>('task-1')

const activeTask = computed(() => {
  return (
    tasks.value.find((t) => t.id === activeTaskId.value) ||
    tasks.value.find((t) => !t.done) || {
      id: 'default',
      title: 'General Deep Work Session',
      tag: 'Productivity',
      done: false,
      currentPomodoros: 0,
      targetPomodoros: 1,
    }
  )
})

const completedTasksCount = computed(() => tasks.value.filter((t) => t.done).length)

const totalModeSeconds = computed(() => MODE_DURATIONS[currentMode.value])
const progressPercentage = computed(() => {
  const elapsed = totalModeSeconds.value - remainingSeconds.value
  return Math.min(100, Math.max(0, (elapsed / totalModeSeconds.value) * 100))
})

// SVG geometry: radius 104, circumference 2 * PI * 104 ≈ 653.451
const RADIUS = 104
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
const strokeDashoffset = computed(() => {
  return CIRCUMFERENCE * (1 - progressPercentage.value / 100)
})

function selectAmbientSound(id: string) {
  selectedSound.value = id
  isSoundMuted.value = id === 'off'
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function startTimer() {
  if (isRunning.value) return
  isRunning.value = true
  timerInterval = setInterval(() => {
    if (remainingSeconds.value > 0) {
      remainingSeconds.value -= 1
    } else {
      handleTimerComplete()
    }
  }, 1000)
}

function pauseTimer() {
  isRunning.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
    timerInterval = null
  }
}

function toggleTimer() {
  if (isRunning.value) {
    pauseTimer()
  } else {
    startTimer()
  }
}

function resetTimer() {
  pauseTimer()
  remainingSeconds.value = MODE_DURATIONS[currentMode.value]
}

function setMode(mode: TimerMode) {
  pauseTimer()
  currentMode.value = mode
  remainingSeconds.value = MODE_DURATIONS[mode]
}

function skipPhase() {
  pauseTimer()
  if (currentMode.value === 'focus') {
    completedSessionsToday.value += 1
    const task = tasks.value.find((t) => t.id === activeTaskId.value)
    if (task && task.currentPomodoros < task.targetPomodoros) {
      task.currentPomodoros += 1
    }
    if (currentSession.value >= 4) {
      currentMode.value = 'longBreak'
      currentSession.value = 1
    } else {
      currentMode.value = 'shortBreak'
      currentSession.value += 1
    }
  } else {
    currentMode.value = 'focus'
  }
  remainingSeconds.value = MODE_DURATIONS[currentMode.value]
}

function handleTimerComplete() {
  skipPhase()
}

function toggleTaskDone(taskId: string) {
  const task = tasks.value.find((t) => t.id === taskId)
  if (task) {
    task.done = !task.done
    if (task.done && task.currentPomodoros < task.targetPomodoros) {
      task.currentPomodoros = task.targetPomodoros
    }
  }
}

function selectActiveTask(taskId: string) {
  activeTaskId.value = taskId
}

function removeTask(taskId: string) {
  tasks.value = tasks.value.filter((t) => t.id !== taskId)
  if (activeTaskId.value === taskId && tasks.value.length > 0) {
    activeTaskId.value = tasks.value[0].id
  }
}

function addTask() {
  const trimmed = newTaskTitle.value.trim()
  if (!trimmed) return
  const id = `task-${Date.now()}`
  tasks.value.push({
    id,
    title: trimmed,
    tag: 'Focus',
    done: false,
    currentPomodoros: 0,
    targetPomodoros: Math.max(1, newTaskEstimate.value || 2),
  })
  newTaskTitle.value = ''
  newTaskEstimate.value = 2
  if (!activeTaskId.value || tasks.value.length === 1) {
    activeTaskId.value = id
  }
}

function toggleSoundMute() {
  isSoundMuted.value = !isSoundMuted.value
}

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})
</script>

<template>
  <div data-slot="pomodoro-focus-timer" :class="cn('mx-auto w-full max-w-5xl space-y-6', props.class)">
    <!-- Header Section -->
    <header class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div class="space-y-1">
        <div class="flex items-center gap-2">
          <h2 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
            Focus Space &amp; Pomodoro Timer
          </h2>
          <Badge wrap variant="secondary" class="gap-1 text-xs">
            <Sparkles class="text-primary size-3" />
            <span>v2.4</span>
          </Badge>
        </div>
        <p class="text-muted-foreground text-sm">
          High-yield interval productivity engine with ambient soundscapes and active task execution.
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <!-- Daily Streak Badge -->
        <Badge
          wrap
          variant="outline"
          class="gap-1.5 border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400"
        >
          <Flame class="size-4 fill-amber-500 text-amber-500" />
          <span>🔥 6-Day Focus Streak · {{ completedSessionsToday }} Sessions Complete Today</span>
        </Badge>
      </div>
    </header>

    <!-- Ambient Sound Preset Bar -->
    <Card class="bg-card/70 backdrop-blur-xs">
      <CardContent class="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
        <div class="text-muted-foreground flex items-center gap-2 text-xs font-medium">
          <Headphones class="text-primary size-4" />
          <span class="text-foreground font-semibold">Ambient Sound:</span>
          <span class="hidden sm:inline">Choose your background audio focus generator</span>
        </div>

        <div class="flex flex-wrap items-center gap-1.5">
          <Button
            v-for="sound in ambientSounds"
            :key="sound.id"
            :variant="selectedSound === sound.id && !isSoundMuted ? 'default' : 'outline'"
            size="sm"
            class="h-8 gap-1.5 text-xs"
            @click="selectAmbientSound(sound.id)"
          >
            <component :is="sound.icon" class="size-3.5" />
            <span>{{ sound.name }}</span>
            <span
              v-if="selectedSound === sound.id && !isSoundMuted && sound.id !== 'off'"
              class="flex items-center gap-0.5"
            >
              <span class="bg-primary-foreground h-2 w-0.5 animate-pulse" />
              <span class="bg-primary-foreground h-3.5 w-0.5 animate-pulse delay-75" />
              <span class="bg-primary-foreground h-1.5 w-0.5 animate-pulse delay-150" />
            </span>
          </Button>

          <Button
            variant="ghost"
            size="icon-sm"
            class="text-muted-foreground hover:text-foreground size-8"
            :title="isSoundMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'"
            @click="toggleSoundMute"
          >
            <VolumeX v-if="isSoundMuted" class="text-destructive size-4" />
            <Volume2 v-else class="size-4" />
          </Button>
        </div>
      </CardContent>
    </Card>

    <!-- Main Grid: Timer Centerpiece (Left) and Tasks + Analytics (Right) -->
    <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
      <!-- Left Column: Centerpiece Timer -->
      <div class="space-y-6 lg:col-span-6">
        <!-- Timer Card -->
        <Card class="border-border relative overflow-hidden shadow-xs">
          <!-- Card Header / Mode Switcher -->
          <CardHeader class="pb-2 text-center">
            <div class="bg-muted/70 mx-auto flex w-full max-w-sm items-center justify-center rounded-xl p-1">
              <Button
                :variant="currentMode === 'focus' ? 'default' : 'ghost'"
                size="sm"
                class="flex-1 rounded-lg text-xs font-semibold transition-all"
                @click="setMode('focus')"
              >
                Focus 25m
              </Button>
              <Button
                :variant="currentMode === 'shortBreak' ? 'default' : 'ghost'"
                size="sm"
                class="flex-1 rounded-lg text-xs font-semibold transition-all"
                @click="setMode('shortBreak')"
              >
                Short Break 5m
              </Button>
              <Button
                :variant="currentMode === 'longBreak' ? 'default' : 'ghost'"
                size="sm"
                class="flex-1 rounded-lg text-xs font-semibold transition-all"
                @click="setMode('longBreak')"
              >
                Long Break 15m
              </Button>
            </div>
          </CardHeader>

          <!-- Card Content / Circular Countdown Display -->
          <CardContent class="flex flex-col items-center justify-center pt-4 pb-2">
            <!-- Circular SVG Ring Frame -->
            <div class="relative flex size-64 items-center justify-center sm:size-72">
              <svg class="size-full -rotate-90 transform" viewBox="0 0 256 256">
                <!-- Background track -->
                <circle
                  cx="128"
                  cy="128"
                  :r="RADIUS"
                  fill="transparent"
                  stroke="currentColor"
                  stroke-width="10"
                  class="text-muted/40"
                />
                <!-- Progress ring -->
                <circle
                  cx="128"
                  cy="128"
                  :r="RADIUS"
                  fill="transparent"
                  stroke="currentColor"
                  stroke-width="10"
                  stroke-linecap="round"
                  :stroke-dasharray="CIRCUMFERENCE"
                  :stroke-dashoffset="strokeDashoffset"
                  :class="[
                    'transition-all duration-700 ease-out motion-reduce:transition-none',
                    currentMode === 'focus' && 'text-primary',
                    currentMode === 'shortBreak' && 'text-emerald-500',
                    currentMode === 'longBreak' && 'text-sky-500',
                  ]"
                />
              </svg>

              <!-- Center Countdown Display -->
              <div class="absolute inset-0 flex flex-col items-center justify-center text-center">
                <div class="flex items-center gap-1.5">
                  <span
                    class="size-2 rounded-full"
                    :class="[
                      isRunning ? 'animate-ping' : 'opacity-60',
                      currentMode === 'focus' && 'bg-primary',
                      currentMode === 'shortBreak' && 'bg-emerald-500',
                      currentMode === 'longBreak' && 'bg-sky-500',
                    ]"
                  />
                  <span
                    class="text-xs font-semibold tracking-wider uppercase"
                    :class="[
                      currentMode === 'focus' && 'text-primary',
                      currentMode === 'shortBreak' && 'text-emerald-600 dark:text-emerald-400',
                      currentMode === 'longBreak' && 'text-sky-600 dark:text-sky-400',
                    ]"
                  >
                    {{
                      currentMode === 'focus'
                        ? 'Deep Focus'
                        : currentMode === 'shortBreak'
                          ? 'Short Break'
                          : 'Rest Phase'
                    }}
                  </span>
                </div>

                <!-- Big Countdown Readout -->
                <div class="text-foreground my-1 font-mono text-5xl font-bold tracking-tight tabular-nums sm:text-6xl">
                  {{ formatTime(remainingSeconds) }}
                </div>

                <!-- Current State Label -->
                <div class="text-muted-foreground text-xs font-medium">
                  <span v-if="isRunning">Session {{ currentSession }} of 4 active</span>
                  <span v-else>Timer Paused</span>
                </div>
              </div>
            </div>

            <!-- Current Active Task Banner -->
            <div
              class="border-border/70 bg-muted/40 mt-4 flex w-full max-w-sm items-center justify-between gap-2 rounded-lg border p-2.5 text-xs"
            >
              <div class="flex min-w-0 flex-wrap items-center gap-2">
                <Target class="text-primary size-4 shrink-0" />
                <div class="min-w-0 flex-1">
                  <span class="text-foreground block truncate font-medium">{{ activeTask.title }}</span>
                </div>
              </div>
              <Badge wrap variant="secondary" class="shrink-0 gap-1 text-xs">
                <span>🍅 {{ activeTask.currentPomodoros }}/{{ activeTask.targetPomodoros }}</span>
              </Badge>
            </div>
          </CardContent>

          <!-- Action Controls & Session Dots -->
          <CardFooter class="flex flex-col gap-4 pt-2">
            <!-- Action Buttons Row -->
            <div class="flex items-center justify-center gap-4">
              <!-- Reset Button -->
              <Button
                variant="outline"
                size="icon"
                class="text-muted-foreground hover:text-foreground size-11 rounded-full"
                title="Reset current interval"
                @click="resetTimer"
                aria-label="Action"
              >
                <RotateCcw class="size-4" />
              </Button>

              <!-- Primary Play / Pause Button -->
              <Button
                variant="default"
                size="icon-lg"
                class="size-14 rounded-full shadow-md transition-all active:scale-95"
                :title="isRunning ? 'Pause Timer' : 'Start Focus Timer'"
                @click="toggleTimer"
              >
                <Pause v-if="isRunning" class="size-6 fill-current" />
                <Play v-else class="ml-0.5 size-6 fill-current" />
              </Button>

              <!-- Skip Button -->
              <Button
                variant="outline"
                size="icon"
                class="text-muted-foreground hover:text-foreground size-11 rounded-full"
                title="Skip to next phase"
                @click="skipPhase"
                aria-label="Action"
              >
                <SkipForward class="size-4" />
              </Button>
            </div>

            <Separator />

            <!-- Session Tracker 4-Dot Indicator -->
            <div class="text-muted-foreground flex w-full items-center justify-between text-xs">
              <span class="text-foreground font-medium">Session {{ currentSession }} of 4</span>

              <div class="flex items-center gap-2">
                <div
                  v-for="index in 4"
                  :key="index"
                  class="flex size-4 items-center justify-center rounded-full transition-all"
                  :class="[
                    index < currentSession
                      ? 'bg-primary text-primary-foreground'
                      : index === currentSession
                        ? 'ring-primary ring-offset-background bg-primary/80 ring-2 ring-offset-2'
                        : 'border-muted-foreground/30 bg-muted/30 border-2',
                  ]"
                >
                  <Check v-if="index < currentSession" class="size-2.5 stroke-[3]" />
                </div>
              </div>

              <span>Long break after 4</span>
            </div>
          </CardFooter>
        </Card>

        <!-- Daily Focus Analytics Card -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <BarChart3 class="text-primary size-4" />
                <CardTitle class="text-base font-semibold">Daily Focus Analytics</CardTitle>
              </div>
              <Badge wrap variant="outline" class="text-muted-foreground text-xs font-normal"> Today </Badge>
            </div>
            <CardDescription class="text-xs">
              Aggregated productivity stats and session completion rate
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- 3 Mini Metric Tiles -->
            <div class="grid grid-cols-3 gap-3">
              <div class="border-border/60 bg-muted/30 rounded-lg border p-3 text-center">
                <div class="text-muted-foreground text-xs font-medium">Total Focus</div>
                <div class="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">3h 45m</div>
                <div class="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">+28m vs avg</div>
              </div>

              <div class="border-border/60 bg-muted/30 rounded-lg border p-3 text-center">
                <div class="text-muted-foreground text-xs font-medium">Completed</div>
                <div class="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">
                  {{ completedSessionsToday }} <span class="text-muted-foreground text-xs font-normal">/ 10</span>
                </div>
                <div class="text-muted-foreground mt-0.5 text-xs">80% of goal</div>
              </div>

              <div class="border-border/60 bg-muted/30 rounded-lg border p-3 text-center">
                <div class="text-muted-foreground text-xs font-medium">Focus Score</div>
                <div class="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">94%</div>
                <div class="text-primary mt-0.5 text-xs font-semibold">High Flow</div>
              </div>
            </div>

            <!-- Daily Goal Progress -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground">Daily Session Goal</span>
                <span class="text-foreground font-semibold tabular-nums">{{ completedSessionsToday }}/10 (80%)</span>
              </div>
              <Progress :model-value="80" class="h-2" />
            </div>

            <Separator />

            <!-- Recent Sessions History -->
            <div class="space-y-2">
              <div class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Recent Completed Intervals
              </div>
              <div class="space-y-1.5 text-xs">
                <div class="bg-muted/30 flex items-center justify-between rounded-md px-2.5 py-1.5">
                  <div class="flex items-center gap-2 truncate">
                    <span class="text-muted-foreground font-mono tabular-nums">10:45 AM</span>
                    <span class="text-foreground truncate font-medium">Refactor OKLCH color-mix</span>
                  </div>
                  <Badge wrap variant="success" class="h-5 px-1.5 text-xs">25m Focus</Badge>
                </div>
                <div class="bg-muted/30 flex items-center justify-between rounded-md px-2.5 py-1.5">
                  <div class="flex items-center gap-2 truncate">
                    <span class="text-muted-foreground font-mono tabular-nums">10:15 AM</span>
                    <span class="text-muted-foreground truncate">Short Break · Lofi Beats</span>
                  </div>
                  <Badge wrap variant="secondary" class="h-5 px-1.5 text-xs">5m Rest</Badge>
                </div>
                <div class="bg-muted/30 flex items-center justify-between rounded-md px-2.5 py-1.5">
                  <div class="flex items-center gap-2 truncate">
                    <span class="text-muted-foreground font-mono tabular-nums">09:30 AM</span>
                    <span class="text-foreground truncate font-medium">Audit ARIA roles</span>
                  </div>
                  <Badge wrap variant="success" class="h-5 px-1.5 text-xs">25m Focus</Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Right Column: Active Task Queue -->
      <div class="space-y-6 lg:col-span-6">
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <ListTodo class="text-primary size-4" />
                <CardTitle class="text-base font-semibold">Active Focus Task Queue</CardTitle>
              </div>
              <Badge wrap variant="secondary" class="text-xs">
                {{ completedTasksCount }}/{{ tasks.length }} Completed
              </Badge>
            </div>
            <CardDescription class="text-xs">
              Select an item to link it to the active timer countdown. Check off tasks as you finish.
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Add New Task Form -->
            <form class="flex items-center gap-2" @submit.prevent="addTask">
              <div class="flex-1">
                <Input v-model="newTaskTitle" placeholder="Add a new focus task..." size="middle" class="text-xs" />
              </div>
              <div class="w-20">
                <Input
                  v-model="newTaskEstimate"
                  type="number"
                  min="1"
                  max="12"
                  placeholder="🍅 Est"
                  size="middle"
                  class="text-center text-xs tabular-nums"
                  title="Estimated Pomodoros"
                />
              </div>
              <Button type="submit" size="default" class="gap-1 text-xs">
                <Plus class="size-3.5" />
                <span>Add</span>
              </Button>
            </form>

            <Separator />

            <!-- Tasks List -->
            <div class="space-y-2.5">
              <div
                v-for="task in tasks"
                :key="task.id"
                class="group flex items-center justify-between gap-3 rounded-lg border p-3 transition-all"
                :class="[
                  task.id === activeTaskId && !task.done
                    ? 'border-primary/50 bg-primary/5 shadow-xs'
                    : 'border-border/70 bg-card hover:border-border hover:bg-muted/30',
                  task.done && 'bg-muted/20 opacity-65',
                ]"
              >
                <!-- Task Checkbox + Title -->
                <div class="flex min-w-0 flex-1 items-start gap-3">
                  <div class="pt-0.5">
                    <Checkbox :model-value="task.done" @update:model-value="() => toggleTaskDone(task.id)" />
                  </div>

                  <button
                    type="button"
                    class="focus-visible:ring-ring min-w-0 flex-1 cursor-pointer rounded-md text-left focus-visible:ring-2 focus-visible:outline-none"
                    :aria-pressed="task.id === activeTaskId"
                    @click="selectActiveTask(task.id)"
                  >
                    <div class="flex items-center gap-2">
                      <p
                        class="text-foreground text-xs font-medium transition-all"
                        :class="task.done && 'text-muted-foreground line-through'"
                      >
                        {{ task.title }}
                      </p>
                      <Badge
                        wrap
                        v-if="task.id === activeTaskId && !task.done"
                        variant="default"
                        class="h-4.5 px-1.5 text-xs"
                      >
                        Active
                      </Badge>
                    </div>

                    <div class="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                      <Badge wrap variant="outline" class="h-4 px-1 text-xs font-normal">
                        {{ task.tag }}
                      </Badge>
                      <span>Estimated: {{ task.targetPomodoros * 25 }}m</span>
                    </div>
                  </button>
                </div>

                <!-- Pomodoro Pills + Delete -->
                <div class="flex items-center gap-2">
                  <Badge
                    :variant="task.done ? 'secondary' : task.id === activeTaskId ? 'default' : 'outline'"
                    class="shrink-0 gap-1 text-xs font-medium whitespace-normal tabular-nums"
                  >
                    <span>🍅 {{ task.currentPomodoros }}/{{ task.targetPomodoros }}</span>
                  </Badge>

                  <Button
                    variant="ghost"
                    size="icon-sm"
                    class="text-muted-foreground hover:text-destructive size-7 opacity-0 transition-opacity group-hover:opacity-100"
                    title="Remove task"
                    @click="removeTask(task.id)"
                  >
                    <Trash2 class="size-3.5" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter
            class="border-border/50 bg-muted/20 text-muted-foreground flex items-center justify-between border-t py-3 text-xs"
          >
            <span>Tip: Switch tasks any time without resetting timer elapsed time.</span>
            <Button
              variant="ghost"
              size="sm"
              class="text-muted-foreground hover:text-foreground h-7 text-xs"
              @click="tasks = tasks.filter((t) => !t.done)"
            >
              Clear Done ({{ completedTasksCount }})
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
