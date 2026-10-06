import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiScrollSpyComponent, UiScrollSpyLinkComponent } from './scroll-spy.component'
import { resolveScrollSpyColor } from './scroll-spy.types'

const here = dirname(fileURLToPath(import.meta.url))
const angularSrc = readFileSync(resolve(here, './scroll-spy.component.ts'), 'utf8')

describe('ScrollSpy (angular parity, 10 checks)', () => {
  it('1: all parts are standalone', () => {
    expect(angularSrc.match(/standalone: true/g)?.length).toBeGreaterThanOrEqual(7)
  })
  it('2: defaults mirror Vue (empty model / line indicator / right pos)', () => {
    const c = new UiScrollSpyComponent()
    expect(c.modelValue).toBe('')
    expect(c.items).toEqual([])
    expect(c.offsetTop).toBe(0)
    expect(c.bounds).toBe(5)
    expect(c.affix).toBe(false)
    expect(c.indicator).toBe('line')
    expect(c.position).toBe('right')
    expect(c.color).toBe('primary')
  })
  it('3: variant/turn/position resolution mirrors Vue', () => {
    const c = new UiScrollSpyComponent()
    expect(c.resolvedVariant).toBe('line')
    expect(c.resolvedTurn).toBe('straight')
    expect(c.resolvedRailPosition).toBe('left')
    c.position = 'left'
    expect(c.resolvedRailPosition).toBe('right')
    c.position = 'top'
    expect(c.resolvedVariant).toBe('stepper')
    c.turn = 'sharp'
    expect(c.resolvedTurn).toBe('sharp')
  })
  it('4: line widths resolve to px like Vue', () => {
    const c = new UiScrollSpyComponent()
    expect(c.resolvedLineWidth).toBe(2.5)
    c.lineWidth = 'thin'
    expect(c.resolvedLineWidth).toBe(1.5)
    c.lineWidth = 'thick'
    expect(c.resolvedLineWidth).toBe(3.5)
    c.lineWidth = 4
    expect(c.resolvedLineWidth).toBe(4)
  })
  it('5: color resolver maps tokens', () => {
    expect(resolveScrollSpyColor('primary').borderClass).toBe('border-primary')
    expect(resolveScrollSpyColor('foreground').bgClass).toBe('bg-foreground')
    expect(resolveScrollSpyColor('#abc').customColor).toBe('#abc')
    const c = new UiScrollSpyComponent()
    expect(c.handleColor).toBe('border-primary')
  })
  it('6: register/unregister tracks items', () => {
    const c = new UiScrollSpyComponent()
    c.registerItem({ value: '#a', depth: 1 })
    c.registerItem({ value: '#a', depth: 1 })
    expect(c.registered.length).toBe(1)
    c.unregisterItem('#a')
    expect(c.registered.length).toBe(0)
  })
  it('7: setActive emits model + change', () => {
    const c = new UiScrollSpyComponent()
    let model: string | undefined
    let changed: string | undefined
    c.modelValueChange.subscribe((v) => (model = v))
    c.change.subscribe((v) => (changed = v))
    c.setActive('#intro')
    expect(c.isItemActive('#intro')).toBe(true)
    expect(c.isItemActive('intro')).toBe(true)
    expect(model).toBe('#intro')
    expect(changed).toBe('#intro')
  })
  it('8: scrolled marks + progress clamps', () => {
    const c = new UiScrollSpyComponent()
    c.markScrolled('#a')
    expect(c.isItemScrolled('#a')).toBe(true)
    c.markScrolled('#a', false)
    expect(c.isItemScrolled('#a')).toBe(false)
    let p: number | undefined
    c.progress.subscribe((v) => (p = v))
    c.reportProgress(9)
    expect(p).toBe(1)
    const l = new UiScrollSpyLinkComponent()
    l.active = true
    expect(l.hostClass).toContain('font-medium')
  })
  it('9: data-slot scroll-spy contracts + link a11y (aria-current, focus ring)', () => {
    for (const slot of [
      'scroll-spy',
      'scroll-spy-title',
      'scroll-spy-list',
      'scroll-spy-item',
      'scroll-spy-link',
      'scroll-spy-indicator',
      'scroll-spy-stepper',
    ]) {
      expect(angularSrc).toContain(slot)
    }
    expect(angularSrc).toContain('aria-current')
    expect(angularSrc).toContain("'location'")
  })
  it('10: custom class merges + imports type-only', () => {
    const c = new UiScrollSpyComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    const lines = angularSrc
      .split('\n')
      .filter((l) => l.includes('@angular/cdk') || l.includes('@angular/common') || l.includes('@angular/forms'))
    expect(lines.length === 0 || lines.every((l) => l.trim().startsWith('import type'))).toBe(true)
  })
})
