import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

export type ProgressState = 'indeterminate' | 'complete' | 'loading'

/**
 * Angular port of UIPKGE Progress (React `Progress` = Radix `Progress.Root` + `Indicator`).
 * The host is the progressbar root (role, aria-value*, aria-valuetext, data-state /
 * data-value / data-max like Radix); the inner indicator is translated by the clamped value.
 * Out-of-range values clamp to [0, 100] so the indicator cannot overshoot the track, and an
 * unlabelled bar falls back to aria-label="Progress".
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-progress, [ui-progress]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"progress"',
    '[attr.role]': '"progressbar"',
    '[attr.aria-label]': 'resolvedAriaLabel',
    '[attr.aria-labelledby]': 'ariaLabelledby ?? null',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': 'max',
    '[attr.aria-valuenow]': 'clampedValue',
    '[attr.aria-valuetext]': 'valueText',
    '[attr.data-state]': 'state',
    '[attr.data-value]': 'clampedValue',
    '[attr.data-max]': 'max',
    '[class]': 'hostClass',
  },
  template: `
    <div
      data-uipkge=""
      data-slot="progress-indicator"
      [attr.data-state]="state"
      [attr.data-value]="clampedValue"
      [attr.data-max]="max"
      class="bg-primary h-full w-full flex-1 transition-transform duration-500 ease-out motion-reduce:transition-none"
      [style.transform]="'translateX(-' + (100 - clampedValue) + '%)'"
    ></div>
  `,
})
export class UiProgressComponent {
  @Input() value: number | null | undefined = 0
  @Input() max = 100
  @Input('aria-label') ariaLabel?: string
  @Input('aria-labelledby') ariaLabelledby?: string
  @Input('class') className?: string

  get clampedValue(): number {
    return Math.min(100, Math.max(0, this.value ?? 0))
  }

  /** Radix `getProgressState`: complete when value reaches max, loading otherwise. */
  get state(): ProgressState {
    return this.clampedValue === this.max ? 'complete' : 'loading'
  }

  /** Radix default `getValueLabel`. */
  get valueText(): string {
    return `${Math.round((this.clampedValue / this.max) * 100)}%`
  }

  get resolvedAriaLabel(): string | null {
    if (this.ariaLabel !== undefined) return this.ariaLabel
    return this.ariaLabelledby !== undefined ? null : 'Progress'
  }

  get hostClass(): string {
    return cn('block bg-primary/20 relative h-2 w-full overflow-hidden rounded-full', this.className)
  }
}
