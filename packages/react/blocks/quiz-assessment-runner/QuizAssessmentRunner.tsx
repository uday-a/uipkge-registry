'use client'

import * as React from 'react'
import {
  AlertCircle,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileCode,
  Flag,
  LogOut,
  RotateCcw,
  Sparkles,
  XCircle,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export interface QuizOption {
  id: string
  text: string
}

export interface QuizQuestion {
  id: number
  category: string
  prompt: string
  codeSnippet?: string
  codeLanguage?: string
  options: QuizOption[]
  correctOptionId: string
  explanation: string
}

export interface QuizAssessmentRunnerProps {
  initialQuestion?: number
  initialTimeRemaining?: number
  initialAnswers?: Record<number, string>
  initialFlagged?: number[]
  initialSubmitted?: boolean
  className?: string
}

const defaultQuestions: QuizQuestion[] = [
  {
    id: 1,
    category: 'Architecture',
    prompt:
      'What is the primary architectural difference between a UI Primitive and a UI Block in the UIPKGE component registry?',
    codeSnippet: `// Primitive (registry:ui) vs Block (registry:block)\nconst Primitive = <Button variant="outline">Save Changes</Button>\nconst Block = <QuizAssessmentRunner initialQuestion={1} />`,
    codeLanguage: 'TypeScript',
    options: [
      {
        id: 'A',
        text: 'Primitives are pre-compiled npm packages, while Blocks are static JSON schema files.',
      },
      {
        id: 'B',
        text: 'Primitives encapsulate low-level mechanics and styling tokens, while Blocks compose primitives into transparent, copy-pastable domain layouts.',
      },
      {
        id: 'C',
        text: 'Primitives can only be rendered server-side, while Blocks require client-side WebSockets.',
      },
      {
        id: 'D',
        text: 'Primitives require Zod runtime validation schemas, while Blocks only support TypeScript interfaces.',
      },
    ],
    correctOptionId: 'B',
    explanation:
      'In the UIPKGE architecture, primitives (registry:ui) encapsulate accessibility, focus states, and styling tokens, whereas blocks (registry:block) compose those primitives raw into unabstracted layouts where developers own and customize the code.',
  },
  {
    id: 2,
    category: 'Vue 3.5 SSR',
    prompt:
      'Why must CVA (Class Variance Authority) variant functions in Vue registry components be placed in a dedicated `<name>.variants.ts` file rather than `index.ts`?',
    codeSnippet: `// button.variants.ts\nexport const buttonVariants = cva(...)\n\n// Button.vue\nimport { buttonVariants } from './button.variants'\n\n// index.ts\nexport { default as Button } from './Button.vue'\nexport { buttonVariants } from './button.variants'`,
    codeLanguage: 'TypeScript',
    options: [
      {
        id: 'A',
        text: 'To comply with ECMAScript dynamic tree-shaking requirements for bundlers.',
      },
      {
        id: 'B',
        text: 'To prevent Vue SSR circular module dependency deadlocks where $setup.xxxVariants is undefined at runtime.',
      },
      {
        id: 'C',
        text: 'Because TypeScript forbids exporting types and constants from the same index file.',
      },
      {
        id: 'D',
        text: 'To enable hot-module replacement specifically for PostCSS variable transformations.',
      },
    ],
    correctOptionId: 'B',
    explanation:
      'Circular imports between Component.vue and index.ts cause runtime evaluation failures during SSR/SSG pre-rendering, resulting in "$setup.xxxVariants is not a function" errors.',
  },
  {
    id: 3,
    category: 'Design Tokens',
    prompt: "Which Tailwind CSS v4 directive establishes the OKLCH design token mapping in UIPKGE's theme layer?",
    codeSnippet: `@theme inline {\n  --color-background: var(--background);\n  --color-foreground: var(--foreground);\n  --color-primary: var(--primary);\n  --color-card: var(--card);\n}`,
    codeLanguage: 'CSS',
    options: [
      {
        id: 'A',
        text: '@apply tokens.oklch;',
      },
      {
        id: 'B',
        text: '@theme inline',
      },
      {
        id: 'C',
        text: "@config 'tailwind.theme.ts';",
      },
      {
        id: 'D',
        text: '@utility theme-variables;',
      },
    ],
    correctOptionId: 'B',
    explanation:
      'Tailwind CSS v4 uses `@theme inline` blocks to bind OKLCH CSS variables directly to Tailwind utility classes without needing a separate tailwind.config.js file.',
  },
  {
    id: 4,
    category: 'Reka UI / Vue',
    prompt:
      'When authoring polymorphic components in Vue 3.5 with Reka UI, which pattern cleanly strips the class prop for `cn()` forwarding?',
    codeSnippet: `const props = defineProps<ButtonProps>()\nconst delegatedProps = reactiveOmit(props, 'class')\nconst forwarded = useForwardProps(delegatedProps)`,
    codeLanguage: 'TypeScript',
    options: [
      {
        id: 'A',
        text: "Directly passing v-bind='props' to the template without stripping the class prop.",
      },
      {
        id: 'B',
        text: "Using reactiveOmit(props, 'class') combined with useForwardProps and explicit :class='cn(...)'.",
      },
      {
        id: 'C',
        text: 'Using Object.assign({}, props) inside an onMounted lifecycle hook.',
      },
      {
        id: 'D',
        text: "Using v-bind='$attrs' with inheritAttrs: true set on the SFC.",
      },
    ],
    correctOptionId: 'B',
    explanation:
      'reactiveOmit from @vueuse/core strips the class attribute while retaining reactivity, allowing custom class names to merge via cn() on the root element.',
  },
  {
    id: 5,
    category: 'Design Craft',
    prompt:
      'Why is the sub-12px micro-text rule (avoiding `text-xs`, `text-xs`) strictly enforced in UIPKGE craft standards?',
    codeSnippet: `// ❌ Anti-pattern:\n<span class="text-xs uppercase text-muted-foreground">Status</span>\n\n// ✅ Standard-compliant:\n<span class="text-xs font-medium uppercase text-muted-foreground">Status</span>`,
    codeLanguage: 'HTML',
    options: [
      {
        id: 'A',
        text: 'Sub-12px text triggers subpixel antialiasing rendering bugs on macOS WebKit.',
      },
      {
        id: 'B',
        text: 'Arbitrary micro-text degrades legibility, violates WCAG AA contrast guidelines, and fragments typographic scale discipline.',
      },
      {
        id: 'C',
        text: 'Tailwind CSS v4 ignores arbitrary bracket pixel values in production builds.',
      },
      {
        id: 'D',
        text: 'Screen readers automatically skip DOM elements rendered smaller than 12px.',
      },
    ],
    correctOptionId: 'B',
    explanation:
      'UIPKGE design craft mandates semantic typography starting at text-xs (12px) for badges and metadata to maintain readability and systematic hierarchy across devices.',
  },
  {
    id: 6,
    category: 'React Architecture',
    prompt:
      'In the React registry mirror, what headless primitive pattern allows consumers to pass custom trigger elements via `asChild`?',
    codeSnippet: `const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(\n  ({ className, asChild = false, ...props }, ref) => {\n    const Comp = asChild ? Slot : 'button'\n    return <Comp data-slot="quiz-assessment-runner" ref={ref} className={cn(buttonVariants(), className)} {...props} />\n  }\n)`,
    codeLanguage: 'TSX',
    options: [
      {
        id: 'A',
        text: 'Radix UI Slot primitive forwarded with asChild boolean prop.',
      },
      {
        id: 'B',
        text: 'React cloneElement with recursive prop decoration.',
      },
      {
        id: 'C',
        text: 'Custom Shadow DOM web component injection.',
      },
      {
        id: 'D',
        text: 'Direct DOM mutation through React portal boundaries.',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'The Radix UI Slot primitive merges props and event listeners directly onto its immediate child, enabling seamless element composition without wrapper DIVs.',
  },
  {
    id: 7,
    category: 'Typography / UX',
    prompt:
      'Which CSS font utility prevents numerical values like timers, counters, and metrics from causing horizontal layout shift during updates?',
    codeSnippet: `<div class="font-mono text-sm font-semibold tabular-nums text-foreground">\n  18:42 remaining\n</div>`,
    codeLanguage: 'HTML',
    options: [
      {
        id: 'A',
        text: 'tabular-nums (font-variant-numeric: tabular-nums)',
      },
      {
        id: 'B',
        text: 'font-stretch-condensed',
      },
      {
        id: 'C',
        text: 'tracking-tightest',
      },
      {
        id: 'D',
        text: 'text-balance',
      },
    ],
    correctOptionId: 'A',
    explanation:
      'tabular-nums enforces uniform width for numerical glyphs (0-9), preventing visual jitter when numbers change in timers and live feeds.',
  },
  {
    id: 8,
    category: 'Registry Conventions',
    prompt: 'What is the core rule regarding data arrays and tile layout abstractions when authoring UIPKGE blocks?',
    codeSnippet: `// ✅ Allowed in blocks:\n<div class="grid grid-cols-1 md:grid-cols-3 gap-4">\n  <Card><CardHeader><CardTitle>Total Revenue</CardTitle></CardHeader>...</Card>\n  <Card><CardHeader><CardTitle>Active Users</CardTitle></CardHeader>...</Card>\n</div>`,
    codeLanguage: 'TSX',
    options: [
      {
        id: 'A',
        text: 'Always abstract card lists into a generic <StatCard items={data} /> primitive.',
      },
      {
        id: 'B',
        text: 'Blocks must compose primitives raw and top-to-bottom so developers can inspect and edit layout structure directly.',
      },
      {
        id: 'C',
        text: 'Never render more than two cards per block layout.',
      },
      {
        id: 'D',
        text: 'All block components must persist their state to IndexedDB storage.',
      },
    ],
    correctOptionId: 'B',
    explanation:
      'UIPKGE explicitly bans monolithic StatCard-shaped primitives. Blocks must expose raw primitive composition inline so users have full ownership of the rendered markup.',
  },
  {
    id: 9,
    category: 'Accessibility (a11y)',
    prompt:
      'Which focus ring class pattern guarantees high-contrast keyboard accessibility without creating persistent outlines on mouse clicks?',
    codeSnippet: `class="focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none"`,
    codeLanguage: 'HTML',
    options: [
      {
        id: 'A',
        text: 'focus:outline-none with no replacement outline or ring.',
      },
      {
        id: 'B',
        text: 'focus-visible:ring-2 focus-visible:ring-ring with visible focus ring tokens.',
      },
      {
        id: 'C',
        text: 'active:scale-95 on all interactive mouse events.',
      },
      {
        id: 'D',
        text: 'hover:border-destructive on standard form input elements.',
      },
    ],
    correctOptionId: 'B',
    explanation:
      'focus-visible only applies the focus ring when keyboard navigation is detected, preserving clean aesthetics on mouse clicks while strictly satisfying WCAG 2.1 criteria.',
  },
  {
    id: 10,
    category: 'Registry Distribution',
    prompt: 'What is the purpose of the `registryDependencies` array in `<name>.registry.ts` item manifests?',
    codeSnippet: `export default defineRegistryItem({\n  name: 'quiz-assessment-runner',\n  type: 'registry:block',\n  registryDependencies: [\n    'https://uipkge.dev/r/badge.json',\n    'https://uipkge.dev/r/button.json',\n    'https://uipkge.dev/r/card.json',\n  ],\n})`,
    codeLanguage: 'TypeScript',
    options: [
      {
        id: 'A',
        text: 'It publishes private registry tarballs directly to npmjs.com.',
      },
      {
        id: 'B',
        text: 'It instructs shadcn / shadcn-vue CLIs to transitively resolve and copy required UI primitives into the consumer project.',
      },
      {
        id: 'C',
        text: 'It configures Webpack chunk splitting for client-side routing.',
      },
      {
        id: 'D',
        text: 'It generates backend database migration tables automatically.',
      },
    ],
    correctOptionId: 'B',
    explanation:
      'registryDependencies allows shadcn and shadcn-vue CLI tools to resolve and download all required component dependencies when installing a block.',
  },
]

export function QuizAssessmentRunner({
  initialQuestion = 1,
  initialTimeRemaining = 1122,
  initialAnswers = {},
  initialFlagged = [],
  initialSubmitted = false,
  className,
}: QuizAssessmentRunnerProps) {
  const totalQuestions = defaultQuestions.length
  const [currentQuestionIndex, setCurrentQuestionIndex] = React.useState(
    Math.max(0, Math.min(initialQuestion - 1, totalQuestions - 1)),
  )
  const [answers, setAnswers] = React.useState<Record<number, string>>(initialAnswers)
  const [flagged, setFlagged] = React.useState<Set<number>>(new Set(initialFlagged))
  const [timeRemaining, setTimeRemaining] = React.useState(initialTimeRemaining)
  const [isSubmitted, setIsSubmitted] = React.useState(initialSubmitted)
  const [isSubmitDialogOpen, setIsSubmitDialogOpen] = React.useState(false)
  const [isExitDialogOpen, setIsExitDialogOpen] = React.useState(false)
  const [reviewFilter, setReviewFilter] = React.useState<'all' | 'correct' | 'incorrect' | 'flagged'>('all')

  React.useEffect(() => {
    if (isSubmitted) return

    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval)
          setIsSubmitted(true)
          setIsSubmitDialogOpen(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isSubmitted])

  const currentQuestion = defaultQuestions[currentQuestionIndex]

  const answeredCount = Object.keys(answers).length
  const flaggedCount = flagged.size
  const unansweredCount = totalQuestions - answeredCount
  const progressPercentage = Math.round((answeredCount / totalQuestions) * 100)

  const correctCount = React.useMemo(() => {
    return defaultQuestions.filter((q) => answers[q.id] === q.correctOptionId).length
  }, [answers])

  const incorrectCount = React.useMemo(() => {
    return defaultQuestions.filter((q) => answers[q.id] && answers[q.id] !== q.correctOptionId).length
  }, [answers])

  const scorePercentage = Math.round((correctCount / totalQuestions) * 100)
  const isPassed = scorePercentage >= 80

  const gradeLabel = React.useMemo(() => {
    if (scorePercentage >= 90) return 'Grade A (Mastery)'
    if (scorePercentage >= 80) return 'Grade B (Proficient)'
    if (scorePercentage >= 70) return 'Grade C (Needs Review)'
    return 'Grade F (Did Not Pass)'
  }, [scorePercentage])

  const formattedTime = React.useMemo(() => {
    const mins = Math.floor(Math.max(0, timeRemaining) / 60)
    const secs = Math.max(0, timeRemaining) % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }, [timeRemaining])

  const timeSpentFormatted = React.useMemo(() => {
    const spent = Math.max(0, initialTimeRemaining - timeRemaining)
    const mins = Math.floor(spent / 60)
    const secs = spent % 60
    return `${mins}m ${String(secs).padStart(2, '0')}s`
  }, [initialTimeRemaining, timeRemaining])

  const filteredReviewQuestions = React.useMemo(() => {
    if (reviewFilter === 'correct') {
      return defaultQuestions.filter((q) => answers[q.id] === q.correctOptionId)
    }
    if (reviewFilter === 'incorrect') {
      return defaultQuestions.filter((q) => answers[q.id] !== q.correctOptionId)
    }
    if (reviewFilter === 'flagged') {
      return defaultQuestions.filter((q) => flagged.has(q.id))
    }
    return defaultQuestions
  }, [reviewFilter, answers, flagged])

  const toggleFlag = (questionId: number) => {
    setFlagged((prev) => {
      const next = new Set(prev)
      if (next.has(questionId)) {
        next.delete(questionId)
      } else {
        next.add(questionId)
      }
      return next
    })
  }

  const selectOption = (optionId: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: optionId,
    }))
  }

  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(Math.max(0, Math.min(index, totalQuestions - 1)))
  }

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    } else {
      setIsSubmitDialogOpen(true)
    }
  }

  const submitExam = () => {
    setIsSubmitted(true)
    setIsSubmitDialogOpen(false)
  }

  const retakeQuiz = () => {
    setAnswers({})
    setFlagged(new Set())
    setTimeRemaining(initialTimeRemaining)
    setCurrentQuestionIndex(0)
    setIsSubmitted(false)
    setReviewFilter('all')
  }

  const confirmExit = () => {
    setIsExitDialogOpen(false)
    retakeQuiz()
  }

  return (
    <div className={cn('mx-auto w-full max-w-6xl space-y-6', className)}>
      {/* ================================================================= */}
      {/* VIEW 1: ACTIVE QUIZ EXAM RUNNER */}
      {/* ================================================================= */}
      {!isSubmitted ? (
        <>
          {/* Quiz Top Bar / Header */}
          <Card className="border-border bg-card shadow-xs">
            <CardContent className="p-4 sm:p-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="secondary" className="text-xs font-medium">
                      Certification Assessment
                    </Badge>
                    <Badge variant="outline" className="text-muted-foreground font-mono text-xs">
                      Exam #TS-804
                    </Badge>
                  </div>
                  <h1 className="text-foreground text-base font-bold tracking-tight sm:text-lg">
                    TypeScript & Component Architecture Certification Quiz
                  </h1>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                  {/* Timer Pill */}
                  <div
                    className={cn(
                      'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-xs transition-colors',
                      timeRemaining < 300
                        ? 'border-destructive/40 bg-destructive/10 text-destructive'
                        : 'border-border bg-muted/50 text-foreground',
                    )}
                  >
                    <Clock className="size-3.5 shrink-0" />
                    <span className="font-mono font-semibold tabular-nums">{formattedTime}</span>
                    <span className="text-muted-foreground text-xs">remaining</span>
                  </div>

                  {/* Question Counter Pill */}
                  <Badge variant="outline" className="h-8 px-2.5 text-xs font-medium tabular-nums">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </Badge>

                  {/* Exit Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground text-xs"
                    onClick={() => setIsExitDialogOpen(true)}
                  >
                    <LogOut className="mr-1.5 size-3.5" />
                    Exit Quiz
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 2-Column Quiz Canvas */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
            {/* Left: Question & Options Card */}
            <div className="space-y-6 lg:col-span-8">
              <Card className="border-border shadow-xs">
                <CardHeader className="space-y-3 pb-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs font-medium">
                        {currentQuestion.category}
                      </Badge>
                      <span className="text-muted-foreground text-xs font-medium tabular-nums">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                      </span>
                    </div>

                    {/* Flag for Review Toggle Button */}
                    <Button
                      variant="outline"
                      size="sm"
                      className={cn(
                        'text-xs transition-colors',
                        flagged.has(currentQuestion.id)
                          ? 'border-amber-500/40 bg-amber-500/10 font-semibold text-amber-700 dark:text-amber-400'
                          : 'text-muted-foreground hover:text-foreground',
                      )}
                      onClick={() => toggleFlag(currentQuestion.id)}
                    >
                      <Flag
                        className={cn(
                          'mr-1.5 size-3.5',
                          flagged.has(currentQuestion.id) ? 'fill-amber-500 text-amber-500' : '',
                        )}
                      />
                      {flagged.has(currentQuestion.id) ? 'Flagged' : 'Flag for Review'}
                    </Button>
                  </div>

                  {/* Question Prompt Text */}
                  <CardTitle className="text-foreground text-base leading-relaxed font-semibold sm:text-lg">
                    {currentQuestion.prompt}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-5">
                  {/* Code Snippet Box (if available) */}
                  {currentQuestion.codeSnippet && (
                    <div className="border-border/80 bg-muted/40 dark:bg-muted/20 overflow-hidden rounded-lg border">
                      <div className="border-border/70 bg-muted/80 dark:bg-muted/40 flex items-center justify-between border-b px-3.5 py-1.5">
                        <div className="flex items-center gap-2">
                          <FileCode className="text-muted-foreground size-3.5" />
                          <span className="text-muted-foreground font-mono text-xs font-medium">
                            {currentQuestion.codeLanguage || 'TypeScript'}
                          </span>
                        </div>
                        <span className="text-muted-foreground font-mono text-xs">Context</span>
                      </div>
                      <pre className="text-foreground/90 overflow-x-auto p-4 font-mono text-xs leading-relaxed whitespace-pre">
                        <code>{currentQuestion.codeSnippet}</code>
                      </pre>
                    </div>
                  )}

                  {/* 4 Radio Option Cards */}
                  <div className="space-y-3">
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Select the correct answer:
                    </p>

                    <div className="grid gap-2.5">
                      {currentQuestion.options.map((opt) => {
                        const isSelected = answers[currentQuestion.id] === opt.id
                        return (
                          <div
                            key={opt.id}
                            role="button"
                            tabIndex={0}
                            className={cn(
                              'group relative flex cursor-pointer items-start gap-3.5 rounded-lg border p-3.5 text-left transition-all sm:p-4',
                              'focus-visible:ring-ring select-none focus-visible:ring-2 focus-visible:outline-none',
                              isSelected
                                ? 'border-primary bg-primary/[0.04] dark:bg-primary/10 ring-primary shadow-xs ring-1'
                                : 'border-border bg-card hover:bg-muted/40 hover:border-muted-foreground/30',
                            )}
                            onClick={() => selectOption(opt.id)}
                            onKeyDown={(e) => {
                              if (e.key === ' ' || e.key === 'Enter') {
                                e.preventDefault()
                                selectOption(opt.id)
                              }
                            }}
                          >
                            {/* Letter Circle Badge (A, B, C, D) */}
                            <div
                              className={cn(
                                'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors',
                                isSelected
                                  ? 'border-primary bg-primary text-primary-foreground'
                                  : 'border-border bg-muted/60 text-muted-foreground group-hover:border-foreground/30 group-hover:text-foreground',
                              )}
                            >
                              {opt.id}
                            </div>

                            {/* Option Text */}
                            <div className="flex-1 space-y-0.5">
                              <p className="text-foreground text-sm leading-relaxed font-medium">{opt.text}</p>
                            </div>

                            {/* Selected Check Icon */}
                            {isSelected && (
                              <div className="text-primary mt-0.5 shrink-0">
                                <Check className="size-4" />
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="border-border bg-muted/10 flex flex-wrap items-center justify-between gap-3 border-t p-4 sm:p-5">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentQuestionIndex === 0}
                    className="text-xs"
                    onClick={prevQuestion}
                  >
                    <ChevronLeft className="mr-1 size-4" />
                    Previous Question
                  </Button>

                  <div className="flex items-center gap-2">
                    {currentQuestionIndex === totalQuestions - 1 ? (
                      <Button
                        variant="default"
                        size="sm"
                        className="text-xs font-medium"
                        onClick={() => setIsSubmitDialogOpen(true)}
                      >
                        <CheckCircle2 className="mr-1.5 size-4" />
                        Review & Submit
                      </Button>
                    ) : (
                      <Button variant="default" size="sm" className="text-xs font-medium" onClick={nextQuestion}>
                        Save & Next
                        <ChevronRight className="ml-1 size-4" />
                      </Button>
                    )}
                  </div>
                </CardFooter>
              </Card>
            </div>

            {/* Right: Question Navigation Sidebar */}
            <div className="space-y-4 lg:sticky lg:top-6 lg:col-span-4">
              <Card className="border-border shadow-xs">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm font-semibold">Question Navigator</CardTitle>
                    <Badge variant="outline" className="font-mono text-xs tabular-nums">
                      {answeredCount}/{totalQuestions} done
                    </Badge>
                  </div>
                  <CardDescription className="text-xs">Jump directly to any question or review status.</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Exam Progress</span>
                      <span className="text-foreground font-semibold tabular-nums">{progressPercentage}% Complete</span>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>

                  <Separator />

                  {/* 10 Question Number Grid */}
                  <div className="space-y-2">
                    <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      Questions
                    </span>

                    <div className="grid grid-cols-5 gap-2">
                      {defaultQuestions.map((q, idx) => {
                        const isCurrent = idx === currentQuestionIndex
                        const isAnswered = Boolean(answers[q.id])
                        const isFlag = flagged.has(q.id)

                        return (
                          <button
                            key={q.id}
                            type="button"
                            className={cn(
                              'relative flex size-10 items-center justify-center rounded-lg border text-xs font-semibold tabular-nums transition-all',
                              'focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none',
                              isCurrent
                                ? 'border-primary bg-primary/10 text-primary ring-primary font-bold shadow-xs ring-2'
                                : isAnswered
                                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400'
                                  : isFlag
                                    ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400'
                                    : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
                            )}
                            onClick={() => goToQuestion(idx)}
                          >
                            {q.id}

                            {/* Mini status indicator on badge */}
                            {isFlag && !isCurrent && (
                              <span
                                className="ring-background absolute -top-1 -right-1 size-2 rounded-full bg-amber-500 ring-2"
                                title="Flagged"
                              />
                            )}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Legend */}
                  <div className="border-border/70 bg-muted/30 space-y-2 rounded-lg border p-3 text-xs">
                    <span className="text-foreground font-medium">Status Legend</span>
                    <div className="text-muted-foreground grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-emerald-500" />
                        <span>Answered ({answeredCount})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="size-2 rounded-full bg-amber-500" />
                        <span>Flagged ({flaggedCount})</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-primary size-2 rounded-full" />
                        <span>Current</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="bg-muted-foreground/40 size-2 rounded-full" />
                        <span>Unanswered ({unansweredCount})</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* Submit Button */}
                  <Button
                    variant="default"
                    className="h-10 w-full text-xs font-semibold shadow-xs"
                    onClick={() => setIsSubmitDialogOpen(true)}
                  >
                    <CheckCircle2 className="mr-2 size-4" />
                    Submit Exam
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      ) : (
        /* ================================================================= */
        /* VIEW 2: QUIZ RESULTS SUMMARY SCREEN */
        /* ================================================================= */
        <div className="space-y-6">
          {/* Results Hero Score Card */}
          <Card className="border-border bg-card overflow-hidden shadow-xs">
            <div className="border-border bg-muted/20 border-b p-6 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      variant={isPassed ? 'secondary' : 'outline'}
                      className={cn(
                        'text-xs font-semibold',
                        isPassed
                          ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                          : 'bg-destructive/10 text-destructive border-destructive/30',
                      )}
                    >
                      {isPassed ? 'PASSED · CERTIFIED' : 'DID NOT PASS · RETAKE RECOMMENDED'}
                    </Badge>
                    <Badge variant="outline" className="text-muted-foreground font-mono text-xs">
                      Exam Code #TS-804
                    </Badge>
                  </div>

                  <h1 className="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                    <span className="font-mono tabular-nums">{scorePercentage}%</span> Score · {gradeLabel}
                  </h1>
                  <p className="text-muted-foreground max-w-xl text-sm">
                    {isPassed
                      ? 'Congratulations! You have satisfied the technical competency standards for TypeScript and UIPKGE Component Architecture.'
                      : 'You scored below the 80% certification threshold. Review the explanations below and retake the assessment when ready.'}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <Button variant="default" size="sm" className="text-xs font-semibold" onClick={retakeQuiz}>
                    <RotateCcw className="mr-1.5 size-3.5" />
                    Retake Exam
                  </Button>
                </div>
              </div>
            </div>

            {/* 4 KPI Summary Cards */}
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <div className="border-border bg-card space-y-1 rounded-lg border p-4">
                  <span className="text-muted-foreground text-xs font-medium">Total Score</span>
                  <div className="text-foreground text-xl font-bold tabular-nums">
                    {correctCount} <span className="text-muted-foreground text-sm font-normal">/ {totalQuestions}</span>
                  </div>
                  <div className="text-muted-foreground font-mono text-xs">{scorePercentage}% accuracy</div>
                </div>

                <div className="border-border bg-card space-y-1 rounded-lg border p-4">
                  <span className="text-muted-foreground text-xs font-medium">Result Status</span>
                  <div
                    className={cn(
                      'text-xl font-bold',
                      isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive',
                    )}
                  >
                    {isPassed ? 'Passed' : 'Failed'}
                  </div>
                  <div className="text-muted-foreground font-mono text-xs">Passing threshold: 80%</div>
                </div>

                <div className="border-border bg-card space-y-1 rounded-lg border p-4">
                  <span className="text-muted-foreground text-xs font-medium">Time Elapsed</span>
                  <div className="text-foreground font-mono text-xl font-bold tabular-nums">{timeSpentFormatted}</div>
                  <div className="text-muted-foreground font-mono text-xs">18m 42s allocated</div>
                </div>

                <div className="border-border bg-card space-y-1 rounded-lg border p-4">
                  <span className="text-muted-foreground text-xs font-medium">Flagged Questions</span>
                  <div className="text-foreground text-xl font-bold tabular-nums">{flaggedCount}</div>
                  <div className="text-muted-foreground font-mono text-xs">Reviewed items</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Question Review Section */}
          <Card className="border-border shadow-xs">
            <CardHeader className="pb-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle className="text-base font-semibold">Answer Review & Explanations</CardTitle>
                  <CardDescription className="text-xs">
                    Detailed technical breakdown for every question in the assessment.
                  </CardDescription>
                </div>

                {/* Filter Buttons */}
                <div className="flex flex-wrap items-center gap-1.5">
                  <Button
                    variant={reviewFilter === 'all' ? 'default' : 'outline'}
                    size="sm"
                    className="h-7.5 px-2.5 text-xs"
                    onClick={() => setReviewFilter('all')}
                  >
                    All ({totalQuestions})
                  </Button>
                  <Button
                    variant={reviewFilter === 'correct' ? 'default' : 'outline'}
                    size="sm"
                    className="h-7.5 px-2.5 text-xs"
                    onClick={() => setReviewFilter('correct')}
                  >
                    Correct ({correctCount})
                  </Button>
                  <Button
                    variant={reviewFilter === 'incorrect' ? 'default' : 'outline'}
                    size="sm"
                    className="h-7.5 px-2.5 text-xs"
                    onClick={() => setReviewFilter('incorrect')}
                  >
                    Incorrect ({incorrectCount})
                  </Button>
                  <Button
                    variant={reviewFilter === 'flagged' ? 'default' : 'outline'}
                    size="sm"
                    className="h-7.5 px-2.5 text-xs"
                    onClick={() => setReviewFilter('flagged')}
                  >
                    Flagged ({flaggedCount})
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {filteredReviewQuestions.map((q) => {
                const isCorrect = answers[q.id] === q.correctOptionId
                const isFlag = flagged.has(q.id)

                return (
                  <div
                    key={q.id}
                    className={cn(
                      'space-y-4 rounded-lg border p-4 transition-all sm:p-5',
                      isCorrect
                        ? 'border-emerald-500/30 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.05]'
                        : 'border-destructive/30 bg-destructive/[0.02] dark:bg-destructive/[0.05]',
                    )}
                  >
                    {/* Question Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs font-bold tabular-nums">
                          Question {q.id}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {q.category}
                        </Badge>
                        {isFlag && (
                          <Badge
                            variant="outline"
                            className="border-amber-500/40 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-400"
                          >
                            <Flag className="mr-1 size-3 fill-amber-500" />
                            Flagged
                          </Badge>
                        )}
                      </div>

                      <Badge
                        variant={isCorrect ? 'secondary' : 'outline'}
                        className={cn(
                          'text-xs font-semibold',
                          isCorrect
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            : 'bg-destructive/10 text-destructive border-destructive/30',
                        )}
                      >
                        {isCorrect ? <CheckCircle2 className="mr-1 size-3.5" /> : <XCircle className="mr-1 size-3.5" />}
                        {isCorrect ? 'Correct (+10 pts)' : answers[q.id] ? 'Incorrect (0 pts)' : 'Unanswered (0 pts)'}
                      </Badge>
                    </div>

                    {/* Question Prompt */}
                    <p className="text-foreground text-sm leading-relaxed font-semibold">{q.prompt}</p>

                    {/* Optional Context Snippet */}
                    {q.codeSnippet && (
                      <div className="border-border/80 bg-muted/40 dark:bg-muted/20 overflow-hidden rounded-md border">
                        <pre className="text-foreground/80 overflow-x-auto p-3 font-mono text-xs leading-relaxed whitespace-pre">
                          <code>{q.codeSnippet}</code>
                        </pre>
                      </div>
                    )}

                    {/* Answer Comparison Cards */}
                    <div className="grid gap-2 sm:grid-cols-2">
                      {/* User's Answer */}
                      <div
                        className={cn(
                          'space-y-1 rounded-md border p-3 text-xs',
                          isCorrect
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300'
                            : 'border-destructive/30 bg-destructive/10 text-destructive',
                        )}
                      >
                        <span className="block text-xs font-semibold tracking-wider uppercase opacity-80">
                          Your Response:
                        </span>
                        <div className="font-medium">
                          {answers[q.id] ? (
                            <>
                              <span className="mr-1 font-bold">Option {answers[q.id]}:</span>
                              <span>{q.options.find((o) => o.id === answers[q.id])?.text}</span>
                            </>
                          ) : (
                            'No answer submitted'
                          )}
                        </div>
                      </div>

                      {/* Correct Answer */}
                      <div className="space-y-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-900 dark:text-emerald-300">
                        <span className="block text-xs font-semibold tracking-wider uppercase opacity-80">
                          Correct Answer:
                        </span>
                        <div className="font-medium">
                          <span className="mr-1 font-bold">Option {q.correctOptionId}:</span>
                          <span>{q.options.find((o) => o.id === q.correctOptionId)?.text}</span>
                        </div>
                      </div>
                    </div>

                    {/* Technical Explanation Box */}
                    <div className="border-border/80 bg-muted/40 text-muted-foreground space-y-1 rounded-md border p-3 text-xs">
                      <div className="text-foreground flex items-center gap-1.5 font-semibold">
                        <Sparkles className="text-primary size-3.5" />
                        <span>Architectural Explanation:</span>
                      </div>
                      <p className="leading-relaxed">{q.explanation}</p>
                    </div>
                  </div>
                )
              })}
            </CardContent>

            <CardFooter className="border-border bg-muted/10 flex items-center justify-between border-t p-4 sm:p-5">
              <span className="text-muted-foreground font-mono text-xs">Exam ID: 804-FE-UIPKGE</span>
              <Button variant="default" size="sm" className="text-xs" onClick={retakeQuiz}>
                <RotateCcw className="mr-1.5 size-3.5" />
                Retake Assessment
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* ================================================================= */}
      {/* DIALOG: CONFIRM EXAM SUBMISSION */}
      {/* ================================================================= */}
      <Dialog open={isSubmitDialogOpen} onOpenChange={setIsSubmitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Submit Assessment?</DialogTitle>
            <DialogDescription className="text-xs">
              Review your completion status before finalizing your submission.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 py-2 text-xs">
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="border-border bg-muted/40 space-y-0.5 rounded-lg border p-2.5">
                <span className="text-muted-foreground">Answered</span>
                <p className="text-foreground text-base font-bold tabular-nums">
                  {answeredCount}/{totalQuestions}
                </p>
              </div>
              <div className="border-border bg-muted/40 space-y-0.5 rounded-lg border p-2.5">
                <span className="text-muted-foreground">Flagged</span>
                <p className="text-base font-bold text-amber-600 tabular-nums dark:text-amber-400">{flaggedCount}</p>
              </div>
              <div className="border-border bg-muted/40 space-y-0.5 rounded-lg border p-2.5">
                <span className="text-muted-foreground">Unanswered</span>
                <p
                  className={cn(
                    'text-base font-bold tabular-nums',
                    unansweredCount > 0 ? 'text-destructive' : 'text-foreground',
                  )}
                >
                  {unansweredCount}
                </p>
              </div>
            </div>

            {unansweredCount > 0 && (
              <div className="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300">
                <AlertCircle className="mt-0.5 size-4 shrink-0" />
                <p>
                  You have{' '}
                  <strong>
                    {unansweredCount} unanswered question{unansweredCount === 1 ? '' : 's'}
                  </strong>
                  . Unanswered questions receive 0 points.
                </p>
              </div>
            )}

            <p className="text-muted-foreground text-xs">
              Once submitted, you will immediately receive your final score and detailed technical explanations.
            </p>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsSubmitDialogOpen(false)}>
              Continue Quiz
            </Button>
            <Button variant="default" size="sm" className="text-xs font-semibold" onClick={submitExam}>
              Confirm & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ================================================================= */}
      {/* DIALOG: CONFIRM EXIT */}
      {/* ================================================================= */}
      <Dialog open={isExitDialogOpen} onOpenChange={setIsExitDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-semibold">Exit Assessment?</DialogTitle>
            <DialogDescription className="text-xs">
              Are you sure you want to exit? Your answers for this session will be cleared.
            </DialogDescription>
          </DialogHeader>

          <div className="text-muted-foreground py-2 text-xs">
            You have answered {answeredCount} of {totalQuestions} questions. Exiting now will reset your attempt.
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" size="sm" className="text-xs" onClick={() => setIsExitDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" size="sm" className="text-xs" onClick={confirmExit}>
              Exit Quiz
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default QuizAssessmentRunner
