import { Component, ElementRef, Input, booleanAttribute, inject, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

/**
 * Angular port of UIPKGE List (React `List`). React's `as` prop maps to the host element you put
 * the attribute on: `<ul ui-list>` (default in React), `<ol ui-list>` or `<div ui-list>`; the
 * `<ui-list>` element form is display:block.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-list, [ui-list]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"list"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiListComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block list-none space-y-1', this.className)
  }
}

/**
 * React `ListItem`. `as` maps to the host element: `<li ui-list-item>`, `<div ui-list-item>` or
 * `<a ui-list-item [href]>`. Hover/pointer affordances show only when the item is interactive,
 * as in React (`as="a"` / `href` / `onClick`): an `<a>` host or an `href` count automatically;
 * set `interactive` for a click-handled item (Angular can't see whether `(click)` is bound).
 * Disabled items swallow clicks and drop out of the tab order.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-list-item, [ui-list-item]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"list-item"',
    '[attr.data-active]': 'active ? "" : null',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.aria-disabled]': 'disabled ? "true" : null',
    '[attr.aria-current]': 'active ? "true" : null',
    '[attr.tabindex]': 'disabled ? -1 : null',
    '[attr.href]': 'isAnchor && !disabled ? href ?? null : null',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiListItemComponent {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  @Input({ transform: booleanAttribute }) active = false
  @Input({ transform: booleanAttribute }) disabled = false
  @Input() href?: string
  /** Stand-in for React's `typeof onClick === 'function'` check. */
  @Input({ transform: booleanAttribute }) interactive = false
  @Input('class') className?: string

  get isAnchor(): boolean {
    return this.el.tagName === 'A'
  }

  get isInteractive(): boolean {
    return !this.disabled && (this.isAnchor || this.href != null || this.interactive)
  }

  constructor() {
    // Capture phase so it runs before any consumer (click) handler on the same element.
    this.el.addEventListener('click', (e) => this.onClick(e), true)
  }

  onClick(e: MouseEvent): void {
    if (!this.disabled) return
    e.preventDefault()
    e.stopImmediatePropagation()
  }

  get hostClass(): string {
    return cn(
      'block rounded-md px-2 py-1.5 text-sm transition-colors duration-200 select-none focus-visible:outline-none',
      'has-[>[data-slot=list-item-content]]:flex has-[>[data-slot=list-item-content]]:items-center has-[>[data-slot=list-item-content]]:gap-3',
      this.isInteractive && 'hover:bg-accent focus-visible:bg-accent cursor-pointer',
      this.active && 'bg-accent text-accent-foreground',
      this.disabled && 'pointer-events-none cursor-not-allowed opacity-50',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-list-item-media, [ui-list-item-media]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"list-item-media"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiListItemMediaComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex shrink-0 items-center justify-center self-center', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-list-item-content, [ui-list-item-content]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"list-item-content"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiListItemContentComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex min-w-0 flex-1 flex-col gap-0.5 self-center', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-list-item-title, [ui-list-item-title]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"list-item-title"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiListItemTitleComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block text-foreground truncate text-sm leading-none font-medium', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-list-item-description, [ui-list-item-description]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"list-item-description"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiListItemDescriptionComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block text-muted-foreground line-clamp-1 text-xs', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-list-item-actions, [ui-list-item-actions]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"list-item-actions"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiListItemActionsComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('text-muted-foreground flex shrink-0 items-center gap-1.5 self-center', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-list-subheader, [ui-list-subheader]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"list-subheader"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiListSubheaderComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block text-muted-foreground px-2 py-1 text-xs font-medium tracking-wider uppercase', this.className)
  }
}
