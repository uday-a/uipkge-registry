import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiCodeBlockComponent } from './code-block.component'

const here = dirname(fileURLToPath(import.meta.url))
const vueSrc = readFileSync(resolve(here, '../../../registry-vue/components/code-block/CodeBlock.vue'), 'utf8')
const angularSrc = readFileSync(resolve(here, './code-block.component.ts'), 'utf8')

describe('CodeBlock (angular parity, 10 checks)', () => {
  it('1: container class strings match Vue source tokens', () => {
    for (const token of [
      'relative overflow-hidden rounded-lg border',
      'bg-muted/40 flex items-center justify-between',
      'overflow-auto font-mono text-sm',
    ]) {
      expect(vueSrc).toContain(token)
      expect(angularSrc).toContain(token)
    }
  })
  it('2: component is standalone', () => {
    expect(angularSrc).toContain('standalone: true')
  })
  it('3: defaults mirror React (tsx / line numbers / 400px / expanded / header)', () => {
    const c = new UiCodeBlockComponent()
    expect(c.language).toBe('tsx')
    expect(c.showLineNumbers).toBe(true)
    expect(c.maxHeight).toBe('400px')
    expect(c.defaultExpanded).toBe(true)
    expect(c.showHeader).toBe(true)
  })
  it('4: host has rounded-lg border base', () => {
    const c = new UiCodeBlockComponent()
    expect(c.hostClass).toContain('rounded-lg')
    expect(c.hostClass).toContain('border')
  })
  it('5: lines split on newline for the gutter', () => {
    const c = new UiCodeBlockComponent()
    c.code = 'a\nb\nc'
    expect(c.lines).toEqual(['a', 'b', 'c'])
  })
  it('6: copy label cycles idle/copy text (matches Vue)', () => {
    const c = new UiCodeBlockComponent()
    expect(c.copyLabel).toBe('Copy')
    c.copyStatus = 'copied'
    expect(c.copyLabel).toBe('Copied')
    c.copyStatus = 'error'
    expect(c.copyLabel).toBe('Copy failed')
    expect(c.copyLabelClass).toContain('text-destructive')
  })
  it('7: collapsed state hides body when header shown', () => {
    const c = new UiCodeBlockComponent()
    c.ngOnInit()
    expect(c.bodyVisible).toBe(true)
    c.isExpanded = false
    expect(c.bodyVisible).toBe(false)
    c.showHeader = false
    expect(c.bodyVisible).toBe(true)
  })
  it('8: custom class merges via cn()', () => {
    const c = new UiCodeBlockComponent()
    c.className = 'custom-class'
    expect(c.hostClass).toContain('custom-class')
  })
  it('9: data-slot root + sub-part contracts present', () => {
    for (const slot of ['"code-block"', '"code-block-copy"', '"code-block-toggle"', '"code-block-body"']) {
      expect(angularSrc).toContain(slot)
    }
  })
  it('10: defaultExpanded=false starts collapsed', () => {
    const c = new UiCodeBlockComponent()
    c.defaultExpanded = false
    c.ngOnInit()
    expect(c.isExpanded).toBe(false)
    expect(c.bodyVisible).toBe(false)
  })
})
