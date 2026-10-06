import { describe, it, expect } from 'vitest'
import { readdirSync, readFileSync } from 'node:fs'
import { resolve, dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiAspectRatioComponent } from './aspect-ratio/aspect-ratio.component'
import { UiBarChartComponent } from './charts/bar-chart/bar-chart.component'
import { UiGanttComponent } from './gantt/gantt.component'
import { UiLazyImageComponent } from './lazy-image/lazy-image.component'
import { UiLeafletMapComponent } from './leaflet-map/leaflet-map.component'
import { UiMapComponent } from './map/map.component'
import { UiProgressItemComponent } from './progress-item/progress-item.component'
import { UiSkeletonComponent, UiSkeletonGroupComponent } from './skeleton/skeleton.component'
import {
  UiTableBodyComponent,
  UiTableCaptionComponent,
  UiTableCellComponent,
  UiTableFooterComponent,
  UiTableHeadComponent,
  UiTableHeaderComponent,
  UiTableRowComponent,
} from './table/table.component'
import { UiVirtualListComponent } from './virtual-list/virtual-list.component'

// Custom-element hosts render `display: inline`, which ignores width/height
// (charts, maps collapse) and breaks native table layout. Hosts that size or
// lay out like their Vue element carry the display utility FIRST in their
// class string. It must be a utility, not `:host` CSS: component styles are
// unlayered and beat Tailwind's utilities layer, so a consumer `class="hidden"`
// could never override them.

const here = dirname(fileURLToPath(import.meta.url))
const firstClass = (hostClass: string) => hostClass.split(' ')[0]

function sourcesUnder(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return entry.name === 'node_modules' ? [] : sourcesUnder(path)
    return path.endsWith('.ts') && !path.endsWith('.spec.ts') ? [path] : []
  })
}

describe('Host display (angular, 10 checks)', () => {
  it('1: every sized chart host renders block', async () => {
    const chartsDir = resolve(here, 'charts')
    const dirs = readdirSync(chartsDir, { withFileTypes: true }).filter((d) => d.isDirectory())
    expect(dirs.length).toBeGreaterThan(60)
    for (const { name } of dirs) {
      const mod = await import(`./charts/${name}/${name}.component.ts`)
      const Chart = Object.values(mod).find((v) => typeof v === 'function' && /Component$/.test(v.name)) as new () => {
        hostClass: string
      }
      // dotted-map-chart renders React's card <div> in its template and takes its host out of
      // layout (display: contents), so there is no inline host to collapse.
      if (['dotted-map-chart', 'category-distribution-chart', 'progress-ring-chart', 'uptime-tracker-chart', 'segmented-gauge', 'waffle-chart'].includes(name)) continue
      expect(firstClass(new Chart().hostClass), name).toBe('block')
    }
  })
  it('2: table header/body/footer keep row-group semantics', () => {
    expect(firstClass(new UiTableHeaderComponent().hostClass)).toBe('table-header-group')
    expect(firstClass(new UiTableBodyComponent().hostClass)).toBe('table-row-group')
    expect(firstClass(new UiTableFooterComponent().hostClass)).toBe('table-footer-group')
  })
  it('3: table row is a table-row', () => {
    expect(firstClass(new UiTableRowComponent().hostClass)).toBe('table-row')
  })
  it('4: table head + cell are table cells', () => {
    expect(firstClass(new UiTableHeadComponent().hostClass)).toBe('table-cell')
    expect(firstClass(new UiTableCellComponent().hostClass)).toBe('table-cell')
  })
  it('5: table caption is a table-caption', () => {
    expect(firstClass(new UiTableCaptionComponent().hostClass)).toBe('table-caption')
  })
  it('6: sized primitives render block', () => {
    for (const c of [
      new UiAspectRatioComponent(),
      new UiVirtualListComponent(),
      new UiProgressItemComponent(),
      new UiLazyImageComponent(),
      new UiGanttComponent(),
    ]) {
      expect(firstClass(c.hostClass), c.constructor.name).toBe('block')
    }
  })
  it('7: map containers render block ahead of variant classes', () => {
    expect(firstClass(new UiMapComponent().hostClass)).toBe('block')
    expect(firstClass(new UiLeafletMapComponent().hostClass)).toBe('block')
  })
  it('8: skeleton + skeleton group render block', () => {
    expect(firstClass(new UiSkeletonComponent().hostClass)).toBe('block')
    expect(firstClass(new UiSkeletonGroupComponent().hostClass)).toBe('block')
  })
  it('9: consumer class overrides host display', () => {
    const chart = new UiBarChartComponent()
    chart.className = 'hidden'
    expect(chart.hostClass.split(' ')).toContain('hidden')
    expect(chart.hostClass.split(' ')).not.toContain('block')
    const row = new UiTableRowComponent()
    row.className = 'hidden'
    expect(row.hostClass.split(' ')).not.toContain('table-row')
  })
  it('10: no component or block ships :host display CSS', () => {
    const offenders = [...sourcesUnder(here), ...sourcesUnder(resolve(here, '../blocks'))].filter((file) =>
      /:host\s*\{[^}]*display/.test(readFileSync(file, 'utf8')),
    )
    expect(offenders).toEqual([])
  })
})
