import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiGradientTextComponent } from './gradient-text.component'
import { gradientTextPresets as angularPresets } from './gradient-text.variants'

const here = dirname(fileURLToPath(import.meta.url))
const shared = readFileSync(resolve(here, '../../../shared/variants/gradient-text.variants.ts'), 'utf8')
const vueSrc = readFileSync(
  resolve(here, '../../../registry-vue/components/gradient-text/gradient-text.variants.ts'),
  'utf8',
)
const angularSrc = readFileSync(resolve(here, './gradient-text.variants.ts'), 'utf8')

function stripComments(s: string): string {
  return s.replace(/\/\/.*$/gm, '')
}

describe('GradientText (angular parity, 10 checks)', () => {
  it('1: variants file is byte-identical to shared canonical', () => {
    expect(stripComments(angularSrc)).toBe(stripComments(shared))
  })
  it('2: variants file matches Vue registry copy', () => {
    expect(stripComments(angularSrc)).toBe(stripComments(vueSrc))
  })
  it('3: component is standalone', () => {
    const src = readFileSync(resolve(here, './gradient-text.component.ts'), 'utf8')
    expect(src).toContain('standalone: true')
  })
  it('4: defaults mirror Vue (to right / not animated / 4s)', () => {
    const c = new UiGradientTextComponent()
    expect(c.direction).toBe('to right')
    expect(c.animated).toBe(false)
    expect(c.animationDuration).toBe(4)
  })
  it('5: host has inline-block base', () => {
    const c = new UiGradientTextComponent()
    expect(c.hostClass).toContain('inline-block')
  })
  it('6: all 10 presets are distinct gradients', () => {
    const names = ['sunset', 'ocean', 'forest', 'fire', 'candy', 'aurora', 'rainbow', 'gold', 'neon', 'grape'] as const
    const out = names.map((n) => angularPresets[n])
    expect(new Set(out).size).toBe(names.length)
  })
  it('7: sunset preset matches Vue linear-gradient', () => {
    expect(angularPresets.sunset).toBe('linear-gradient(to right, #ff7e5f, #feb47b)')
  })
  it('8: custom gradient wins; from/to builds direction string', () => {
    const c = new UiGradientTextComponent()
    c.gradient = 'linear-gradient(45deg, #f00, #00f)'
    expect(c.gradientValue).toBe('linear-gradient(45deg, #f00, #00f)')
    c.gradient = undefined
    c.from = '#f00'
    c.to = '#00f'
    expect(c.gradientValue).toBe('linear-gradient(to right, #f00, #00f)')
  })
  it('9: custom class merges via cn()', () => {
    const c = new UiGradientTextComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('10: data-slot gradient-text contract + animated host token', () => {
    const src = readFileSync(resolve(here, './gradient-text.component.ts'), 'utf8')
    expect(src).toContain('gradient-text')
    const c = new UiGradientTextComponent()
    c.animated = true
    expect(c.hostClass).toContain('gradient-text-shift')
  })
})
