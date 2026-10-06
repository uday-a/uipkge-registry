import { Component, Input, booleanAttribute, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

export type IconSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inherit'
export type IconFlip = 'horizontal' | 'vertical' | 'both'

const SIZE_CLASSES: Record<IconSize, string> = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
  '2xl': 'size-12',
  inherit: 'size-full',
}

/** Generate a Font Awesome class string. */
export function faClass(iconName: string, style: 'solid' | 'regular' | 'brands' = 'solid'): string {
  const prefix = style === 'brands' ? 'fab' : style === 'solid' ? 'fas' : 'far'
  return `${prefix} fa-${iconName}`
}

/** Generate a Material Design Icons class string. */
export function mdiClass(iconName: string): string {
  return `mdi mdi-${iconName}`
}

/**
 * Universal icon wrapper (React `Icon`): Lucide / Heroicons / inline svg via content projection,
 * Font Awesome / MDI via `class`, image icons via `src`. In `src` mode React renders the <img>
 * itself, so the `<ui-icon>` host becomes `display: contents` and the <img> carries the size,
 * flip, color, rotation and a11y attributes.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-icon, [ui-icon]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': 'src ? null : ""',
    '[attr.data-slot]': 'src ? null : "icon"',
    '[attr.role]': '!src && accessibleName ? "img" : null',
    '[attr.aria-label]': 'src ? null : accessibleName || null',
    '[attr.aria-hidden]': '!src && !accessibleName ? "true" : null',
    '[style.color]': 'src ? null : color',
    '[style.transform]': 'src ? null : rotationTransform',
    '[class]': 'src ? "contents" : hostClass',
  },
  template: `
    @if (src) {
      <img
        data-uipkge=""
        data-slot="icon"
        [src]="src"
        [alt]="alt || label || ''"
        [class]="imgClass"
        [style.color]="color"
        [style.transform]="rotationTransform"
        [attr.aria-label]="accessibleName || null"
        role="img"
      />
    } @else {
      <ng-content />
    }
  `,
})
export class UiIconComponent {
  @Input() size: IconSize = 'md'
  @Input() color?: string
  @Input('class') className?: string
  @Input() src?: string
  @Input() alt?: string
  @Input() rotation?: number | string
  @Input() flip?: IconFlip
  @Input() label?: string
  @Input() ariaLabel?: string
  @Input({ transform: booleanAttribute }) inline = true

  get accessibleName(): string | undefined {
    return this.ariaLabel || this.label
  }

  get rotationTransform(): string | null {
    const deg = this.rotation
      ? typeof this.rotation === 'string'
        ? parseInt(this.rotation)
        : this.rotation
      : undefined
    return deg ? `rotate(${deg}deg)` : null
  }

  get flipClass(): string {
    if (this.flip === 'horizontal') return '-scale-x-100'
    if (this.flip === 'vertical') return '-scale-y-100'
    if (this.flip === 'both') return '-scale-x-100 -scale-y-100'
    return ''
  }

  get hostClass(): string {
    return cn(
      'shrink-0 items-center justify-center',
      this.inline ? 'inline-flex' : 'flex',
      this.size !== 'inherit' ? SIZE_CLASSES[this.size] : '',
      this.flipClass,
      this.className,
    )
  }

  get imgClass(): string {
    return cn(
      'shrink-0 object-contain',
      this.inline ? 'inline-block' : 'block',
      this.size !== 'inherit' ? SIZE_CLASSES[this.size] : '',
      this.flipClass,
      this.className,
    )
  }
}
