import { Component, ElementRef, Input, booleanAttribute, inject, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { fabVariants, type FabVariants } from './fab.variants'

export type FabVariant = NonNullable<FabVariants['variant']>
export type FabSize = NonNullable<FabVariants['size']>
export type FabPosition = NonNullable<FabVariants['position']>

/**
 * Angular port of UIPKGE Fab (React `Fab`): a floating action <button>. Put it on a native
 * element — `<button ui-fab>` (React default) or `<a ui-fab>` (React `asChild` with a link).
 * Click with the native `(click)`; while `disabled` clicks are swallowed (the <button> also gets
 * the native disabled attribute). Class strings identical to React via shared `fabVariants`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'button[ui-fab], a[ui-fab]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"fab"',
    '[attr.data-variant]': 'variant ?? null',
    '[attr.data-size]': 'resolvedSize ?? null',
    '[attr.data-position]': 'position ?? null',
    '[attr.disabled]': 'disabled && isButton ? "" : null',
    '[attr.aria-label]': 'ariaLabelAttr || ariaLabel || label || "Floating action"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />
    @if (label) {
      <span class="pr-1">{{ label }}</span>
    }`,
})
export class UiFabComponent {
  private readonly el = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  /** Label text: renders an extended FAB. Project the icon as content. */
  @Input() label?: string
  @Input() variant?: FabVariant
  @Input() size?: FabSize
  @Input() position?: FabPosition
  /** Absolute instead of fixed positioning (for contained FABs). */
  @Input({ transform: booleanAttribute }) absolute = false
  @Input({ transform: booleanAttribute }) disabled = false
  /** Accessible label. Defaults to `label`, then 'Floating action'. */
  @Input() ariaLabel?: string
  /** A plain `aria-label="…"` attribute wins over `ariaLabel`, like React. */
  @Input('aria-label') ariaLabelAttr?: string
  @Input('class') className?: string

  constructor() {
    // Capture phase so it runs before consumer (click) handlers: disabled <a> FABs must not fire.
    this.el.addEventListener(
      'click',
      (e) => {
        if (!this.disabled) return
        e.preventDefault()
        e.stopImmediatePropagation()
      },
      true,
    )
  }

  get isButton(): boolean {
    return this.el.tagName === 'BUTTON'
  }

  get resolvedSize(): FabSize | undefined {
    return this.label ? 'extended' : this.size
  }

  get hostClass(): string {
    return cn(
      fabVariants({ variant: this.variant, size: this.resolvedSize, position: this.position }),
      this.absolute && this.position !== 'inline' && 'absolute',
      this.className,
    )
  }
}

export { fabVariants, type FabVariants }
