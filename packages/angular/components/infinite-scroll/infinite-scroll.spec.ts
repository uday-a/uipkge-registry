import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiInfiniteScrollComponent } from './infinite-scroll.component'

const here = dirname(fileURLToPath(import.meta.url))
const angularSrc = readFileSync(resolve(here, './infinite-scroll.component.ts'), 'utf8')

describe('InfiniteScroll (angular parity, 10 checks)', () => {
  it('1: sentinel + loading slot tokens present', () => {
    for (const token of ['infinite-scroll-sentinel', 'infinite-scroll-loading', 'infinite-scroll-end']) {
      expect(angularSrc).toContain(token)
    }
  })
  it('2: component is standalone', () => {
    expect(angularSrc).toContain('standalone: true')
  })
  it('3: defaults mirror Vue (hasMore / idle / reverse false)', () => {
    const c = new UiInfiniteScrollComponent()
    expect(c.hasMore).toBe(true)
    expect(c.loading).toBe(false)
    expect(c.reverse).toBe(false)
    expect(c.disabled).toBe(false)
    expect(c.hideSpinner).toBe(false)
  })
  it('4: host is block w-full', () => {
    expect(new UiInfiniteScrollComponent().hostClass).toContain('block w-full')
  })
  it('5: canLoad true when idle with more', () => {
    expect(new UiInfiniteScrollComponent().canLoad).toBe(true)
  })
  it('6: loading blocks canLoad', () => {
    const c = new UiInfiniteScrollComponent()
    c.loading = true
    expect(c.canLoad).toBe(false)
  })
  it('7: exhausted list blocks canLoad', () => {
    const c = new UiInfiniteScrollComponent()
    c.hasMore = false
    expect(c.canLoad).toBe(false)
  })
  it('8: intersection emits load at edge', () => {
    const c = new UiInfiniteScrollComponent()
    let count = 0
    c.load.subscribe(() => count++)
    c.onIntersection(true)
    expect(count).toBe(1)
    c.onIntersection(false)
    expect(count).toBe(1)
  })
  it('9: custom class merges', () => {
    const c = new UiInfiniteScrollComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('10: data-slot infinite-scroll contract present', () => {
    expect(angularSrc).toContain('"infinite-scroll"')
    expect(angularSrc).toContain('data-uipkge')
  })
})
