import { Component, Input, ViewEncapsulation, booleanAttribute, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { progressLinearVariants, type ProgressLinearVariants } from './progress-linear.variants'

// Copied verbatim from React ProgressLinear (injected there as an inline <style>). Unscoped
// (ViewEncapsulation.None) so the `.uipkge-pl` descendant selectors match the template.
const PROGRESS_LINEAR_STYLES = `
@media (prefers-reduced-motion: no-preference) {
  .uipkge-pl .animate-indeterminate {
    animation: uipkge-pl-indeterminate 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .uipkge-pl .animate-indeterminate1 {
    animation: uipkge-pl-indeterminate1 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .uipkge-pl .animate-indeterminate2 {
    animation: uipkge-pl-indeterminate2 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
  }
  .uipkge-pl .animate-stream {
    animation: uipkge-pl-stream 1s linear infinite;
  }
}
@keyframes uipkge-pl-indeterminate {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
@keyframes uipkge-pl-indeterminate1 {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(400%); }
}
@keyframes uipkge-pl-indeterminate2 {
  0% { transform: translateX(-100%); opacity: 1; }
  100% { transform: translateX(400%); opacity: 0; }
}
@keyframes uipkge-pl-stream {
  0% { transform: translateX(0); }
  100% { transform: translateX(40px); }
}
`

/**
 * Angular port of UIPKGE ProgressLinear (React `ProgressLinear`). The host is the
 * progressbar container (height, rounded variant); inside: a background track (striped /
 * dimmed when buffered), an optional buffer fill, an optional stream overlay, and the value
 * bar — which in indeterminate mode carries two sliding inner bars. Value and buffer clamp
 * to 0..100; `reverse` fills right-to-left.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-progress-linear, [ui-progress-linear]',
  standalone: true,
  encapsulation: ViewEncapsulation.None,
  styles: [PROGRESS_LINEAR_STYLES],
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"progress-linear"',
    '[attr.role]': '"progressbar"',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': '100',
    '[attr.aria-valuenow]': 'indeterminate ? null : normalizedValue',
    '[class]': 'containerClasses',
    '[style.height]': 'heightValue',
  },
  template: `
    <div
      [class]="backgroundClass"
      [style.background-color]="bgColorValue"
      [style.width]="normalizedBuffer > 0 ? normalizedBuffer + '%' : '100%'"
    ></div>
    @if (!indeterminate && normalizedBuffer > 0 && normalizedBuffer < 100) {
      <div
        [class]="bufferClass"
        [style.background-color]="bgColorValue"
        [style.width.%]="normalizedBuffer"
        [style.opacity]="0.3"
      ></div>
    }
    @if (stream && !indeterminate && active) {
      <div [class]="streamClass">
        <div
          class="animate-stream absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_10px,rgba(255,255,255,0.2)_10px,rgba(255,255,255,0.2)_20px)] bg-[length:40px_40px]"
          [style.width.%]="normalizedBuffer || 100"
        ></div>
      </div>
    }
    <div
      [class]="barClass"
      [style.width]="indeterminate ? '100%' : normalizedValue + '%'"
      [style.background-color]="indeterminate ? null : progressColorValue"
    >
      @if (indeterminate) {
        <div
          class="animate-indeterminate1 absolute inset-y-0 w-full bg-inherit"
          [style.background-color]="progressColorValue"
        ></div>
        <div
          class="animate-indeterminate2 absolute inset-y-0 w-full bg-inherit"
          [style.background-color]="progressColorValue"
        ></div>
      }
    </div>
  `,
})
export class UiProgressLinearComponent {
  @Input() value = 0
  @Input() bgColor?: string
  @Input() buffer?: number
  @Input() color?: string
  @Input() height?: number | string
  @Input({ transform: booleanAttribute }) indeterminate = false
  @Input({ transform: booleanAttribute }) reverse = false
  @Input() rounded?: ProgressLinearVariants['rounded']
  @Input({ transform: booleanAttribute }) stream = false
  @Input({ transform: booleanAttribute }) striped = false
  @Input({ transform: booleanAttribute }) active = true
  @Input('class') className?: string

  get normalizedValue(): number {
    return Math.min(100, Math.max(0, this.value ?? 0))
  }

  get normalizedBuffer(): number {
    return Math.min(100, Math.max(0, this.buffer || 0))
  }

  get heightValue(): string {
    if (typeof this.height === 'number') return `${this.height}px`
    if (typeof this.height === 'string') return this.height
    return '4px'
  }

  get bgColorValue(): string {
    return this.bgColor || 'currentColor'
  }

  get progressColorValue(): string {
    return this.color || 'currentColor'
  }

  get containerClasses(): string {
    return cn('block uipkge-pl', progressLinearVariants({ rounded: this.rounded }), this.className)
  }

  private get side(): string {
    return this.reverse ? 'right-0 left-auto' : 'right-auto left-0'
  }

  get backgroundClass(): string {
    return cn(
      'absolute inset-0 transition-colors duration-300',
      this.striped
        ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.1)_8px,rgba(255,255,255,0.1)_16px)]'
        : '',
      !this.indeterminate && this.normalizedBuffer > 0 ? 'opacity-30' : 'opacity-100',
    )
  }

  get bufferClass(): string {
    return cn(
      'absolute inset-0 transition-colors duration-300',
      this.side,
      this.striped
        ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.15)_8px,rgba(255,255,255,0.15)_16px)]'
        : '',
    )
  }

  get streamClass(): string {
    return cn('absolute inset-0 overflow-hidden', this.side)
  }

  get barClass(): string {
    return cn(
      'absolute inset-y-0 transition-colors duration-300',
      this.side,
      this.indeterminate ? 'animate-indeterminate' : '',
      this.striped && !this.indeterminate
        ? 'bg-[repeating-linear-gradient(45deg,transparent,transparent_8px,rgba(255,255,255,0.25)_8px,rgba(255,255,255,0.25)_16px)]'
        : '',
    )
  }
}

export { progressLinearVariants, type ProgressLinearVariants }
