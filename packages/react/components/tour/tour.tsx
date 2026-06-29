'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export type TourTarget = string | (() => HTMLElement | null) | HTMLElement | null

export interface TargetRect {
  x: number
  y: number
  width: number
  height: number
}

export interface TourStep {
  target?: TourTarget
  title: string
  description?: string
  cover?: string
  mask?: boolean
  nextButtonText?: string
  prevButtonText?: string
  finishButtonText?: string
}

// ── useTourTarget ────────────────────────────────────────────────────────────
// Measures the current step's target element (getBoundingClientRect) and keeps
// the rect in sync on scroll / resize / element resize. `attach` is called
// imperatively when the step or open state changes; `measure` re-reads the rect.
function useTourTarget(target: TourTarget | undefined) {
  const [rect, setRect] = React.useState<TargetRect | null>(null)
  const elementRef = React.useRef<HTMLElement | null>(null)
  const resizeObsRef = React.useRef<ResizeObserver | null>(null)
  const rafRef = React.useRef(0)
  const targetRef = React.useRef(target)
  targetRef.current = target

  const resolve = React.useCallback((): HTMLElement | null => {
    const t = targetRef.current
    if (!t) return null
    if (typeof t === 'string') return document.querySelector(t) as HTMLElement | null
    if (typeof t === 'function') return t()
    return t
  }, [])

  const measure = React.useCallback(() => {
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(() => {
      if (!elementRef.current) {
        setRect(null)
        return
      }
      const r = elementRef.current.getBoundingClientRect()
      setRect({ x: r.left, y: r.top, width: r.width, height: r.height })
    })
  }, [])

  const detach = React.useCallback(() => {
    resizeObsRef.current?.disconnect()
    resizeObsRef.current = null
    window.removeEventListener('scroll', measure, true)
    window.removeEventListener('resize', measure)
    cancelAnimationFrame(rafRef.current)
    elementRef.current = null
  }, [measure])

  const attach = React.useCallback(() => {
    detach()
    elementRef.current = resolve()
    if (!elementRef.current) {
      setRect(null)
      return
    }
    measure()
    if (typeof ResizeObserver !== 'undefined') {
      resizeObsRef.current = new ResizeObserver(measure)
      resizeObsRef.current.observe(elementRef.current)
      resizeObsRef.current.observe(document.documentElement)
    }
    window.addEventListener('scroll', measure, { passive: true, capture: true })
    window.addEventListener('resize', measure, { passive: true })
  }, [detach, measure, resolve])

  React.useEffect(() => detach, [detach])

  return { rect, attach, detach, measure }
}

function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

// ── TourMask ─────────────────────────────────────────────────────────────────
interface TourMaskProps {
  rect: TargetRect | null
  zIndex: number
  opacity?: number
  padding?: number
  radius?: number
}

function TourMask({ rect, zIndex, opacity = 0.5, padding = 4, radius = 6 }: TourMaskProps) {
  // Unique mask id so multiple open tours (or other SVG masks on the page) never collide.
  const reactId = React.useId()
  const maskId = `uipkge-tour-mask-${reactId.replace(/:/g, '')}`
  const reduceMotion = prefersReducedMotion()

  const cutout = rect
    ? {
        x: rect.x - padding,
        y: rect.y - padding,
        w: rect.width + padding * 2,
        h: rect.height + padding * 2,
      }
    : null

  /**
   * Clip-path leaves a hole over the target so pointer events pass through to the
   * highlighted element. SVG mask alone does not punch a hit-test hole.
   */
  const hitClipPath = cutout
    ? `polygon(evenodd, 0% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, ${cutout.x}px ${cutout.y}px, ${cutout.x}px ${cutout.y + cutout.h}px, ${cutout.x + cutout.w}px ${cutout.y + cutout.h}px, ${cutout.x + cutout.w}px ${cutout.y}px, ${cutout.x}px ${cutout.y}px)`
    : undefined

  return (
    <>
      {/* Visual dim with rounded cutout (decorative only — no hit testing). */}
      <svg
        className="pointer-events-none fixed inset-0"
        style={{ zIndex }}
        width="100%"
        height="100%"
        aria-hidden="true"
      >
        <defs>
          <mask id={maskId}>
            <rect width="100%" height="100%" fill="white" />
            {cutout && <rect x={cutout.x} y={cutout.y} width={cutout.w} height={cutout.h} rx={radius} fill="black" />}
          </mask>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`rgba(0, 0, 0, ${opacity})`}
          mask={`url(#${maskId})`}
          style={reduceMotion ? undefined : { transition: 'all 200ms ease' }}
        />
      </svg>
      {/* Hit layer: blocks clicks outside the cutout; hole is click-through. */}
      <div
        className="fixed inset-0"
        aria-hidden="true"
        style={{
          zIndex,
          clipPath: hitClipPath,
          background: 'transparent',
        }}
      />
    </>
  )
}

// ── TourCard ─────────────────────────────────────────────────────────────────
const FOCUSABLE =
  'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

interface TourCardProps {
  title: string
  description?: string
  cover?: string
  rect: TargetRect | null
  total: number
  current: number
  prevText?: string
  nextText?: string
  finishText?: string
  type?: 'default' | 'primary'
  zIndex: number
  autofocus?: boolean
  onPrev: () => void
  onNext: () => void
  onFinish: () => void
  onSkip: () => void
}

function TourCard({
  title,
  description,
  cover,
  rect,
  total,
  current,
  prevText = 'Previous',
  nextText = 'Next',
  finishText = 'Finish',
  type = 'default',
  zIndex,
  autofocus = false,
  onPrev,
  onNext,
  onFinish,
  onSkip,
}: TourCardProps) {
  const isLast = current === total - 1
  const isFirst = current === 0
  const titleId = React.useId()
  const descriptionId = React.useId()
  const cardRef = React.useRef<HTMLDivElement>(null)
  /** Measured card height used for placement; falls back to estimate until laid out. */
  const [measuredHeight, setMeasuredHeight] = React.useState(0)

  // Move focus into the card when opened or when the step changes.
  React.useEffect(() => {
    if (!autofocus) return
    cardRef.current?.focus()
  }, [autofocus, current, title])

  // Reposition from actual card height after open / step content change.
  React.useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const measure = () => setMeasuredHeight(el.getBoundingClientRect().height)
    measure()
    if (typeof ResizeObserver === 'undefined') return
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [current, title, description, cover])

  /** Keep Tab cycling inside the dialog while aria-modal is asserted. */
  function onKeydown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab' || !cardRef.current) return
    // Prefer getClientRects over offsetParent — fixed-position descendants report null offsetParent.
    const list = Array.from(cardRef.current.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.getClientRects().length > 0,
    )
    if (list.length === 0) return
    const first = list[0]!
    const last = list[list.length - 1]!
    if (e.shiftKey) {
      if (document.activeElement === first || document.activeElement === cardRef.current) {
        e.preventDefault()
        last.focus()
      }
    } else if (document.activeElement === last) {
      e.preventDefault()
      first.focus()
    }
  }

  const cardStyle = React.useMemo<React.CSSProperties>(() => {
    const cardWidth = 320
    const margin = 12
    const edgePadding = 8
    // Prefer measured height; estimate only before first layout (cover makes card taller).
    const cardHeight = measuredHeight || (cover ? 320 : 200)
    if (!rect) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: `${cardWidth}px`,
        zIndex: zIndex + 1,
      }
    }
    const { x, y, height } = rect
    const viewportH = typeof window !== 'undefined' ? window.innerHeight : 768
    const viewportW = typeof window !== 'undefined' ? window.innerWidth : 1024
    const placeBelow = y + height + margin + cardHeight < viewportH
    const top = placeBelow ? y + height + margin : Math.max(edgePadding, y - margin - cardHeight)
    let left = x
    if (left + cardWidth > viewportW - edgePadding) {
      left = viewportW - cardWidth - edgePadding
    }
    if (left < edgePadding) left = edgePadding
    return {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      width: `${cardWidth}px`,
      zIndex: zIndex + 1,
    }
  }, [rect, zIndex, cover, measuredHeight])

  return (
    <div
      ref={cardRef}
      data-slot="tour-card"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      tabIndex={-1}
      className={cn(
        'relative space-y-3 rounded-lg border p-4 shadow-lg outline-none',
        type === 'primary' ? 'bg-primary text-primary-foreground border-primary' : 'bg-popover text-popover-foreground',
      )}
      style={cardStyle}
      onKeyDown={onKeydown}
    >
      <button
        type="button"
        className="hover:bg-foreground/10 focus-visible:ring-ring absolute top-2 right-2 inline-flex size-6 items-center justify-center rounded focus-visible:ring-2 focus-visible:outline-none"
        aria-label="Close tour"
        onClick={onSkip}
      >
        <X className="size-4" aria-hidden="true" />
      </button>

      {cover && <img src={cover} alt="" className="w-full rounded-md" />}

      <div>
        <div id={titleId} className="pr-6 font-semibold">
          {title}
        </div>
        {description && (
          <div id={descriptionId} className="mt-1 text-sm opacity-90">
            {description}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-2 pt-2">
        <div className="text-xs tabular-nums opacity-70" aria-live="polite" aria-atomic="true">
          {current + 1} / {total}
        </div>
        <div className="flex gap-2">
          {!isFirst && (
            <Button size="sm" variant={type === 'primary' ? 'secondary' : 'outline'} onClick={onPrev}>
              {prevText}
            </Button>
          )}
          {!isLast ? (
            <Button size="sm" variant={type === 'primary' ? 'secondary' : 'default'} onClick={onNext}>
              {nextText}
            </Button>
          ) : (
            <Button size="sm" variant={type === 'primary' ? 'secondary' : 'default'} onClick={onFinish}>
              {finishText}
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Tour ─────────────────────────────────────────────────────────────────────
export interface TourProps {
  open?: boolean
  current?: number
  steps: TourStep[]
  mask?: boolean
  type?: 'default' | 'primary'
  zIndex?: number
  /** Controlled open updates — mirrors Vue's `update:open`. */
  onOpenChange?: (open: boolean) => void
  /** Controlled current-step updates — mirrors Vue's `update:current`. */
  onCurrentChange?: (current: number) => void
  /** Fired whenever the active step changes. */
  onChange?: (current: number) => void
  /** Fired when the user presses Finish on the last step. */
  onFinish?: () => void
  /** Fired when the user dismisses the tour (close button / Escape). */
  onClose?: () => void
}

function Tour({
  open = false,
  current = 0,
  steps,
  mask = true,
  type = 'default',
  zIndex = 1000,
  onOpenChange,
  onCurrentChange,
  onChange,
  onFinish,
  onClose,
}: TourProps) {
  const [stepIndex, setStepIndex] = React.useState(current)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)
  const wasOpenRef = React.useRef(false)

  // Mirror the `current` prop into local state (Vue `watch(() => props.current)`).
  React.useEffect(() => {
    setStepIndex(current)
  }, [current])

  const currentStep = steps[stepIndex] ?? null

  const { rect, attach, detach, measure } = useTourTarget(currentStep?.target)

  // Attach + scroll the target into view on open / step change; detach + restore
  // focus when the tour closes.
  React.useEffect(() => {
    if (!open) {
      detach()
      if (wasOpenRef.current) {
        previousFocusRef.current?.focus?.()
        previousFocusRef.current = null
      }
      wasOpenRef.current = false
      return
    }
    if (!wasOpenRef.current) {
      previousFocusRef.current = (document.activeElement as HTMLElement | null) ?? null
      wasOpenRef.current = true
    }
    attach()
    const t = currentStep?.target
    if (t) {
      const el =
        typeof t === 'string' ? (document.querySelector(t) as HTMLElement | null) : typeof t === 'function' ? t() : t
      const reduce = prefersReducedMotion()
      el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
      // Re-measure after smooth scroll settles; skip long wait when reduce.
      const id = setTimeout(measure, reduce ? 0 : 320)
      return () => clearTimeout(id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, stepIndex])

  const setStep = React.useCallback(
    (i: number) => {
      setStepIndex(i)
      onCurrentChange?.(i)
      onChange?.(i)
    },
    [onCurrentChange, onChange],
  )

  const next = React.useCallback(() => {
    if (stepIndex < steps.length - 1) setStep(stepIndex + 1)
  }, [stepIndex, steps.length, setStep])

  const prev = React.useCallback(() => {
    if (stepIndex > 0) setStep(stepIndex - 1)
  }, [stepIndex, setStep])

  const finish = React.useCallback(() => {
    onFinish?.()
    onOpenChange?.(false)
  }, [onFinish, onOpenChange])

  const skip = React.useCallback(() => {
    onClose?.()
    onOpenChange?.(false)
  }, [onClose, onOpenChange])

  // Escape closes the tour while open.
  React.useEffect(() => {
    if (typeof document === 'undefined') return
    if (!open) return
    function onKeydown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        e.preventDefault()
        skip()
      }
    }
    document.addEventListener('keydown', onKeydown)
    return () => document.removeEventListener('keydown', onKeydown)
  }, [open, skip])

  const showMask = currentStep?.mask !== undefined ? currentStep.mask : mask

  if (typeof document === 'undefined') return null
  if (!open || !currentStep) return null

  return createPortal(
    <>
      {showMask && <TourMask rect={rect} zIndex={zIndex} />}
      <TourCard
        title={currentStep.title}
        description={currentStep.description}
        cover={currentStep.cover}
        rect={rect}
        total={steps.length}
        current={stepIndex}
        prevText={currentStep.prevButtonText}
        nextText={currentStep.nextButtonText}
        finishText={currentStep.finishButtonText}
        type={type}
        zIndex={zIndex}
        autofocus
        onPrev={prev}
        onNext={next}
        onFinish={finish}
        onSkip={skip}
      />
    </>,
    document.body,
  )
}

export { Tour }
