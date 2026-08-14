'use client'

import * as React from 'react'
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
} from 'lucide-react'
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

export interface FlashcardStudyDeckProps extends React.HTMLAttributes<HTMLDivElement> {
  initialTitle?: string
  initialCards?: Flashcard[]
}

export function FlashcardStudyDeck({
  initialTitle = DEFAULT_DECK_TITLE,
  initialCards = DEFAULT_CARDS,
  className,
  ...props
}: FlashcardStudyDeckProps) {
  const [deck, setDeck] = React.useState<Flashcard[]>(initialCards)
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isFlipped, setIsFlipped] = React.useState(false)
  const [showHint, setShowHint] = React.useState(false)
  const [copiedSnippet, setCopiedSnippet] = React.useState(false)
  const [bookmarkedCards, setBookmarkedCards] = React.useState<Set<string>>(new Set())
  const [cardScores, setCardScores] = React.useState<Record<string, number>>({})
  const [lastRatingFeedback, setLastRatingFeedback] = React.useState<string | null>(null)

  const currentCard = deck[currentIndex] ?? deck[0]
  const totalCards = deck.length
  const currentNumber = currentIndex + 1
  const progressPercentage = Math.round((currentNumber / totalCards) * 100)

  const masteryPercentage = React.useMemo(() => {
    const ratedKeys = Object.keys(cardScores)
    if (ratedKeys.length === 0) return 0
    const totalScore = ratedKeys.reduce((sum, key) => sum + (cardScores[key] ?? 0), 0)
    return Math.min(100, Math.round(totalScore / totalCards))
  }, [cardScores, totalCards])

  const isBookmarked = currentCard ? bookmarkedCards.has(currentCard.id) : false

  const toggleFlip = React.useCallback(() => {
    setIsFlipped((prev) => !prev)
  }, [])

  const toggleHint = React.useCallback(() => {
    setShowHint((prev) => !prev)
  }, [])

  const toggleBookmark = React.useCallback(() => {
    if (!currentCard) return
    setBookmarkedCards((prev) => {
      const next = new Set(prev)
      if (next.has(currentCard.id)) {
        next.delete(currentCard.id)
      } else {
        next.add(currentCard.id)
      }
      return next
    })
  }, [currentCard])

  const handlePrev = React.useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1)
      setIsFlipped(false)
      setShowHint(false)
      setLastRatingFeedback(null)
    }
  }, [currentIndex])

  const handleNext = React.useCallback(() => {
    if (currentIndex < totalCards - 1) {
      setCurrentIndex((prev) => prev + 1)
      setIsFlipped(false)
      setShowHint(false)
      setLastRatingFeedback(null)
    }
  }, [currentIndex, totalCards])

  const handleShuffle = React.useCallback(() => {
    const shuffled = [...deck]
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    setDeck(shuffled)
    setCurrentIndex(0)
    setIsFlipped(false)
    setShowHint(false)
    setLastRatingFeedback('Deck shuffled')
    setTimeout(() => {
      setLastRatingFeedback((prev) => (prev === 'Deck shuffled' ? null : prev))
    }, 2000)
  }, [deck])

  const handleRate = React.useCallback(
    (interval: RatingInterval) => {
      if (!currentCard) return

      const scoreMap: Record<RatingInterval, { score: number; label: string }> = {
        again: { score: 25, label: 'Again (< 1 min)' },
        hard: { score: 50, label: 'Hard (12 hours)' },
        good: { score: 80, label: 'Good (2 days)' },
        easy: { score: 100, label: 'Easy (4 days)' },
      }

      const { score, label } = scoreMap[interval]
      setCardScores((prev) => ({ ...prev, [currentCard.id]: score }))
      setLastRatingFeedback(`Rated: ${label}`)

      setTimeout(() => {
        if (currentIndex < totalCards - 1) {
          handleNext()
        } else {
          setIsFlipped(false)
          setShowHint(false)
        }
      }, 350)
    },
    [currentCard, currentIndex, totalCards, handleNext],
  )

  const copyCodeSnippet = React.useCallback(async () => {
    if (!currentCard?.codeSnippet) return
    try {
      await navigator.clipboard.writeText(currentCard.codeSnippet)
      setCopiedSnippet(true)
      setTimeout(() => {
        setCopiedSnippet(false)
      }, 2000)
    } catch {
      // Clipboard fallback
    }
  }, [currentCard])

  React.useEffect(() => {
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
      } else if (isFlipped) {
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

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handlePrev, handleNext, toggleFlip, toggleHint, handleRate, isFlipped])

  return (
    <div
      data-slot="flashcard-study-deck"
      className={cn('mx-auto w-full max-w-4xl space-y-6 p-4 md:p-6 lg:p-8', className)}
      {...props}
    >
      {/* Header Section */}
      <header className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="gap-1 px-2.5 py-0.5 font-medium">
                <GraduationCap className="text-primary size-3.5" />
                <span>Study Deck</span>
              </Badge>
              <Badge variant="outline" className="text-muted-foreground gap-1 text-xs">
                <Flame className="size-3 text-amber-500" />
                <span>5-day streak</span>
              </Badge>
            </div>
            <h2 className="text-foreground text-xl font-bold tracking-tight md:text-2xl">{initialTitle}</h2>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="outline" className="px-3 py-1 font-mono text-xs font-medium">
              Card {currentNumber} of {totalCards} · {masteryPercentage}% Mastery
            </Badge>
          </div>
        </div>

        {/* Progress Track */}
        <div className="space-y-1.5">
          <Progress value={progressPercentage} className="h-2" />
          <div className="text-muted-foreground flex items-center justify-between text-xs">
            <span>
              Progress: {currentNumber} / {totalCards} cards
            </span>
            <span>
              {Object.keys(cardScores).length} of {totalCards} reviewed
            </span>
          </div>
        </div>
      </header>

      {/* 3D Interactive Flashcard Container */}
      <div className="mx-auto w-full max-w-2xl [perspective:1200px]">
        <div
          className={cn(
            'relative min-h-[440px] w-full rounded-xl transition-transform duration-500 [transform-style:preserve-3d] md:min-h-[460px]',
            isFlipped && '[transform:rotateY(180deg)]',
          )}
        >
          {/* FRONT FACE: Question State */}
          <Card
            className={cn(
              'border-border bg-card absolute inset-0 flex h-full w-full flex-col justify-between rounded-xl border p-6 shadow-xs [backface-visibility:hidden] md:p-8',
              isFlipped ? 'pointer-events-none opacity-0' : 'pointer-events-auto opacity-100',
            )}
          >
            {/* Front Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs font-medium">
                  {currentCard.category}
                </Badge>
                {currentCard.difficulty && (
                  <Badge variant="outline" className="text-xs">
                    {currentCard.difficulty}
                  </Badge>
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className={cn('text-muted-foreground hover:text-foreground', isBookmarked && 'text-amber-500')}
                  aria-label="Bookmark card"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleBookmark()
                  }}
                >
                  <Bookmark className={cn('size-4', isBookmarked && 'fill-amber-500 text-amber-500')} />
                </Button>
              </div>
            </div>

            {/* Question Content */}
            <div className="my-auto space-y-4 py-4">
              <div className="space-y-1.5">
                <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Question Prompt
                </span>
                <p className="text-foreground text-lg leading-snug font-semibold tracking-tight md:text-xl">
                  {currentCard.question}
                </p>
              </div>

              {/* Hint Drawer / Toggle */}
              {currentCard.hint && (
                <div className="pt-2">
                  <Button
                    variant="ghost"
                    size="xs"
                    className="text-muted-foreground hover:text-foreground gap-1.5 text-xs"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleHint()
                    }}
                  >
                    <Lightbulb className="size-3.5 text-amber-500" />
                    <span>{showHint ? 'Hide Hint' : 'Show Hint'}</span>
                    <span className="text-muted-foreground/60 font-mono">[H]</span>
                  </Button>

                  {showHint && (
                    <div className="text-muted-foreground mt-2.5 flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed">
                      <Lightbulb className="mt-0.5 size-4 shrink-0 text-amber-500" />
                      <div>
                        <strong className="text-foreground font-semibold">Hint: </strong>
                        <span>{currentCard.hint}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Front Footer / Flip Trigger */}
            <div className="space-y-3 pt-2">
              <Separator />
              <div className="text-muted-foreground flex flex-col items-center justify-between gap-3 text-xs sm:flex-row">
                <span className="hidden sm:inline">
                  Press <kbd className="bg-muted border-border rounded border px-1 py-0.5 font-mono">Space</kbd> or
                  click button
                </span>
                <Button
                  variant="default"
                  size="sm"
                  className="w-full cursor-pointer gap-2 font-medium sm:w-auto"
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleFlip()
                  }}
                >
                  <RotateCw className="size-3.5" />
                  <span>Flip Card to Reveal Answer</span>
                </Button>
              </div>
            </div>
          </Card>

          {/* BACK FACE: Answer State */}
          <Card
            className={cn(
              'border-border bg-card absolute inset-0 flex h-full w-full [transform:rotateY(180deg)] flex-col justify-between rounded-xl border p-6 shadow-xs [backface-visibility:hidden] md:p-8',
              isFlipped ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
            )}
          >
            {/* Back Header */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary" className="text-xs font-medium">
                  {currentCard.category}
                </Badge>
                <Badge
                  variant="default"
                  className="border-emerald-500/30 bg-emerald-500/15 text-xs text-emerald-700 dark:text-emerald-300"
                >
                  Answer Revealed
                </Badge>
              </div>

              <Button
                variant="ghost"
                size="xs"
                className="text-muted-foreground hover:text-foreground gap-1 text-xs"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleFlip()
                }}
              >
                <RotateCw className="size-3.5" />
                <span>Flip Back</span>
              </Button>
            </div>

            {/* Answer Content */}
            <div className="my-auto space-y-4 overflow-y-auto py-3">
              <div className="space-y-1.5">
                <span className="text-primary text-xs font-semibold tracking-wider uppercase">Answer Explanation</span>
                <p className="text-foreground text-base leading-relaxed font-medium md:text-lg">{currentCard.answer}</p>
              </div>

              {/* Code / Token Example Block */}
              {currentCard.codeSnippet && (
                <div className="border-border bg-muted/60 dark:bg-muted/30 space-y-2 rounded-lg border p-3.5">
                  <div className="text-muted-foreground flex items-center justify-between text-xs">
                    <span className="font-mono font-medium">Code / Token Example</span>
                    <Button
                      variant="ghost"
                      size="xs"
                      className="h-6 gap-1 px-2 text-xs"
                      onClick={(e) => {
                        e.stopPropagation()
                        copyCodeSnippet()
                      }}
                    >
                      {copiedSnippet ? <Check className="size-3 text-emerald-500" /> : <Copy className="size-3" />}
                      <span>{copiedSnippet ? 'Copied' : 'Copy'}</span>
                    </Button>
                  </div>
                  <pre className="text-foreground bg-background/80 border-border/60 overflow-x-auto rounded border p-2 font-mono text-xs md:text-sm">
                    <code>{currentCard.codeSnippet}</code>
                  </pre>
                  {currentCard.source && (
                    <p className="text-muted-foreground text-xs italic">Source: {currentCard.source}</p>
                  )}
                </div>
              )}
            </div>

            {/* Spaced-Repetition Feedback Buttons */}
            <div className="space-y-2.5 pt-2">
              <div className="text-muted-foreground flex items-center justify-between text-xs">
                <span className="font-medium">Rate recall difficulty (SM-2 Spaced Repetition):</span>
                {lastRatingFeedback && <span className="text-primary text-xs font-medium">{lastRatingFeedback}</span>}
              </div>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-auto flex-col border-red-500/30 bg-red-500/10 py-2 text-xs text-red-700 transition-all hover:bg-red-500/20 active:scale-95 dark:text-red-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRate('again')
                  }}
                >
                  <span className="font-semibold">Again</span>
                  <span className="text-xs opacity-80">&lt; 1 min [1]</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-auto flex-col border-amber-500/30 bg-amber-500/10 py-2 text-xs text-amber-700 transition-all hover:bg-amber-500/20 active:scale-95 dark:text-amber-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRate('hard')
                  }}
                >
                  <span className="font-semibold">Hard</span>
                  <span className="text-xs opacity-80">12 hours [2]</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-auto flex-col border-blue-500/30 bg-blue-500/10 py-2 text-xs text-blue-700 transition-all hover:bg-blue-500/20 active:scale-95 dark:text-blue-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRate('good')
                  }}
                >
                  <span className="font-semibold">Good</span>
                  <span className="text-xs opacity-80">2 days [3]</span>
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="flex h-auto flex-col border-emerald-500/30 bg-emerald-500/10 py-2 text-xs text-emerald-700 transition-all hover:bg-emerald-500/20 active:scale-95 dark:text-emerald-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRate('easy')
                  }}
                >
                  <span className="font-semibold">Easy</span>
                  <span className="text-xs opacity-80">4 days [4]</span>
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* Deck Navigation & Utility Controls */}
      <div className="mx-auto flex max-w-2xl flex-col items-center justify-between gap-3 pt-2 sm:flex-row">
        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-start">
          <Button variant="outline" size="sm" disabled={currentIndex === 0} className="gap-1.5" onClick={handlePrev}>
            <ChevronLeft className="size-4" />
            <span>Previous</span>
          </Button>

          <Button variant="outline" size="sm" className="gap-1.5" onClick={handleShuffle}>
            <Shuffle className="size-3.5" />
            <span>Shuffle</span>
          </Button>
        </div>

        <div className="flex w-full items-center justify-between gap-2 sm:w-auto sm:justify-end">
          <Button variant="secondary" size="sm" className="gap-1.5" onClick={toggleFlip}>
            <RotateCw className="size-3.5" />
            <span>{isFlipped ? 'Show Question' : 'Flip Card'}</span>
          </Button>

          <Button
            variant="default"
            size="sm"
            disabled={currentIndex === totalCards - 1}
            className="gap-1.5"
            onClick={handleNext}
          >
            <span>Next</span>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      {/* Keyboard Shortcuts Legend Footer */}
      <div className="mx-auto max-w-2xl pt-2 text-center">
        <p className="text-muted-foreground font-mono text-xs">
          Shortcuts: <span className="text-foreground font-semibold">← / →</span> Navigate ·{' '}
          <span className="text-foreground font-semibold">Space</span> Flip ·{' '}
          <span className="text-foreground font-semibold">H</span> Hint ·{' '}
          <span className="text-foreground font-semibold">1-4</span> Rate Interval
        </p>
      </div>
    </div>
  )
}
