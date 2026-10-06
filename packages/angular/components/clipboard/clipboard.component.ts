import {
  Component,
  ContentChild,
  Directive,
  type EmbeddedViewRef,
  EventEmitter,
  Input,
  type OnChanges,
  type OnDestroy,
  Output,
  TemplateRef,
  ViewContainerRef,
  booleanAttribute,
  inject,
  signal,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'
import {
  UiTooltipComponent,
  UiTooltipContentComponent,
  UiTooltipProviderComponent,
  UiTooltipTriggerComponent,
} from '@/ui/tooltip/tooltip.component'

export type ClipboardState = 'idle' | 'success' | 'error'

/** Template context for the render-prop form: `<ng-template let-state>`. */
export interface ClipboardTemplateContext {
  $implicit: ClipboardState
  state: ClipboardState
}

/** Renders the consumer's `<ng-template let-state>` with the live copy state (React render-prop children). */
@Directive({ selector: '[uiClipboardOutlet]', standalone: true })
export class UiClipboardOutletDirective implements OnChanges, OnDestroy {
  @Input('uiClipboardOutlet') template: TemplateRef<ClipboardTemplateContext> | null = null
  @Input('uiClipboardOutletState') state: ClipboardState = 'idle'
  private readonly vcr = inject(ViewContainerRef)
  private view?: EmbeddedViewRef<ClipboardTemplateContext>
  private tpl: TemplateRef<ClipboardTemplateContext> | null = null

  ngOnChanges(): void {
    if (this.template !== this.tpl) {
      this.vcr.clear()
      this.tpl = this.template
      this.view = this.template
        ? this.vcr.createEmbeddedView(this.template, { $implicit: this.state, state: this.state })
        : undefined
      return
    }
    if (this.view) {
      this.view.context.$implicit = this.state
      this.view.context.state = this.state
      this.view.markForCheck()
    }
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

/**
 * Angular port of UIPKGE Clipboard (React `Clipboard`): a native `<button>` that copies `text`
 * (navigator.clipboard, execCommand fallback), swaps the Copy icon for a green Check on
 * success, and wraps itself in a Tooltip (300ms delay) whose text follows the state
 * (tooltip / successText / errorText) for `timeout` ms. `feedbackTooltip=false` hides the
 * tooltip while feedback is showing. Projected content, or an `<ng-template let-state>`
 * (React render-prop children), renders after the icon + label.
 *
 * Outputs: React `onCopy` is `copyText` here (`copy` is a native DOM event that would
 * collide), `success`, `error`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-clipboard, [ui-clipboard]',
  standalone: true,
  imports: [
    UiTooltipProviderComponent,
    UiTooltipComponent,
    UiTooltipTriggerComponent,
    UiTooltipContentComponent,
    UiClipboardOutletDirective,
  ],
  // React renders the button itself (Tooltip parts add no DOM).
  host: { '[class]': '"contents"' },
  template: `
    <ui-tooltip-provider [delayDuration]="300">
      <ui-tooltip>
        <button
          ui-tooltip-trigger
          type="button"
          data-uipkge=""
          data-slot="clipboard"
          [attr.data-feedback-state]="state()"
          [disabled]="disabled"
          [attr.aria-label]="currentTooltip"
          [class]="buttonClass"
          (click)="doCopy()"
        >
          @if (!hideIcon) {
            <span data-slot="clipboard-icon" class="inline-flex">
              @if (state() === 'success') {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-check size-4 text-emerald-500"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              } @else {
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-copy size-4"
                  aria-hidden="true"
                >
                  <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
                  <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                </svg>
              }
            </span>
          }
          @if (label) {
            <span data-slot="clipboard-label">{{ label }}</span>
          }
          @if (children) {
            <ng-container [uiClipboardOutlet]="children" [uiClipboardOutletState]="state()" />
          }
          <ng-content />
        </button>
        @if (feedbackTooltip || state() === 'idle') {
          <ui-tooltip-content>{{ currentTooltip }}</ui-tooltip-content>
        }
      </ui-tooltip>
    </ui-tooltip-provider>
  `,
})
export class UiClipboardComponent implements OnDestroy {
  /** Text to copy to the clipboard. */
  @Input() text = ''
  /** Optional visible label next to the icon. */
  @Input() label = ''
  /** Disable the button (no copy, no tooltip). */
  @Input({ transform: booleanAttribute }) disabled = false
  /** Hide the copy icon (useful when a label is shown). */
  @Input({ transform: booleanAttribute }) hideIcon = false
  /** Tooltip text shown on hover before copying. */
  @Input() tooltip = 'Copy'
  /** Feedback text shown after a successful copy. */
  @Input() successText = 'Copied!'
  /** Feedback text shown after a failed copy. */
  @Input() errorText = 'Failed'
  /** How long (ms) the success/error feedback stays before resetting. */
  @Input() timeout = 2000
  /** Show the feedback as a tooltip rather than only swapping the icon. */
  @Input({ transform: booleanAttribute }) feedbackTooltip = true
  @Input('class') className?: string

  /** Fired before the copy attempt with the text being copied (React `onCopy`). */
  @Output() copyText = new EventEmitter<string>()
  /** Fired after a successful copy. */
  @Output() success = new EventEmitter<string>()
  /** Fired after a failed copy. */
  @Output() error = new EventEmitter<Error>()

  /** Render-prop children: `<ng-template let-state>…</ng-template>`. */
  @ContentChild(TemplateRef) children?: TemplateRef<ClipboardTemplateContext>

  /** Signal so the timer-driven reset repaints in zoneless apps. */
  readonly state = signal<ClipboardState>('idle')
  private resetTimer: ReturnType<typeof setTimeout> | null = null

  get buttonClass(): string {
    return cn(
      'inline-flex items-center gap-2 rounded-md text-sm transition-colors',
      'text-muted-foreground hover:text-foreground',
      'focus-visible:ring-ring/50 outline-none focus-visible:ring-[3px]',
      'disabled:cursor-not-allowed disabled:opacity-50',
      this.className,
    )
  }

  get currentTooltip(): string {
    const s = this.state()
    return s === 'success' ? this.successText : s === 'error' ? this.errorText : this.tooltip
  }

  private setFeedback(next: ClipboardState): void {
    this.state.set(next)
    if (this.resetTimer) clearTimeout(this.resetTimer)
    this.resetTimer = setTimeout(() => this.state.set('idle'), this.timeout)
  }

  async doCopy(): Promise<void> {
    if (this.disabled) return
    const value = this.text
    this.copyText.emit(value)
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
      } else {
        // Legacy fallback for non-secure contexts.
        const ta = document.createElement('textarea')
        ta.value = value
        ta.style.position = 'fixed'
        ta.style.opacity = '0'
        document.body.appendChild(ta)
        ta.select()
        const ok = document.execCommand('copy')
        document.body.removeChild(ta)
        if (!ok) throw new Error('execCommand copy failed')
      }
      this.setFeedback('success')
      this.success.emit(value)
    } catch (err) {
      this.setFeedback('error')
      this.error.emit(err as Error)
    }
  }

  ngOnDestroy(): void {
    if (this.resetTimer) clearTimeout(this.resetTimer)
  }
}
