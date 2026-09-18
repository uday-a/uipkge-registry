'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextRevealProps extends React.HTMLAttributes<HTMLElement> {
  text: string
  as?: string
  mode?: 'words' | 'chars'
  /** ms between segment starts */
  stagger?: number
  /** ms per segment transition */
  duration?: number
  /** ms before the first segment starts */
  delay?: number
  blur?: boolean
  /** reveal only on first intersection; false re-hides when scrolled away */
  once?: boolean
}

interface Segment {
  text: string
  space: boolean
}

const STYLE_ID = 'text-reveal-motion-styles'
const STYLE_CONTENT = `
[data-slot='text-reveal'] .text-reveal-seg {
  opacity: 0;
  transform: translateY(0.5em);
  transition-property: opacity, transform, filter;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
}
[data-slot='text-reveal'].is-revealed .text-reveal-seg {
  opacity: 1;
  transform: translateY(0);
}
[data-slot='text-reveal'] .text-reveal-blur {
  filter: blur(8px);
}
[data-slot='text-reveal'].is-revealed .text-reveal-blur {
  filter: blur(0);
}
@media (prefers-reduced-motion: reduce) {
  [data-slot='text-reveal'] .text-reveal-seg {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    transition: none !important;
  }
}
`

function useInjectedStyles() {
  React.useLayoutEffect(() => {
    if (typeof document === 'undefined') return
    let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null
    if (!el) {
      el = document.createElement('style')
      el.id = STYLE_ID
      document.head.appendChild(el)
    }
    if (el.textContent !== STYLE_CONTENT) el.textContent = STYLE_CONTENT
  }, [])
}

function buildSegments(text: string, mode: 'words' | 'chars'): Segment[] {
  const source = text.replace(/\s+/g, ' ').trim()
  if (mode === 'chars') {
    return Array.from(source).map((ch) => ({ text: ch, space: ch === ' ' }))
  }
  const words = source.split(' ')
  return words.flatMap((word, i) =>
    i < words.length - 1
      ? [
          { text: word, space: false },
          { text: '', space: true },
        ]
      : [{ text: word, space: false }],
  )
}

const TextReveal = React.forwardRef<HTMLElement, TextRevealProps>(
  (
    {
      text,
      as = 'span',
      mode = 'words',
      stagger = 40,
      duration = 600,
      delay = 0,
      blur = true,
      once = true,
      className,
      ...props
    },
    ref,
  ) => {
    useInjectedStyles()

    const [revealed, setRevealed] = React.useState(false)
    const rootRef = React.useRef<HTMLElement | null>(null)
    const observerRef = React.useRef<IntersectionObserver | null>(null)

    const segments = React.useMemo(() => buildSegments(text, mode), [text, mode])

    React.useEffect(() => {
      const root = rootRef.current
      if (!root) return

      function cleanup() {
        observerRef.current?.disconnect()
        observerRef.current = null
      }

      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (reduce || typeof IntersectionObserver === 'undefined') {
        setRevealed(true)
        return cleanup
      }

      const observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.isIntersecting) {
              setRevealed(true)
              if (once) cleanup()
            } else if (!once) {
              setRevealed(false)
            }
          }
        },
        { threshold: 0.2 },
      )
      observerRef.current = observer
      observer.observe(root)
      return cleanup
    }, [once])

    const Tag = as as React.ElementType

    return (
      <Tag
        ref={ref ?? rootRef}
        data-uipkge=""
        data-slot="text-reveal"
        aria-label={text}
        aria-hidden={undefined}
        className={cn('inline-block', revealed && 'is-revealed', className)}
        {...props}
      >
        {segments.map((seg, i) =>
          seg.space ? (
            <span key={`space-${i}`} aria-hidden="true">
              &nbsp;
            </span>
          ) : (
            <span
              key={`${seg.text}-${i}`}
              aria-hidden="true"
              data-slot="text-reveal-segment"
              className={cn('text-reveal-seg inline-block will-change-transform', blur && 'text-reveal-blur')}
              style={{
                transitionDelay: `${delay + i * stagger}ms`,
                transitionDuration: `${duration}ms`,
              }}
            >
              {seg.text}
            </span>
          ),
        )}
      </Tag>
    )
  },
)
TextReveal.displayName = 'TextReveal'

export { TextReveal }
