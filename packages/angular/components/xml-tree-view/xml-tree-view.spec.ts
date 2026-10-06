import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  UiXmlTreeViewComponent,
  UiXmlTreeNodeComponent,
  parseXml,
  pathKey,
  isExpandable,
} from './xml-tree-view.component'

const here = dirname(fileURLToPath(import.meta.url))
const src = readFileSync(resolve(here, './xml-tree-view.component.ts'), 'utf8')
const XML = '<root><child id="1">hi</child><!-- note --><empty /></root>'

describe('XmlTreeView (angular parity, 10 checks)', () => {
  it('1: component is standalone', () => {
    expect(src).toContain('standalone: true')
  })
  it('2: defaults mirror Vue (depth 1/100, search + toolbar)', () => {
    const c = new UiXmlTreeViewComponent()
    expect(c.expandDepth).toBe(1)
    expect(c.maxDepth).toBe(100)
    expect(c.showSearch).toBe(true)
    expect(c.showToolbar).toBe(true)
  })
  it('3: parser reads root + children', () => {
    const { root } = parseXml(XML)
    expect(root?.name).toBe('root')
    expect(root?.children?.length).toBe(3)
  })
  it('4: attributes + text parsed', () => {
    const { root } = parseXml(XML)
    const child = root?.children?.[0]
    expect(child?.attributes).toEqual({ id: '1' })
    expect(child?.children?.[0]?.value).toBe('hi')
  })
  it('5: comments + self-closing parsed', () => {
    const { root } = parseXml(XML)
    expect(root?.children?.[1]?.type).toBe('comment')
    expect(root?.children?.[2]?.name).toBe('empty')
  })
  it('6: expandAll collects element paths', () => {
    const c = new UiXmlTreeViewComponent()
    c.data = XML
    c.expandAll()
    expect(c.isExpanded(['root'])).toBe(true)
    c.collapseAll()
    expect(c.isExpanded(['root'])).toBe(false)
  })
  it('7: toggle flips one path', () => {
    const c = new UiXmlTreeViewComponent()
    c.toggle(['root'])
    expect(c.isExpanded(['root'])).toBe(true)
    c.toggle(['root'])
    expect(c.isExpanded(['root'])).toBe(false)
  })
  it('8: search matches names, text and attrs', () => {
    const c = new UiXmlTreeViewComponent()
    c.search = 'id'
    const { root } = parseXml(XML)
    expect(c.matchesSearch(root!.children![0])).toBe(true)
    expect(pathKey(['a', 'b'])).toBe('/a/b')
    expect(isExpandable(root!)).toBe(true)
  })
  it('9: copy emits value + path', () => {
    const c = new UiXmlTreeViewComponent()
    let got: unknown = null
    c.copy.subscribe((v: unknown) => (got = v))
    c.copyNode('<x/>', ['root'])
    expect(got).toEqual({ value: '<x/>', path: '/root' })
    expect(c.copiedPath).toBe('/root')
  })
  it('10: data-slot contracts + node indent', () => {
    expect(src).toContain('"xml-tree-view"')
    expect(src).toContain('"xml-tree-node"')
    const n = new UiXmlTreeNodeComponent()
    n.depth = 2
    expect(n.indentStyle()).toEqual({ 'padding-left': '40px' })
  })
})
