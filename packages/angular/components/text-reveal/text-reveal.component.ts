import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

export interface TextSegment {
  text: string
  space: boolean
}

// Copied verbatim from the React TextReveal (injected there into <head>). Unscoped
// (ViewEncapsulation.None) so the [data-slot] selectors reach the rendered segments.
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

/** Same segmentation as React: whitespace collapsed, words separated by explicit space segments. */
export function buildSegments(text: string, mode: 'words' | 'chars'): TextSegment[] {
  const source = text.replace(/\s+/g, ' ').trim()
  if (mode === 'chars') return Array.from(source).map((ch) => ({ text: ch, space: ch === ' ' }))
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

/**
 * Scroll-triggered staggered text entrance (React `TextReveal`). Splits `text` into word or
 * character segments that fade / rise (and un-blur) in sequence once the element is 20% in
 * view. React's `as` maps to the attribute form: `<h2 ui-text-reveal text="…">`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-text-reveal, [ui-text-reveal]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [STYLE_CONTENT],
  host: {
    'data-uipkge': '',
    'data-slot': 'text-reveal',
    '[attr.aria-label]': 'text',
    '[class]': 'hostClass',
  },
  template: `
    @for (seg of segments; track $index; let i = $index) {
      @if (seg.space) {
        <span aria-hidden="true">&nbsp;</span>
      } @else {
        <span
          aria-hidden="true"
          data-slot="text-reveal-segment"
          [class]="segmentClass"
          [style.transition-delay]="delay + i * stagger + 'ms'"
          [style.transition-duration]="duration + 'ms'"
          >{{ seg.text }}</span
        >
      }
    }
  `,
})
export class UiTextRevealComponent implements OnInit, OnDestroy {
  @Input({ required: true }) text = ''
  @Input() mode: 'words' | 'chars' = 'words'
  /** ms between segment starts */
  @Input() stagger = 40
  /** ms per segment transition */
  @Input() duration = 600
  /** ms before the first segment starts */
  @Input() delay = 0
  @Input({ transform: booleanAttribute }) blur = true
  /** reveal only on first intersection; false re-hides when scrolled away */
  @Input({ transform: booleanAttribute }) once = true
  @Input('class') className?: string

  readonly revealed = signal(false)
  private readonly host: ElementRef<HTMLElement> | null = null
  private observer: IntersectionObserver | null = null

  constructor() {
    try {
      this.host = inject<ElementRef<HTMLElement>>(ElementRef, { optional: true })
    } catch {}
  }

  get segments(): TextSegment[] {
    return buildSegments(this.text, this.mode)
  }

  get hostClass(): string {
    return cn('inline-block', this.revealed() && 'is-revealed', this.className)
  }

  get segmentClass(): string {
    return `text-reveal-seg inline-block will-change-transform ${this.blur ? 'text-reveal-blur' : ''}`.trim()
  }

  ngOnInit(): void {
    if (typeof window === 'undefined') return
    const reduce = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce || typeof IntersectionObserver === 'undefined') {
      this.revealed.set(true)
      return
    }
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            this.revealed.set(true)
            if (this.once) this.disconnect()
          } else if (!this.once) {
            this.revealed.set(false)
          }
        }
      },
      { threshold: 0.2 },
    )
    if (this.host) this.observer.observe(this.host.nativeElement)
  }

  ngOnDestroy(): void {
    this.disconnect()
  }

  private disconnect(): void {
    this.observer?.disconnect()
    this.observer = null
  }
}
