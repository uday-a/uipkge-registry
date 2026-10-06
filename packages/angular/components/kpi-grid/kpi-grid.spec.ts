// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiKpiGridComponent, type KpiGridColumns } from './kpi-grid.component'

// React KpiGrid parity. If these break, dashboards lay KPI tiles out at the wrong density on
// desktop (columns prop ignored) or stop going to two columns on tablets.

@Component({
  standalone: true,
  imports: [UiKpiGridComponent],
  template: `<div ui-kpi-grid [columns]="columns" class="mb-4"><div>tile</div></div>`,
})
class Host {
  columns: KpiGridColumns = 4
}

function render(columns?: KpiGridColumns) {
  const f = TestBed.createComponent(Host)
  if (columns) f.componentInstance.columns = columns
  f.detectChanges()
  return (f.nativeElement as HTMLElement).querySelector('[data-slot=kpi-grid]') as HTMLElement
}

describe('KpiGrid (angular, 4 checks)', () => {
  it('1: defaults to 4 columns on lg, 2 on md', () => {
    const el = render()
    for (const c of ['grid', 'gap-4', 'md:grid-cols-2', 'lg:grid-cols-4', 'mb-4'])
      expect(el.classList.contains(c)).toBe(true)
  })
  it('2: columns=3 switches lg to 3', () => {
    expect(render(3).classList.contains('lg:grid-cols-3')).toBe(true)
  })
  it('3: columns=2 switches lg to 2', () => {
    const el = render(2)
    expect(el.classList.contains('lg:grid-cols-2')).toBe(true)
    expect(el.classList.contains('lg:grid-cols-4')).toBe(false)
  })
  it('4: children are projected as-is', () => {
    expect(render().textContent).toBe('tile')
  })
})
