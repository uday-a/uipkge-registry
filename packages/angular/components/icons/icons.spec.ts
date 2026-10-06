import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiIconComponent, faClass, mdiClass } from './icons.component'

const here = dirname(fileURLToPath(import.meta.url))
const vueSrc = readFileSync(resolve(here, '../../../registry-vue/components/icons/Icon.vue'), 'utf8')
const angularSrc = readFileSync(resolve(here, './icons.component.ts'), 'utf8')

describe('Icons (angular parity, 10 checks)', () => {
  it('1: size maps match Vue source tokens', () => {
    for (const token of ['size-3', 'size-4', 'size-5', 'size-6', 'size-8', 'size-12']) {
      expect(vueSrc).toContain(token)
      expect(angularSrc).toContain(token)
    }
  })
  it('2: component is standalone', () => {
    expect(angularSrc).toContain('standalone: true')
  })
  it('3: defaults mirror Vue (md / inline)', () => {
    const c = new UiIconComponent()
    expect(c.size).toBe('md')
    expect(c.inline).toBe(true)
  })
  it('4: host has shrink-0 + size-5 for md', () => {
    const c = new UiIconComponent()
    expect(c.hostClass).toContain('shrink-0')
    expect(c.hostClass).toContain('size-5')
  })
  it('5: sizes produce distinct output', () => {
    const out = (['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const).map((s) => {
      const c = new UiIconComponent()
      c.size = s
      return c.hostClass
    })
    expect(new Set(out).size).toBe(6)
  })
  it('6: fa/mdi helpers match Vue recipes', () => {
    expect(faClass('coffee')).toBe('fas fa-coffee')
    expect(faClass('github', 'brands')).toBe('fab fa-github')
    expect(mdiClass('home')).toBe('mdi mdi-home')
  })
  it('7: flip maps to scale utilities (matches Vue)', () => {
    const c = new UiIconComponent()
    c.flip = 'horizontal'
    expect(c.hostClass).toContain('-scale-x-100')
    c.flip = 'both'
    expect(c.hostClass).toContain('-scale-y-100')
  })
  it('8: custom class merges via cn()', () => {
    const c = new UiIconComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('9: data-slot icon contract present', () => {
    expect(angularSrc).toContain('"icon"')
  })
  it('10: rotation + a11y role wiring', () => {
    const c = new UiIconComponent()
    c.rotation = 90
    expect(c.rotationTransform).toBe('rotate(90deg)')
    expect(c.accessibleName).toBe(undefined)
    c.label = 'Home'
    expect(c.accessibleName).toBe('Home')
  })
})
