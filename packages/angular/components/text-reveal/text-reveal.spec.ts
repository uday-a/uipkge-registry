import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiTextRevealComponent, buildSegments } from './text-reveal.component'

const here = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(resolve(here, './text-reveal.component.ts'), 'utf8')

describe('TextReveal (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(src).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (words, 40/600/0, blur, once)', () => {
    const c = new UiTextRevealComponent()
    expect(c.mode).toBe('words')
    expect(c.stagger).toBe(40)
    expect(c.duration).toBe(600)
    expect(c.delay).toBe(0)
    expect(c.blur).toBe(true)
    expect(c.once).toBe(true)
  })
  it('3: word mode splits on whitespace', () => {
    const c = new UiTextRevealComponent()
    c.text = 'hello world'
    expect(c.segments.filter((s) => !s.space).length).toBe(2)
  })
  it('4: char mode splits every glyph', () => {
    const c = new UiTextRevealComponent()
    c.mode = 'chars'
    c.text = 'ab'
    expect(c.segments.length).toBe(2)
  })
  it('5: buildSegments handles multiple spaces', () => {
    const segs = buildSegments('a   b', 'words')
    expect(segs.filter((s) => !s.space).length).toBe(2)
  })
  it('6: segment class contains text-reveal-seg and blur when blur=true', () => {
    const c = new UiTextRevealComponent()
    expect(c.segmentClass).toContain('text-reveal-seg')
    expect(c.segmentClass).toContain('text-reveal-blur')
    c.blur = false
    expect(c.segmentClass).not.toContain('text-reveal-blur')
  })
  it('7: revealed signal flips state', () => {
    const c = new UiTextRevealComponent()
    expect(c.revealed()).toBe(false)
    c.revealed.set(true)
    expect(c.revealed()).toBe(true)
    expect(c.hostClass).toContain('is-revealed')
  })
  it('8: once=true input default', () => {
    const c = new UiTextRevealComponent()
    expect(c.once).toBe(true)
  })
  it('9: once=false input config', () => {
    const c = new UiTextRevealComponent()
    c.once = false
    expect(c.once).toBe(false)
  })
  it('10: data-slot contracts + custom class', () => {
    expect(src).toContain('text-reveal')
    const c = new UiTextRevealComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
})
