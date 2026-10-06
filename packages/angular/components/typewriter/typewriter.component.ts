import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  booleanAttribute,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

/** Inputs that restart the sequence (React's effect dependency list). */
const SEQUENCE_INPUTS = ['phrases', 'typingSpeed', 'deletingSpeed', 'pause', 'startDelay', 'loop']

/**
 * Types text character by character with a blinking caret (React `Typewriter`). A list of
 * phrases cycles type -> pause -> delete -> next; `loop=false` stops after the last phrase
 * (caret keeps blinking). Screen readers get the full text once via an sr-only copy.
 * Starts empty, so SSR markup and hydration match; prefers-reduced-motion renders the first
 * phrase in full with a static caret.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-typewriter, [ui-typewriter]',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'typewriter',
    '[class]': 'hostClass',
  },
  template: `<span class="sr-only">{{ srText }}</span
    ><span aria-hidden="true" class="whitespace-pre-wrap"
      ><span>{{ text() }}</span>
      @if (showCaret) {
        <span [class]="caretClass"></span>
      }
    </span>`,
})
export class UiTypewriterComponent implements OnChanges, OnDestroy {
  /** A single phrase or a list cycled type -> pause -> delete -> next. */
  @Input({ required: true }) phrases: string | string[] = ''
  /** Milliseconds per typed character. */
  @Input() typingSpeed = 45
  /** Milliseconds per deleted character. */
  @Input() deletingSpeed = 25
  /** Milliseconds a completed phrase holds before deleting. */
  @Input() pause = 1600
  /** Milliseconds before the first character types. */
  @Input() startDelay = 0
  /** When false, stops after fully typing the last phrase (caret keeps blinking). */
  @Input({ transform: booleanAttribute }) loop = true
  @Input({ transform: booleanAttribute }) showCaret = true
  @Input('class') className?: string

  // Signals: written from timers, which never schedule change detection in zoneless apps.
  readonly text = signal('')
  readonly reduced = signal(false)
  private timer?: ReturnType<typeof setTimeout>

  get list(): string[] {
    return Array.isArray(this.phrases) ? this.phrases : [this.phrases]
  }

  get srText(): string {
    return this.list.join('. ')
  }

  get hostClass(): string {
    return cn(this.className)
  }

  get caretClass(): string {
    return cn('inline-block h-[1em] w-[0.5ch] bg-current align-baseline', !this.reduced() && 'animate-caret-blink')
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (SEQUENCE_INPUTS.some((k) => k in changes)) this.start()
  }

  ngOnDestroy(): void {
    this.clear()
  }

  private clear(): void {
    if (this.timer !== undefined) clearTimeout(this.timer)
    this.timer = undefined
  }

  private schedule(fn: () => void, delay: number): void {
    this.clear()
    this.timer = setTimeout(() => {
      this.timer = undefined
      fn()
    }, delay)
  }

  private start(): void {
    this.clear()
    if (typeof window === 'undefined') return
    const list = this.list
    const isReduced = !!window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    this.reduced.set(isReduced)
    if (isReduced) {
      // Skip the animation entirely: render the phrase in full with a static caret.
      this.text.set(list[0] ?? '')
      return
    }

    const { typingSpeed, deletingSpeed, pause, loop } = this
    let index = 0
    let chars = 0
    let deleting = false

    const step = (): void => {
      const current = list[index] ?? ''
      if (!deleting) {
        chars += 1
        this.text.set(current.slice(0, chars))
        if (chars < current.length) {
          this.schedule(step, typingSpeed)
        } else if (loop || index < list.length - 1) {
          this.schedule(() => {
            deleting = true
            step()
          }, pause)
        }
        // loop=false on the last phrase: stop here; the caret keeps blinking.
      } else {
        chars -= 1
        this.text.set(current.slice(0, chars))
        if (chars > 0) {
          this.schedule(step, deletingSpeed)
        } else {
          deleting = false
          index = (index + 1) % list.length
          step()
        }
      }
    }

    if (this.startDelay > 0) this.schedule(step, this.startDelay)
    else step()
  }
}
