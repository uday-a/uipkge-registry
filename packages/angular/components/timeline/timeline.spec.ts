// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import {
  UiTimelineComponent,
  UiTimelineContentComponent,
  UiTimelineItemComponent,
  UiTimelineMediaComponent,
  UiTimelineSeparatorComponent,
  UiTimelineTitleComponent,
  type TimelineAlign,
  type TimelineDensity,
  type TimelineDirection,
} from './timeline.component'
import { timelineMediaVariants } from './timeline.variants'
import { timelineMediaVariants as reactMediaVariants } from '../../../registry-react/components/timeline/timeline.variants'

// Angular icons are <lucide-icon><svg/></lucide-icon>, so the Angular variants also target
// `lucide-icon > svg` wherever React targets a direct `> svg` child. Fold that back before
// comparing; every other class must match React byte for byte.
const foldIcons = (s: string) =>
  s.replaceAll('[&>svg,&>lucide-icon>svg]:', '[&>svg]:').replaceAll('has-[>svg,>lucide-icon]:', 'has-[>svg]:')

// React Timeline parity. Items learn their index / last-ness from the root, so if these
// break users see: a connector line dangling below the last marker, extra padding under the
// last row, align="center" not alternating sides, the icon marker ignoring the item status
// colour, or the separator / media markers missing entirely.

@Component({
  standalone: true,
  imports: [
    UiTimelineComponent,
    UiTimelineItemComponent,
    UiTimelineMediaComponent,
    UiTimelineSeparatorComponent,
    UiTimelineContentComponent,
    UiTimelineTitleComponent,
  ],
  template: `
    <div ui-timeline id="t" [direction]="direction" [align]="align" [density]="density">
      @for (s of steps(); track s; let i = $index) {
        <div
          ui-timeline-item
          [status]="i === 0 ? 'success' : 'default'"
          #item="uiTimelineItem"
          [attr.data-idx]="item.index()"
        >
          <div ui-timeline-media [variant]="i === 0 ? 'icon' : 'dot'" [lineStyle]="i === 1 ? 'dashed' : 'solid'"></div>
          <div ui-timeline-content>
            <h3 ui-timeline-title>{{ s }}</h3>
          </div>
        </div>
      }
    </div>
    <div ui-timeline id="s">
      <div ui-timeline-item><div ui-timeline-separator></div></div>
      <div ui-timeline-item>
        <div ui-timeline-separator><i slot="dot" id="dot"></i></div>
      </div>
    </div>
    <ui-timeline-title id="tt">T</ui-timeline-title>
  `,
})
class Host {
  direction: TimelineDirection = 'vertical'
  align: TimelineAlign = 'start'
  density: TimelineDensity = 'default'
  readonly steps = signal(['a', 'b', 'c'])
}

async function render(init: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, init)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  fixture.detectChanges()
  const root = fixture.nativeElement as HTMLElement
  const items = () => [...root.querySelectorAll<HTMLElement>('#t > [data-slot=timeline-item]')]
  return { fixture, host: fixture.componentInstance, root, items }
}

describe('Timeline (angular, 7 checks)', () => {
  it('1: items get their index from the root and only the last one is data-last', async () => {
    const { items } = await render()
    expect(items().map((i) => i.getAttribute('data-idx'))).toEqual(['0', '1', '2'])
    expect(items().map((i) => i.hasAttribute('data-last'))).toEqual([false, false, true])
    expect(items()[1]!.style.getPropertyValue('--timeline-stagger')).toBe('55ms')
  })

  it('2: media renders marker + connector, and no connector under the last marker', async () => {
    const { items } = await render()
    const connectors = items().map((i) => i.querySelector('[data-slot=timeline-media-connector]'))
    expect(connectors[0]).not.toBeNull()
    expect(connectors[1]!.className).toContain('border-dashed')
    expect(connectors[2]).toBeNull()
    expect(items()[2]!.querySelector('[data-slot=timeline-media-marker]')!.classList.contains('mt-1')).toBe(true)
  })

  it('3: the marker inherits the item status (success icon marker is tinted)', async () => {
    const { items } = await render()
    const marker = items()[0]!.querySelector('[data-slot=timeline-media-marker]')!
    expect(marker.className).toContain('text-success')
    expect(items()[0]!.getAttribute('data-status')).toBe('success')
  })

  it('4: density spacing applies to every row except the last', async () => {
    const { items } = await render({ density: 'compact' })
    expect(items()[0]!.className).toContain('[&>[data-slot=timeline-content]]:pb-2')
    expect(items()[2]!.className).not.toContain('pb-2')
  })

  it('5: align="center" alternates sides on a 3-column grid and does not leak an HTML align attr', async () => {
    const { items, root } = await render({ align: 'center' })
    expect(items().map((i) => i.getAttribute('data-side'))).toEqual(['left', 'right', 'left'])
    expect(items()[0]!.className).toContain('grid-cols-[1fr_auto_1fr]')
    expect(root.querySelector('#t')!.hasAttribute('align')).toBe(false)
  })

  it('6: adding / removing items re-indexes (new last item, connector moves)', async () => {
    const { items, host, fixture } = await render()
    host.steps.set(['a', 'b'])
    fixture.detectChanges()
    await fixture.whenStable()
    fixture.detectChanges()
    expect(items().length).toBe(2)
    expect(items()[1]!.hasAttribute('data-last')).toBe(true)
    expect(items()[1]!.querySelector('[data-slot=timeline-media-connector]')).toBeNull()
  })

  it('7: separator marker + dot override; custom-element title is a heading; variants match React', async () => {
    const { root } = await render()
    const seps = root.querySelectorAll('#s [data-slot=timeline-separator]')
    expect(seps[0]!.querySelector('[data-slot=timeline-separator-marker] .rounded-full')).not.toBeNull()
    expect(seps[0]!.querySelector('[data-slot=timeline-media-connector]')).not.toBeNull()
    expect(seps[1]!.querySelector('#dot')).not.toBeNull()
    expect(seps[1]!.querySelector('[data-slot=timeline-media-connector]')).toBeNull()
    const tt = root.querySelector('#tt')!
    expect(tt.getAttribute('role')).toBe('heading')
    expect(tt.getAttribute('aria-level')).toBe('3')
    for (const variant of ['dot', 'icon', 'avatar', 'outline'] as const)
      for (const status of ['default', 'current', 'success', 'warning', 'error', 'info', 'muted'] as const)
        expect(foldIcons(timelineMediaVariants({ variant, status }))).toBe(reactMediaVariants({ variant, status }))
  })
})
