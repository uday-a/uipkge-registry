import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiIconBoxComponent, UiIconStackComponent } from './icon-box.component'

const here = dirname(fileURLToPath(import.meta.url))
const vueSrc = readFileSync(resolve(here, '../../../registry-vue/components/icon-box/IconBox.vue'), 'utf8')
const angularSrc = readFileSync(resolve(here, './icon-box.component.ts'), 'utf8')

describe('IconBox (angular parity, 10 checks)', () => {
  it('1: class maps match Vue source tokens', () => {
    for (const token of [
      'bg-primary/10 text-primary',
      'bg-muted text-muted-foreground',
      'rounded-lg',
      'rounded-full',
      'size-9 p-2',
    ]) {
      expect(vueSrc).toContain(token)
      expect(angularSrc).toContain(token)
    }
  })
  it('2: components are standalone', () => {
    expect(angularSrc.match(/standalone: true/g)!.length).toBeGreaterThanOrEqual(2)
  })
  it('3: defaults mirror Vue (primary / rounded / md)', () => {
    const c = new UiIconBoxComponent()
    expect(c.variant).toBe('primary')
    expect(c.shape).toBe('rounded')
    expect(c.size).toBe('md')
    const s = new UiIconStackComponent()
    expect(s.variant).toBe('primary')
    expect(s.size).toBe('md')
  })
  it('4: host has inline-flex shrink-0 base', () => {
    const c = new UiIconBoxComponent()
    expect(c.hostClass).toContain('inline-flex')
    expect(c.hostClass).toContain('shrink-0')
  })
  it('5: variants produce distinct output', () => {
    const out = (['primary', 'muted', 'outline', 'solid', 'destructive', 'success'] as const).map((v) => {
      const c = new UiIconBoxComponent()
      c.variant = v
      return c.hostClass
    })
    expect(new Set(out).size).toBe(6)
  })
  it('6: primary maps to bg-primary/10 (matches Vue)', () => {
    const c = new UiIconBoxComponent()
    expect(c.hostClass).toContain('bg-primary/10')
  })
  it('7: sizes map to calibrated boxes (2xs/xl)', () => {
    const xs = new UiIconBoxComponent()
    xs.size = '2xs'
    expect(xs.hostClass).toContain('size-6')
    const xl = new UiIconBoxComponent()
    xl.size = 'xl'
    expect(xl.hostClass).toContain('size-14')
  })
  it('8: custom class merges via cn()', () => {
    const c = new UiIconBoxComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('9: data-slot root + stack contracts present', () => {
    expect(angularSrc).toContain('icon-box')
    expect(angularSrc).toContain('icon-stack')
  })
  it('10: shapes + stack layers behave (circle/square, back/front)', () => {
    const c = new UiIconBoxComponent()
    c.shape = 'circle'
    expect(c.hostClass).toContain('rounded-full')
    c.shape = 'square'
    expect(c.hostClass).toContain('rounded-none')
    const s = new UiIconStackComponent()
    s.variant = 'success'
    expect(s.backClass).toContain('bg-success/20')
    expect(s.frontClass).toContain('text-success')
  })
})
