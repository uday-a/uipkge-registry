import { Component, ElementRef, Input, booleanAttribute, inject, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { linkVariants, type LinkVariants } from './link.variants'

export type LinkUnderline = NonNullable<LinkVariants['underline']>
export type LinkColor = NonNullable<LinkVariants['color']>
export type LinkSize = NonNullable<LinkVariants['size']>

/**
 * Angular port of UIPKGE Link (React `Link`, an `<a>` by default). Put it on the element you
 * want: `<a ui-link href="...">` is the React default; any other element (`<button ui-link>`)
 * is the Radix `asChild` form and still gets the link styling. http(s) hrefs open in a new tab
 * with rel=noopener unless `external` says otherwise; disabled links drop href, get
 * aria-disabled + tabindex -1 and swallow clicks (and are never external). `left` / `right`
 * icon slots project via `[slot=left]` / `[slot=right]`. The `<ui-link>` custom element gets
 * link semantics (role="link", focusable, Enter / click navigate to the href).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-link, [ui-link]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"link"',
    '[attr.data-underline]': 'underline ?? null',
    '[attr.data-color]': 'color ?? null',
    '[attr.data-size]': 'size ?? null',
    '[attr.data-disabled]': 'disabled ? "" : null',
    '[attr.href]': 'resolvedHref',
    '[attr.aria-disabled]': 'disabled ? "true" : null',
    '[attr.tabindex]': 'disabled ? -1 : isCustom ? 0 : null',
    '[attr.role]': 'isCustom ? "link" : null',
    '[attr.target]': 'isExternal ? "_blank" : null',
    '[attr.rel]': 'isExternal ? "noopener noreferrer" : null',
    '[class]': 'hostClass',
    '(click)': 'onClick($event)',
    '(keydown.enter)': 'onEnter($event)',
  },
  template: `<ng-content select="[slot=left]" /><ng-content /><ng-content select="[slot=right]" />`,
})
export class UiLinkComponent {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  /** `<ui-link>` custom element: not an anchor, so it needs role / focus / navigation. */
  readonly isCustom = this.el.tagName === 'UI-LINK'

  /** External URL — renders an anchor with target/rel handling. */
  @Input() href?: string
  /** Router destination (string); wins over `href`, like React. */
  @Input() to?: string | object
  @Input() underline?: LinkUnderline
  @Input() color?: LinkColor
  @Input() size?: LinkSize
  /** Disabled links render without href/navigation and get aria-disabled. */
  @Input({ transform: booleanAttribute }) disabled = false
  /** Open external href in a new tab. Defaults to true for http(s) hrefs. */
  @Input({ transform: booleanAttribute }) external?: boolean
  @Input('class') className?: string

  get isExternal(): boolean {
    if (this.disabled) return false
    if (this.external !== undefined) return this.external
    return typeof this.href === 'string' && /^https?:\/\//.test(this.href)
  }

  get resolvedHref(): string | null {
    if (this.disabled) return null
    if (typeof this.to === 'string') return this.to
    return this.href ?? null
  }

  get hostClass(): string {
    return cn(
      linkVariants({ underline: this.underline, color: this.color, size: this.size }),
      this.disabled && 'pointer-events-none opacity-50',
      this.className,
    )
  }

  onClick(event: MouseEvent): void {
    if (this.disabled) {
      event.preventDefault()
      event.stopPropagation()
      return
    }
    if (this.isCustom && this.resolvedHref) this.navigate()
  }

  onEnter(event: Event): void {
    if (!this.isCustom || this.disabled) return
    event.preventDefault()
    this.el.click()
  }

  private navigate(): void {
    const href = this.resolvedHref!
    if (this.isExternal) window.open(href, '_blank', 'noopener,noreferrer')
    else window.location.assign(href)
  }
}

export { linkVariants, type LinkVariants }
