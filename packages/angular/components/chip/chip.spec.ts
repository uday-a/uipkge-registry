// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiChipComponent, UiChipGroupComponent } from './chip.component'
import { chipVariants } from './chip.variants'
import { chipVariants as reactChipVariants } from '../../../registry-react/components/chip/chip.variants'

// React Chip parity. If these break, users see: a closable chip that vanishes abruptly (or
// never fades) because the leave animation / timing changed, a remove click that also
// triggers the chip's own click handler, the dismiss button losing its label or X glyph, or
// ChipGroup selection rules (single / multiple / mandatory / max) behaving differently.

@Component({
  standalone: true,
  imports: [UiChipComponent, UiChipGroupComponent],
  template: `
    <span ui-chip id="c" closable (close)="closed = closed + 1" (click)="chipClicks = chipClicks + 1">tag</span>
    <span ui-chip id="plain" variant="success" size="lg">ok</span>
    <div
      ui-chip-group
      id="g"
      #g="uiChipGroup"
      [selected]="selected()"
      [multiple]="multiple"
      [max]="max"
      [mandatory]="mandatory"
      (selectedChange)="selected.set($event)"
    >
      <span ui-chip id="ga" [variant]="g.isSelected('a') ? 'filled' : 'default'" (click)="g.toggle('a')">A</span>
      <span ui-chip id="gb" (click)="g.toggle('b')">B</span>
      <span ui-chip id="gc" (click)="g.toggle('c')">C</span>
    </div>
  `,
})
class Host {
  closed = 0
  chipClicks = 0
  readonly selected = signal<string[]>([])
  multiple = false
  mandatory = false
  max?: number
}

function render(init: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, init)
  fixture.detectChanges()
  const q = (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
  return { fixture, host: fixture.componentInstance, q }
}

afterEach(() => vi.useRealTimers())

describe('Chip (angular, 6 checks)', () => {
  it('1: renders data-slot="chip" with the enter animation class and React variant classes', () => {
    const { q } = render()
    const c = q('plain')
    expect(c.getAttribute('data-slot')).toBe('chip')
    for (const cls of ['chip-enter', 'inline-flex', 'bg-success/10']) expect(c.classList.contains(cls), cls).toBe(true)
  })

  it('2: closable renders a labelled button with the Lucide X icon (aria-hidden)', () => {
    const btn = render().q('c').querySelector('button')!
    expect(btn.getAttribute('type')).toBe('button')
    expect(btn.getAttribute('aria-label')).toBe('Remove item')
    const svg = btn.querySelector('svg')!
    expect(svg.getAttribute('class')).toContain('lucide-x')
    expect(svg.getAttribute('aria-hidden')).toBe('true')
  })

  it('3: remove plays chip-leave (data-leaving) and emits close after 160ms, without clicking the chip', () => {
    vi.useFakeTimers()
    window.matchMedia = ((q: string) => ({ matches: false, media: q })) as typeof window.matchMedia
    const { q, host, fixture } = render()
    q('c').querySelector('button')!.click()
    fixture.detectChanges()
    expect(q('c').hasAttribute('data-leaving')).toBe(true)
    expect(q('c').classList.contains('chip-leave')).toBe(true)
    expect(host.chipClicks).toBe(0)
    expect(host.closed).toBe(0)
    vi.advanceTimersByTime(160)
    expect(host.closed).toBe(1)
    q('c').querySelector('button')!.click()
    vi.advanceTimersByTime(200)
    expect(host.closed).toBe(1)
  })

  it('4: ChipGroup single select toggles on / off and exposes isSelected via #g="uiChipGroup"', () => {
    const { q, host, fixture } = render()
    expect(q('g').getAttribute('role')).toBe('group')
    q('ga').click()
    fixture.detectChanges()
    expect(host.selected()).toEqual(['a'])
    expect(q('ga').classList.contains('bg-primary')).toBe(true)
    q('gb').click()
    fixture.detectChanges()
    expect(host.selected()).toEqual(['b'])
    q('gb').click()
    fixture.detectChanges()
    expect(host.selected()).toEqual([])
  })

  it('5: mandatory keeps one selected; multiple with max drops the oldest', () => {
    const click = (r: ReturnType<typeof render>, id: string) => {
      r.q(id).click()
      r.fixture.detectChanges()
    }
    const m = render({ mandatory: true })
    click(m, 'ga')
    click(m, 'ga')
    expect(m.host.selected()).toEqual(['a'])
    const x = render({ multiple: true, max: 2 })
    click(x, 'ga')
    click(x, 'gb')
    click(x, 'gc')
    expect(x.host.selected()).toEqual(['b', 'c'])
  })

  it('6: every variant x size x wrap produces the same classes as React chipVariants', () => {
    const variants = [
      'default',
      'filled',
      'outlined',
      'outline',
      'elevated',
      'success',
      'warning',
      'destructive',
    ] as const
    for (const variant of variants)
      for (const size of ['sm', 'default', 'lg'] as const)
        for (const wrap of [true, undefined])
          expect(chipVariants({ variant, size, wrap })).toBe(reactChipVariants({ variant, size, wrap }))
  })
})
