import { Component, Input, ChangeDetectionStrategy } from '@angular/core'
import { cn } from '@/lib/utils'

export type ColIndex = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12
export type Cols = ColIndex | Partial<Record<'base' | 'sm' | 'md' | 'lg' | 'xl', ColIndex>>
export type GapToken = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16

const COLS: Record<string, Record<number, string>> = {
  base: {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
    6: 'grid-cols-6',
    7: 'grid-cols-7',
    8: 'grid-cols-8',
    9: 'grid-cols-9',
    10: 'grid-cols-10',
    11: 'grid-cols-11',
    12: 'grid-cols-12',
  },
  sm: {
    1: 'sm:grid-cols-1',
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-3',
    4: 'sm:grid-cols-4',
    5: 'sm:grid-cols-5',
    6: 'sm:grid-cols-6',
    7: 'sm:grid-cols-7',
    8: 'sm:grid-cols-8',
    9: 'sm:grid-cols-9',
    10: 'sm:grid-cols-10',
    11: 'sm:grid-cols-11',
    12: 'sm:grid-cols-12',
  },
  md: {
    1: 'md:grid-cols-1',
    2: 'md:grid-cols-2',
    3: 'md:grid-cols-3',
    4: 'md:grid-cols-4',
    5: 'md:grid-cols-5',
    6: 'md:grid-cols-6',
    7: 'md:grid-cols-7',
    8: 'md:grid-cols-8',
    9: 'md:grid-cols-9',
    10: 'md:grid-cols-10',
    11: 'md:grid-cols-11',
    12: 'md:grid-cols-12',
  },
  lg: {
    1: 'lg:grid-cols-1',
    2: 'lg:grid-cols-2',
    3: 'lg:grid-cols-3',
    4: 'lg:grid-cols-4',
    5: 'lg:grid-cols-5',
    6: 'lg:grid-cols-6',
    7: 'lg:grid-cols-7',
    8: 'lg:grid-cols-8',
    9: 'lg:grid-cols-9',
    10: 'lg:grid-cols-10',
    11: 'lg:grid-cols-11',
    12: 'lg:grid-cols-12',
  },
  xl: {
    1: 'xl:grid-cols-1',
    2: 'xl:grid-cols-2',
    3: 'xl:grid-cols-3',
    4: 'xl:grid-cols-4',
    5: 'xl:grid-cols-5',
    6: 'xl:grid-cols-6',
    7: 'xl:grid-cols-7',
    8: 'xl:grid-cols-8',
    9: 'xl:grid-cols-9',
    10: 'xl:grid-cols-10',
    11: 'xl:grid-cols-11',
    12: 'xl:grid-cols-12',
  },
}

const GAP: Record<GapToken, string> = {
  0: 'gap-0',
  1: 'gap-1',
  2: 'gap-2',
  3: 'gap-3',
  4: 'gap-4',
  5: 'gap-5',
  6: 'gap-6',
  8: 'gap-8',
  10: 'gap-10',
  12: 'gap-12',
  16: 'gap-16',
}

/**
 * Angular port of UIPKGE Grid. Responsive CSS-grid container with cols/gap
 * breakpoint props. Literal class maps mirror the React source so the
 * Tailwind scanner emits them.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'ui-grid, [ui-grid]',
  standalone: true,
  host: {
    '[attr.data-slot]': '"grid"',
    '[attr.data-uipkge]': '""',
    '[class]': 'hostClass',
  },
  template: `<ng-content />`,
})
export class UiGridComponent {
  @Input() cols: Cols = 1
  @Input() gap: GapToken = 4
  @Input('class') className?: string

  colsClasses(): string {
    if (typeof this.cols === 'number') return COLS['base'][this.cols] ?? ''
    const c = this.cols as Partial<Record<'base' | 'sm' | 'md' | 'lg' | 'xl', ColIndex>>
    return [
      c.base != null ? COLS['base'][c.base] : '',
      c.sm != null ? COLS['sm'][c.sm] : '',
      c.md != null ? COLS['md'][c.md] : '',
      c.lg != null ? COLS['lg'][c.lg] : '',
      c.xl != null ? COLS['xl'][c.xl] : '',
    ]
      .filter(Boolean)
      .join(' ')
  }

  get hostClass(): string {
    return cn('grid', this.colsClasses(), GAP[this.gap], this.className)
  }
}
