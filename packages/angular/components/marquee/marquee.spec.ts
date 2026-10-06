import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiMarqueeComponent } from './marquee.component'

const here = dirname(fileURLToPath(import.meta.url))
const vueSrc = readFileSync(resolve(here, '../../../registry-vue/components/marquee/Marquee.vue'), 'utf8')
const angularSrc = readFileSync(resolve(here, './marquee.component.ts'), 'utf8')

describe('Marquee (angular parity, 10 checks)', () => {
  it('1: class strings match Vue (group flex overflow-hidden)', () => {
    expect(vueSrc).toContain('group flex overflow-hidden')
    expect(angularSrc).toContain('group flex overflow-hidden')
  })
  it('2: component is standalone', () => {
    expect(angularSrc).toContain('standalone: true')
  })
  it('3: defaults mirror Vue (horizontal/left/20/gap16/repeat2)', () => {
    const c = new UiMarqueeComponent()
    expect(c.orientation).toBe('horizontal')
    expect(c.direction).toBe('left')
    expect(c.speed).toBe(20)
    expect(c.gap).toBe(16)
    expect(c.repeat).toBe(2)
    expect(c.paused).toBe(false)
  })
  it('4: horizontal track uses marquee-x keyframes', () => {
    expect(new UiMarqueeComponent().trackStyle['animation-name']).toBe('uipkge-marquee-x')
  })
  it('5: vertical track uses marquee-y keyframes', () => {
    const c = new UiMarqueeComponent()
    c.orientation = 'vertical'
    expect(c.trackStyle['animation-name']).toBe('uipkge-marquee-y')
    expect(c.hostClass).toContain('flex-col')
  })
  it('6: right/down reverses direction', () => {
    const c = new UiMarqueeComponent()
    c.direction = 'right'
    expect(c.trackStyle['animation-direction']).toBe('reverse')
  })
  it('7: speed feeds animation duration', () => {
    const c = new UiMarqueeComponent()
    c.speed = 10
    expect(c.trackStyle['animation-duration']).toBe('10s')
  })
  it('8: repeat duplicates tracks', () => {
    const c = new UiMarqueeComponent()
    c.repeat = 3
    expect(c.tracks.length).toBe(3)
  })
  it('9: custom class merges + pause token', () => {
    const c = new UiMarqueeComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
    c.paused = true
    expect(c.trackClass).toContain('paused')
  })
  it('10: data-slot marquee contract present', () => {
    expect(angularSrc).toContain('marquee')
    expect(angularSrc).toContain('marquee-track')
  })
})
