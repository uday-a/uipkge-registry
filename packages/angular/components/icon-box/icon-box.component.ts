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

export type IconBoxVariant =
  'primary' | 'muted' | 'outline' | 'solid' | 'subtle' | 'destructive' | 'success' | 'warning' | 'ghost' | 'custom'
export type IconBoxSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
export type IconBoxShape = 'rounded' | 'circle' | 'square'
export type IconStackVariant = 'primary' | 'muted' | 'destructive' | 'success' | 'warning'
export type IconStackSize = 'sm' | 'md' | 'lg' | 'xl'

const VARIANT_CLASSES: Record<IconBoxVariant, string> = {
  primary: 'bg-primary/10 text-primary',
  muted: 'bg-muted text-muted-foreground',
  outline: 'border border-border bg-background text-foreground shadow-xs',
  solid: 'bg-foreground text-background shadow-xs',
  subtle: 'bg-accent text-accent-foreground',
  destructive: 'bg-destructive/10 text-destructive',
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  ghost: 'text-muted-foreground hover:bg-accent hover:text-foreground',
  custom: '',
}

const SHAPE_CLASSES: Record<IconBoxShape, string> = {
  rounded: 'rounded-lg',
  circle: 'rounded-full',
  square: 'rounded-none',
}

const SIZE_CLASSES: Record<IconBoxSize, string> = {
  '2xs': 'size-6 p-1',
  xs: 'size-7 p-1.5',
  sm: 'size-8 p-1.5',
  md: 'size-9 p-2',
  lg: 'size-11 p-2.5',
  xl: 'size-14 p-3.5',
}

const ICON_SIZES: Record<IconBoxSize, string> = {
  '2xs': 'size-3',
  xs: 'size-3.5',
  sm: 'size-4',
  md: 'size-4.5',
  lg: 'size-6',
  xl: 'size-7',
}

const STACK_SIZES: Record<IconStackSize, { root: string; base: string; icon: string }> = {
  sm: { root: 'size-10', base: 'size-8 rounded-lg', icon: 'size-4' },
  md: { root: 'size-14', base: 'size-11 rounded-xl', icon: 'size-5' },
  lg: { root: 'size-18', base: 'size-14 rounded-2xl', icon: 'size-7' },
  xl: { root: 'size-24', base: 'size-18 rounded-3xl', icon: 'size-9' },
}

const STACK_VARIANTS: Record<IconStackVariant, { back: string; front: string; text: string }> = {
  primary: {
    back: 'bg-primary/20 border-primary/30',
    front: 'bg-background border-primary/20 shadow-primary/10',
    text: 'text-primary',
  },
  muted: {
    back: 'bg-muted border-border',
    front: 'bg-card border-border shadow-black/5',
    text: 'text-muted-foreground',
  },
  destructive: {
    back: 'bg-destructive/20 border-destructive/30',
    front: 'bg-background border-destructive/20 shadow-destructive/10',
    text: 'text-destructive',
  },
  success: {
    back: 'bg-success/20 border-success/30',
    front: 'bg-background border-success/20 shadow-success/10',
    text: 'text-success',
  },
  warning: {
    back: 'bg-warning/20 border-warning/30',
    front: 'bg-background border-warning/20 shadow-warning/10',
    text: 'text-warning',
  },
}

/**
 * Stamps an icon template and styles its root element(s) the way React styles the `icon`
 * component it receives (`className` + aria-hidden), so consumers pass a bare svg.
 */
@Directive({ selector: '[uiIconBoxIcon]', standalone: true })
export class UiIconBoxIconDirective implements OnChanges, OnDestroy {
  @Input('uiIconBoxIcon') template: TemplateRef<unknown> | null | undefined = null
  @Input() iconClass?: string
  private readonly vcr = inject(ViewContainerRef)

  ngOnChanges(): void {
    this.vcr.clear()
    if (!this.template) return
    const view = this.vcr.createEmbeddedView(this.template)
    view.detectChanges()
    for (const node of view.rootNodes) {
      if (!(node instanceof Element)) continue
      node.setAttribute('class', cn(node.getAttribute('class') ?? '', this.iconClass))
      node.setAttribute('aria-hidden', 'true')
    }
  }

  ngOnDestroy(): void {
    this.vcr.clear()
  }
}

/**
 * Icon container with calibrated sizes, surface variants and shapes (React `IconBox`). Pass the
 * icon as a template (`<ng-template #bell><svg …/></ng-template>` + `[icon]="bell"`), which gets
 * the size-matched icon class, or project your own content instead.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-icon-box, [ui-icon-box]',
  standalone: true,
  imports: [UiIconBoxIconDirective],
  host: {
    'data-uipkge': '',
    'data-slot': 'icon-box',
    '[attr.data-variant]': 'variant',
    '[attr.data-size]': 'size',
    '[attr.data-shape]': 'shape',
    '[class]': 'hostClass',
  },
  template: `<ng-content />
    @if (icon) {
      <ng-container [uiIconBoxIcon]="icon" [iconClass]="iconClassMerged" />
    }`,
})
export class UiIconBoxComponent {
  /** Optional icon template rendered inside the box (e.g. a Lucide svg). */
  @Input() icon?: TemplateRef<unknown> | null
  @Input() variant: IconBoxVariant = 'primary'
  @Input() shape: IconBoxShape = 'rounded'
  @Input() size: IconBoxSize = 'md'
  @Input() iconClass?: string
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'inline-flex shrink-0 items-center justify-center transition-colors',
      VARIANT_CLASSES[this.variant],
      SHAPE_CLASSES[this.shape],
      SIZE_CLASSES[this.size],
      this.className,
    )
  }

  get iconClassMerged(): string {
    return cn(ICON_SIZES[this.size], this.iconClass)
  }
}

/** 2.5D layered icon for empty states and feature hero cards (React `IconStack`). */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-icon-stack, [ui-icon-stack]',
  standalone: true,
  imports: [UiIconBoxIconDirective],
  host: {
    'data-uipkge': '',
    'data-slot': 'icon-stack',
    '[attr.data-variant]': 'variant',
    '[attr.data-size]': 'size',
    '[class]': 'hostClass',
  },
  template: `
    <div aria-hidden="true" [class]="backClass"></div>
    <div [class]="frontClass">
      <ng-content />
      @if (icon) {
        <ng-container [uiIconBoxIcon]="icon" [iconClass]="iconClassMerged" />
      }
    </div>
  `,
})
export class UiIconStackComponent {
  /** Optional icon template rendered on the front tile. */
  @Input() icon?: TemplateRef<unknown> | null
  @Input() variant: IconStackVariant = 'primary'
  @Input() size: IconStackSize = 'md'
  @Input() iconClass?: string
  @Input('class') className?: string

  get hostClass(): string {
    return cn(
      'relative inline-flex items-center justify-center select-none',
      STACK_SIZES[this.size].root,
      this.className,
    )
  }

  get backClass(): string {
    return cn(
      'absolute inset-0 m-auto rotate-6 border transition-transform duration-300',
      STACK_SIZES[this.size].base,
      STACK_VARIANTS[this.variant].back,
    )
  }

  get frontClass(): string {
    return cn(
      'relative z-10 flex items-center justify-center border shadow-md transition-transform duration-300 group-hover:-translate-y-0.5',
      STACK_SIZES[this.size].base,
      STACK_VARIANTS[this.variant].front,
      STACK_VARIANTS[this.variant].text,
    )
  }

  get iconClassMerged(): string {
    return cn(STACK_SIZES[this.size].icon, this.iconClass)
  }
}
