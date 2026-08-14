'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

export interface PomodoroFocusTimerProps {
  initialMode?: TimerMode
  initialTime?: number
  initialSound?: string
  initialSession?: number
  className?: string
}

const MODE_DURATIONS: Record<TimerMode, number> = {
  focus: 25 * 60,
  shortBreak: 5 * 60,
  longBreak: 15 * 60,
}

const ambientSounds = [
  { id: 'off', name: 'Off / Mute', icon: VolumeX, label: 'Silent' },
  { id: 'whitenoise', name: 'Deep Focus White Noise', icon: Waves, label: 'White Noise' },
  { id: 'lofi', name: 'Lofi Beats', icon: Music2, label: 'Lofi Beats' },
  { id: 'rainforest', name: 'Rainforest', icon: Trees, label: 'Rainforest' },
]

const initialTasks: FocusTask[] = [
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
]

export function PomodoroFocusTimer({
  initialMode = 'focus',
  initialTime = 1485, // 24:45
  initialSound = 'lofi',
  initialSession = 3,
  className,
}: PomodoroFocusTimerProps) {
  const [currentMode, setCurrentMode] = React.useState<TimerMode>(initialMode)
  const [remainingSeconds, setRemainingSeconds] = React.useState<number>(initialTime)
  const [isRunning, setIsRunning] = React.useState<boolean>(false)
  const [currentSession, setCurrentSession] = React.useState<number>(initialSession)
  const [completedSessionsToday, setCompletedSessionsToday] = React.useState<number>(8)
  const [selectedSound, setSelectedSound] = React.useState<string>(initialSound)
  const [isSoundMuted, setIsSoundMuted] = React.useState<boolean>(false)
  const [tasks, setTasks] = React.useState<FocusTask[]>(initialTasks)
  const [activeTaskId, setActiveTaskId] = React.useState<string>('task-1')
  const [newTaskTitle, setNewTaskTitle] = React.useState<string>('')
  const [newTaskEstimate, setNewTaskEstimate] = React.useState<number>(2)

  // Timer interval countdown
  React.useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    if (isRunning) {
      interval = setInterval(() => {
        setRemainingSeconds((prev) => {
          if (prev <= 1) {
            handleSkipPhase()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isRunning, currentMode, currentSession, activeTaskId])

  const activeTask = tasks.find((t) => t.id === activeTaskId) ||
    tasks.find((t) => !t.done) || {
      id: 'default',
      title: 'General Deep Work Session',
      tag: 'Productivity',
      done: false,
      currentPomodoros: 0,
      targetPomodoros: 1,
    }

  const completedTasksCount = tasks.filter((t) => t.done).length
  const totalModeSeconds = MODE_DURATIONS[currentMode]
  const progressPercentage = Math.min(
    100,
    Math.max(0, ((totalModeSeconds - remainingSeconds) / totalModeSeconds) * 100),
  )

  const RADIUS = 104
  const CIRCUMFERENCE = 2 * Math.PI * RADIUS
  const strokeDashoffset = CIRCUMFERENCE * (1 - progressPercentage / 100)

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  function handleToggleTimer() {
    setIsRunning((prev) => !prev)
  }

  function handleResetTimer() {
    setIsRunning(false)
    setRemainingSeconds(MODE_DURATIONS[currentMode])
  }

  function handleSetMode(mode: TimerMode) {
    setIsRunning(false)
    setCurrentMode(mode)
    setRemainingSeconds(MODE_DURATIONS[mode])
  }

  function handleSkipPhase() {
    setIsRunning(false)
    if (currentMode === 'focus') {
      setCompletedSessionsToday((prev) => prev + 1)
      setTasks((prev) =>
        prev.map((t) =>
          t.id === activeTaskId && t.currentPomodoros < t.targetPomodoros
            ? { ...t, currentPomodoros: t.currentPomodoros + 1 }
            : t,
        ),
      )
      if (currentSession >= 4) {
        setCurrentMode('longBreak')
        setCurrentSession(1)
        setRemainingSeconds(MODE_DURATIONS.longBreak)
      } else {
        setCurrentMode('shortBreak')
        setCurrentSession((prev) => prev + 1)
        setRemainingSeconds(MODE_DURATIONS.shortBreak)
      }
    } else {
      setCurrentMode('focus')
      setRemainingSeconds(MODE_DURATIONS.focus)
    }
  }

  function handleToggleTask(taskId: string) {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextDone = !t.done
          return {
            ...t,
            done: nextDone,
            currentPomodoros:
              nextDone && t.currentPomodoros < t.targetPomodoros ? t.targetPomodoros : t.currentPomodoros,
          }
        }
        return t
      }),
    )
  }

  function handleRemoveTask(taskId: string) {
    setTasks((prev) => prev.filter((t) => t.id !== taskId))
    if (activeTaskId === taskId) {
      const remaining = tasks.filter((t) => t.id !== taskId)
      if (remaining.length > 0) {
        setActiveTaskId(remaining[0].id)
      }
    }
  }

  function handleAddTask(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = newTaskTitle.trim()
    if (!trimmed) return
    const id = `task-${Date.now()}`
    const newTask: FocusTask = {
      id,
      title: trimmed,
      tag: 'Focus',
      done: false,
      currentPomodoros: 0,
      targetPomodoros: Math.max(1, newTaskEstimate || 2),
    }
    setTasks((prev) => [...prev, newTask])
    setNewTaskTitle('')
    setNewTaskEstimate(2)
    if (!activeTaskId || tasks.length === 0) {
      setActiveTaskId(id)
    }
  }

  function handleToggleSoundMute() {
    setIsSoundMuted((prev) => !prev)
  }

  return (
    <div data-slot="pomodoro-focus-timer" className={cn('mx-auto w-full max-w-5xl space-y-6', className)}>
      {/* Header Section */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
              Focus Space &amp; Pomodoro Timer
            </h2>
            <Badge wrap variant="secondary" className="gap-1 text-xs">
              <Sparkles className="text-primary size-3" />
              <span>v2.4</span>
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            High-yield interval productivity engine with ambient soundscapes and active task execution.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Daily Streak Badge */}
          <Badge
            wrap
            variant="outline"
            className="gap-1.5 border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400"
          >
            <Flame className="size-4 fill-amber-500 text-amber-500" />
            <span>🔥 6-Day Focus Streak · {completedSessionsToday} Sessions Complete Today</span>
          </Badge>
        </div>
      </header>

      {/* Ambient Sound Preset Bar */}
      <Card className="bg-card/70 backdrop-blur-xs">
        <CardContent className="flex flex-wrap items-center justify-between gap-3 p-3 sm:p-4">
          <div className="text-muted-foreground flex items-center gap-2 text-xs font-medium">
            <Headphones className="text-primary size-4" />
            <span className="text-foreground font-semibold">Ambient Sound:</span>
            <span className="hidden sm:inline">Choose your background audio focus generator</span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {ambientSounds.map((sound) => {
              const Icon = sound.icon
              const isCurrent = selectedSound === sound.id && !isSoundMuted
              return (
                <Button
                  key={sound.id}
                  variant={isCurrent ? 'default' : 'outline'}
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={() => {
                    setSelectedSound(sound.id)
                    if (sound.id === 'off') {
                      setIsSoundMuted(true)
                    } else {
                      setIsSoundMuted(false)
                    }
                  }}
                >
                  <Icon className="size-3.5" />
                  <span>{sound.name}</span>
                  {isCurrent && sound.id !== 'off' && (
                    <span className="flex items-center gap-0.5">
                      <span className="bg-primary-foreground h-2 w-0.5 animate-pulse" />
                      <span className="bg-primary-foreground h-3.5 w-0.5 animate-pulse delay-75" />
                      <span className="bg-primary-foreground h-1.5 w-0.5 animate-pulse delay-150" />
                    </span>
                  )}
                </Button>
              )
            })}

            <Button
              variant="ghost"
              size="icon-sm"
              className="text-muted-foreground hover:text-foreground size-8"
              title={isSoundMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
              onClick={handleToggleSoundMute}
            >
              {isSoundMuted ? <VolumeX className="text-destructive size-4" /> : <Volume2 className="size-4" />}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Main Grid: Timer Centerpiece (Left) and Tasks + Analytics (Right) */}
      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        {/* Left Column: Centerpiece Timer */}
        <div className="space-y-6 lg:col-span-6">
          {/* Timer Card */}
          <Card className="border-border relative overflow-hidden shadow-xs">
            {/* Card Header / Mode Switcher */}
            <CardHeader className="pb-2 text-center">
              <div className="bg-muted/70 mx-auto flex w-full max-w-sm items-center justify-center rounded-xl p-1">
                <Button
                  variant={currentMode === 'focus' ? 'default' : 'ghost'}
                  size="sm"
                  className="flex-1 rounded-lg text-xs font-semibold transition-all"
                  onClick={() => handleSetMode('focus')}
                >
                  Focus 25m
                </Button>
                <Button
                  variant={currentMode === 'shortBreak' ? 'default' : 'ghost'}
                  size="sm"
                  className="flex-1 rounded-lg text-xs font-semibold transition-all"
                  onClick={() => handleSetMode('shortBreak')}
                >
                  Short Break 5m
                </Button>
                <Button
                  variant={currentMode === 'longBreak' ? 'default' : 'ghost'}
                  size="sm"
                  className="flex-1 rounded-lg text-xs font-semibold transition-all"
                  onClick={() => handleSetMode('longBreak')}
                >
                  Long Break 15m
                </Button>
              </div>
            </CardHeader>

            {/* Card Content / Circular Countdown Display */}
            <CardContent className="flex flex-col items-center justify-center pt-4 pb-2">
              {/* Circular SVG Ring Frame */}
              <div className="relative flex size-64 items-center justify-center sm:size-72">
                <svg className="size-full -rotate-90 transform" viewBox="0 0 256 256">
                  {/* Background track */}
                  <circle
                    cx="128"
                    cy="128"
                    r={RADIUS}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="10"
                    className="text-muted/40"
                  />
                  {/* Progress ring */}
                  <circle
                    cx="128"
                    cy="128"
                    r={RADIUS}
                    fill="transparent"
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={strokeDashoffset}
                    className={cn(
                      'transition-all duration-700 ease-out motion-reduce:transition-none',
                      currentMode === 'focus' && 'text-primary',
                      currentMode === 'shortBreak' && 'text-emerald-500',
                      currentMode === 'longBreak' && 'text-sky-500',
                    )}
                  />
                </svg>

                {/* Center Countdown Display */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={cn(
                        'size-2 rounded-full',
                        isRunning ? 'animate-ping' : 'opacity-60',
                        currentMode === 'focus' && 'bg-primary',
                        currentMode === 'shortBreak' && 'bg-emerald-500',
                        currentMode === 'longBreak' && 'bg-sky-500',
                      )}
                    />
                    <span
                      className={cn(
                        'text-xs font-semibold tracking-wider uppercase',
                        currentMode === 'focus' && 'text-primary',
                        currentMode === 'shortBreak' && 'text-emerald-600 dark:text-emerald-400',
                        currentMode === 'longBreak' && 'text-sky-600 dark:text-sky-400',
                      )}
                    >
                      {currentMode === 'focus'
                        ? 'Deep Focus'
                        : currentMode === 'shortBreak'
                          ? 'Short Break'
                          : 'Rest Phase'}
                    </span>
                  </div>

                  {/* Big Countdown Readout */}
                  <div className="text-foreground my-1 font-mono text-5xl font-bold tracking-tight tabular-nums sm:text-6xl">
                    {formatTime(remainingSeconds)}
                  </div>

                  {/* Current State Label */}
                  <div className="text-muted-foreground text-xs font-medium">
                    {isRunning ? `Session ${currentSession} of 4 active` : 'Timer Paused'}
                  </div>
                </div>
              </div>

              {/* Current Active Task Banner */}
              <div className="border-border/70 bg-muted/40 mt-4 flex w-full max-w-sm items-center justify-between gap-2 rounded-lg border p-2.5 text-xs">
                <div className="flex min-w-0 flex-wrap items-center gap-2">
                  <Target className="text-primary size-4 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <span className="text-foreground block truncate font-medium">{activeTask.title}</span>
                  </div>
                </div>
                <Badge wrap variant="secondary" className="shrink-0 gap-1 text-xs">
                  <span>
                    🍅 {activeTask.currentPomodoros}/{activeTask.targetPomodoros}
                  </span>
                </Badge>
              </div>
            </CardContent>

            {/* Action Controls & Session Dots */}
            <CardFooter className="flex flex-col gap-4 pt-2">
              {/* Action Buttons Row */}
              <div className="flex items-center justify-center gap-4">
                {/* Reset Button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground size-11 rounded-full"
                  title="Reset current interval"
                  onClick={handleResetTimer}
                  aria-label="Action"
                >
                  <RotateCcw className="size-4" />
                </Button>

                {/* Primary Play / Pause Button */}
                <Button
                  variant="default"
                  size="icon-lg"
                  className="size-14 rounded-full shadow-md transition-all active:scale-95"
                  title={isRunning ? 'Pause Timer' : 'Start Focus Timer'}
                  onClick={handleToggleTimer}
                >
                  {isRunning ? (
                    <Pause className="size-6 fill-current" />
                  ) : (
                    <Play className="ml-0.5 size-6 fill-current" />
                  )}
                </Button>

                {/* Skip Button */}
                <Button
                  variant="outline"
                  size="icon"
                  className="text-muted-foreground hover:text-foreground size-11 rounded-full"
                  title="Skip to next phase"
                  onClick={handleSkipPhase}
                  aria-label="Action"
                >
                  <SkipForward className="size-4" />
                </Button>
              </div>

              <Separator />

              {/* Session Tracker 4-Dot Indicator */}
              <div className="text-muted-foreground flex w-full items-center justify-between text-xs">
                <span className="text-foreground font-medium">Session {currentSession} of 4</span>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map((index) => (
                    <div
                      key={index}
                      className={cn(
                        'flex size-4 items-center justify-center rounded-full transition-all',
                        index < currentSession
                          ? 'bg-primary text-primary-foreground'
                          : index === currentSession
                            ? 'ring-primary ring-offset-background bg-primary/80 ring-2 ring-offset-2'
                            : 'border-muted-foreground/30 bg-muted/30 border-2',
                      )}
                    >
                      {index < currentSession && <Check className="size-2.5 stroke-[3]" />}
                    </div>
                  ))}
                </div>

                <span>Long break after 4</span>
              </div>
            </CardFooter>
          </Card>

          {/* Daily Focus Analytics Card */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BarChart3 className="text-primary size-4" />
                  <CardTitle className="text-base font-semibold">Daily Focus Analytics</CardTitle>
                </div>
                <Badge wrap variant="outline" className="text-muted-foreground text-xs font-normal">
                  Today
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Aggregated productivity stats and session completion rate
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* 3 Mini Metric Tiles */}
              <div className="grid grid-cols-3 gap-3">
                <div className="border-border/60 bg-muted/30 rounded-lg border p-3 text-center">
                  <div className="text-muted-foreground text-xs font-medium">Total Focus</div>
                  <div className="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">3h 45m</div>
                  <div className="mt-0.5 text-xs text-emerald-600 dark:text-emerald-400">+28m vs avg</div>
                </div>

                <div className="border-border/60 bg-muted/30 rounded-lg border p-3 text-center">
                  <div className="text-muted-foreground text-xs font-medium">Completed</div>
                  <div className="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">
                    {completedSessionsToday} <span className="text-muted-foreground text-xs font-normal">/ 10</span>
                  </div>
                  <div className="text-muted-foreground mt-0.5 text-xs">80% of goal</div>
                </div>

                <div className="border-border/60 bg-muted/30 rounded-lg border p-3 text-center">
                  <div className="text-muted-foreground text-xs font-medium">Focus Score</div>
                  <div className="text-foreground mt-1 font-mono text-lg font-bold tabular-nums">94%</div>
                  <div className="text-primary mt-0.5 text-xs font-semibold">High Flow</div>
                </div>
              </div>

              {/* Daily Goal Progress */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Daily Session Goal</span>
                  <span className="text-foreground font-semibold tabular-nums">{completedSessionsToday}/10 (80%)</span>
                </div>
                <Progress value={80} className="h-2" />
              </div>

              <Separator />

              {/* Recent Sessions History */}
              <div className="space-y-2">
                <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Recent Completed Intervals
                </div>
                <div className="space-y-1.5 text-xs">
                  <div className="bg-muted/30 flex items-center justify-between rounded-md px-2.5 py-1.5">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-muted-foreground font-mono tabular-nums">10:45 AM</span>
                      <span className="text-foreground truncate font-medium">Refactor OKLCH color-mix</span>
                    </div>
                    <Badge wrap variant="success" className="h-5 px-1.5 text-xs">
                      25m Focus
                    </Badge>
                  </div>
                  <div className="bg-muted/30 flex items-center justify-between rounded-md px-2.5 py-1.5">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-muted-foreground font-mono tabular-nums">10:15 AM</span>
                      <span className="text-muted-foreground truncate">Short Break · Lofi Beats</span>
                    </div>
                    <Badge wrap variant="secondary" className="h-5 px-1.5 text-xs">
                      5m Rest
                    </Badge>
                  </div>
                  <div className="bg-muted/30 flex items-center justify-between rounded-md px-2.5 py-1.5">
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-muted-foreground font-mono tabular-nums">09:30 AM</span>
                      <span className="text-foreground truncate font-medium">Audit ARIA roles</span>
                    </div>
                    <Badge wrap variant="success" className="h-5 px-1.5 text-xs">
                      25m Focus
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Active Task Queue */}
        <div className="space-y-6 lg:col-span-6">
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <ListTodo className="text-primary size-4" />
                  <CardTitle className="text-base font-semibold">Active Focus Task Queue</CardTitle>
                </div>
                <Badge wrap variant="secondary" className="text-xs">
                  {completedTasksCount}/{tasks.length} Completed
                </Badge>
              </div>
              <CardDescription className="text-xs">
                Select an item to link it to the active timer countdown. Check off tasks as you finish.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Add New Task Form */}
              <form className="flex items-center gap-2" onSubmit={handleAddTask}>
                <div className="flex-1">
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="Add a new focus task..."
                    size="middle"
                    className="text-xs"
                  />
                </div>
                <div className="w-20">
                  <Input
                    value={newTaskEstimate}
                    onChange={(e) => setNewTaskEstimate(Number(e.target.value))}
                    type="number"
                    min={1}
                    max={12}
                    placeholder="🍅 Est"
                    size="middle"
                    className="text-center text-xs tabular-nums"
                    title="Estimated Pomodoros"
                  />
                </div>
                <Button type="submit" size="default" className="gap-1 text-xs">
                  <Plus className="size-3.5" />
                  <span>Add</span>
                </Button>
              </form>

              <Separator />

              {/* Tasks List */}
              <div className="space-y-2.5">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className={cn(
                      'group flex items-center justify-between gap-3 rounded-lg border p-3 transition-all',
                      task.id === activeTaskId && !task.done
                        ? 'border-primary/50 bg-primary/5 shadow-xs'
                        : 'border-border/70 bg-card hover:border-border hover:bg-muted/30',
                      task.done && 'bg-muted/20 opacity-65',
                    )}
                  >
                    {/* Task Checkbox + Title */}
                    <div className="flex min-w-0 flex-1 items-start gap-3">
                      <div className="pt-0.5">
                        <Checkbox checked={task.done} onCheckedChange={() => handleToggleTask(task.id)} />
                      </div>

                      <button
                        type="button"
                        className="focus-visible:ring-ring min-w-0 flex-1 cursor-pointer rounded-md text-left focus-visible:ring-2 focus-visible:outline-none"
                        aria-pressed={task.id === activeTaskId}
                        onClick={() => setActiveTaskId(task.id)}
                      >
                        <div className="flex items-center gap-2">
                          <p
                            className={cn(
                              'text-foreground text-xs font-medium transition-all',
                              task.done && 'text-muted-foreground line-through',
                            )}
                          >
                            {task.title}
                          </p>
                          {task.id === activeTaskId && !task.done && (
                            <Badge wrap variant="default" className="h-4.5 px-1.5 text-xs">
                              Active
                            </Badge>
                          )}
                        </div>

                        <div className="text-muted-foreground mt-1 flex items-center gap-2 text-xs">
                          <Badge wrap variant="outline" className="h-4 px-1 text-xs font-normal">
                            {task.tag}
                          </Badge>
                          <span>Estimated: {task.targetPomodoros * 25}m</span>
                        </div>
                      </button>
                    </div>

                    {/* Pomodoro Pills + Delete */}
                    <div className="flex items-center gap-2">
                      <Badge
                        wrap
                        variant={task.done ? 'secondary' : task.id === activeTaskId ? 'default' : 'outline'}
                        className="shrink-0 gap-1 text-xs font-medium tabular-nums"
                      >
                        <span>
                          🍅 {task.currentPomodoros}/{task.targetPomodoros}
                        </span>
                      </Badge>

                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-muted-foreground hover:text-destructive size-7 opacity-0 transition-opacity group-hover:opacity-100"
                        title="Remove task"
                        onClick={() => handleRemoveTask(task.id)}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>

            <CardFooter className="border-border/50 bg-muted/20 text-muted-foreground flex items-center justify-between border-t py-3 text-xs">
              <span>Tip: Switch tasks any time without resetting timer elapsed time.</span>
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-foreground h-7 text-xs"
                onClick={() => setTasks((prev) => prev.filter((t) => !t.done))}
              >
                Clear Done ({completedTasksCount})
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
