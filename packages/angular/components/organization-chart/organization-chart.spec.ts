// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, ViewChild, provideZonelessChangeDetection, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiOrganizationChartComponent, type OrgChartToggleEvent, type OrgNode } from './organization-chart.component'

// Behaviour parity with the React OrganizationChart. If these break, users notice: the
// chart is empty, branches can't be collapsed / expanded, the zoom toolbar does nothing,
// clicking or pressing Enter on a person doesn't select them, custom card content
// (renderNode) disappears, and people without a photo lose their initials.

const org: OrgNode = {
  id: '1',
  name: 'Sarah Johnson',
  title: 'CEO',
  avatar: 'https://example.test/sarah.png',
  department: 'Executive',
  children: [
    {
      id: '2',
      name: 'Michael Chen',
      title: 'VP Engineering',
      department: 'Engineering',
      children: [{ id: '5', name: 'Alex Rivera', title: 'Lead' }],
    },
    { id: '3', name: 'Emily Davis', title: 'VP Sales' },
  ],
}

@Component({
  standalone: true,
  imports: [UiOrganizationChartComponent],
  template: `
    <ng-template #badge let-node
      ><span class="dept">{{ node.department }}</span></ng-template
    >
    <ui-organization-chart
      #chart
      [data]="data"
      [direction]="direction()"
      [defaultExpanded]="defaultExpanded()"
      [zoomable]="zoomable()"
      [renderNode]="withBadge() ? badge : null"
      (nodeClick)="clicked.push($event.name)"
      (toggle)="toggles.push($event)"
    />
  `,
})
class HostComponent {
  @ViewChild('chart') chart!: UiOrganizationChartComponent
  data = org
  readonly direction = signal<'top-down' | 'left-right'>('top-down')
  readonly defaultExpanded = signal(true)
  readonly zoomable = signal(false)
  readonly withBadge = signal(false)
  clicked: string[] = []
  toggles: OrgChartToggleEvent[] = []
}

async function setup(init: (h: HostComponent) => void = () => {}) {
  TestBed.configureTestingModule({ providers: [provideZonelessChangeDetection()] })
  const fixture = TestBed.createComponent(HostComponent)
  init(fixture.componentInstance)
  document.body.appendChild(fixture.nativeElement)
  fixture.detectChanges()
  await fixture.whenStable()
  const root = fixture.nativeElement.querySelector('[data-slot="organization-chart"]') as HTMLElement
  const cards = () => Array.from(root.querySelectorAll<HTMLElement>('[role="button"]'))
  const names = () => cards().map((c) => c.getAttribute('aria-label'))
  const settle = async () => {
    fixture.detectChanges()
    await fixture.whenStable()
  }
  return { fixture, host: fixture.componentInstance, root, cards, names, settle }
}

describe('OrganizationChart (angular, 8 checks)', () => {
  it('1: renders every node of an expanded tree as a labelled card, root marked', async () => {
    const t = await setup()
    expect(t.names()).toEqual([
      'Sarah Johnson, CEO',
      'Michael Chen, VP Engineering',
      'Alex Rivera, Lead',
      'Emily Davis, VP Sales',
    ])
    const rootNode = t.root.querySelector('.org-v')!
    expect(rootNode.hasAttribute('data-root')).toBe(true)
    expect(t.cards()[0].className).toContain('ring-primary/20')
    expect(t.root.classList.contains('bg-background')).toBe(true)
  })

  it('2: avatar image when given, otherwise two-letter initials', async () => {
    const t = await setup()
    expect(t.cards()[0].querySelector('img')?.getAttribute('src')).toBe('https://example.test/sarah.png')
    expect(t.cards()[1].querySelector('[aria-hidden="true"]')?.textContent?.trim()).toBe('MC')
  })

  it('3: the toggle collapses a branch and emits toggle(node, expanded)', async () => {
    const t = await setup()
    const btn = t.cards()[1].querySelector<HTMLButtonElement>('button[aria-expanded]')!
    expect(btn.getAttribute('aria-label')).toBe('Collapse')
    btn.click()
    await t.settle()
    expect(t.names()).not.toContain('Alex Rivera, Lead')
    expect(t.host.toggles).toEqual([{ node: org.children![0], expanded: false }])
    expect(t.host.clicked).toEqual([]) // toggle doesn't select the card
  })

  it('4: defaultExpanded=false expands only the root: its reports show, deeper branches stay closed', async () => {
    const t = await setup((h) => h.defaultExpanded.set(false))
    expect(t.names()).toEqual(['Sarah Johnson, CEO', 'Michael Chen, VP Engineering', 'Emily Davis, VP Sales'])
    expect(t.cards()[1].querySelector('button')?.getAttribute('aria-label')).toBe('Expand')
  })

  it('5: click, Enter and Space on a card emit nodeClick', async () => {
    const t = await setup()
    t.cards()[3].click()
    t.cards()[1].dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    t.cards()[0].dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    expect(t.host.clicked).toEqual(['Emily Davis', 'Michael Chen', 'Sarah Johnson'])
  })

  it('6: zoom toolbar scales the tree within 50%..200%, expand / collapse all', async () => {
    const t = await setup((h) => h.zoomable.set(true))
    const btn = (label: string) => t.root.querySelector<HTMLButtonElement>(`button[aria-label="${label}"]`)!
    const scaled = t.root.querySelector<HTMLElement>('.transition-transform')!
    btn('Zoom in').click()
    await t.settle()
    expect(scaled.style.transform).toBe('scale(1.1)')
    expect(t.root.textContent).toContain('110%')
    for (let i = 0; i < 12; i++) btn('Zoom out').click()
    await t.settle()
    expect(scaled.style.transform).toBe('scale(0.5)')
    btn('Reset zoom').click()
    btn('Collapse all').click()
    await t.settle()
    expect(scaled.style.transform).toBe('scale(1)')
    expect(t.names()).toEqual(['Sarah Johnson, CEO', 'Michael Chen, VP Engineering', 'Emily Davis, VP Sales'])
    t.host.chart.expandAll()
    await t.settle()
    expect(t.names().length).toBe(4)
  })

  it('7: left-right direction uses the horizontal connector layout', async () => {
    const t = await setup((h) => h.direction.set('left-right'))
    expect(t.root.getAttribute('data-direction')).toBe('left-right')
    expect(t.root.querySelector('.org-v')).toBeNull()
    expect(t.root.querySelectorAll('.org-h').length).toBe(4)
    expect(t.root.querySelector('.org-h-line-right')).not.toBeNull()
  })

  it('8: renderNode template renders inside each card with the node as context', async () => {
    const t = await setup((h) => h.withBadge.set(true))
    expect(Array.from(t.root.querySelectorAll('.dept')).map((d) => d.textContent)).toEqual([
      'Executive',
      'Engineering',
      '',
      '',
    ])
    expect(t.cards()[0].querySelector('.dept')).not.toBeNull()
  })
})
