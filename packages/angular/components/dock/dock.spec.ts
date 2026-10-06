import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiDockComponent } from './dock.component'

const here = dirname(fileURLToPath(import.meta.url))
const vueSrc = readFileSync(resolve(here, '../../../registry-vue/components/dock/Dock.vue'), 'utf8')
const angularSrc = readFileSync(resolve(here, './dock.component.ts'), 'utf8')

describe('Dock (angular parity, 10 checks)', () => {
  it('1: class strings match Vue (rounded-2xl backdrop-blur-md)', () => {
    for (const token of ['rounded-2xl', 'backdrop-blur-md', 'dock-item']) {
      expect(vueSrc).toContain(token)
      expect(angularSrc).toContain(token)
    }
  })
  it('2: component is standalone', () => {
    expect(angularSrc).toContain('standalone: true')
  })
  it('3: defaults mirror Vue (48 / 1.6 / 120 / horizontal / tooltips)', () => {
    const c = new UiDockComponent()
    expect(c.baseSize).toBe(48)
    expect(c.magnification).toBe(1.6)
    expect(c.distance).toBe(120)
    expect(c.orientation).toBe('horizontal')
    expect(c.showTooltips).toBe(true)
  })
  it('4: host has rounded-2xl border', () => {
    const c = new UiDockComponent()
    expect(c.hostClass).toContain('rounded-2xl')
    expect(c.hostClass).toContain('border')
  })
  it('5: idle size equals baseSize', () => {
    const c = new UiDockComponent()
    expect(c.sizeFor(0)).toBe(48)
  })
  it('6: hovered item magnifies', () => {
    const c = new UiDockComponent()
    c.mouseX = 24
    expect(c.sizeFor(0)).toBeGreaterThan(48)
  })
  it('7: distant item stays at base', () => {
    const c = new UiDockComponent()
    c.mouseX = 10000
    expect(c.sizeFor(0)).toBe(48)
  })
  it('8: onLeave resets hover state', () => {
    const c = new UiDockComponent()
    c.mouseX = 10
    c.hoveredId = 'a'
    c.onLeave()
    expect(c.mouseX).toBe(null)
    expect(c.hoveredId).toBe(null)
  })
  it('9: custom class merges + select emits', () => {
    const c = new UiDockComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    let emitted: unknown
    c.select.subscribe((v) => (emitted = v))
    c.onSelect({ id: 'a', label: 'A' })
    expect(emitted).toEqual({ id: 'a', label: 'A' })
  })
  it('10: data-slot dock contract present', () => {
    expect(angularSrc).toContain('"dock"')
    expect(angularSrc).toContain('data-uipkge')
  })
})
