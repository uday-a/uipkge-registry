import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiHighlightComponent } from './highlight.component'

const here = dirname(fileURLToPath(import.meta.url))
const vueSrc = readFileSync(resolve(here, '../../../registry-vue/components/highlight/Highlight.vue'), 'utf8')
const angularSrc = readFileSync(resolve(here, './highlight.component.ts'), 'utf8')

describe('Highlight (angular parity, 10 checks)', () => {
  it('1: match class strings match Vue source tokens', () => {
    for (const token of ['bg-accent text-accent-foreground', 'rounded px-0.5 font-medium']) {
      expect(vueSrc).toContain(token)
      expect(angularSrc).toContain(token)
    }
  })
  it('2: component is standalone', () => {
    expect(angularSrc).toContain('standalone: true')
  })
  it('3: defaults mirror Vue (mark / insensitive / subword / uncapped)', () => {
    const c = new UiHighlightComponent()
    expect(c.highlightTag).toBe('mark')
    expect(c.caseSensitive).toBe(false)
    expect(c.wholeWord).toBe(false)
    expect(c.maxHighlights).toBe(0)
  })
  it('4: match class has bg-accent + font-medium', () => {
    const c = new UiHighlightComponent()
    expect(c.matchClass).toContain('bg-accent')
    expect(c.matchClass).toContain('font-medium')
  })
  it('5: case-insensitive query splits segments', () => {
    const c = new UiHighlightComponent()
    c.text = 'Hello hello'
    c.query = 'hello'
    c.ngOnChanges()
    expect(c.segments.filter((s) => s.match).length).toBe(2)
  })
  it('6: case-sensitive narrows to exact case (matches Vue)', () => {
    const c = new UiHighlightComponent()
    c.text = 'Hello hello'
    c.query = 'hello'
    c.caseSensitive = true
    c.ngOnChanges()
    expect(c.segments.filter((s) => s.match).length).toBe(1)
  })
  it('7: whole-word skips substrings', () => {
    const c = new UiHighlightComponent()
    c.text = 'cat cats concatenate'
    c.query = 'cat'
    c.wholeWord = true
    c.ngOnChanges()
    expect(c.segments.filter((s) => s.match).length).toBe(1)
  })
  it('8: custom class merges via cn()', () => {
    const c = new UiHighlightComponent()
    c.className = 'custom-class'
    c.highlightClass = 'hl-class'
    expect(c.hostClass).toContain('custom-class')
    expect(c.matchClass).toContain('hl-class')
  })
  it('9: data-slot root + match contracts present', () => {
    expect(angularSrc).toContain('highlight')
    expect(angularSrc).toContain('highlight-match')
  })
  it('10: maxHighlights caps rendered but total counts all', () => {
    const c = new UiHighlightComponent()
    c.text = 'a a a a'
    c.query = 'a'
    c.maxHighlights = 2
    c.ngOnChanges()
    expect(c.segments.filter((s) => s.match).length).toBe(2)
    expect(c.total).toBe(4)
  })
})
