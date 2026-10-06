// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiSkeletonComponent,
  UiSkeletonGroupComponent,
  UiSkeletonLoaderComponent,
  UiSkeletonTextComponent,
  skeletonLoaderVariants,
} from './skeleton.component'
import { skeletonLoaderVariants as reactVariants } from '../../../registry-react/components/skeleton/skeleton.variants'

// React Skeleton parity. If these break, users see: placeholders with no shimmer background
// (scoped CSS never matching the host), a collapsed inline block, skeletons that keep
// covering real content after loading finishes, or SkeletonLoader presets (article, table,
// list-item…) rendering a single bar instead of their composed shape.

@Component({
  standalone: true,
  imports: [UiSkeletonComponent, UiSkeletonGroupComponent, UiSkeletonTextComponent, UiSkeletonLoaderComponent],
  template: `
    <ui-skeleton id="s" variant="avatar" width="3rem" class="mt-1" />
    <ui-skeleton id="done" [loading]="false"><span id="real">Loaded</span></ui-skeleton>
    <ul ui-skeleton-group id="g">
      <li>a</li>
    </ul>
    <ui-skeleton-text id="t" [lines]="4" lastLineWidth="60%" />
    <ui-skeleton-loader id="atom" variant="avatar" class="mx-2" />
    <ui-skeleton-loader id="article" variant="article" [rows]="3" />
    <ui-skeleton-loader id="table" variant="table" [rows]="4" />
    <ui-skeleton-loader id="three" variant="list-item-three-line" [rows]="2" />
    <ui-skeleton-loader id="off" [loading]="false" [boilerplate]="true"><p id="content">x</p></ui-skeleton-loader>
  `,
})
class Host {}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  return (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
}

describe('Skeleton (angular, 7 checks)', () => {
  it('1: loading skeleton is an aria-hidden block shimmer with variant shape + size', () => {
    const s = render()('s')
    for (const c of ['block', 'skeleton-shimmer', 'rounded-full', 'size-10', 'mt-1'])
      expect(s.classList.contains(c), c).toBe(true)
    expect(s.getAttribute('aria-hidden')).toBe('true')
    expect(s.getAttribute('data-slot')).toBe('skeleton')
    expect(s.style.width).toBe('3rem')
  })

  it('2: shimmer CSS is global (unscoped) so it matches the host itself', () => {
    render()
    const css = [...document.head.querySelectorAll('style')].map((s) => s.textContent).join('\n')
    expect(css).toMatch(/\.skeleton-shimmer\s*\{/)
    expect(css).not.toMatch(/\.skeleton-shimmer\[_ng/)
  })

  it('3: loading=false steps out of layout and renders the real children only', () => {
    const d = render()('done')
    expect(d.className).toBe('contents')
    expect(d.hasAttribute('aria-hidden')).toBe(false)
    expect(d.querySelector('#real')!.textContent).toBe('Loaded')
  })

  it('4: SkeletonGroup works on any element (React `tag`); SkeletonText paints N lines', () => {
    const q = render()
    expect(q('g').tagName).toBe('UL')
    expect(q('g').classList.contains('space-y-2')).toBe(true)
    const lines = [...q('t').querySelectorAll<HTMLElement>('.skeleton-shimmer')]
    expect(lines.map((l) => l.style.width)).toEqual(['100%', '100%', '100%', '60%'])
  })

  it('5: SkeletonLoader atom carries the variant classes + className; variants match React', () => {
    const atom = render()('atom').firstElementChild!
    for (const c of ['bg-muted', 'animate-pulse', 'size-12', 'rounded-full', 'mx-2'])
      expect(atom.classList.contains(c), c).toBe(true)
    for (const v of ['text', 'chip', 'avatar', 'image-large', 'table-row', 'button'] as const)
      expect(skeletonLoaderVariants({ variant: v })).toBe(reactVariants({ variant: v }))
  })

  it('6: rows > 1 builds the composed presets', () => {
    const q = render()
    expect(q('article').children.length).toBe(4)
    expect(q('article').firstElementChild!.classList.contains('mb-4')).toBe(true)
    expect(q('table').children.length).toBe(4)
    const three = q('three')
    expect(three.children.length).toBe(2)
    expect(three.firstElementChild!.classList.contains('items-start')).toBe(true)
    expect(three.firstElementChild!.querySelectorAll('.flex-1 > div').length).toBe(3)
  })

  it('7: loading=false shows content (+ boilerplate veil)', () => {
    const off = render()('off')
    expect(off.querySelector('#content')).not.toBeNull()
    expect(off.querySelector('.bg-muted\\/50.absolute')).not.toBeNull()
  })
})
