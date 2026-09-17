<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import type { HTMLAttributes } from 'vue'
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
} from 'lucide-vue-next'
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
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<QuizAssessmentRunnerProps>(), {
  initialQuestion: 1,
  initialTimeRemaining: 1122, // 18m 42s
  initialAnswers: () => ({}),
  initialFlagged: () => [],
  initialSubmitted: false,
})

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
    codeSnippet: `const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(\n  ({ className, asChild = false, ...props }, ref) => {\n    const Comp = asChild ? Slot : 'button'\n    return <Comp ref={ref} className={cn(buttonVariants(), className)} {...props} />\n  }\n)`,
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

const totalQuestions = defaultQuestions.length
const currentQuestionIndex = ref(Math.max(0, Math.min(props.initialQuestion - 1, totalQuestions - 1)))
const answers = ref<Record<number, string>>({ ...props.initialAnswers })
const flagged = ref<Set<number>>(new Set(props.initialFlagged))
const timeRemaining = ref(props.initialTimeRemaining)
const isSubmitted = ref(props.initialSubmitted)
const isSubmitDialogOpen = ref(false)
const isExitDialogOpen = ref(false)
const reviewFilter = ref<'all' | 'correct' | 'incorrect' | 'flagged'>('all')

let timerInterval: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  if (!isSubmitted.value) {
    timerInterval = setInterval(() => {
      if (timeRemaining.value > 0) {
        timeRemaining.value -= 1
      } else {
        if (!isSubmitted.value) {
          isSubmitted.value = true
          isSubmitDialogOpen.value = false
        }
      }
    }, 1000)
  }
})

onUnmounted(() => {
  if (timerInterval) {
    clearInterval(timerInterval)
  }
})

const currentQuestion = computed(() => defaultQuestions[currentQuestionIndex.value])

const answeredCount = computed(() => Object.keys(answers.value).length)
const flaggedCount = computed(() => flagged.value.size)
const unansweredCount = computed(() => totalQuestions - answeredCount.value)
const progressPercentage = computed(() => Math.round((answeredCount.value / totalQuestions) * 100))

const correctCount = computed(() => {
  return defaultQuestions.filter((q) => answers.value[q.id] === q.correctOptionId).length
})
const incorrectCount = computed(() => {
  return defaultQuestions.filter((q) => answers.value[q.id] && answers.value[q.id] !== q.correctOptionId).length
})
const scorePercentage = computed(() => Math.round((correctCount.value / totalQuestions) * 100))
const isPassed = computed(() => scorePercentage.value >= 80)

const gradeLabel = computed(() => {
  if (scorePercentage.value >= 90) return 'Grade A (Mastery)'
  if (scorePercentage.value >= 80) return 'Grade B (Proficient)'
  if (scorePercentage.value >= 70) return 'Grade C (Needs Review)'
  return 'Grade F (Did Not Pass)'
})

const formattedTime = computed(() => {
  const mins = Math.floor(Math.max(0, timeRemaining.value) / 60)
  const secs = Math.max(0, timeRemaining.value) % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
})

const timeSpentFormatted = computed(() => {
  const spent = Math.max(0, props.initialTimeRemaining - timeRemaining.value)
  const mins = Math.floor(spent / 60)
  const secs = spent % 60
  return `${mins}m ${String(secs).padStart(2, '0')}s`
})

const filteredReviewQuestions = computed(() => {
  if (reviewFilter.value === 'correct') {
    return defaultQuestions.filter((q) => answers.value[q.id] === q.correctOptionId)
  }
  if (reviewFilter.value === 'incorrect') {
    return defaultQuestions.filter((q) => answers.value[q.id] !== q.correctOptionId)
  }
  if (reviewFilter.value === 'flagged') {
    return defaultQuestions.filter((q) => flagged.value.has(q.id))
  }
  return defaultQuestions
})

function toggleFlag(questionId: number) {
  const next = new Set(flagged.value)
  if (next.has(questionId)) {
    next.delete(questionId)
  } else {
    next.add(questionId)
  }
  flagged.value = next
}

function selectOption(optionId: string) {
  answers.value = {
    ...answers.value,
    [currentQuestion.value.id]: optionId,
  }
}

function goToQuestion(index: number) {
  currentQuestionIndex.value = Math.max(0, Math.min(index, totalQuestions - 1))
}

function prevQuestion() {
  if (currentQuestionIndex.value > 0) {
    currentQuestionIndex.value -= 1
  }
}

function nextQuestion() {
  if (currentQuestionIndex.value < totalQuestions - 1) {
    currentQuestionIndex.value += 1
  } else {
    isSubmitDialogOpen.value = true
  }
}

function submitExam() {
  isSubmitted.value = true
  isSubmitDialogOpen.value = false
  if (timerInterval) {
    clearInterval(timerInterval)
  }
}

function retakeQuiz() {
  answers.value = {}
  flagged.value = new Set()
  timeRemaining.value = props.initialTimeRemaining
  currentQuestionIndex.value = 0
  isSubmitted.value = false
  reviewFilter.value = 'all'

  if (timerInterval) {
    clearInterval(timerInterval)
  }
  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value -= 1
    } else {
      if (!isSubmitted.value) {
        isSubmitted.value = true
      }
    }
  }, 1000)
}

function confirmExit() {
  isExitDialogOpen.value = false
  retakeQuiz()
}
</script>

<template>
  <div data-slot="quiz-assessment-runner" :class="cn('mx-auto w-full max-w-6xl space-y-6', props.class)">
    <!-- ================================================================= -->
    <!-- VIEW 1: ACTIVE QUIZ EXAM RUNNER -->
    <!-- ================================================================= -->
    <template v-if="!isSubmitted">
      <!-- Quiz Top Bar / Header -->
      <Card class="border-border bg-card shadow-xs">
        <CardContent class="p-4 sm:p-5">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div class="space-y-1">
              <div class="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" class="text-xs font-medium"> Certification Assessment </Badge>
                <Badge variant="outline" class="text-muted-foreground font-mono text-xs"> Exam #TS-804 </Badge>
              </div>
              <h1 class="text-foreground text-base font-bold tracking-tight sm:text-lg">
                TypeScript & Component Architecture Certification Quiz
              </h1>
            </div>

            <div class="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <!-- Timer Pill -->
              <div
                :class="
                  cn(
                    'flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium shadow-xs transition-colors',
                    timeRemaining < 300
                      ? 'border-destructive/40 bg-destructive/10 text-destructive'
                      : 'border-border bg-muted/50 text-foreground',
                  )
                "
              >
                <Clock class="size-3.5 shrink-0" />
                <span class="font-mono font-semibold tabular-nums">{{ formattedTime }}</span>
                <span class="text-muted-foreground text-xs">remaining</span>
              </div>

              <!-- Question Counter Pill -->
              <Badge variant="outline" class="h-8 px-2.5 text-xs font-medium tabular-nums">
                Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
              </Badge>

              <!-- Exit Button -->
              <Button
                variant="ghost"
                size="sm"
                class="text-muted-foreground hover:text-foreground text-xs"
                @click="isExitDialogOpen = true"
              >
                <LogOut class="mr-1.5 size-3.5" />
                Exit Quiz
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <!-- 2-Column Quiz Canvas -->
      <div class="grid grid-cols-1 items-start gap-6 lg:grid-cols-12">
        <!-- Left: Question & Options Card -->
        <div class="space-y-6 lg:col-span-8">
          <Card class="border-border shadow-xs">
            <CardHeader class="space-y-3 pb-4">
              <div class="flex items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <Badge variant="secondary" class="text-xs font-medium">
                    {{ currentQuestion.category }}
                  </Badge>
                  <span class="text-muted-foreground text-xs font-medium tabular-nums">
                    Question {{ currentQuestionIndex + 1 }} of {{ totalQuestions }}
                  </span>
                </div>

                <!-- Flag for Review Toggle Button -->
                <Button
                  variant="outline"
                  size="sm"
                  :class="
                    cn(
                      'text-xs transition-colors',
                      flagged.has(currentQuestion.id)
                        ? 'border-amber-500/40 bg-amber-500/10 font-semibold text-amber-700 dark:text-amber-400'
                        : 'text-muted-foreground hover:text-foreground',
                    )
                  "
                  @click="toggleFlag(currentQuestion.id)"
                >
                  <Flag
                    :class="
                      cn('mr-1.5 size-3.5', flagged.has(currentQuestion.id) ? 'fill-amber-500 text-amber-500' : '')
                    "
                  />
                  {{ flagged.has(currentQuestion.id) ? 'Flagged' : 'Flag for Review' }}
                </Button>
              </div>

              <!-- Question Prompt Text -->
              <CardTitle class="text-foreground text-base leading-relaxed font-semibold sm:text-lg">
                {{ currentQuestion.prompt }}
              </CardTitle>
            </CardHeader>

            <CardContent class="space-y-5">
              <!-- Code Snippet Box (if available) -->
              <div
                v-if="currentQuestion.codeSnippet"
                class="border-border/80 bg-muted/40 dark:bg-muted/20 overflow-hidden rounded-lg border"
              >
                <div
                  class="border-border/70 bg-muted/80 dark:bg-muted/40 flex items-center justify-between border-b px-3.5 py-1.5"
                >
                  <div class="flex items-center gap-2">
                    <FileCode class="text-muted-foreground size-3.5" />
                    <span class="text-muted-foreground font-mono text-xs font-medium">
                      {{ currentQuestion.codeLanguage || 'TypeScript' }}
                    </span>
                  </div>
                  <span class="text-muted-foreground font-mono text-xs">Context</span>
                </div>
                <pre
                  class="text-foreground/90 overflow-x-auto p-4 font-mono text-xs leading-relaxed whitespace-pre"
                ><code>{{ currentQuestion.codeSnippet }}</code></pre>
              </div>

              <!-- 4 Radio Option Cards -->
              <div class="space-y-3">
                <p class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Select the correct answer:
                </p>

                <div class="grid gap-2.5">
                  <div
                    v-for="opt in currentQuestion.options"
                    :key="opt.id"
                    role="button"
                    tabindex="0"
                    :class="
                      cn(
                        'group relative flex cursor-pointer items-start gap-3.5 rounded-lg border p-3.5 text-left transition-all sm:p-4',
                        'focus-visible:ring-ring select-none focus-visible:ring-2 focus-visible:outline-none',
                        answers[currentQuestion.id] === opt.id
                          ? 'border-primary bg-primary/[0.04] dark:bg-primary/10 ring-primary shadow-xs ring-1'
                          : 'border-border bg-card hover:bg-muted/40 hover:border-muted-foreground/30',
                      )
                    "
                    @click="selectOption(opt.id)"
                    @keydown.space.prevent="selectOption(opt.id)"
                    @keydown.enter.prevent="selectOption(opt.id)"
                  >
                    <!-- Letter Circle Badge (A, B, C, D) -->
                    <div
                      :class="
                        cn(
                          'mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold transition-colors',
                          answers[currentQuestion.id] === opt.id
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-muted/60 text-muted-foreground group-hover:border-foreground/30 group-hover:text-foreground',
                        )
                      "
                    >
                      {{ opt.id }}
                    </div>

                    <!-- Option Text -->
                    <div class="flex-1 space-y-0.5">
                      <p class="text-foreground text-sm leading-relaxed font-medium">
                        {{ opt.text }}
                      </p>
                    </div>

                    <!-- Selected Check Icon -->
                    <div v-if="answers[currentQuestion.id] === opt.id" class="text-primary mt-0.5 shrink-0">
                      <Check class="size-4" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>

            <CardFooter
              class="border-border bg-muted/10 flex flex-wrap items-center justify-between gap-3 border-t p-4 sm:p-5"
            >
              <Button
                variant="outline"
                size="sm"
                :disabled="currentQuestionIndex === 0"
                class="text-xs"
                @click="prevQuestion"
              >
                <ChevronLeft class="mr-1 size-4" />
                Previous Question
              </Button>

              <div class="flex items-center gap-2">
                <Button
                  v-if="currentQuestionIndex === totalQuestions - 1"
                  variant="default"
                  size="sm"
                  class="text-xs font-medium"
                  @click="isSubmitDialogOpen = true"
                >
                  <CheckCircle2 class="mr-1.5 size-4" />
                  Review & Submit
                </Button>
                <Button v-else variant="default" size="sm" class="text-xs font-medium" @click="nextQuestion">
                  Save & Next
                  <ChevronRight class="ml-1 size-4" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        </div>

        <!-- Right: Question Navigation Sidebar -->
        <div class="space-y-4 lg:sticky lg:top-6 lg:col-span-4">
          <Card class="border-border shadow-xs">
            <CardHeader class="pb-3">
              <div class="flex items-center justify-between">
                <CardTitle class="text-sm font-semibold">Question Navigator</CardTitle>
                <Badge variant="outline" class="font-mono text-xs tabular-nums">
                  {{ answeredCount }}/{{ totalQuestions }} done
                </Badge>
              </div>
              <CardDescription class="text-xs"> Jump directly to any question or review status. </CardDescription>
            </CardHeader>

            <CardContent class="space-y-4">
              <!-- Progress Bar -->
              <div class="space-y-1.5">
                <div class="flex items-center justify-between text-xs">
                  <span class="text-muted-foreground font-medium">Exam Progress</span>
                  <span class="text-foreground font-semibold tabular-nums">{{ progressPercentage }}% Complete</span>
                </div>
                <Progress :model-value="progressPercentage" class="h-2" />
              </div>

              <Separator />

              <!-- 10 Question Number Grid -->
              <div class="space-y-2">
                <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase"> Questions </span>

                <div class="grid grid-cols-5 gap-2">
                  <button
                    v-for="(q, idx) in defaultQuestions"
                    :key="q.id"
                    type="button"
                    :class="
                      cn(
                        'relative flex size-10 items-center justify-center rounded-lg border text-xs font-semibold tabular-nums transition-all',
                        'focus-visible:ring-ring cursor-pointer focus-visible:ring-2 focus-visible:outline-none',
                        idx === currentQuestionIndex
                          ? 'border-primary bg-primary/10 text-primary ring-primary font-bold shadow-xs ring-2'
                          : answers[q.id]
                            ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/20 dark:text-emerald-400'
                            : flagged.has(q.id)
                              ? 'border-amber-500/30 bg-amber-500/10 text-amber-700 hover:bg-amber-500/20 dark:text-amber-400'
                              : 'border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground',
                      )
                    "
                    @click="goToQuestion(idx)"
                  >
                    {{ q.id }}

                    <!-- Mini status indicator on badge -->
                    <span
                      v-if="flagged.has(q.id) && idx !== currentQuestionIndex"
                      class="ring-background absolute -top-1 -right-1 size-2 rounded-full bg-amber-500 ring-2"
                      title="Flagged"
                    />
                  </button>
                </div>
              </div>

              <!-- Legend -->
              <div class="border-border/70 bg-muted/30 space-y-2 rounded-lg border p-3 text-xs">
                <span class="text-foreground font-medium">Status Legend</span>
                <div class="text-muted-foreground grid grid-cols-2 gap-2">
                  <div class="flex items-center gap-1.5">
                    <span class="size-2 rounded-full bg-emerald-500" />
                    <span>Answered ({{ answeredCount }})</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="size-2 rounded-full bg-amber-500" />
                    <span>Flagged ({{ flaggedCount }})</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="bg-primary size-2 rounded-full" />
                    <span>Current</span>
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="bg-muted-foreground/40 size-2 rounded-full" />
                    <span>Unanswered ({{ unansweredCount }})</span>
                  </div>
                </div>
              </div>

              <Separator />

              <!-- Submit Button -->
              <Button
                variant="default"
                class="h-10 w-full text-xs font-semibold shadow-xs"
                @click="isSubmitDialogOpen = true"
              >
                <CheckCircle2 class="mr-2 size-4" />
                Submit Exam
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </template>

    <!-- ================================================================= -->
    <!-- VIEW 2: QUIZ RESULTS SUMMARY SCREEN -->
    <!-- ================================================================= -->
    <template v-else>
      <div class="space-y-6">
        <!-- Results Hero Score Card -->
        <Card class="border-border bg-card overflow-hidden shadow-xs">
          <div class="border-border bg-muted/20 border-b p-6 sm:p-8">
            <div class="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div class="space-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <Badge
                    :variant="isPassed ? 'secondary' : 'outline'"
                    :class="
                      isPassed
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                        : 'bg-destructive/10 text-destructive border-destructive/30'
                    "
                    class="text-xs font-semibold"
                  >
                    {{ isPassed ? 'PASSED · CERTIFIED' : 'DID NOT PASS · RETAKE RECOMMENDED' }}
                  </Badge>
                  <Badge variant="outline" class="text-muted-foreground font-mono text-xs"> Exam Code #TS-804 </Badge>
                </div>

                <h1 class="text-foreground text-2xl font-bold tracking-tight sm:text-3xl">
                  <span class="font-mono tabular-nums">{{ scorePercentage }}%</span> Score · {{ gradeLabel }}
                </h1>
                <p class="text-muted-foreground max-w-xl text-sm">
                  {{
                    isPassed
                      ? 'Congratulations! You have satisfied the technical competency standards for TypeScript and UIPKGE Component Architecture.'
                      : 'You scored below the 80% certification threshold. Review the explanations below and retake the assessment when ready.'
                  }}
                </p>
              </div>

              <div class="flex shrink-0 items-center gap-3">
                <Button variant="default" size="sm" class="text-xs font-semibold" @click="retakeQuiz">
                  <RotateCcw class="mr-1.5 size-3.5" />
                  Retake Exam
                </Button>
              </div>
            </div>
          </div>

          <!-- 4 KPI Summary Cards -->
          <CardContent class="p-6">
            <div class="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <div class="border-border bg-card space-y-1 rounded-lg border p-4">
                <span class="text-muted-foreground text-xs font-medium">Total Score</span>
                <div class="text-foreground text-xl font-bold tabular-nums">
                  {{ correctCount }}
                  <span class="text-muted-foreground text-sm font-normal">/ {{ totalQuestions }}</span>
                </div>
                <div class="text-muted-foreground font-mono text-xs">{{ scorePercentage }}% accuracy</div>
              </div>

              <div class="border-border bg-card space-y-1 rounded-lg border p-4">
                <span class="text-muted-foreground text-xs font-medium">Result Status</span>
                <div
                  :class="
                    cn('text-xl font-bold', isPassed ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive')
                  "
                >
                  {{ isPassed ? 'Passed' : 'Failed' }}
                </div>
                <div class="text-muted-foreground font-mono text-xs">Passing threshold: 80%</div>
              </div>

              <div class="border-border bg-card space-y-1 rounded-lg border p-4">
                <span class="text-muted-foreground text-xs font-medium">Time Elapsed</span>
                <div class="text-foreground font-mono text-xl font-bold tabular-nums">
                  {{ timeSpentFormatted }}
                </div>
                <div class="text-muted-foreground font-mono text-xs">18m 42s allocated</div>
              </div>

              <div class="border-border bg-card space-y-1 rounded-lg border p-4">
                <span class="text-muted-foreground text-xs font-medium">Flagged Questions</span>
                <div class="text-foreground text-xl font-bold tabular-nums">
                  {{ flaggedCount }}
                </div>
                <div class="text-muted-foreground font-mono text-xs">Reviewed items</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Question Review Section -->
        <Card class="border-border shadow-xs">
          <CardHeader class="pb-4">
            <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle class="text-base font-semibold">Answer Review & Explanations</CardTitle>
                <CardDescription class="text-xs">
                  Detailed technical breakdown for every question in the assessment.
                </CardDescription>
              </div>

              <!-- Filter Buttons -->
              <div class="flex flex-wrap items-center gap-1.5">
                <Button
                  :variant="reviewFilter === 'all' ? 'default' : 'outline'"
                  size="sm"
                  class="h-7.5 px-2.5 text-xs"
                  @click="reviewFilter = 'all'"
                >
                  All ({{ totalQuestions }})
                </Button>
                <Button
                  :variant="reviewFilter === 'correct' ? 'default' : 'outline'"
                  size="sm"
                  class="h-7.5 px-2.5 text-xs"
                  @click="reviewFilter = 'correct'"
                >
                  Correct ({{ correctCount }})
                </Button>
                <Button
                  :variant="reviewFilter === 'incorrect' ? 'default' : 'outline'"
                  size="sm"
                  class="h-7.5 px-2.5 text-xs"
                  @click="reviewFilter = 'incorrect'"
                >
                  Incorrect ({{ incorrectCount }})
                </Button>
                <Button
                  :variant="reviewFilter === 'flagged' ? 'default' : 'outline'"
                  size="sm"
                  class="h-7.5 px-2.5 text-xs"
                  @click="reviewFilter = 'flagged'"
                >
                  Flagged ({{ flaggedCount }})
                </Button>
              </div>
            </div>
          </CardHeader>

          <CardContent class="space-y-4">
            <div
              v-for="q in filteredReviewQuestions"
              :key="q.id"
              :class="
                cn(
                  'space-y-4 rounded-lg border p-4 transition-all sm:p-5',
                  answers[q.id] === q.correctOptionId
                    ? 'border-emerald-500/30 bg-emerald-500/[0.02] dark:bg-emerald-500/[0.05]'
                    : 'border-destructive/30 bg-destructive/[0.02] dark:bg-destructive/[0.05]',
                )
              "
            >
              <!-- Question Header -->
              <div class="flex flex-wrap items-center justify-between gap-2">
                <div class="flex items-center gap-2">
                  <Badge variant="outline" class="text-xs font-bold tabular-nums"> Question {{ q.id }} </Badge>
                  <Badge variant="secondary" class="text-xs">
                    {{ q.category }}
                  </Badge>
                  <Badge
                    v-if="flagged.has(q.id)"
                    variant="outline"
                    class="border-amber-500/40 bg-amber-500/10 text-xs text-amber-700 dark:text-amber-400"
                  >
                    <Flag class="mr-1 size-3 fill-amber-500" />
                    Flagged
                  </Badge>
                </div>

                <Badge
                  :variant="answers[q.id] === q.correctOptionId ? 'secondary' : 'outline'"
                  :class="
                    answers[q.id] === q.correctOptionId
                      ? 'border-emerald-500/30 bg-emerald-500/10 text-xs font-semibold text-emerald-700 dark:text-emerald-400'
                      : 'bg-destructive/10 text-destructive border-destructive/30 text-xs font-semibold'
                  "
                >
                  <component :is="answers[q.id] === q.correctOptionId ? CheckCircle2 : XCircle" class="mr-1 size-3.5" />
                  {{
                    answers[q.id] === q.correctOptionId
                      ? 'Correct (+10 pts)'
                      : answers[q.id]
                        ? 'Incorrect (0 pts)'
                        : 'Unanswered (0 pts)'
                  }}
                </Badge>
              </div>

              <!-- Question Prompt -->
              <p class="text-foreground text-sm leading-relaxed font-semibold">
                {{ q.prompt }}
              </p>

              <!-- Optional Context Snippet -->
              <div
                v-if="q.codeSnippet"
                class="border-border/80 bg-muted/40 dark:bg-muted/20 overflow-hidden rounded-md border"
              >
                <pre
                  class="text-foreground/80 overflow-x-auto p-3 font-mono text-xs leading-relaxed whitespace-pre"
                ><code>{{ q.codeSnippet }}</code></pre>
              </div>

              <!-- Answer Comparison Cards -->
              <div class="grid gap-2 sm:grid-cols-2">
                <!-- User's Answer -->
                <div
                  :class="
                    cn(
                      'space-y-1 rounded-md border p-3 text-xs',
                      answers[q.id] === q.correctOptionId
                        ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-900 dark:text-emerald-300'
                        : 'border-destructive/30 bg-destructive/10 text-destructive',
                    )
                  "
                >
                  <span class="block text-xs font-semibold tracking-wider uppercase opacity-80"> Your Response: </span>
                  <div class="font-medium">
                    <span v-if="answers[q.id]" class="mr-1 font-bold">Option {{ answers[q.id] }}:</span>
                    <span>
                      {{ answers[q.id] ? q.options.find((o) => o.id === answers[q.id])?.text : 'No answer submitted' }}
                    </span>
                  </div>
                </div>

                <!-- Correct Answer (shown if incorrect or skipped) -->
                <div
                  class="space-y-1 rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-900 dark:text-emerald-300"
                >
                  <span class="block text-xs font-semibold tracking-wider uppercase opacity-80"> Correct Answer: </span>
                  <div class="font-medium">
                    <span class="mr-1 font-bold">Option {{ q.correctOptionId }}:</span>
                    <span>{{ q.options.find((o) => o.id === q.correctOptionId)?.text }}</span>
                  </div>
                </div>
              </div>

              <!-- Technical Explanation Box -->
              <div class="border-border/80 bg-muted/40 text-muted-foreground space-y-1 rounded-md border p-3 text-xs">
                <div class="text-foreground flex items-center gap-1.5 font-semibold">
                  <Sparkles class="text-primary size-3.5" />
                  <span>Architectural Explanation:</span>
                </div>
                <p class="leading-relaxed">
                  {{ q.explanation }}
                </p>
              </div>
            </div>
          </CardContent>

          <CardFooter class="border-border bg-muted/10 flex items-center justify-between border-t p-4 sm:p-5">
            <span class="text-muted-foreground font-mono text-xs"> Exam ID: 804-FE-UIPKGE </span>
            <Button variant="default" size="sm" class="text-xs" @click="retakeQuiz">
              <RotateCcw class="mr-1.5 size-3.5" />
              Retake Assessment
            </Button>
          </CardFooter>
        </Card>
      </div>
    </template>

    <!-- ================================================================= -->
    <!-- DIALOG: CONFIRM EXAM SUBMISSION -->
    <!-- ================================================================= -->
    <Dialog v-model:open="isSubmitDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="text-base font-semibold">Submit Assessment?</DialogTitle>
          <DialogDescription class="text-xs">
            Review your completion status before finalizing your submission.
          </DialogDescription>
        </DialogHeader>

        <div class="space-y-3 py-2 text-xs">
          <div class="grid grid-cols-3 gap-2 text-center">
            <div class="border-border bg-muted/40 space-y-0.5 rounded-lg border p-2.5">
              <span class="text-muted-foreground">Answered</span>
              <p class="text-foreground text-base font-bold tabular-nums">{{ answeredCount }}/{{ totalQuestions }}</p>
            </div>
            <div class="border-border bg-muted/40 space-y-0.5 rounded-lg border p-2.5">
              <span class="text-muted-foreground">Flagged</span>
              <p class="text-base font-bold text-amber-600 tabular-nums dark:text-amber-400">{{ flaggedCount }}</p>
            </div>
            <div class="border-border bg-muted/40 space-y-0.5 rounded-lg border p-2.5">
              <span class="text-muted-foreground">Unanswered</span>
              <p
                :class="
                  cn('text-base font-bold tabular-nums', unansweredCount > 0 ? 'text-destructive' : 'text-foreground')
                "
              >
                {{ unansweredCount }}
              </p>
            </div>
          </div>

          <div
            v-if="unansweredCount > 0"
            class="flex items-start gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-300"
          >
            <AlertCircle class="mt-0.5 size-4 shrink-0" />
            <p>
              You have <strong>{{ unansweredCount }} unanswered question{{ unansweredCount === 1 ? '' : 's' }}</strong
              >. Unanswered questions receive 0 points.
            </p>
          </div>

          <p class="text-muted-foreground text-xs">
            Once submitted, you will immediately receive your final score and detailed technical explanations.
          </p>
        </div>

        <DialogFooter class="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" class="text-xs" @click="isSubmitDialogOpen = false">
            Continue Quiz
          </Button>
          <Button variant="default" size="sm" class="text-xs font-semibold" @click="submitExam">
            Confirm & Submit
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <!-- ================================================================= -->
    <!-- DIALOG: CONFIRM EXIT -->
    <!-- ================================================================= -->
    <Dialog v-model:open="isExitDialogOpen">
      <DialogContent class="sm:max-w-md">
        <DialogHeader>
          <DialogTitle class="text-base font-semibold">Exit Assessment?</DialogTitle>
          <DialogDescription class="text-xs">
            Are you sure you want to exit? Your answers for this session will be cleared.
          </DialogDescription>
        </DialogHeader>

        <div class="text-muted-foreground py-2 text-xs">
          You have answered {{ answeredCount }} of {{ totalQuestions }} questions. Exiting now will reset your attempt.
        </div>

        <DialogFooter class="gap-2 sm:gap-0">
          <Button variant="outline" size="sm" class="text-xs" @click="isExitDialogOpen = false"> Cancel </Button>
          <Button variant="destructive" size="sm" class="text-xs" @click="confirmExit"> Exit Quiz </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </div>
</template>
