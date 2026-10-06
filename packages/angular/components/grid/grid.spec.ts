// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiGridComponent, type Cols, type GapToken } from './grid.component'

// React Grid parity. If these break, users see the wrong number of columns, a responsive map
// that ignores a breakpoint (or forces 1 column at base when they only asked for sm/lg), or
// the wrong gap. Class names are literal so Tailwind's scanner emits them.

@Component({
  standalone: true,
  imports: [UiGridComponent],
  template: `<div ui-grid [cols]="cols" [gap]="gap" class="mt-2"><span>1</span></div>`,
})
class Host {
  cols: Cols = 1
  gap: GapToken = 4
}

function render(cols?: Cols, gap?: GapToken) {
  const f = TestBed.createComponent(Host)
  if (cols !== undefined) f.componentInstance.cols = cols
  if (gap !== undefined) f.componentInstance.gap = gap
  f.detectChanges()
  return ((f.nativeElement as HTMLElement).querySelector('[data-slot=grid]') as HTMLElement).className.split(' ')
}

describe('Grid (angular, 5 checks)', () => {
  it('1: defaults to 1 column, gap-4 (React defaults)', () => {
    const c = new UiGridComponent()
    expect(c.cols).toBe(1)
    expect(c.gap).toBe(4)
    expect(render()).toEqual(expect.arrayContaining(['grid', 'grid-cols-1', 'gap-4', 'mt-2']))
  })
  it('2: fixed column count', () => {
    expect(render(3, 3)).toEqual(expect.arrayContaining(['grid-cols-3', 'gap-3']))
  })
  it('3: breakpoint map emits one class per breakpoint', () => {
    expect(render({ base: 1, sm: 2, lg: 4 })).toEqual(
      expect.arrayContaining(['grid-cols-1', 'sm:grid-cols-2', 'lg:grid-cols-4']),
    )
  })
  it('4: a map without base adds no base column class', () => {
    const cls = render({ md: 3 })
    expect(cls).toContain('md:grid-cols-3')
    expect(cls).not.toContain('grid-cols-1')
  })
  it('5: gap tokens map to literal classes', () => {
    expect(render(2, 16)).toContain('gap-16')
    expect(render(2, 0)).toContain('gap-0')
  })
})
