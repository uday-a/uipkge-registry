import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiVirtualListComponent } from './virtual-list.component'

const here = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(resolve(here, './virtual-list.component.ts'), 'utf8')
const items = Array.from({ length: 100 }, (_, i) => ({ id: `r${i}`, v: i }))

describe('VirtualList (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(src).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (overscan 3, id key, vertical)', () => {
    const c = new UiVirtualListComponent()
    expect(c.overscan).toBe(3)
    expect(c.keyField).toBe('id')
    expect(c.direction).toBe('vertical')
    expect(c.isVertical).toBe(true)
  })
  it('3: fixed size totals rows', () => {
    const c = new UiVirtualListComponent()
    c.items = items
    c.itemSize = 32
    expect(c.totalSize()).toBe(3200)
  })
  it('4: dynamic sizes sum per-row', () => {
    const c = new UiVirtualListComponent()
    c.items = items
    c.itemSize = (_item, i) => (i % 2 === 0 ? 20 : 40)
    expect(c.totalSize()).toBe(3000)
  })
  it('5: offsets accumulate', () => {
    const c = new UiVirtualListComponent()
    c.items = items
    c.itemSize = 32
    expect(c.offsetAt(3)).toBe(96)
  })
  it('6: visible range windows with overscan', () => {
    const c = new UiVirtualListComponent()
    c.items = items
    c.itemSize = 32
    const [start, end] = c.visibleRange(320, 320)
    expect(start).toBe(7)
    expect(end - start).toBeLessThan(30)
  })
  it('7: empty list returns zero range', () => {
    const c = new UiVirtualListComponent()
    expect(c.visibleRange(0, 400)).toEqual([0, 0])
  })
  it('8: keys read keyField with index fallback', () => {
    const c = new UiVirtualListComponent()
    c.items = items
    expect(c.keyAt(5)).toBe('r5')
    c.items = ['a', 'b']
    expect(c.keyAt(1)).toBe('1')
  })
  it('9: height style normalizes numbers', () => {
    const c = new UiVirtualListComponent()
    c.height = 400
    expect(c.heightStyle).toBe('400px')
    c.height = '50vh'
    expect(c.heightStyle).toBe('50vh')
  })
  it('10: data-slot contract + custom class', () => {
    expect(src).toContain('"virtual-list"')
    const c = new UiVirtualListComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})
