import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

/** Angular port of UIPKGE Breadcrumb. Parts, DOM (nav > ol > li > a/span) and class strings mirror the React source; use the attribute selectors on native elements (the asChild equivalent). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-breadcrumb, [ui-breadcrumb]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"breadcrumb"',
    '[attr.data-uipkge]': '""',
    '[attr.aria-label]': '"breadcrumb"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiBreadcrumbComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-breadcrumb-list, [ui-breadcrumb-list]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"breadcrumb-list"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiBreadcrumbListComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'text-muted-foreground flex flex-wrap items-center gap-1.5 text-sm break-words sm:gap-2.5',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-breadcrumb-item, [ui-breadcrumb-item]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"breadcrumb-item"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiBreadcrumbItemComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('inline-flex items-center gap-1.5', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-breadcrumb-link, [ui-breadcrumb-link]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"breadcrumb-link"',
    '[attr.data-uipkge]': '""',
    '[attr.href]': 'href',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiBreadcrumbLinkComponent {
  @Input() href?: string
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'hover:text-foreground focus-visible:outline-ring rounded-sm underline-offset-4 transition-colors duration-200 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2',
      this.className,
    )
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-breadcrumb-page, [ui-breadcrumb-page]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"breadcrumb-page"',
    '[attr.data-uipkge]': '""',
    '[attr.aria-current]': '"page"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiBreadcrumbPageComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('text-foreground cursor-default font-normal', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-breadcrumb-separator, [ui-breadcrumb-separator]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"breadcrumb-separator"',
    '[attr.data-uipkge]': '""',
    '[attr.role]': '"presentation"',
    '[attr.aria-hidden]': '"true"',
    '[class]': 'hostClass',
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
      class="lucide lucide-chevron-right"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" /></svg
  ></ng-content>`,
})
export class UiBreadcrumbSeparatorComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('list-item [&>svg,&>lucide-icon>svg]:size-3.5', this.className)
  }
}

@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-breadcrumb-ellipsis, [ui-breadcrumb-ellipsis]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"breadcrumb-ellipsis"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
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
        <circle cx="5" cy="12" r="1" /></svg></ng-content
    ><span class="sr-only">More</span>`,
})
export class UiBreadcrumbEllipsisComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('flex size-11 items-center justify-center', this.className)
  }
}
