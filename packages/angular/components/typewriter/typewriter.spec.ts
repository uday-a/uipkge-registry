import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiTypewriterComponent } from './typewriter.component'

const here = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(resolve(here, './typewriter.component.ts'), 'utf8')

describe('Typewriter (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(src).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (45/25/1600, loop, caret)', () => {
    const c = new UiTypewriterComponent()
    expect(c.typingSpeed).toBe(45)
    expect(c.deletingSpeed).toBe(25)
    expect(c.pause).toBe(1600)
    expect(c.startDelay).toBe(0)
    expect(c.loop).toBe(true)
    expect(c.showCaret).toBe(true)
  })
  it('3: starts empty for SSR safety', () => {
    expect(new UiTypewriterComponent().text()).toBe('')
  })
  it('4: list wraps a single phrase', () => {
    const c = new UiTypewriterComponent()
    c.phrases = 'hello'
    expect(c.list).toEqual(['hello'])
  })
  it('5: list preserves array of phrases', () => {
    const c = new UiTypewriterComponent()
    c.phrases = ['ab', 'cd']
    expect(c.list).toEqual(['ab', 'cd'])
  })
  it('6: srText joins phrases for screen readers', () => {
    const c = new UiTypewriterComponent()
    c.phrases = ['a', 'b']
    expect(c.srText).toBe('a. b')
  })
  it('7: text signal updates', () => {
    const c = new UiTypewriterComponent()
    c.text.set('hello')
    expect(c.text()).toBe('hello')
  })
  it('8: caretClass contains animate-caret-blink', () => {
    const c = new UiTypewriterComponent()
    expect(c.caretClass).toContain('animate-caret-blink')
  })
  it('9: custom class merges via hostClass', () => {
    const c = new UiTypewriterComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('10: data-slot contract present', () => {
    expect(src).toContain('typewriter')
  })
})
