// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component, signal } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { FormControl, ReactiveFormsModule } from '@angular/forms'
import { UiToggleComponent } from './toggle.component'
import { toggleVariants } from './toggle.variants'
import { toggleVariants as reactToggleVariants } from '../../../registry-react/components/toggle/toggle.variants'

// Radix Toggle parity. If these break, users see: a toggle that does not latch on click (or
// latches while its parent holds it controlled), aria-pressed / data-state out of sync so the
// "on" surface never paints, a disabled toggle that still flips and stays tabbable, a
// <ui-toggle> element that ignores Enter / Space, or a form control that never updates.

@Component({
  standalone: true,
  imports: [UiToggleComponent, ReactiveFormsModule],
  template: `
    <button ui-toggle id="u" aria-label="Bold" (pressedChange)="changes.push($event)">B</button>
    <button ui-toggle id="d" defaultPressed>D</button>
    <button ui-toggle id="c" [pressed]="pinned()" (pressedChange)="requests.push($event)">C</button>
    <button ui-toggle id="c2" [(pressed)]="two">C2</button>
    <button ui-toggle id="off" disabled [pressed]="true">Off</button>
    <ui-toggle id="el">El</ui-toggle>
    <button ui-toggle id="f" [formControl]="control">F</button>
  `,
})
class Host {
  readonly pinned = signal(false)
  two = false
  changes: boolean[] = []
  requests: boolean[] = []
  control = new FormControl(false)
}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  const q = (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
  return { fixture, host: fixture.componentInstance, q }
}

describe('Toggle (angular, 7 checks)', () => {
  it('1: uncontrolled: click latches on / off, mirrored in aria-pressed + data-state, emits pressedChange', () => {
    const { q, host, fixture } = render()
    const b = q('u')
    expect(b.getAttribute('type')).toBe('button')
    expect(b.getAttribute('aria-pressed')).toBe('false')
    expect(b.getAttribute('data-state')).toBe('off')
    b.click()
    fixture.detectChanges()
    expect(b.getAttribute('aria-pressed')).toBe('true')
    expect(b.getAttribute('data-state')).toBe('on')
    b.click()
    fixture.detectChanges()
    expect(b.getAttribute('data-state')).toBe('off')
    expect(host.changes).toEqual([true, false])
  })

  it('2: defaultPressed starts on', () => {
    expect(render().q('d').getAttribute('data-state')).toBe('on')
  })

  it('3: controlled: click only requests a change; state follows the bound value', () => {
    const { q, host, fixture } = render()
    const b = q('c')
    b.click()
    fixture.detectChanges()
    expect(host.requests).toEqual([true])
    expect(b.getAttribute('data-state')).toBe('off')
    host.pinned.set(true)
    fixture.detectChanges()
    expect(b.getAttribute('data-state')).toBe('on')
  })

  it('4: [(pressed)] two-way binding round-trips', () => {
    const { q, host, fixture } = render()
    q('c2').click()
    fixture.detectChanges()
    expect(host.two).toBe(true)
    expect(q('c2').getAttribute('data-state')).toBe('on')
  })

  it('5: disabled sets native disabled + data-disabled and ignores clicks, keeping its pressed value', () => {
    const { q, fixture } = render()
    const b = q('off') as HTMLButtonElement
    expect(b.disabled).toBe(true)
    expect(b.hasAttribute('data-disabled')).toBe(true)
    b.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    fixture.detectChanges()
    expect(b.getAttribute('data-state')).toBe('on')
  })

  it('6: the <ui-toggle> element is a focusable role="button" that toggles on Enter / Space', () => {
    const { q, fixture } = render()
    const el = q('el')
    expect(el.getAttribute('role')).toBe('button')
    expect(el.getAttribute('tabindex')).toBe('0')
    el.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }))
    fixture.detectChanges()
    expect(el.getAttribute('data-state')).toBe('on')
    el.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }))
    fixture.detectChanges()
    expect(el.getAttribute('data-state')).toBe('off')
  })

  it('7: forms: control value writes through, clicks update the control; classes match React', () => {
    const { q, host, fixture } = render()
    host.control.setValue(true)
    fixture.detectChanges()
    expect(q('f').getAttribute('data-state')).toBe('on')
    q('f').click()
    expect(host.control.value).toBe(false)
    for (const variant of ['default', 'outline'] as const)
      for (const size of ['default', 'sm', 'lg'] as const)
        expect(toggleVariants({ variant, size })).toBe(reactToggleVariants({ variant, size }))
  })
})
