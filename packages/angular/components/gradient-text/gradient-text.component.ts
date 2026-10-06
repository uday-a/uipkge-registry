import { Component, Input, booleanAttribute, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import {
  gradientTextPresets,
  gradientTextVariants,
  type GradientPreset,
  type GradientTextVariants,
} from './gradient-text.variants'

// Copied verbatim from the React gradient-text (injected there as a global <style>). Unscoped
// (ViewEncapsulation.None) so it reaches the host and projected content; Angular adds it once.
const GRADIENT_TEXT_MOTION_STYLES = `
@media (prefers-reduced-motion: no-preference) {
  @keyframes gradient-text-shift {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
}
`

export type GradientDirection =
  | 'to right'
  | 'to left'
  | 'to top'
  | 'to bottom'
  | 'to top right'
  | 'to top left'
  | 'to bottom right'
  | 'to bottom left'

/**
 * Applies a CSS gradient as text color via background-clip: text (React `GradientText`).
 * React's `as` / `asChild` map to the attribute form: `<h1 ui-gradient-text>` renders the
 * gradient on that element. Consumer `[style]` bindings on the host merge with the gradient
 * styles, like React's `style` spread.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-gradient-text, [ui-gradient-text]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [GRADIENT_TEXT_MOTION_STYLES],
  host: {
    'data-uipkge': '',
    'data-slot': 'gradient-text',
    '[attr.data-preset]': 'preset ?? null',
    '[attr.data-animated]': 'animated ? "true" : null',
    '[style.background-image]': 'gradientValue',
    '[style.background-clip]': '"text"',
    '[style.-webkit-background-clip]': '"text"',
    '[style.color]': '"transparent"',
    '[style.-webkit-text-fill-color]': '"transparent"',
    '[style.background-size]': 'animated ? "200% 200%" : null',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiGradientTextComponent {
  @Input() preset?: GradientPreset
  @Input() from?: string
  @Input() to?: string
  @Input() direction: GradientDirection = 'to right'
  @Input() gradient?: string
  @Input({ transform: booleanAttribute }) animated = false
  @Input() animationDuration = 4
  @Input('class') className?: string

  get gradientValue(): string {
    if (this.gradient) return this.gradient
    if (this.preset) return gradientTextPresets[this.preset] ?? ''
    if (this.from && this.to) return `linear-gradient(${this.direction}, ${this.from}, ${this.to})`
    return 'linear-gradient(to right, var(--primary), var(--primary))'
  }

  get hostClass(): string {
    return cn(
      gradientTextVariants({} as GradientTextVariants),
      this.animated ? `motion-safe:animate-[gradient-text-shift_${this.animationDuration}s_ease_infinite]` : '',
      this.className,
    )
  }
}

export { gradientTextPresets, gradientTextVariants, type GradientPreset, type GradientTextVariants }
