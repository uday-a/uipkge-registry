import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { UiJsonTreeViewComponent, UiJsonTreeNodeComponent } from './json-tree-view.component'

const here = dirname(fileURLToPath(import.meta.url))
const angularSrc = readFileSync(resolve(here, './json-tree-view.component.ts'), 'utf8')

describe('JsonTreeView (angular parity, 10 checks)', () => {
  it('1: types file is byte-identical to Vue copy', () => {
    const a = readFileSync(resolve(here, './types.ts'), 'utf8')
    const v = readFileSync(resolve(here, '../../../registry-vue/components/json-tree-view/types.ts'), 'utf8')
    expect(a).toBe(v)
  })
  it('2: both components standalone', () => {
    expect(angularSrc.match(/standalone: true/g)!.length).toBeGreaterThanOrEqual(2)
  })
  it('3: defaults mirror Vue (1 / 100 / search / toolbar / root)', () => {
    const c = new UiJsonTreeViewComponent()
    expect(c.expandDepth).toBe(1)
    expect(c.maxDepth).toBe(100)
    expect(c.showSearch).toBe(true)
    expect(c.showToolbar).toBe(true)
    expect(c.rootLabel).toBe('root')
  })
  it('4: host has rounded-lg border', () => {
    expect(new UiJsonTreeViewComponent().hostClass).toContain('rounded-lg border')
  })
  it('5: primitives are not expandable', () => {
    const n = new UiJsonTreeNodeComponent()
    n.value = 42
    expect(n.isExpandable).toBe(false)
    expect(n.displayValue).toBe('42')
  })
  it('6: objects expand with entries', () => {
    const n = new UiJsonTreeNodeComponent()
    n.value = { a: 1 }
    expect(n.isExpandable).toBe(true)
    expect(n.entries).toEqual([{ key: 'a', value: 1 }])
  })
  it('7: strings render quoted with emerald tone', () => {
    const n = new UiJsonTreeNodeComponent()
    n.value = 'hi'
    expect(n.displayValue).toBe('"hi"')
    expect(n.valueClass).toContain('emerald')
  })
  it('8: expandAll/collapseAll set forced state', () => {
    const c = new UiJsonTreeViewComponent()
    c.expandAll()
    expect(c.forcedExpanded).toBe(true)
    c.collapseAll()
    expect(c.forcedExpanded).toBe(false)
  })
  it('9: copy emits value + path', () => {
    const n = new UiJsonTreeNodeComponent()
    n.value = { a: 1 }
    n.label = 'root'
    let emitted: unknown
    n.copy.subscribe((v) => (emitted = v))
    n.copyValue()
    expect(emitted).toEqual({ value: '{"a":1}', path: 'root' })
  })
  it('10: data-slot json-tree contracts present', () => {
    for (const slot of ['"json-tree-view"', '"json-tree-node"', 'json-tree-toolbar', 'json-tree-search']) {
      expect(angularSrc).toContain(slot)
    }
  })
})
