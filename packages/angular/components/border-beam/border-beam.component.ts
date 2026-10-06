import { Component, Input, OnDestroy, OnInit, booleanAttribute, signal, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

/**
 * Rotating conic light beam that traces the border ring of its parent (React `BorderBeam`).
 * Place inside a `relative` parent; the overlay is absolutely positioned, pointer-events-none
 * and masked down to a ring of `size` px. Keyframes and the `--uipkge-border-angle` @property
 * ship in the canonical tailwind tokens. prefers-reduced-motion renders a static beam.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-border-beam, [ui-border-beam]',
  standalone: true,
  host: {
    'data-uipkge': '',
    'data-slot': 'border-beam',
    'aria-hidden': 'true',
    '[class]': 'hostClass',
    '[style]': 'beamStyle',
  },
  template: ``,
})
export class UiBorderBeamComponent implements OnInit, OnDestroy {
  /** Ring thickness in px. */
  @Input() size = 2
  /** Seconds per revolution. */
  @Input() duration = 6
  /** Seconds; negative values offset the beam's starting position around the ring. */
  @Input() delay = 0
  /** Any CSS color for the beam highlight. */
  @Input() color = 'var(--primary)'
  /** Freeze the beam in place (animation-play-state: paused). */
  @Input({ transform: booleanAttribute }) paused = false
  @Input('class') className?: string

  // Signal: flipped by a media-query listener, outside any template event.
  private readonly reducedMotion = signal(false)
  private query?: MediaQueryList
  private readonly onChange = (event: MediaQueryListEvent) => this.reducedMotion.set(event.matches)

  ngOnInit(): void {
    if (typeof window === 'undefined' || !window.matchMedia) return
    this.query = window.matchMedia('(prefers-reduced-motion: reduce)')
    this.reducedMotion.set(this.query.matches)
    this.query.addEventListener?.('change', this.onChange)
  }

  ngOnDestroy(): void {
    this.query?.removeEventListener?.('change', this.onChange)
  }

  get hostClass(): string {
    return cn('pointer-events-none absolute inset-0 rounded-[inherit]', this.className)
  }

  get beamStyle(): Record<string, string | null> {
    const reduced = this.reducedMotion()
    const mask = 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)'
    return {
      padding: `${this.size}px`,
      background: reduced
        ? `conic-gradient(from 45deg, transparent 0deg, transparent 290deg, ${this.color} 330deg, transparent 360deg)`
        : `conic-gradient(from var(--uipkge-border-angle), transparent 0deg, transparent 290deg, ${this.color} 330deg, transparent 360deg)`,
      animation: reduced ? 'none' : `uipkge-border-beam ${this.duration}s linear infinite ${this.delay}s`,
      'animation-play-state': !reduced && this.paused ? 'paused' : null,
      '-webkit-mask': mask,
      '-webkit-mask-composite': 'xor',
      mask,
      'mask-composite': 'exclude',
    }
  }
}
