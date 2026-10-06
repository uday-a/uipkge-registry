import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiBorderBeamComponent } from './border-beam.component'

const here = dirname(fileURLToPath(import.meta.url))
const vueSrc = readFileSync(resolve(here, '../../../registry-vue/components/border-beam/BorderBeam.vue'), 'utf8')
const angularSrc = readFileSync(resolve(here, './border-beam.component.ts'), 'utf8')

describe('BorderBeam (angular parity, 10 checks)', () => {
  it('1: class strings match Vue (pointer-events-none absolute inset-0)', () => {
    expect(vueSrc).toContain('pointer-events-none absolute inset-0 rounded-[inherit]')
    expect(angularSrc).toContain('pointer-events-none absolute inset-0 rounded-[inherit]')
  })
  it('2: component is standalone', () => {
    expect(angularSrc).toContain('standalone: true')
  })
  it('3: defaults mirror Vue (2 / 6 / 0 / var(--primary) / false)', () => {
    const c = new UiBorderBeamComponent()
    expect(c.size).toBe(2)
    expect(c.duration).toBe(6)
    expect(c.delay).toBe(0)
    expect(c.color).toBe('var(--primary)')
    expect(c.paused).toBe(false)
  })
  it('4: base has pointer-events-none', () => {
    expect(new UiBorderBeamComponent().hostClass).toContain('pointer-events-none')
  })
  it('5: beam background uses conic-gradient with color', () => {
    const c = new UiBorderBeamComponent()
    expect(String(c.beamStyle['background'])).toContain('conic-gradient')
    expect(String(c.beamStyle['background'])).toContain('var(--primary)')
  })
  it('6: duration/delay feed animation shorthand', () => {
    const c = new UiBorderBeamComponent()
    c.duration = 10
    c.delay = 2
    expect(String(c.beamStyle['animation'])).toContain('10s')
    expect(String(c.beamStyle['animation'])).toContain('2s')
  })
  it('7: size feeds padding ring thickness', () => {
    const c = new UiBorderBeamComponent()
    c.size = 4
    expect(c.beamStyle['padding']).toBe('4px')
  })
  it('8: paused freezes animation', () => {
    const c = new UiBorderBeamComponent()
    c.paused = true
    expect(c.beamStyle['animation-play-state']).toBe('paused')
  })
  it('9: custom class merges', () => {
    const c = new UiBorderBeamComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('10: data-slot border-beam contract present', () => {
    expect(angularSrc).toContain('border-beam')
    expect(angularSrc).toContain('data-uipkge')
  })
})
