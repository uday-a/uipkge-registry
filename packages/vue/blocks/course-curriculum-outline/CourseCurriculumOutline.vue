<script setup lang="ts">
import { computed, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
import {
  Award,
  Check,
  CheckCircle2,
  Circle,
  Clock,
  Download,
  ExternalLink,
  FileCode,
  FileQuestion,
  FileText,
  FlaskConical,
  GraduationCap,
  Lock,
  MessageSquare,
  Play,
  PlayCircle,
  ShieldCheck,
  Sparkles,
  Star,
  Users,
  Video,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'

export interface Lesson {
  id: string
  title: string
  duration: string
  type: 'Video' | 'Interactive Lab' | 'Quiz'
  status: 'completed' | 'in-progress' | 'not-started' | 'locked'
}

export interface Module {
  id: string
  title: string
  duration: string
  lessonsCount: string
  completedCount: number
  totalCount: number
  status: 'completed' | 'in-progress' | 'locked'
  lessons: Lesson[]
}

interface Resource {
  id: string
  title: string
  meta: string
  type: 'figma' | 'repo' | 'pdf'
}

const props = withDefaults(
  defineProps<{
    /** Seed completed state for all lessons to preview the verified certificate state. */
    initialComplete?: boolean
    class?: HTMLAttributes['class']
  }>(),
  {
    initialComplete: false,
  },
)

const openModules = ref<string[]>(['module-1', 'module-2'])

const defaultModules: Module[] = [
  {
    id: 'module-1',
    title: 'Module 1: Design Tokens & OKLCH Architecture',
    duration: '1h 45m',
    lessonsCount: '4 lessons',
    completedCount: 4,
    totalCount: 4,
    status: 'completed',
    lessons: [
      {
        id: 'm1-l1',
        title: 'Introduction to OKLCH & Gamut Mapping',
        duration: '18m',
        type: 'Video',
        status: 'completed',
      },
      {
        id: 'm1-l2',
        title: 'Configuring Semantic Tokens in Tailwind CSS v4',
        duration: '26m',
        type: 'Video',
        status: 'completed',
      },
      {
        id: 'm1-l3',
        title: 'Lab: Building an Automated Contrast Checker',
        duration: '35m',
        type: 'Interactive Lab',
        status: 'completed',
      },
      {
        id: 'm1-l4',
        title: 'Quiz: Token Architecture & Dark Mode Strategy',
        duration: '26m',
        type: 'Quiz',
        status: 'completed',
      },
    ],
  },
  {
    id: 'module-2',
    title: 'Module 2: Polymorphic Primitives & Headless Reka UI',
    duration: '3h 10m',
    lessonsCount: '6 lessons',
    completedCount: 3,
    totalCount: 6,
    status: 'in-progress',
    lessons: [
      {
        id: 'm2-l1',
        title: 'Anatomy of Headless Primitives with Reka UI & Radix',
        duration: '24m',
        type: 'Video',
        status: 'completed',
      },
      {
        id: 'm2-l2',
        title: 'Building Polymorphic Button & Slot Mechanics',
        duration: '32m',
        type: 'Video',
        status: 'completed',
      },
      {
        id: 'm2-l3',
        title: 'Lab: Compound Component Patterns with Provide/Inject',
        duration: '40m',
        type: 'Interactive Lab',
        status: 'completed',
      },
      {
        id: 'm2-l4',
        title: 'Accessible Dialog, Popover & Focus Trapping',
        duration: '36m',
        type: 'Video',
        status: 'in-progress',
      },
      {
        id: 'm2-l5',
        title: 'Virtualization for High-Density Data Grids',
        duration: '38m',
        type: 'Video',
        status: 'not-started',
      },
      {
        id: 'm2-l6',
        title: 'Quiz: Accessibility Tree & ARIA Roles',
        duration: '20m',
        type: 'Quiz',
        status: 'not-started',
      },
    ],
  },
  {
    id: 'module-3',
    title: 'Module 3: Micro-Interactions & Spring Physics',
    duration: '4h 50m',
    lessonsCount: '8 lessons',
    completedCount: 0,
    totalCount: 8,
    status: 'locked',
    lessons: [
      {
        id: 'm3-l1',
        title: 'Physics-Based Animation Principles with Spring Physics',
        duration: '28m',
        type: 'Video',
        status: 'locked',
      },
      {
        id: 'm3-l2',
        title: 'Gesture Interactions & Drag-and-Drop Primitives',
        duration: '35m',
        type: 'Interactive Lab',
        status: 'locked',
      },
      {
        id: 'm3-l3',
        title: 'Layout Animations and Shared Element Transitions',
        duration: '42m',
        type: 'Video',
        status: 'locked',
      },
      {
        id: 'm3-l4',
        title: 'Haptic Feedback & Tactile States in Web Interfaces',
        duration: '25m',
        type: 'Video',
        status: 'locked',
      },
      {
        id: 'm3-l5',
        title: 'Optimizing 60fps / 120fps Rendering Pipelines',
        duration: '45m',
        type: 'Video',
        status: 'locked',
      },
      {
        id: 'm3-l6',
        title: 'Lab: Crafting a Fluid Floating Command Palette',
        duration: '50m',
        type: 'Interactive Lab',
        status: 'locked',
      },
      {
        id: 'm3-l7',
        title: 'Sound Design & Audio Micro-Feedback',
        duration: '25m',
        type: 'Video',
        status: 'locked',
      },
      {
        id: 'm3-l8',
        title: 'Quiz: Motion Reduction & Animation Performance',
        duration: '20m',
        type: 'Quiz',
        status: 'locked',
      },
    ],
  },
  {
    id: 'module-4',
    title: 'Module 4: Monorepo Architecture & CI Distribution',
    duration: '4h 45m',
    lessonsCount: '6 lessons',
    completedCount: 0,
    totalCount: 6,
    status: 'locked',
    lessons: [
      {
        id: 'm4-l1',
        title: 'Turborepo & pnpm Workspaces Setup from Scratch',
        duration: '35m',
        type: 'Video',
        status: 'locked',
      },
      {
        id: 'm4-l2',
        title: 'Dual-Framework Export Pipelines (Vue 3 + React 19)',
        duration: '45m',
        type: 'Video',
        status: 'locked',
      },
      {
        id: 'm4-l3',
        title: 'Registry Distribution Schema & JSON Manifest Generator',
        duration: '50m',
        type: 'Video',
        status: 'locked',
      },
      {
        id: 'm4-l4',
        title: 'Lab: Custom CLI Tooling with npx shadcn add',
        duration: '55m',
        type: 'Interactive Lab',
        status: 'locked',
      },
      {
        id: 'm4-l5',
        title: 'Automated Visual Regression CI with Playwright',
        duration: '40m',
        type: 'Interactive Lab',
        status: 'locked',
      },
      {
        id: 'm4-l6',
        title: 'Capstone Project: Publishing Your Own Component Registry',
        duration: '60m',
        type: 'Interactive Lab',
        status: 'locked',
      },
    ],
  },
]

const resources: Resource[] = [
  {
    id: 'res-figma',
    title: 'Figma Design System Kit v4.2',
    meta: '.fig · 48.2 MB',
    type: 'figma',
  },
  {
    id: 'res-repo',
    title: 'Course Starter Monorepo Template',
    meta: 'GitHub Template · Public',
    type: 'repo',
  },
  {
    id: 'res-tokens',
    title: 'OKLCH & Color Tokens Cheatsheet',
    meta: 'PDF Guide · 2.4 MB',
    type: 'pdf',
  },
  {
    id: 'res-wcag',
    title: 'WCAG 2.2 AA Contrast Matrix',
    meta: 'PDF Reference · 1.8 MB',
    type: 'pdf',
  },
]

const modules = computed(() => {
  if (props.initialComplete) {
    return defaultModules.map((m) => ({
      ...m,
      status: 'completed' as const,
      completedCount: m.totalCount,
      lessons: m.lessons.map((l) => ({
        ...l,
        status: 'completed' as const,
      })),
    }))
  }
  return defaultModules
})

const completedLessonsCount = computed(() => {
  if (props.initialComplete) return 24
  return 8
})
const totalLessonsCount = 24
const progressPercent = computed(() => Math.round((completedLessonsCount.value / totalLessonsCount) * 100))
const isFullyCompleted = computed(() => completedLessonsCount.value === totalLessonsCount)
</script>

<template>
  <div data-slot="course-curriculum-outline" :class="cn('text-foreground w-full space-y-6', props.class)">
    <!-- Course Hero Header -->
    <Card class="border-border bg-card shadow-xs">
      <CardHeader class="space-y-4">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div class="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" class="font-medium">Advanced · 14.5 Total Hours</Badge>
            <Badge variant="outline" class="text-muted-foreground">Design Engineering</Badge>
          </div>
          <div class="text-muted-foreground flex items-center gap-1.5 text-xs">
            <div class="flex items-center text-amber-500 dark:text-amber-400">
              <Star class="size-3.5 fill-current" aria-hidden="true" />
              <span class="text-foreground ml-1 font-semibold">4.9</span>
            </div>
            <span>·</span>
            <span class="tabular-nums">(1,840 students)</span>
          </div>
        </div>

        <div class="space-y-2">
          <CardTitle class="text-2xl font-bold tracking-tight sm:text-3xl">
            Full-Stack Design Systems with Vue & React
          </CardTitle>
          <CardDescription class="text-sm">
            Master enterprise-grade UI components, OKLCH color spaces, headless architecture with Reka UI, fluid spring
            physics, and monorepo package distribution.
          </CardDescription>
        </div>

        <div class="flex flex-wrap items-center justify-between gap-4 pt-1">
          <div class="flex items-center gap-3">
            <Avatar class="border-border size-10 border">
              <AvatarImage
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces"
                alt="Marcus Vance"
              />
              <AvatarFallback>MV</AvatarFallback>
            </Avatar>
            <div>
              <p class="text-sm leading-none font-medium">Marcus Vance</p>
              <p class="text-muted-foreground mt-1 text-xs">Principal Design Engineer</p>
            </div>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <Button v-if="!isFullyCompleted" class="gap-2 shadow-xs">
              <Play class="size-4 fill-current" aria-hidden="true" />
              Resume Learning
            </Button>
            <Button aria-label="Download attachment" v-else class="gap-2 shadow-xs">
              <Award class="size-4" aria-hidden="true" />
              Download Certificate
            </Button>
            <Button aria-label="Download attachment" variant="outline" class="gap-2">
              <Download class="size-4" aria-hidden="true" />
              Download Resources
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent class="pt-0">
        <div class="border-border/60 bg-muted/40 space-y-2 rounded-lg border p-4">
          <div class="flex items-center justify-between text-xs">
            <span class="text-foreground font-medium">
              <span class="tabular-nums">{{ completedLessonsCount }} of {{ totalLessonsCount }}</span> lessons completed
            </span>
            <span class="text-muted-foreground font-medium tabular-nums">{{ progressPercent }}%</span>
          </div>
          <Progress :model-value="progressPercent" />
        </div>
      </CardContent>
    </Card>

    <!-- Main Content & Sidebar Grid -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Left Column: Modular Curriculum Accordions -->
      <div class="space-y-4 lg:col-span-2">
        <div class="flex items-center justify-between px-1">
          <div>
            <h2 class="text-lg font-semibold tracking-tight">Course Curriculum</h2>
            <p class="text-muted-foreground text-xs">4 modular sections · 24 total lessons & interactive labs</p>
          </div>
          <div class="text-muted-foreground text-xs tabular-nums">
            <span class="text-foreground font-medium">{{ completedLessonsCount }}/{{ totalLessonsCount }}</span>
            Completed
          </div>
        </div>

        <Accordion type="multiple" :default-value="openModules" variant="separated">
          <AccordionItem v-for="module in modules" :key="module.id" :value="module.id">
            <AccordionTrigger class="hover:no-underline">
              <div class="flex flex-1 items-center justify-between gap-3 pr-2 text-left">
                <div class="flex min-w-0 items-center gap-3">
                  <span
                    v-if="module.status === 'completed'"
                    class="border-success/30 bg-success/15 text-success flex size-7 shrink-0 items-center justify-center rounded-full border shadow-xs"
                  >
                    <Check class="size-3.5" aria-hidden="true" />
                  </span>
                  <span
                    v-else-if="module.status === 'in-progress'"
                    class="border-primary/20 bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full border"
                  >
                    <Play class="size-3.5 fill-current" aria-hidden="true" />
                  </span>
                  <span
                    v-else
                    class="border-border bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full border"
                  >
                    <Lock class="size-3.5" aria-hidden="true" />
                  </span>
                  <div class="min-w-0">
                    <p class="text-foreground truncate text-sm font-semibold">{{ module.title }}</p>
                    <p class="text-muted-foreground mt-0.5 text-xs tabular-nums">
                      {{ module.lessonsCount }} · {{ module.duration }} ·
                      <span v-if="module.status === 'completed'" class="text-success font-medium">100% completed</span>
                      <span v-else-if="module.status === 'in-progress'" class="text-foreground font-medium">
                        {{ module.completedCount }}/{{ module.totalCount }} completed
                      </span>
                      <span v-else class="text-muted-foreground">Locked</span>
                    </p>
                  </div>
                </div>

                <div class="hidden shrink-0 items-center gap-2 sm:flex">
                  <Badge v-if="module.status === 'completed'" variant="success" class="gap-1 text-xs">
                    <Check class="size-3" /> Completed
                  </Badge>
                  <Badge v-else-if="module.status === 'in-progress'" variant="secondary" class="text-xs">
                    In Progress ({{ module.completedCount }}/{{ module.totalCount }})
                  </Badge>
                  <Badge v-else variant="outline" class="text-muted-foreground gap-1 text-xs">
                    <Lock class="size-3" /> Locked
                  </Badge>
                </div>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div class="border-border divide-border divide-y border-t">
                <div
                  v-for="lesson in module.lessons"
                  :key="lesson.id"
                  class="group hover:bg-muted/40 flex items-center justify-between gap-3 px-2 py-3 transition-colors first:pt-3 last:pb-1 sm:px-3"
                >
                  <div class="flex min-w-0 items-center gap-3">
                    <div class="flex shrink-0 items-center justify-center">
                      <CheckCircle2
                        v-if="lesson.status === 'completed'"
                        class="text-success size-4"
                        aria-hidden="true"
                      />
                      <PlayCircle
                        v-else-if="lesson.status === 'in-progress'"
                        class="text-primary size-4 animate-pulse"
                        aria-hidden="true"
                      />
                      <Lock
                        v-else-if="lesson.status === 'locked'"
                        class="text-muted-foreground/50 size-4"
                        aria-hidden="true"
                      />
                      <Circle v-else class="text-muted-foreground/60 size-4" aria-hidden="true" />
                    </div>

                    <div class="min-w-0">
                      <p
                        :class="
                          cn(
                            'truncate text-sm font-medium transition-colors',
                            lesson.status === 'locked'
                              ? 'text-muted-foreground'
                              : 'text-foreground group-hover:text-primary',
                          )
                        "
                      >
                        {{ lesson.title }}
                      </p>
                    </div>
                  </div>

                  <div class="flex shrink-0 items-center gap-2">
                    <Badge v-if="lesson.type === 'Interactive Lab'" variant="secondary" class="gap-1 text-xs">
                      <FlaskConical class="size-3" aria-hidden="true" />
                      <span class="hidden sm:inline">Interactive Lab</span>
                      <span class="sm:hidden">Lab</span>
                    </Badge>
                    <Badge v-else-if="lesson.type === 'Quiz'" variant="outline" class="gap-1 text-xs">
                      <FileQuestion class="size-3" aria-hidden="true" />
                      Quiz
                    </Badge>
                    <Badge v-else variant="outline" class="gap-1 text-xs">
                      <Video class="size-3" aria-hidden="true" />
                      Video
                    </Badge>

                    <span class="text-muted-foreground min-w-[32px] text-right font-mono text-xs tabular-nums">
                      {{ lesson.duration }}
                    </span>

                    <div class="hidden sm:block">
                      <Button v-if="lesson.status === 'in-progress'" size="sm" class="h-7 gap-1 px-2.5 text-xs">
                        <Play class="size-3 fill-current" /> Resume
                      </Button>
                      <Button
                        v-else-if="lesson.status === 'completed'"
                        variant="ghost"
                        size="sm"
                        class="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                      >
                        Review
                      </Button>
                      <Button
                        v-else-if="lesson.status === 'not-started'"
                        variant="outline"
                        size="sm"
                        class="h-7 px-2 text-xs"
                      >
                        Start
                      </Button>
                      <span v-else class="text-muted-foreground/50 px-2 text-xs">Locked</span>
                    </div>
                  </div>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>

      <!-- Right Column: Certificate & Resources Sidebar -->
      <div class="space-y-6">
        <!-- Certificate Card -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex items-center gap-2">
              <GraduationCap class="text-primary size-5" aria-hidden="true" />
              <CardTitle class="text-base">Certificate of Completion</CardTitle>
            </div>
            <CardDescription class="text-xs">
              Accredited credential upon 100% course and lab completion.
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-4">
            <!-- Cert preview container -->
            <div
              class="border-border/80 from-muted/50 to-muted/20 relative space-y-3 overflow-hidden rounded-lg border bg-gradient-to-b p-4 text-center"
            >
              <div class="relative z-10 space-y-2">
                <div
                  :class="
                    cn(
                      'mx-auto flex size-12 items-center justify-center rounded-full border shadow-xs',
                      isFullyCompleted
                        ? 'border-success/30 bg-success/15 text-success'
                        : 'border-primary/30 bg-primary/10 text-primary',
                    )
                  "
                >
                  <Award class="size-6" aria-hidden="true" />
                </div>
                <div>
                  <p class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    Verified Credential
                  </p>
                  <p class="text-foreground mt-0.5 text-sm font-bold">Full-Stack Design Systems</p>
                  <p class="text-muted-foreground text-xs">Marcus Vance · UIPKGE Academy</p>
                </div>
                <div class="pt-1">
                  <span
                    class="border-border bg-background/80 text-muted-foreground inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs"
                  >
                    <ShieldCheck class="text-primary size-3" /> CERT-8841-FS
                  </span>
                </div>
              </div>
            </div>

            <!-- Progress info -->
            <div class="space-y-1.5">
              <div class="flex items-center justify-between text-xs">
                <span class="text-muted-foreground">Graduation Status</span>
                <span class="text-foreground font-medium tabular-nums">
                  {{ completedLessonsCount }}/{{ totalLessonsCount }} Lessons
                </span>
              </div>
              <Progress :model-value="progressPercent" />
              <p class="text-muted-foreground pt-1 text-xs">
                <span v-if="isFullyCompleted" class="text-success font-medium">
                  All requirements satisfied! Your certificate is ready to download and share.
                </span>
                <span v-else>
                  Complete the remaining {{ totalLessonsCount - completedLessonsCount }} lessons and labs to unlock.
                </span>
              </p>
            </div>
          </CardContent>

          <CardFooter>
            <Button aria-label="Download attachment" v-if="isFullyCompleted" class="w-full gap-1.5" size="sm">
              <Download class="size-4" /> Download PDF Certificate
            </Button>
            <Button v-else variant="outline" size="sm" class="w-full gap-1.5" disabled>
              <Lock class="size-4" /> Locked (Complete Course)
            </Button>
          </CardFooter>
        </Card>

        <!-- Course Resources Card -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex items-center gap-2">
              <FileCode class="text-primary size-5" aria-hidden="true" />
              <CardTitle class="text-base">Course Resources</CardTitle>
            </div>
            <CardDescription class="text-xs">
              Downloadable starter kits, Figma files, and spec guides.
            </CardDescription>
          </CardHeader>

          <CardContent class="space-y-2.5">
            <div
              v-for="res in resources"
              :key="res.id"
              class="border-border hover:bg-muted/40 flex items-center justify-between gap-3 rounded-md border p-2.5 transition-colors"
            >
              <div class="flex min-w-0 items-center gap-2.5">
                <span
                  class="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md"
                >
                  <FileCode v-if="res.type === 'repo'" class="size-4" aria-hidden="true" />
                  <Sparkles v-else-if="res.type === 'figma'" class="size-4" aria-hidden="true" />
                  <FileText v-else class="size-4" aria-hidden="true" />
                </span>
                <div class="min-w-0">
                  <p class="text-foreground truncate text-xs font-medium">{{ res.title }}</p>
                  <p class="text-muted-foreground text-xs">{{ res.meta }}</p>
                </div>
              </div>

              <Button variant="ghost" size="icon" class="text-muted-foreground hover:text-foreground size-8 shrink-0">
                <ExternalLink v-if="res.type === 'repo'" class="size-4" aria-hidden="true" />
                <Download v-else class="size-4" aria-hidden="true" />
                <span class="sr-only">Download {{ res.title }}</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        <!-- Community & Mentorship Card -->
        <Card>
          <CardHeader class="pb-3">
            <div class="flex items-center gap-2">
              <Users class="text-primary size-5" aria-hidden="true" />
              <CardTitle class="text-base">Student Community</CardTitle>
            </div>
            <CardDescription class="text-xs">
              Connect with peers and get code reviews from design engineering mentors.
            </CardDescription>
          </CardHeader>

          <CardContent class="text-muted-foreground space-y-2.5 text-xs">
            <div class="flex items-center gap-2">
              <span class="bg-success size-2 rounded-full"></span>
              <span><strong class="text-foreground">1,420 students online</strong> in Discord</span>
            </div>
            <div class="flex items-center gap-2">
              <Clock class="text-muted-foreground size-3.5" aria-hidden="true" />
              <span>Weekly live Q&A: <strong class="text-foreground">Thursdays @ 5:00 PM UTC</strong></span>
            </div>
          </CardContent>

          <CardFooter>
            <Button variant="outline" size="sm" class="w-full gap-1.5">
              <MessageSquare class="size-4" /> Join Discord Community
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  </div>
</template>
