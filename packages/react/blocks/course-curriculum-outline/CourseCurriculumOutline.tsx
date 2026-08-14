'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

export interface CourseCurriculumOutlineProps {
  /** Seed completed state for all lessons to preview the verified certificate state. */
  initialComplete?: boolean
  className?: string
}

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

export function CourseCurriculumOutline({ initialComplete = false, className }: CourseCurriculumOutlineProps) {
  const modules = React.useMemo(() => {
    if (initialComplete) {
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
  }, [initialComplete])

  const completedLessonsCount = initialComplete ? 24 : 8
  const totalLessonsCount = 24
  const progressPercent = Math.round((completedLessonsCount / totalLessonsCount) * 100)
  const isFullyCompleted = completedLessonsCount === totalLessonsCount

  return (
    <div data-slot="course-curriculum-outline" className={cn('text-foreground w-full space-y-6', className)}>
      {/* Course Hero Header */}
      <Card className="border-border bg-card shadow-xs">
        <CardHeader className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="font-medium">
                Advanced · 14.5 Total Hours
              </Badge>
              <Badge variant="outline" className="text-muted-foreground">
                Design Engineering
              </Badge>
            </div>
            <div className="text-muted-foreground flex items-center gap-1.5 text-xs">
              <div className="flex items-center text-amber-500 dark:text-amber-400">
                <Star className="size-3.5 fill-current" aria-hidden="true" />
                <span className="text-foreground ml-1 font-semibold">4.9</span>
              </div>
              <span>·</span>
              <span className="tabular-nums">(1,840 students)</span>
            </div>
          </div>

          <div className="space-y-2">
            <CardTitle className="text-2xl font-bold tracking-tight sm:text-3xl">
              Full-Stack Design Systems with Vue & React
            </CardTitle>
            <CardDescription className="text-sm">
              Master enterprise-grade UI components, OKLCH color spaces, headless architecture with Reka UI, fluid
              spring physics, and monorepo package distribution.
            </CardDescription>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-3">
              <Avatar className="border-border size-10 border">
                <AvatarImage
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&h=96&fit=crop&crop=faces"
                  alt="Marcus Vance"
                />
                <AvatarFallback>MV</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm leading-none font-medium">Marcus Vance</p>
                <p className="text-muted-foreground mt-1 text-xs">Principal Design Engineer</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              {!isFullyCompleted ? (
                <Button className="gap-2 shadow-xs">
                  <Play className="size-4 fill-current" aria-hidden="true" />
                  Resume Learning
                </Button>
              ) : (
                <Button aria-label="Download attachment" className="gap-2 shadow-xs">
                  <Award className="size-4" aria-hidden="true" />
                  Download Certificate
                </Button>
              )}
              <Button aria-label="Download attachment" variant="outline" className="gap-2">
                <Download className="size-4" aria-hidden="true" />
                Download Resources
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="border-border/60 bg-muted/40 space-y-2 rounded-lg border p-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-foreground font-medium">
                <span className="tabular-nums">
                  {completedLessonsCount} of {totalLessonsCount}
                </span>{' '}
                lessons completed
              </span>
              <span className="text-muted-foreground font-medium tabular-nums">{progressPercent}%</span>
            </div>
            <Progress value={progressPercent} />
          </div>
        </CardContent>
      </Card>

      {/* Main Content & Sidebar Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column: Modular Curriculum Accordions */}
        <div className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Course Curriculum</h2>
              <p className="text-muted-foreground text-xs">4 modular sections · 24 total lessons & interactive labs</p>
            </div>
            <div className="text-muted-foreground text-xs tabular-nums">
              <span className="text-foreground font-medium">
                {completedLessonsCount}/{totalLessonsCount}
              </span>{' '}
              Completed
            </div>
          </div>

          <Accordion type="multiple" defaultValue={['module-1', 'module-2']} variant="separated">
            {modules.map((module) => (
              <AccordionItem key={module.id} value={module.id}>
                <AccordionTrigger className="hover:no-underline">
                  <div className="flex flex-1 items-center justify-between gap-3 pr-2 text-left">
                    <div className="flex min-w-0 items-center gap-3">
                      {module.status === 'completed' ? (
                        <span className="border-success/30 bg-success/15 text-success flex size-7 shrink-0 items-center justify-center rounded-full border shadow-xs">
                          <Check className="size-3.5" aria-hidden="true" />
                        </span>
                      ) : module.status === 'in-progress' ? (
                        <span className="border-primary/20 bg-primary/10 text-primary flex size-7 shrink-0 items-center justify-center rounded-full border">
                          <Play className="size-3.5 fill-current" aria-hidden="true" />
                        </span>
                      ) : (
                        <span className="border-border bg-muted text-muted-foreground flex size-7 shrink-0 items-center justify-center rounded-full border">
                          <Lock className="size-3.5" aria-hidden="true" />
                        </span>
                      )}
                      <div className="min-w-0">
                        <p className="text-foreground truncate text-sm font-semibold">{module.title}</p>
                        <p className="text-muted-foreground mt-0.5 text-xs tabular-nums">
                          {module.lessonsCount} · {module.duration} ·{' '}
                          {module.status === 'completed' ? (
                            <span className="text-success font-medium">100% completed</span>
                          ) : module.status === 'in-progress' ? (
                            <span className="text-foreground font-medium">
                              {module.completedCount}/{module.totalCount} completed
                            </span>
                          ) : (
                            <span className="text-muted-foreground">Locked</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <div className="hidden shrink-0 items-center gap-2 sm:flex">
                      {module.status === 'completed' ? (
                        <Badge variant="success" className="gap-1 text-xs">
                          <Check className="size-3" /> Completed
                        </Badge>
                      ) : module.status === 'in-progress' ? (
                        <Badge variant="secondary" className="text-xs">
                          In Progress ({module.completedCount}/{module.totalCount})
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground gap-1 text-xs">
                          <Lock className="size-3" /> Locked
                        </Badge>
                      )}
                    </div>
                  </div>
                </AccordionTrigger>

                <AccordionContent>
                  <div className="border-border divide-border divide-y border-t">
                    {module.lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="group hover:bg-muted/40 flex items-center justify-between gap-3 px-2 py-3 transition-colors first:pt-3 last:pb-1 sm:px-3"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex shrink-0 items-center justify-center">
                            {lesson.status === 'completed' ? (
                              <CheckCircle2 className="text-success size-4" aria-hidden="true" />
                            ) : lesson.status === 'in-progress' ? (
                              <PlayCircle className="text-primary size-4 animate-pulse" aria-hidden="true" />
                            ) : lesson.status === 'locked' ? (
                              <Lock className="text-muted-foreground/50 size-4" aria-hidden="true" />
                            ) : (
                              <Circle className="text-muted-foreground/60 size-4" aria-hidden="true" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p
                              className={cn(
                                'truncate text-sm font-medium transition-colors',
                                lesson.status === 'locked'
                                  ? 'text-muted-foreground'
                                  : 'text-foreground group-hover:text-primary',
                              )}
                            >
                              {
                                {
                                  ...lesson,
                                }.title
                              }
                            </p>
                          </div>
                        </div>

                        <div className="flex shrink-0 items-center gap-2">
                          {lesson.type === 'Interactive Lab' ? (
                            <Badge variant="secondary" className="gap-1 text-xs">
                              <FlaskConical className="size-3" aria-hidden="true" />
                              <span className="hidden sm:inline">Interactive Lab</span>
                              <span className="sm:hidden">Lab</span>
                            </Badge>
                          ) : lesson.type === 'Quiz' ? (
                            <Badge variant="outline" className="gap-1 text-xs">
                              <FileQuestion className="size-3" aria-hidden="true" />
                              Quiz
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="gap-1 text-xs">
                              <Video className="size-3" aria-hidden="true" />
                              Video
                            </Badge>
                          )}

                          <span className="text-muted-foreground min-w-[32px] text-right font-mono text-xs tabular-nums">
                            {lesson.duration}
                          </span>

                          <div className="hidden sm:block">
                            {lesson.status === 'in-progress' ? (
                              <Button size="sm" className="h-7 gap-1 px-2.5 text-xs">
                                <Play className="size-3 fill-current" /> Resume
                              </Button>
                            ) : lesson.status === 'completed' ? (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-muted-foreground hover:text-foreground h-7 px-2 text-xs"
                              >
                                Review
                              </Button>
                            ) : lesson.status === 'not-started' ? (
                              <Button variant="outline" size="sm" className="h-7 px-2 text-xs">
                                Start
                              </Button>
                            ) : (
                              <span className="text-muted-foreground/50 px-2 text-xs">Locked</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Right Column: Certificate & Resources Sidebar */}
        <div className="space-y-6">
          {/* Certificate Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <GraduationCap className="text-primary size-5" aria-hidden="true" />
                <CardTitle className="text-base">Certificate of Completion</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Accredited credential upon 100% course and lab completion.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Cert preview container */}
              <div className="border-border/80 from-muted/50 to-muted/20 relative space-y-3 overflow-hidden rounded-lg border bg-gradient-to-b p-4 text-center">
                <div className="relative z-10 space-y-2">
                  <div
                    className={cn(
                      'mx-auto flex size-12 items-center justify-center rounded-full border shadow-xs',
                      isFullyCompleted
                        ? 'border-success/30 bg-success/15 text-success'
                        : 'border-primary/30 bg-primary/10 text-primary',
                    )}
                  >
                    <Award className="size-6" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Verified Credential
                    </p>
                    <p className="text-foreground mt-0.5 text-sm font-bold">Full-Stack Design Systems</p>
                    <p className="text-muted-foreground text-xs">Marcus Vance · UIPKGE Academy</p>
                  </div>
                  <div className="pt-1">
                    <span className="border-border bg-background/80 text-muted-foreground inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs">
                      <ShieldCheck className="text-primary size-3" /> CERT-8841-FS
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress info */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Graduation Status</span>
                  <span className="text-foreground font-medium tabular-nums">
                    {completedLessonsCount}/{totalLessonsCount} Lessons
                  </span>
                </div>
                <Progress value={progressPercent} />
                <p className="text-muted-foreground pt-1 text-xs">
                  {isFullyCompleted ? (
                    <span className="text-success font-medium">
                      All requirements satisfied! Your certificate is ready to download and share.
                    </span>
                  ) : (
                    <span>
                      Complete the remaining {totalLessonsCount - completedLessonsCount} lessons and labs to unlock.
                    </span>
                  )}
                </p>
              </div>
            </CardContent>

            <CardFooter>
              {isFullyCompleted ? (
                <Button aria-label="Download attachment" className="w-full gap-1.5" size="sm">
                  <Download className="size-4" /> Download PDF Certificate
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="w-full gap-1.5" disabled>
                  <Lock className="size-4" /> Locked (Complete Course)
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Course Resources Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <FileCode className="text-primary size-5" aria-hidden="true" />
                <CardTitle className="text-base">Course Resources</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Downloadable starter kits, Figma files, and spec guides.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-2.5">
              {resources.map((res) => (
                <div
                  key={res.id}
                  className="border-border hover:bg-muted/40 flex items-center justify-between gap-3 rounded-md border p-2.5 transition-colors"
                >
                  <div className="flex min-w-0 items-center gap-2.5">
                    <span className="bg-muted text-muted-foreground flex size-8 shrink-0 items-center justify-center rounded-md">
                      {res.type === 'repo' ? (
                        <FileCode className="size-4" aria-hidden="true" />
                      ) : res.type === 'figma' ? (
                        <Sparkles className="size-4" aria-hidden="true" />
                      ) : (
                        <FileText className="size-4" aria-hidden="true" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <p className="text-foreground truncate text-xs font-medium">{res.title}</p>
                      <p className="text-muted-foreground text-xs">{res.meta}</p>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-foreground size-8 shrink-0"
                  >
                    {res.type === 'repo' ? (
                      <ExternalLink className="size-4" aria-hidden="true" />
                    ) : (
                      <Download className="size-4" aria-hidden="true" />
                    )}
                    <span className="sr-only">Download {res.title}</span>
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Community & Mentorship Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Users className="text-primary size-5" aria-hidden="true" />
                <CardTitle className="text-base">Student Community</CardTitle>
              </div>
              <CardDescription className="text-xs">
                Connect with peers and get code reviews from design engineering mentors.
              </CardDescription>
            </CardHeader>

            <CardContent className="text-muted-foreground space-y-2.5 text-xs">
              <div className="flex items-center gap-2">
                <span className="bg-success size-2 rounded-full" />
                <span>
                  <strong className="text-foreground">1,420 students online</strong> in Discord
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="text-muted-foreground size-3.5" aria-hidden="true" />
                <span>
                  Weekly live Q&A: <strong className="text-foreground">Thursdays @ 5:00 PM UTC</strong>
                </span>
              </div>
            </CardContent>

            <CardFooter>
              <Button variant="outline" size="sm" className="w-full gap-1.5">
                <MessageSquare className="size-4" /> Join Discord Community
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
