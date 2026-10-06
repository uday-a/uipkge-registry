import {
  Component,
  Directive,
  Input,
  OnChanges,
  OnDestroy,
  TemplateRef,
  ViewContainerRef,
  inject,
  ChangeDetectionStrategy,
} from '@angular/core'
import { cn } from '@/lib/utils'

export type EmptyStateHeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const ICON_CLASS = 'text-muted-foreground mx-auto mb-3 size-10'

/**
 * Renders the `icon` template and styles its root element(s) the way React styles the Lucide
 * `icon` component it receives (`className` + aria-hidden), so consumers pass a bare svg.
 */
@Directive({ selector: '[uiEmptyStateIcon]', standalone: true })
export class UiEmptyStateIconDirective implements OnChanges, OnDestroy {
  @Input('uiEmptyStateIcon') template: TemplateRef<unknown> | null = null
  private readonly vcr = inject(ViewContainerRef)

  ngOnChanges(): void {
    this.vcr.clear()
    if (!this.template) return
    const view = this.vcr.createEmbeddedView(this.template)
    view.detectChanges()
    for (const node of view.rootNodes) {
      if (!(node instanceof Element)) continue
      node.setAttribute('class', cn(node.getAttribute('class') ?? '', ICON_CLASS))
      node.setAttribute('aria-hidden', 'true')
    }
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

/**
 * Angular port of UIPKGE EmptyState (React `EmptyState`). Centered placeholder: optional icon
 * (an `<ng-template>` holding an svg — React's Lucide `icon` prop), a heading rendered as
 * `headingTag`, a description, and projected actions. Live region: role="status" + polite by
 * default, role="alert" + assertive for errors.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-empty-state, [ui-empty-state]',
  standalone: true,
  imports: [UiEmptyStateIconDirective],
  host: {
    '[attr.role]': 'role',
    '[attr.aria-live]': 'ariaLive',
    // `title` is an input (the heading text), never a native tooltip on the host.
    '[attr.title]': 'null',
    '[class]': 'hostClass',
  },
  template: `
    @if (icon) {
      <ng-container [uiEmptyStateIcon]="icon" />
    }
    @if (title) {
      @switch (headingTag) {
        @case ('h1') {
          <h1 class="text-foreground font-medium">{{ title }}</h1>
        }
        @case ('h2') {
          <h2 class="text-foreground font-medium">{{ title }}</h2>
        }
        @case ('h4') {
          <h4 class="text-foreground font-medium">{{ title }}</h4>
        }
        @case ('h5') {
          <h5 class="text-foreground font-medium">{{ title }}</h5>
        }
        @case ('h6') {
          <h6 class="text-foreground font-medium">{{ title }}</h6>
        }
        @default {
          <h3 class="text-foreground font-medium">{{ title }}</h3>
        }
      }
    }
    @if (description) {
      <p class="text-muted-foreground mt-1 max-w-sm text-sm">{{ description }}</p>
    }
    <ng-content />
  `,
})
export class UiEmptyStateComponent {
  /** Icon template (e.g. `<ng-template #icon><svg>…</svg></ng-template>`); styled size-10 + muted. */
  @Input() icon?: TemplateRef<unknown> | null
  @Input() title?: string
  @Input() description?: string
  @Input() role: 'status' | 'alert' = 'status'
  @Input() headingTag: EmptyStateHeadingTag = 'h3'
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex flex-col items-center py-12 text-center', this.className)
  }

  get ariaLive(): string {
    return this.role === 'alert' ? 'assertive' : 'polite'
  }
}
