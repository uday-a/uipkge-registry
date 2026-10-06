import { Component, Input, ViewEncapsulation, booleanAttribute, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'
import { skeletonLoaderVariants, type SkeletonLoaderVariants } from './skeleton.variants'

export type SkeletonVariant =
  'rectangular' | 'rounded' | 'circular' | 'text' | 'avatar' | 'image' | 'card' | 'table-row'
export type SkeletonLoaderVariant = NonNullable<SkeletonLoaderVariants['variant']>

const SKELETON_SHIMMER_STYLES = `
.skeleton-shimmer {
  background: linear-gradient(
    90deg,
    color-mix(in srgb, var(--muted) 100%, transparent) 0%,
    color-mix(in srgb, var(--muted) 60%, var(--foreground) 8%) 50%,
    color-mix(in srgb, var(--muted) 100%, transparent) 100%
  );
  background-size: 200% 100%;
  animation: skeleton-shimmer 1.8s linear infinite;
}
@keyframes skeleton-shimmer {
  from {
    background-position: 200% 0;
  }
  to {
    background-position: -200% 0;
  }
}
@media (prefers-reduced-motion: reduce) {
  .skeleton-shimmer {
    animation: none;
    background: var(--muted);
  }
}
`

const skeletonVariantClasses: Record<SkeletonVariant, string> = {
  rectangular: '',
  rounded: 'rounded-md',
  circular: 'rounded-full',
  text: 'rounded h-4 w-full',
  avatar: 'rounded-full size-10',
  image: 'rounded-lg size-24',
  card: 'rounded-xl size-full min-h-[120px]',
  'table-row': 'rounded h-10 w-full',
}

/**
 * Angular port of UIPKGE Skeleton (React `Skeleton`). While `loading` the host is the
 * aria-hidden shimmer block (variant shape + width / height); with `loading=false` it steps
 * out of layout (`display: contents`) and renders its projected children only. The shimmer
 * keyframes React injects as a <style> ship unscoped (ViewEncapsulation.None) so they match
 * the host itself.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-skeleton, [ui-skeleton]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': 'loading ? "" : null',
    '[attr.data-slot]': 'loading ? "skeleton" : null',
    '[attr.aria-hidden]': 'loading ? "true" : null',
    '[class]': 'hostClass',
    '[style.width]': 'loading ? width : null',
    '[style.height]': 'loading ? height : null',
  },
  template: `@if (!loading) {
    <ng-content />
  }`,
  encapsulation: ViewEncapsulation.None,
  styles: [SKELETON_SHIMMER_STYLES],
})
export class UiSkeletonComponent {
  @Input() variant: SkeletonVariant = 'rectangular'
  @Input() width?: string
  @Input() height?: string
  @Input({ transform: booleanAttribute }) loading = true
  @Input('class') className?: string

  get hostClass(): string {
    if (!this.loading) return 'contents'
    return cn('block skeleton-shimmer', skeletonVariantClasses[this.variant ?? 'rectangular'], this.className)
  }
}

/**
 * React `SkeletonGroup`: a `space-y-2` stack. React's `tag` prop maps to the attribute form —
 * put `ui-skeleton-group` on the element you want (`<ul ui-skeleton-group>`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-skeleton-group, [ui-skeleton-group]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"skeleton-group"',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiSkeletonGroupComponent {
  @Input('class') className?: string

  get hostClass(): string {
    return cn('block space-y-2', this.className)
  }
}

/** React `SkeletonText`: `lines` shimmer bars with first / last line width tweaks. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-skeleton-text, [ui-skeleton-text]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"skeleton-text"',
    '[attr.aria-hidden]': '"true"',
    '[class]': 'hostClass',
  },
  template: `@for (width of lineWidths; track $index) {
    <div class="skeleton-shimmer h-4 rounded" [style.width]="width"></div>
  }`,
  encapsulation: ViewEncapsulation.None,
  styles: [SKELETON_SHIMMER_STYLES],
})
export class UiSkeletonTextComponent {
  @Input() lines = 3
  @Input() lastLineWidth = '80%'
  @Input() firstLineWidth = '100%'
  @Input('class') className?: string

  get lineWidths(): string[] {
    return Array.from({ length: this.lines }, (_, i) => {
      if (i === 0) return this.firstLineWidth
      if (i === this.lines - 1) return this.lastLineWidth
      return '100%'
    })
  }

  get hostClass(): string {
    return cn('block space-y-2', this.className)
  }
}

/**
 * React `SkeletonLoader`: preset placeholder shapes (`skeletonLoaderVariants`). `rows > 1`
 * builds the composed presets (article, card, card-avatar, actions, table, list-item*) or
 * repeats the atom; `loading=false` renders the projected content instead.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-skeleton-loader, [ui-skeleton-loader]',
  standalone: true,
  host: {
    '[attr.data-uipkge]': '""',
    '[attr.data-slot]': '"skeleton-loader"',
    class: 'block space-y-2',
  },
  template: `
    @if (!loading) {
      <ng-content />
    } @else if (rows === 1) {
      <div [class]="single"></div>
    } @else {
      @switch (variant) {
        @case ('article') {
          <div [class]="v('heading', 'mb-4')"></div>
          <div [class]="v('text', 'mb-2')"></div>
          <div [class]="v('text', 'mb-2')"></div>
          <div [class]="v('text', 'w-3/4')"></div>
        }
        @case ('card') {
          <div [class]="v('image-large', 'mb-4')"></div>
          <div [class]="v('heading-small', 'mb-2')"></div>
          <div [class]="v('text', 'mb-2')"></div>
          <div [class]="v('text', 'w-1/2')"></div>
        }
        @case ('card-avatar') {
          <div class="mb-4 flex items-center gap-4">
            <div [class]="v('avatar-large')"></div>
            <div class="flex-1 space-y-2">
              <div [class]="v('heading-small')"></div>
              <div [class]="v('text', 'w-1/2')"></div>
            </div>
          </div>
        }
        @case ('actions') {
          <div class="flex gap-2">
            <div [class]="v('button')"></div>
            <div [class]="v('button')"></div>
          </div>
        }
        @case ('table') {
          @for (r of rowList; track r) {
            <div [class]="v('table-row', 'mb-2')"></div>
          }
        }
        @case ('list-item') {
          @for (r of rowList; track r) {
            <div class="mb-2 flex items-center gap-3">
              <div [class]="v('avatar-small')"></div>
              <div class="flex-1"><div [class]="v('text')"></div></div>
            </div>
          }
        }
        @case ('list-item-two-line') {
          @for (r of rowList; track r) {
            <div class="mb-2 flex items-center gap-3">
              <div [class]="v('avatar')"></div>
              <div class="flex-1 space-y-2">
                <div [class]="v('text')"></div>
                <div [class]="v('text', 'w-3/4')"></div>
              </div>
            </div>
          }
        }
        @case ('list-item-three-line') {
          @for (r of rowList; track r) {
            <div class="mb-2 flex items-start gap-3">
              <div [class]="v('avatar')"></div>
              <div class="flex-1 space-y-2">
                <div [class]="v('text')"></div>
                <div [class]="v('text')"></div>
                <div [class]="v('text', 'w-2/3')"></div>
              </div>
            </div>
          }
        }
        @default {
          @for (r of rowList; track r) {
            <div [class]="v(variant, 'mb-2')"></div>
          }
        }
      }
    }
    @if (boilerplate && !loading) {
      <div class="bg-muted/50 absolute inset-0"></div>
    }
  `,
})
export class UiSkeletonLoaderComponent {
  @Input() variant: SkeletonLoaderVariant = 'text'
  @Input({ transform: booleanAttribute }) loading = true
  @Input() rows = 1
  @Input({ transform: booleanAttribute }) boilerplate = false
  @Input('class') className?: string

  get single(): string {
    return cn(skeletonLoaderVariants({ variant: this.variant }), this.className)
  }

  get rowList(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i)
  }

  v(variant: SkeletonLoaderVariant, extra?: string): string {
    return cn(skeletonLoaderVariants({ variant }), extra)
  }
}

export { skeletonLoaderVariants, type SkeletonLoaderVariants }
