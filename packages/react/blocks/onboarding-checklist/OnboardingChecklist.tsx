import * as React from 'react'
import { Bell, BookOpen, Building2, Check, ChevronRight, Database, Users, X } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

interface Task {
  id: string
  title: string
  description: string
  icon: LucideIcon
}

const baseTasks: Task[] = [
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

export interface OnboardingChecklistProps {
  /** Seed every task as done so the success panel can be previewed in isolation. */
  initialComplete?: boolean
  className?: string
}

export function OnboardingChecklist({ initialComplete = false, className }: OnboardingChecklistProps) {
  const [tasks, setTasks] = React.useState(() =>
    baseTasks.map((task, index) => ({ ...task, done: initialComplete || index < 3 })),
  )
  const [open, setOpen] = React.useState(true)

  const completed = tasks.filter((task) => task.done).length
  const total = tasks.length
  const percent = Math.round((completed / total) * 100)
  const allDone = completed === total

  function toggle(id: string) {
    setTasks((prev) => prev.map((task) => (task.id === id ? { ...task, done: !task.done } : task)))
  }

  return (
    <div
      data-slot="onboarding-checklist"
      className={cn(
        'mx-auto w-full max-w-md transition-all duration-200 ease-out motion-reduce:transition-none',
        !open && 'pointer-events-none translate-y-1 opacity-0',
        className,
      )}
    >
      <Card>
        <CardHeader>
          <CardTitle>Get started</CardTitle>
          <CardDescription>Finish these steps to unlock everything your workspace can do.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-muted-foreground text-xs">
                <span className="text-foreground font-medium">
                  {completed} of {total}
                </span>{' '}
                complete
              </p>
              <p className="text-muted-foreground text-xs tabular-nums">{percent}%</p>
            </div>
            <Progress value={percent} />
          </div>

          {allDone ? (
            <div className="space-y-4 py-6 text-center">
              <div className="relative mx-auto size-16">
                <span className="bg-success/20 absolute inset-0 rounded-full blur-2xl" aria-hidden="true" />
                <span className="border-success/30 bg-success/10 text-success relative flex size-16 items-center justify-center rounded-full border shadow-xs">
                  <Check className="size-8" aria-hidden="true" />
                </span>
              </div>
              <div>
                <p className="text-lg font-semibold">You're all set</p>
                <p className="text-muted-foreground mt-1 text-sm">
                  Every step is complete — your workspace is ready to go.
                </p>
              </div>
            </div>
          ) : (
            <div className="-mx-2 divide-y">
              {tasks.map((task) => {
                const Icon = task.icon
                return (
                  <button
                    key={task.id}
                    type="button"
                    role="checkbox"
                    aria-checked={task.done}
                    onClick={() => toggle(task.id)}
                    className="group hover:bg-muted/50 focus-visible:ring-ring flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors focus-visible:ring-2 focus-visible:outline-none"
                  >
                    {task.done ? (
                      <span className="bg-primary text-primary-foreground flex size-9 shrink-0 items-center justify-center rounded-md shadow-xs">
                        <Check className="size-4" aria-hidden="true" />
                      </span>
                    ) : (
                      <span className="border-border bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors">
                        <Icon className="size-4" aria-hidden="true" />
                      </span>
                    )}
                    <span className="min-w-0 flex-1">
                      <span className={cn('block truncate text-sm font-medium', task.done && 'text-muted-foreground')}>
                        {task.title}
                      </span>
                      <span className="text-muted-foreground mt-0.5 block truncate text-xs">{task.description}</span>
                    </span>
                    <ChevronRight
                      className="text-muted-foreground/50 size-4 shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </button>
                )
              })}
            </div>
          )}
        </CardContent>
        <CardFooter className="justify-between">
          {!allDone ? (
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Skip for now
            </Button>
          ) : (
            <span aria-hidden="true" />
          )}
          <button
            type="button"
            aria-label="Dismiss checklist"
            onClick={() => setOpen(false)}
            className="hover:bg-foreground/10 focus-visible:ring-ring rounded-md p-1.5 transition-colors focus-visible:ring-2 focus-visible:outline-none"
          >
            <X className="text-muted-foreground size-4" aria-hidden="true" />
          </button>
        </CardFooter>
      </Card>
    </div>
  )
}
