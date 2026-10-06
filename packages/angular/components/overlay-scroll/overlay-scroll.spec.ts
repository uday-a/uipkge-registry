import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiOverlayScrollComponent } from './overlay-scroll.component'

const here = dirname(fileURLToPath(import.meta.url))
const vueSrc = readFileSync(resolve(here, '../../../registry-vue/components/overlay-scroll/OverlayScroll.vue'), 'utf8')
const angularSrc = readFileSync(resolve(here, './overlay-scroll.component.ts'), 'utf8')

describe('OverlayScroll (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(angularSrc).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (thumb 4px / offset 2 / 800ms / draggable)', () => {
    const c = new UiOverlayScrollComponent()
    expect(c.thumbWidth).toBe(4)
    expect(c.thumbOffset).toBe(2)
    expect(c.idleHideMs).toBe(800)
    expect(c.draggable).toBe(true)
  })
  it('3: wrapper + viewport tokens match Vue source', () => {
    for (const token of [
      'overlay-scroll relative',
      'h-full overflow-x-hidden overflow-y-auto',
      'overlay-scroll__thumb',
    ]) {
      expect(vueSrc).toContain(token)
      expect(angularSrc).toContain(token)
    }
  })
  it('4: host + inner classes carry the Vue tokens', () => {
    const c = new UiOverlayScrollComponent()
    expect(c.hostClass).toContain('overlay-scroll relative')
    expect(c.innerClass).toContain('overflow-y-auto')
    expect(c.thumbClass).toContain('overlay-scroll__thumb')
  })
  it('5: recompute hides the thumb when content does not overflow', () => {
    const c = new UiOverlayScrollComponent()
    c.recompute({ scrollHeight: 200, clientHeight: 400, scrollTop: 0 })
    expect(c.thumbHeight).toBe(0)
    c.flashThumb()
    expect(c.showThumb).toBe(false)
  })
  it('6: recompute positions the thumb proportionally', () => {
    const c = new UiOverlayScrollComponent()
    c.recompute({ scrollHeight: 1000, clientHeight: 200, scrollTop: 400 })
    expect(c.thumbHeight).toBeGreaterThanOrEqual(24)
    expect(c.thumbTop).toBeGreaterThan(0)
    expect(c.thumbStyle.transform).toContain('translateY(')
    expect(c.thumbStyle.width).toBe('4px')
  })
  it('7: flashThumb shows, hover widens, hideThumb hides', () => {
    const c = new UiOverlayScrollComponent()
    c.idleHideMs = 100000
    c.recompute({ scrollHeight: 1000, clientHeight: 200, scrollTop: 0 })
    c.flashThumb()
    expect(c.showThumb).toBe(true)
    c.isHovered = true
    expect(c.thumbStyle.width).toBe('8px')
    c.isHovered = false
    c.hideThumb()
    expect(c.showThumb).toBe(false)
  })
  it('8: custom class merges via cn()', () => {
    const c = new UiOverlayScrollComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('9: data-slot overlay-scroll contracts present', () => {
    for (const slot of ['"overlay-scroll"', '"overlay-scroll-viewport"', '"overlay-scroll-thumb"']) {
      expect(angularSrc).toContain(slot)
    }
    expect(angularSrc).toContain('ui-overlay-scroll')
  })
  it('10: onScroll recomputes + imports type-only', () => {
    const c = new UiOverlayScrollComponent()
    c.idleHideMs = 100000
    c.onScroll({ scrollHeight: 1000, clientHeight: 200, scrollTop: 100 })
    expect(c.thumbHeight).toBeGreaterThan(0)
    expect(c.showThumb).toBe(true)
    c.hideThumb()
    const lines = angularSrc
      .split('\n')
      .filter((l) => l.includes('@angular/cdk') || l.includes('@angular/common') || l.includes('@angular/forms'))
    expect(lines.length === 0 || lines.every((l) => l.trim().startsWith('import type'))).toBe(true)
  })
})
