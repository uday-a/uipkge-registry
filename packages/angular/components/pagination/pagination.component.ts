import { Component, Input, booleanAttribute, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

/** Page-window entry, kept for callers that build their own page list (`'ellipsis'` marks a gap). */
export type PaginationPage = number | 'ellipsis'

/**
 * Angular port of UIPKGE Pagination. Like the React (radix-style) port these are
 * presentational parts: the caller owns the current page, computes the page window
 * and renders page buttons. `nav > ul > li` DOM, aria labels and class strings
 * mirror the React source 1:1. Use the attribute selectors on native elements
 * (`<nav ui-pagination>`, `<button ui-pagination-next>`), the asChild equivalent.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-pagination, [ui-pagination]',
  standalone: true,
  host: {
    '[attr.aria-label]': 'ariaLabel',
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"pagination"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiPaginationComponent {
  @Input('aria-label') ariaLabel = 'Pagination'
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex items-center gap-1', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-pagination-list, [ui-pagination-list]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"pagination-list"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiPaginationListComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex items-center gap-1', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-pagination-list-item, [ui-pagination-list-item]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"pagination-list-item"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiPaginationListItemComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('shrink-0', this.className)
  }
}

/** Shared host for the four edge buttons: a native `<button type="button">` with a default aria-label. */
const edgeHost = {
  '[attr.type]': '"button"',
  '[attr.aria-label]': 'ariaLabel',
  '[attr.disabled]': 'disabled ? "" : null',
  '[class]': 'className || null',
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-pagination-first, [ui-pagination-first]',
  standalone: true,
  host: edgeHost,
  template: `<ng-content
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevrons-left size-4"
      aria-hidden="true"
    >
      <path d="m11 17-5-5 5-5" />
      <path d="m18 17-5-5 5-5" /></svg
  ></ng-content>`,
})
export class UiPaginationFirstComponent {
  @Input('aria-label') ariaLabel = 'Go to first page'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-pagination-prev, [ui-pagination-prev]',
  standalone: true,
  host: edgeHost,
  template: `<ng-content
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevron-left size-4"
      aria-hidden="true"
    >
      <path d="m15 18-6-6 6-6" /></svg
  ></ng-content>`,
})
export class UiPaginationPrevComponent {
  @Input('aria-label') ariaLabel = 'Go to previous page'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-pagination-next, [ui-pagination-next]',
  standalone: true,
  host: edgeHost,
  template: `<ng-content
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevron-right size-4"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" /></svg
  ></ng-content>`,
})
export class UiPaginationNextComponent {
  @Input('aria-label') ariaLabel = 'Go to next page'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-pagination-last, [ui-pagination-last]',
  standalone: true,
  host: edgeHost,
  template: `<ng-content
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-chevrons-right size-4"
      aria-hidden="true"
    >
      <path d="m6 17 5-5-5-5" />
      <path d="m13 17 5-5-5-5" /></svg
  ></ng-content>`,
})
export class UiPaginationLastComponent {
  @Input('aria-label') ariaLabel = 'Go to last page'
  @Input({ transform: booleanAttribute }) disabled = false
  @Input('class') className?: string
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-pagination-ellipsis, [ui-pagination-ellipsis]',
  standalone: true,
  host: {
    '[attr.aria-hidden]': '"true"',
    '[class]': 'className || null',
  },
  template: `<ng-content
    ><svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="lucide lucide-ellipsis size-4"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" /></svg
  ></ng-content>`,
})
export class UiPaginationEllipsisComponent {
  @Input('class') className?: string
}
