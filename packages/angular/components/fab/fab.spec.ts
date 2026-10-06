// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiFabComponent } from './fab.component'

// React Fab parity. If these break, users see an unlabeled FAB for screen readers, a disabled
// FAB (or link FAB) that still fires its action, an extended FAB without its pill shape/label,
// or a contained FAB that escapes its card because it stayed position:fixed.

@Component({
  standalone: true,
  imports: [UiFabComponent],
  template: `
    <button id="icon" ui-fab position="inline" aria-label="Add" (click)="clicks = clicks + 1"><svg></svg></button>
    <button id="ext" ui-fab label="Compose" variant="secondary"><svg></svg></button>
    <button id="off" ui-fab disabled (click)="clicks = clicks + 1"></button>
    <a id="link" ui-fab href="#x" disabled (click)="clicks = clicks + 1"></a>
    <button id="abs" ui-fab absolute position="bottom-right"></button>
    <button id="lbl" ui-fab ariaLabel="From prop"></button>
  `,
})
class Host {
  clicks = 0
}

function render() {
  const f = TestBed.createComponent(Host)
  f.detectChanges()
  return { f, q: (id: string) => (f.nativeElement as HTMLElement).querySelector('#' + id) as HTMLElement }
}

describe('Fab (angular, 6 checks)', () => {
  it('1: aria-label resolves attr > ariaLabel > label > "Floating action"', () => {
    const { q } = render()
    expect(q('icon').getAttribute('aria-label')).toBe('Add')
    expect(q('lbl').getAttribute('aria-label')).toBe('From prop')
    expect(q('ext').getAttribute('aria-label')).toBe('Compose')
    expect(q('off').getAttribute('aria-label')).toBe('Floating action')
  })
  it('2: label renders an extended FAB with a trailing label span', () => {
    const ext = render().q('ext')
    expect(ext.getAttribute('data-size')).toBe('extended')
    expect(ext.getAttribute('data-variant')).toBe('secondary')
    expect(ext.querySelector('span.pr-1')!.textContent).toBe('Compose')
  })
  it('3: data-* attributes are omitted when the prop is unset (React ?? undefined)', () => {
    const off = render().q('off')
    expect(off.hasAttribute('data-variant')).toBe(false)
    expect(off.hasAttribute('data-size')).toBe(false)
  })
  it('4: clicks reach the consumer when enabled', () => {
    const { f, q } = render()
    q('icon').click()
    expect(f.componentInstance.clicks).toBe(1)
  })
  it('5: disabled button gets native disabled; disabled link swallows clicks', () => {
    const { f, q } = render()
    expect(q('off').hasAttribute('disabled')).toBe(true)
    expect(q('link').hasAttribute('disabled')).toBe(false)
    const ev = new MouseEvent('click', { bubbles: true, cancelable: true })
    q('link').dispatchEvent(ev)
    expect(ev.defaultPrevented).toBe(true)
    expect(f.componentInstance.clicks).toBe(0)
  })
  it('6: absolute swaps fixed for absolute (not for inline)', () => {
    const { q } = render()
    expect(q('abs').classList.contains('absolute')).toBe(true)
    expect(q('abs').classList.contains('fixed')).toBe(false)
    expect(q('icon').classList.contains('absolute')).toBe(false)
  })
})
