// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiKbdComponent } from './kbd.component'

// React Kbd parity. If these break, users see a shortcut hint that is no longer a <kbd>
// (screen readers stop announcing it as a key), is selectable / clickable, or drifts from the
// React chip styling.

@Component({
  standalone: true,
  imports: [UiKbdComponent],
  template: `<kbd ui-kbd id="k" class="ml-2">⌘K</kbd><ui-kbd id="el">Esc</ui-kbd>`,
})
class Host {}

const REACT_CLASSES =
  'bg-muted text-muted-foreground pointer-events-none inline-flex h-5 min-w-5 items-center justify-center gap-1 rounded border px-1.5 font-mono text-xs font-medium select-none'

function render() {
  const fixture = TestBed.createComponent(Host)
  fixture.detectChanges()
  return (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
}

describe('Kbd (angular, 3 checks)', () => {
  it('1: the attribute form keeps native <kbd> semantics and data-slot', () => {
    const k = render()('k')
    expect(k.tagName).toBe('KBD')
    expect(k.getAttribute('data-slot')).toBe('kbd')
  })

  it('2: carries every React class (inert, non-selectable chip) plus consumer classes', () => {
    const k = render()('k')
    for (const c of REACT_CLASSES.split(' ')) expect(k.classList.contains(c), c).toBe(true)
    expect(k.classList.contains('ml-2')).toBe(true)
  })

  it('3: the element form is inline-flex too', () => {
    expect(render()('el').classList.contains('inline-flex')).toBe(true)
  })
})
