import { Component, ElementRef, Input, inject, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { alertVariants, type AlertVariants } from './alert.variants'

export type AlertVariant = NonNullable<AlertVariants['variant']>
export type AlertIcon = 'info' | 'warning' | 'error' | 'success'
export type AlertTitleAs = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div'

/**
 * Angular port of UIPKGE Alert (React `Alert`). `icon` renders the built-in Lucide glyph
 * (error / success / warning / info) as the first direct child so the `[&>svg]` absolute
 * layout in `alertVariants` positions and pads it; `title` / `text` render the shorthand
 * title + description. Composition children (a projected `<svg>`, `ui-alert-title`,
 * `ui-alert-description`) project straight into the host, so they stay direct children too.
 * `title` is consumed like the React prop: it never leaks into a native tooltip attribute.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-alert, [ui-alert]',
  standalone: true,
  host: {
    '[attr.role]': '"alert"',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"alert"',
    '[attr.title]': 'null',
    '[class]': 'hostClass',
  },
  template: `
    @switch (icon) {
      @case ('error') {
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
          class="lucide lucide-circle-alert size-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" x2="12" y1="8" y2="12" />
          <line x1="12" x2="12.01" y1="16" y2="16" />
        </svg>
      }
      @case ('success') {
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
          class="lucide lucide-circle-check-big size-4"
          aria-hidden="true"
        >
          <path d="M21.801 10A10 10 0 1 1 17 3.335" />
          <path d="m9 11 3 3L22 4" />
        </svg>
      }
      @case ('warning') {
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
          class="lucide lucide-triangle-alert size-4"
          aria-hidden="true"
        >
          <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      }
      @case ('info') {
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
          class="lucide lucide-info size-4"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
      }
    }
    @if (title) {
      <p data-uipkge="" data-slot="alert-title" class="mb-1 text-sm leading-none font-medium tracking-tight">
        {{ title }}
      </p>
    }
    @if (text) {
      <div
        data-uipkge=""
        data-slot="alert-description"
        class="text-muted-foreground text-sm leading-relaxed [&_p]:leading-relaxed"
      >
        {{ text }}
      </div>
    }
    <ng-content />
  `,
})
export class UiAlertComponent {
  @Input() variant: AlertVariant = 'default'
  @Input() icon?: AlertIcon
  @Input() title?: string
  @Input() text?: string
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block', alertVariants({ variant: this.variant }), this.className)
  }
}

/**
 * React `AlertTitle` renders an `<h5>` (or the `as` element). Put it on a heading
 * (`<h5 ui-alert-title>`) for the native element; the `<ui-alert-title>` custom element
 * gets the same heading semantics via role="heading" + aria-level from `as`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-alert-title, [ui-alert-title]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"alert-title"',
    '[attr.role]': 'ariaLevel ? "heading" : null',
    '[attr.aria-level]': 'ariaLevel',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiAlertTitleComponent {
  private readonly isCustom = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName === 'UI-ALERT-TITLE'
  @Input() as: AlertTitleAs = 'h5'
  @Input('class') className?: string

  get ariaLevel(): number | null {
    return this.isCustom && this.as !== 'div' ? Number(this.as.slice(1)) : null
  }

  get hostClass(): string {
    return cn('block mb-1 text-sm leading-none font-medium tracking-tight', this.className)
  }
}

/** React `AlertDescription` (a `<div>`). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-alert-description, [ui-alert-description]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"alert-description"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiAlertDescriptionComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block text-muted-foreground text-sm leading-relaxed [&_p]:leading-relaxed', this.className)
  }
}

export { alertVariants, type AlertVariants }
