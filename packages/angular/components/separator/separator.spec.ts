// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiSeparatorComponent } from './separator.component'

// Radix Separator parity. If these break, screen readers announce purely decorative dividers
// as separators (Radix uses role="none"), a semantic vertical separator loses its orientation,
// or the 1px line collapses to nothing because the custom element renders inline.

@Component({
  standalone: true,
  imports: [UiSeparatorComponent],
  template: `
    <ui-separator id="h" class="my-3" />
    <ui-separator id="v" orientation="vertical" />
    <ui-separator id="sh" [decorative]="false" />
    <ui-separator id="sv" [decorative]="false" orientation="vertical" />
  `,
})
class Host {}

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  return (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
}

describe('Separator (angular, 4 checks)', () => {
  it('1: decorative by default: role="none", no aria-orientation, data-orientation set', () => {
    const h = render()('h')
    expect(h.getAttribute('role')).toBe('none')
    expect(h.hasAttribute('aria-orientation')).toBe(false)
    expect(h.getAttribute('data-orientation')).toBe('horizontal')
    expect(h.getAttribute('data-slot')).toBe('separator')
  })

  it('2: decorative=false is a semantic separator; aria-orientation only when vertical (Radix)', () => {
    const q = render()
    expect(q('sh').getAttribute('role')).toBe('separator')
    expect(q('sh').hasAttribute('aria-orientation')).toBe(false)
    expect(q('sv').getAttribute('aria-orientation')).toBe('vertical')
  })

  it('3: the host is block-level so the orientation sizing classes apply', () => {
    const h = render()('h')
    for (const c of [
      'block',
      'bg-border',
      'data-[orientation=horizontal]:h-px',
      'data-[orientation=vertical]:w-px',
      'my-3',
    ])
      expect(h.classList.contains(c), c).toBe(true)
  })

  it('4: vertical orientation is reflected for the data-[orientation=vertical] sizing', () => {
    expect(render()('v').getAttribute('data-orientation')).toBe('vertical')
  })
})
