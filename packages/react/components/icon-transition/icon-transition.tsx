'use client'

import * as React from 'react'

// Self-contained icon-swap control. Click runs an optional async `action`,
// then flips from `defaultIcon` to `activeIcon` with a spring pop. By default
// it auto-reverts after 1500ms; pass `resetAfter={0}` to keep the active
// icon, then call `ref.current.reset()` manually.
//
// Two operating modes:
//   1. Self-managed (most common): pass `defaultIcon`, `activeIcon`, and
//      either `action` or just listen to `onActivate`. The component runs
//      the action, manages its own `active` state, and auto-resets.
//   2. Externally controlled: pass `active={boolean}` and the component
//      will mirror that prop, ignoring its internal flag.
//
// Renders as a <button> by default. Pass `as="span"` for a non-interactive
// icon (e.g. inside a parent button) — in that mode the parent is responsible
// for triggering `trigger()` via the exposed ref.

type IconComponent = React.ComponentType<{ className?: string; 'aria-hidden'?: boolean | 'true' | 'false' }>

export interface IconTransitionProps {
  defaultIcon: IconComponent
  activeIcon: IconComponent
  /** Tailwind size/color applied to the icons. */
  iconClass?: string
  /** Async work executed on click before the icon flips. Return `false` to skip the flip. */
  action?: () => boolean | void | Promise<boolean | void>
  /** ms before reverting to defaultIcon. Set to `0` (or null) to stay active. */
  resetAfter?: number | null
  /** Pop animation duration in ms (also scales the leave fade). */
  duration?: number
  /** aria-label shown in default state. */
  label?: string
  /** aria-label shown after activation; falls back to `label`. */
  activeLabel?: string
  /** Tailwind class applied while active (e.g. "text-success"). */
  activeClass?: string
  /** Render element. `button` adds click handler + focus styling; `span` is purely visual. */
  as?: 'button' | 'span'
  /** External control. When provided, this prop wins over internal state. */
  active?: boolean
  className?: string
  onActivate?: () => void
  onReset?: () => void
}

export interface IconTransitionHandle {
  trigger: () => Promise<void>
  reset: () => void
}

// Scoped styles injected once. Mirrors the Vue SFC's scoped <style> block 1:1
// (pop on enter, fade on leave, reduced-motion guard). Scoped to the
// `.icon-transition` ancestor so the keyframes don't leak.
const STYLE_ID = 'uipkge-icon-transition-styles'
const STYLES = `
.icon-transition .icon-transition-slot {
  grid-area: 1 / 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.icon-transition .icon-transition-enter-active,
.icon-transition .icon-transition-leave-active {
  transform-origin: center;
}
.icon-transition .icon-transition-enter-active {
  animation: icon-transition-pop var(--it-duration, 240ms) cubic-bezier(0.34, 1.56, 0.64, 1) both;
}
.icon-transition .icon-transition-leave-active {
  animation: icon-transition-fade calc(var(--it-duration, 240ms) * 0.66) ease-in both;
}
@keyframes icon-transition-pop {
  0% {
    opacity: 0;
    transform: scale(0.5) rotate(-12deg);
  }
  60% {
    opacity: 1;
    transform: scale(1.18) rotate(2deg);
  }
  100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
}
@keyframes icon-transition-fade {
  to {
    opacity: 0;
    transform: scale(0.85);
  }
}
@media (prefers-reduced-motion: reduce) {
  .icon-transition .icon-transition-enter-active,
  .icon-transition .icon-transition-leave-active {
    animation-duration: 0ms !important;
  }
}
`

function useInjectedStyles() {
  React.useEffect(() => {
    if (typeof document === 'undefined') return
    if (document.getElementById(STYLE_ID)) return
    const el = document.createElement('style')
    el.id = STYLE_ID
    el.textContent = STYLES
    document.head.appendChild(el)
  }, [])
}

const IconTransition = React.forwardRef<IconTransitionHandle, IconTransitionProps>(function IconTransition(
  {
    defaultIcon: DefaultIcon,
    activeIcon: ActiveIcon,
    iconClass = 'size-4',
    action,
    resetAfter = 1500,
    duration = 240,
    label,
    activeLabel,
    activeClass = 'text-success',
    as = 'button',
    active,
    className,
    onActivate,
    onReset,
  },
  ref,
) {
  useInjectedStyles()

  const [internalActive, setInternalActive] = React.useState(false)
  const isActive = active !== undefined ? active : internalActive

  // Track the previous active state so we can render an outgoing (leaving)
  // icon alongside the incoming (entering) one for the cross-fade — Vue's
  // <Transition> does this for free; React needs us to hold the prior key.
  const [prevActive, setPrevActive] = React.useState<boolean | null>(null)
  const prevIsActiveRef = React.useRef(isActive)
  React.useEffect(() => {
    if (prevIsActiveRef.current !== isActive) {
      setPrevActive(prevIsActiveRef.current)
      prevIsActiveRef.current = isActive
    }
  }, [isActive])

  // Drop the leave slot after the animation finishes so it doesn't linger
  // in the DOM (Vue's <Transition> unmounts leave elements automatically).
  React.useEffect(() => {
    if (prevActive === null || prevActive === isActive) return
    const t = setTimeout(() => setPrevActive(null), duration)
    return () => clearTimeout(t)
  }, [prevActive, isActive, duration])

  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }, [])

  const reset = React.useCallback(() => {
    setInternalActive(false)
    onReset?.()
    clearTimer()
  }, [onReset, clearTimer])

  const trigger = React.useCallback(async () => {
    if (action) {
      const result = await action()
      if (result === false) return
    }
    setInternalActive(true)
    onActivate?.()
    clearTimer()
    if (resetAfter && resetAfter > 0) {
      timerRef.current = setTimeout(reset, resetAfter)
    }
  }, [action, onActivate, clearTimer, resetAfter, reset])

  React.useImperativeHandle(ref, () => ({ trigger, reset }), [trigger, reset])

  React.useEffect(() => clearTimer, [clearTimer])

  const Comp = as

  const renderSlot = (slotActive: boolean, phase: 'enter' | 'leave', key: string) => {
    const SlotIcon = slotActive ? ActiveIcon : DefaultIcon
    const phaseClass = phase === 'enter' ? 'icon-transition-enter-active' : 'icon-transition-leave-active'
    return (
      <span key={key} className={`icon-transition-slot ${phaseClass}`}>
        <SlotIcon className={iconClass} aria-hidden="true" />
      </span>
    )
  }

  return (
    <Comp
      data-uipkge=""
      data-slot="icon-transition"
      {...(as === 'button' ? { type: 'button' as const } : {})}
      aria-label={isActive ? (activeLabel ?? label) : label}
      aria-live={isActive ? 'polite' : undefined}
      className={[
        'icon-transition focus-visible:ring-ring inline-grid place-items-center transition-colors focus-visible:ring-2 focus-visible:outline-none',
        isActive ? activeClass : '',
        className ?? '',
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ ['--it-duration' as string]: `${duration}ms` }}
      onClick={as === 'button' ? () => void trigger() : undefined}
    >
      {prevActive !== null && prevActive !== isActive && renderSlot(prevActive, 'leave', `leave-${prevActive}`)}
      {renderSlot(isActive, 'enter', `enter-${isActive}`)}
    </Comp>
  )
})

export { IconTransition }
