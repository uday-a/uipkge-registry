<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import {
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Flame,
  GraduationCap,
  Lightbulb,
  RotateCw,
  Shuffle,
} from 'lucide-vue-next'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'

export interface Flashcard {
  id: string
  category: string
  difficulty?: 'Level A' | 'Level AA' | 'Level AAA' | 'Design System' | 'Engineering'
  question: string
  hint: string
  answer: string
  codeSnippet?: string
  codeLanguage?: string
  source?: string
}

export type RatingInterval = 'again' | 'hard' | 'good' | 'easy'

const DEFAULT_DECK_TITLE = 'Design Engineering & Web Accessibility (WCAG 2.2)'

const DEFAULT_CARDS: Flashcard[] = [
  {
    id: 'wcag-1-4-3',
    category: 'WCAG Criterion 1.4.3',
    difficulty: 'Level AA',
    question: 'What is the minimum contrast ratio required for regular body text under WCAG AA standards?',
    hint: 'Consider standard text (< 18pt or < 14pt bold) versus large display headings (≥ 18pt or ≥ 14pt bold).',
    answer: '4.5:1 for normal text (< 18pt or < 14pt bold) and 3:1 for large text (≥ 18pt or ≥ 14pt bold).',
    codeSnippet: 'color: oklch(0.20 0 0); /* on oklch(0.98 0 0) -> 14.2:1 passes AA/AAA */',
    codeLanguage: 'css',
    source: 'WCAG 2.2 § 1.4.3 Contrast (Minimum)',
  },
  {
    id: 'wcag-2-5-8',
    category: 'WCAG Criterion 2.5.8',
    difficulty: 'Level AA',
    question: 'What is the minimum interactive touch target size required in WCAG 2.2 Level AA?',
    hint: 'Introduced in WCAG 2.2 to prevent accidental taps on mobile touchscreens without requiring 44×44px AAA.',
    answer:
      'At least 24×24 CSS pixels, or have sufficient spacing (undersized targets surrounded by at least 24px diameter clear space).',
    codeSnippet: '<button class="min-h-6 min-w-6 p-2 touch-manipulation">',
    codeLanguage: 'html',
    source: 'WCAG 2.2 § 2.5.8 Target Size (Minimum)',
  },
  {
    id: 'wcag-2-4-7',
    category: 'WCAG Criterion 2.4.7',
    difficulty: 'Level AA',
    question: 'What visual contrast requirement applies to keyboard focus indicators under WCAG 2.2?',
    hint: 'Focus indicators must be distinguishable against both the focused element and adjacent background.',
    answer:
      'The focus indicator must have a contrast ratio of at least 3:1 against the unfocused state and surrounding background, with minimum 2px perimeter thickness.',
    codeSnippet: 'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    codeLanguage: 'css',
    source: 'WCAG 2.2 § 2.4.7 & 2.4.11 Focus Appearance',
  },
  {
    id: 'wcag-4-1-2',
    category: 'WCAG Criterion 4.1.2',
    difficulty: 'Level A',
    question: 'How should custom collapsible or expandable widgets communicate state to screen readers?',
    hint: 'Use native semantic elements or explicit ARIA state attributes rather than visual classes alone.',
    answer:
      'Declare explicit ARIA roles (e.g. role="button"), aria-expanded="true|false", and aria-controls linking to the target element ID.',
    codeSnippet: '<button aria-expanded="true" aria-controls="card-back-content">',
    codeLanguage: 'html',
    source: 'WAI-ARIA 1.2 Authoring Practices',
  },
  {
    id: 'wcag-1-4-11',
    category: 'WCAG Criterion 1.4.11',
    difficulty: 'Level AA',
    question: 'What is the contrast threshold for UI components, boundaries, and graphical objects?',
    hint: 'Applies to active button borders, input outlines, checkboxes, and state badges.',
    answer:
      'A contrast ratio of at least 3:1 against adjacent colors for user interface components and graphical objects essential for comprehension.',
    codeSnippet: 'border: 1px solid var(--border); /* >= 3:1 against surface */',
    codeLanguage: 'css',
    source: 'WCAG 2.2 § 1.4.11 Non-text Contrast',
  },
  {
    id: 'oklch-tokens',
    category: 'Design Systems & Color Science',
    difficulty: 'Design System',
    question: 'Why is the OKLCH color space preferred over HSL for dark mode and accessibility contrast derivation?',
    hint: 'Perceptual lightness is uniform across all hues in OKLCH, unlike HSL where yellow looks brighter than blue at L=50%.',
    answer:
      'OKLCH is perceptually uniform. Equal changes in lightness (L) yield identical perceived contrast regardless of hue or chroma, preventing washed-out dark mode shifts.',
    codeSnippet: '--color-primary: oklch(0.62 0.22 264.4);',
    codeLanguage: 'css',
    source: 'CSS Color Module Level 4',
  },
]

interface Props {
  initialTitle?: string
  initialCards?: Flashcard[]
  class?: HTMLAttributes['class']
}

const props = defineProps<Props>()

const deckTitle = computed(() => props.initialTitle ?? DEFAULT_DECK_TITLE)
const deck = ref<Flashcard[]>([...(props.initialCards ?? DEFAULT_CARDS)])
const currentIndex = ref(0)
const isFlipped = ref(false)
const showHint = ref(false)
const copiedSnippet = ref(false)
const bookmarkedCards = ref<Set<string>>(new Set())
const cardScores = ref<Record<string, number>>({})
const lastRatingFeedback = ref<string | null>(null)

const currentCard = computed(() => deck.value[currentIndex.value] ?? deck.value[0])

const totalCards = computed(() => deck.value.length)
const currentNumber = computed(() => currentIndex.value + 1)
const progressPercentage = computed(() => Math.round((currentNumber.value / totalCards.value) * 100))

const masteryPercentage = computed(() => {
  const ratedKeys = Object.keys(cardScores.value)
  if (ratedKeys.length === 0) return 0
  const totalScore = ratedKeys.reduce((sum, key) => sum + (cardScores.value[key] ?? 0), 0)
  return Math.min(100, Math.round(totalScore / totalCards.value))
})

const isBookmarked = computed(() => bookmarkedCards.value.has(currentCard.value?.id))

function toggleFlip() {
  isFlipped.value = !isFlipped.value
}

function toggleHint() {
  showHint.value = !showHint.value
}

function toggleBookmark() {
  if (!currentCard.value) return
  const id = currentCard.value.id
  if (bookmarkedCards.value.has(id)) {
    bookmarkedCards.value.delete(id)
  } else {
    bookmarkedCards.value.add(id)
  }
}

function handlePrev() {
  if (currentIndex.value > 0) {
    currentIndex.value--
    isFlipped.value = false
    showHint.value = false
    lastRatingFeedback.value = null
  }
}

function handleNext() {
  if (currentIndex.value < totalCards.value - 1) {
    currentIndex.value++
    isFlipped.value = false
    showHint.value = false
    lastRatingFeedback.value = null
  }
}

function handleShuffle() {
  const shuffled = [...deck.value]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  deck.value = shuffled
  currentIndex.value = 0
  isFlipped.value = false
  showHint.value = false
  lastRatingFeedback.value = 'Deck shuffled'
  setTimeout(() => {
    if (lastRatingFeedback.value === 'Deck shuffled') {
      lastRatingFeedback.value = null
    }
  }, 2000)
}

function handleRate(interval: RatingInterval) {
  if (!currentCard.value) return

  const scoreMap: Record<RatingInterval, { score: number; label: string }> = {
    again: { score: 25, label: 'Again (< 1 min)' },
    hard: { score: 50, label: 'Hard (12 hours)' },
    good: { score: 80, label: 'Good (2 days)' },
    easy: { score: 100, label: 'Easy (4 days)' },
  }

  const { score, label } = scoreMap[interval]
  cardScores.value[currentCard.value.id] = score
  lastRatingFeedback.value = `Rated: ${label}`

  setTimeout(() => {
    if (currentIndex.value < totalCards.value - 1) {
      handleNext()
    } else {
      isFlipped.value = false
      showHint.value = false
    }
  }, 350)
}

async function copyCodeSnippet() {
  if (!currentCard.value?.codeSnippet) return
  try {
    await navigator.clipboard.writeText(currentCard.value.codeSnippet)
    copiedSnippet.value = true
    setTimeout(() => {
      copiedSnippet.value = false
    }, 2000)
  } catch {
    // Clipboard permission fallback
  }
}

function handleKeyDown(event: KeyboardEvent) {
  const target = event.target as HTMLElement | null
  if (target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return

  if (event.key === 'ArrowLeft') {
    event.preventDefault()
    handlePrev()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    handleNext()
  } else if (event.key === ' ' || event.code === 'Space') {
    event.preventDefault()
    toggleFlip()
  } else if (event.key.toLowerCase() === 'h') {
    event.preventDefault()
    toggleHint()
  } else if (isFlipped.value) {
    if (event.key === '1') {
      event.preventDefault()
      handleRate('again')
    } else if (event.key === '2') {
      event.preventDefault()
      handleRate('hard')
    } else if (event.key === '3') {
      event.preventDefault()
      handleRate('good')
    } else if (event.key === '4') {
      event.preventDefault()
      handleRate('easy')
    }
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
})
</script>

<template>
  <div
    data-slot="flashcard-study-deck"
    :class="cn('mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6 lg:p-8', props.class)"
  >
    <!-- Header Section -->
    <header class="space-y-4">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <div class="flex items-center gap-2">
            <Badge variant="secondary" class="gap-1 px-2.5 py-0.5 font-medium">
              <GraduationCap class="text-primary size-3.5" />
              <span>Study Deck</span>
            </Badge>
            <Badge variant="outline" class="text-muted-foreground gap-1 text-xs">
              <Flame class="size-3 text-amber-500" />
              <span>5-day streak</span>
            </Badge>
          </div>
          <h2 class="text-foreground text-xl font-bold tracking-tight md:text-2xl">
            {{ deckTitle }}
          </h2>
        </div>

        <div class="flex items-center gap-2">
          <Badge variant="outline" class="px-3 py-1 font-mono text-xs font-medium">
            Card {{ currentNumber }} of {{ totalCards }} · {{ masteryPercentage }}% Mastery
          </Badge>
        </div>
      </div>

      <!-- Progress Track -->
      <div class="space-y-1.5">
        <Progress :model-value="progressPercentage" class="h-2" />
        <div class="text-muted-foreground flex items-center justify-between text-xs">
          <span>Progress: {{ currentNumber }} / {{ totalCards }} cards</span>
          <span>{{ Object.keys(cardScores).length }} of {{ totalCards }} reviewed</span>
        </div>
      </div>
    </header>

    <!-- 3D Interactive Flashcard Container -->
    <div class="mx-auto w-full max-w-2xl [perspective:1200px]">
      <div
        :class="
          cn(
            'relative min-h-[440px] w-full rounded-xl transition-transform duration-500 [transform-style:preserve-3d] md:min-h-[460px]',
            isFlipped && '[transform:rotateY(180deg)]',
          )
        "
      >
        <!-- FRONT FACE: Question State -->
        <Card
          :class="
            cn(
              'border-border bg-card absolute inset-0 flex h-full w-full flex-col justify-between rounded-xl border p-6 shadow-xs [backface-visibility:hidden] md:p-8',
              isFlipped ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100',
            )
          "
        >
          <!-- Front Header -->
          <div class="flex items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" class="text-xs font-medium">
                {{ currentCard.category }}
              </Badge>
              <Badge v-if="currentCard.difficulty" variant="outline" class="text-xs">
                {{ currentCard.difficulty }}
              </Badge>
            </div>

            <div class="flex items-center gap-1.5">
              <Button
                variant="ghost"
                size="icon-sm"
                :class="cn('text-muted-foreground hover:text-foreground', isBookmarked && 'text-amber-500')"
                aria-label="Bookmark card"
                @click.stop="toggleBookmark"
              >
                <Bookmark :class="cn('size-4', isBookmarked && 'fill-amber-500 text-amber-500')" />
              </Button>
            </div>
          </div>

          <!-- Question Content -->
          <div class="my-auto space-y-4 py-4">
            <div class="space-y-1.5">
              <span class="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Question Prompt
              </span>
              <p class="text-foreground text-lg leading-snug font-semibold tracking-tight md:text-xl">
                {{ currentCard.question }}
              </p>
            </div>

            <!-- Hint Drawer / Toggle -->
            <div v-if="currentCard.hint" class="pt-2">
              <Button
                variant="ghost"
                size="xs"
                class="text-muted-foreground hover:text-foreground gap-1.5 text-xs"
                @click.stop="toggleHint"
              >
                <Lightbulb class="size-3.5 text-amber-500" />
                <span>{{ showHint ? 'Hide Hint' : 'Show Hint' }}</span>
                <span class="text-muted-foreground/60 font-mono">[H]</span>
              </Button>

              <div
                v-if="showHint"
                class="text-muted-foreground mt-2.5 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed"
              >
                <Lightbulb class="mt-0.5 size-4 shrink-0 text-amber-500" />
                <div>
                  <strong class="text-foreground font-semibold">Hint: </strong>
                  <span>{{ currentCard.hint }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Front Footer / Flip Trigger -->
          <div class="space-y-3 pt-2">
            <Separator />
            <div class="text-muted-foreground flex flex-col items-center justify-between gap-3 text-xs sm:flex-row">
              <span class="hidden sm:inline"
                >Press <kbd class="bg-muted border-border rounded border px-1 py-0.5 font-mono">Space</kbd> or click
                button</span
              >
              <Button
                variant="default"
                size="sm"
                class="w-full cursor-pointer gap-2 font-medium sm:w-auto"
                @click.stop="toggleFlip"
              >
                <RotateCw class="size-3.5" />
                <span>Flip Card to Reveal Answer</span>
              </Button>
            </div>
          </div>
        </Card>

        <!-- BACK FACE: Answer State -->
        <Card
          :class="
            cn(
              'border-border bg-card absolute inset-0 flex h-full w-full [transform:rotateY(180deg)] flex-col justify-between rounded-xl border p-6 shadow-xs [backface-visibility:hidden] md:p-8',
              isFlipped ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
            )
          "
        >
          <!-- Back Header -->
          <div class="flex items-center justify-between gap-3">
            <div class="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" class="text-xs font-medium">
                {{ currentCard.category }}
              </Badge>
              <Badge
                variant="default"
                class="border-emerald-500/30 bg-emerald-500/15 text-xs text-emerald-700 dark:text-emerald-300"
              >
                Answer Revealed
              </Badge>
            </div>

            <Button
              variant="ghost"
              size="xs"
              class="text-muted-foreground hover:text-foreground gap-1 text-xs"
              @click.stop="toggleFlip"
            >
              <RotateCw class="size-3.5" />
              <span>Flip Back</span>
            </Button>
          </div>

          <!-- Answer Content -->
          <div class="my-auto space-y-4 overflow-y-auto py-3">
            <div class="space-y-1.5">
              <span class="text-primary text-xs font-semibold tracking-wider uppercase"> Answer Explanation </span>
              <p class="text-foreground text-base leading-relaxed font-medium md:text-lg">
                {{ currentCard.answer }}
              </p>
            </div>

            <!-- Code / Token Example Block -->
            <div
              v-if="currentCard.codeSnippet"
              class="border-border bg-muted/60 dark:bg-muted/30 space-y-2 rounded-lg border p-3.5"
            >
              <div class="text-muted-foreground flex items-center justify-between text-xs">
                <span class="font-mono font-medium">Code / Token Example</span>
                <Button variant="ghost" size="xs" class="h-6 gap-1 px-2 text-xs" @click.stop="copyCodeSnippet">
                  <Check v-if="copiedSnippet" class="size-3 text-emerald-500" />
                  <Copy v-else class="size-3" />
                  <span>{{ copiedSnippet ? 'Copied' : 'Copy' }}</span>
                </Button>
              </div>
              <pre
                class="text-foreground bg-background/80 border-border/60 overflow-x-auto rounded border p-2 font-mono text-xs md:text-sm"
              ><code>{{ currentCard.codeSnippet }}</code></pre>
              <p v-if="currentCard.source" class="text-muted-foreground text-xs italic">
                Source: {{ currentCard.source }}
              </p>
            </div>
          </div>

          <!-- Spaced-Repetition Feedback Buttons -->
          <div class="space-y-2.5 pt-2">
            <div class="text-muted-foreground flex items-center justify-between text-xs">
              <span class="font-medium">Rate recall difficulty (SM-2 Spaced Repetition):</span>
              <span v-if="lastRatingFeedback" class="text-primary text-xs font-medium">
                {{ lastRatingFeedback }}
              </span>
            </div>

            <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
              <Button
                variant="outline"
                size="sm"
                class="flex h-auto flex-col border-red-500/30 bg-red-500/10 py-2 text-xs text-red-700 transition-all hover:bg-red-500/20 active:scale-95 dark:text-red-300"
                @click.stop="handleRate('again')"
              >
                <span class="font-semibold">Again</span>
                <span class="text-xs opacity-80">&lt; 1 min [1]</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                class="flex h-auto flex-col border-amber-500/30 bg-amber-500/10 py-2 text-xs text-amber-700 transition-all hover:bg-amber-500/20 active:scale-95 dark:text-amber-300"
                @click.stop="handleRate('hard')"
              >
                <span class="font-semibold">Hard</span>
                <span class="text-xs opacity-80">12 hours [2]</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                class="flex h-auto flex-col border-blue-500/30 bg-blue-500/10 py-2 text-xs text-blue-700 transition-all hover:bg-blue-500/20 active:scale-95 dark:text-blue-300"
                @click.stop="handleRate('good')"
              >
                <span class="font-semibold">Good</span>
                <span class="text-xs opacity-80">2 days [3]</span>
              </Button>

              <Button
                variant="outline"
                size="sm"
                class="flex h-auto flex-col border-emerald-500/30 bg-emerald-500/10 py-2 text-xs text-emerald-700 transition-all hover:bg-emerald-500/20 active:scale-95 dark:text-emerald-300"
                @click.stop="handleRate('easy')"
              >
                <span class="font-semibold">Easy</span>
                <span class="text-xs opacity-80">4 days [4]</span>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>

    <!-- Deck Navigation & Utility Controls -->
    <div class="mx-auto flex max-w-2xl flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
      <div class="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
        <Button variant="outline" size="sm" :disabled="currentIndex === 0" class="gap-1.5" @click="handlePrev">
          <ChevronLeft class="size-4" />
          <span>Previous</span>
        </Button>

        <Button variant="outline" size="sm" class="gap-1.5" @click="handleShuffle">
          <Shuffle class="size-3.5" />
          <span>Shuffle</span>
        </Button>
      </div>

      <div class="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
        <Button variant="secondary" size="sm" class="gap-1.5" @click="toggleFlip">
          <RotateCw class="size-3.5" />
          <span>{{ isFlipped ? 'Show Question' : 'Flip Card' }}</span>
        </Button>

        <Button
          variant="default"
          size="sm"
          :disabled="currentIndex === totalCards - 1"
          class="gap-1.5"
          @click="handleNext"
        >
          <span>Next</span>
          <ChevronRight class="size-4" />
        </Button>
      </div>
    </div>

    <!-- Keyboard Shortcuts Legend Footer -->
    <div class="mx-auto max-w-2xl pt-2 text-center">
      <p class="text-muted-foreground font-mono text-xs">
        Shortcuts: <span class="text-foreground font-semibold">← / →</span> Navigate ·
        <span class="text-foreground font-semibold">Space</span> Flip ·
        <span class="text-foreground font-semibold">H</span> Hint ·
        <span class="text-foreground font-semibold">1-4</span> Rate Interval
      </p>
    </div>
  </div>
</template>
