import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiBackTopComponent } from './back-top.component'
import { backTopVariants as angularVariants } from './back-top.variants'

const here = dirname(fileURLToPath(import.meta.url))
const shared = readFileSync(resolve(here, '../../../shared/variants/back-top.variants.ts'), 'utf8')
const vueSrc = readFileSync(resolve(here, '../../../registry-vue/components/back-top/back-top.variants.ts'), 'utf8')
const angularSrc = readFileSync(resolve(here, './back-top.variants.ts'), 'utf8')

function stripComments(s: string): string {
  return s.replace(/\/\/.*$/gm, '')
}

describe('BackTop (angular parity, 10 checks)', () => {
  it('1: variants file is byte-identical to shared canonical', () => {
    expect(stripComments(angularSrc)).toBe(stripComments(shared))
  })
  it('2: variants file matches Vue registry copy', () => {
    expect(stripComments(angularSrc)).toBe(stripComments(vueSrc))
  })
  it('3: component is standalone', () => {
    const src = readFileSync(resolve(here, './back-top.component.ts'), 'utf8')
    expect(src).toContain('standalone: true')
  })
  it('4: defaults mirror Vue (threshold=200 smooth default bottom-right offset=24)', () => {
    const c = new UiBackTopComponent()
    expect(c.threshold).toBe(200)
    expect(c.behavior).toBe('smooth')
    expect(c.size).toBe('default')
    expect(c.position).toBe('bottom-right')
    expect(c.offset).toBe(24)
    expect(c.ariaLabel).toBe('Scroll to top')
  })
  it('5: button has rounded-full + shadow-lg base', () => {
    const c = new UiBackTopComponent()
    expect(c.buttonClass).toContain('rounded-full')
    expect(c.buttonClass).toContain('shadow-lg')
  })
  it('6: sizes produce distinct output', () => {
    const out = (['sm', 'default', 'lg'] as const).map((s) => angularVariants({ size: s }))
    expect(new Set(out).size).toBe(3)
  })
  it('7: sm maps to size-8 (matches Vue)', () => {
    expect(angularVariants({ size: 'sm' })).toContain('size-8')
  })
  it('8: defaults threshold=200 offset=24', () => {
    const c = new UiBackTopComponent()
    expect(c.threshold).toBe(200)
    expect(c.offset).toBe(24)
  })
  it('9: custom class merges via cn()', () => {
    const c = new UiBackTopComponent()
    c.className = 'custom-class'
    expect(c.buttonClass).toContain('custom-class')
  })
  it('10: data-slot back-top contract + edge style for bottom-left', () => {
    const src = readFileSync(resolve(here, './back-top.component.ts'), 'utf8')
    expect(src).toContain('"back-top"')
    const c = new UiBackTopComponent()
    c.position = 'bottom-left'
    expect(c.edge.left).toBeDefined()
    expect(c.edge.bottom).toBeDefined()
  })
})
