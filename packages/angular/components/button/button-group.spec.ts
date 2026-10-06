// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiButtonGroupComponent } from './button-group.component'
import { UiButtonComponent } from './button.component'

// React ButtonGroup parity. If these break, users see: a segmented toolbar whose buttons keep
// their own rounded corners and gaps instead of fusing into one control, attached="false"
// still fusing (string 'false' treated as truthy), or a vertical group laid out in a row.

@Component({
  standalone: true,
  imports: [UiButtonGroupComponent, UiButtonComponent],
  template: `
    <div ui-button-group id="g" [orientation]="orientation" [attached]="attached">
      <button ui-button variant="outline">A</button>
      <button ui-button variant="outline">B</button>
    </div>
    <div ui-button-group id="s" attached="false"><button ui-button>C</button></div>
  `,
})
class Host {
  orientation: 'horizontal' | 'vertical' = 'horizontal'
  attached = true
}

function render(init: Partial<Host> = {}) {
  const fixture = TestBed.createComponent(Host)
  Object.assign(fixture.componentInstance, init)
  fixture.detectChanges()
  const q = (id: string) => (fixture.nativeElement as HTMLElement).querySelector<HTMLElement>(`#${id}`)!
  return { fixture, q }
}

describe('ButtonGroup (angular, 4 checks)', () => {
  it('1: renders role=group with data-slot / data-orientation / data-attached', () => {
    const g = render().q('g')
    expect(g.getAttribute('role')).toBe('group')
    expect(g.getAttribute('data-slot')).toBe('button-group')
    expect(g.getAttribute('data-orientation')).toBe('horizontal')
    expect(g.hasAttribute('data-attached')).toBe(true)
  })

  it('2: attached horizontal fuses the buttons (rounded-none + -ml-px overlap)', () => {
    const cls = render().q('g').className
    expect(cls).toContain('flex-row')
    expect(cls).toContain('[&>[data-slot=button]]:rounded-none')
    expect(cls).toContain('[&>[data-slot=button]:not(:first-child)]:-ml-px')
  })

  it('3: vertical stacks and fuses top / bottom instead', () => {
    const cls = render({ orientation: 'vertical' }).q('g').className
    expect(cls).toContain('flex-col')
    expect(cls).toContain('[&>[data-slot=button]:first-child]:rounded-t-md')
    expect(cls).not.toContain('-ml-px')
  })

  it('4: attached="false" (string attribute) detaches: gap, no fusing, no data-attached', () => {
    const s = render().q('s')
    expect(s.className).toContain('gap-1.5')
    expect(s.className).not.toContain('rounded-none')
    expect(s.hasAttribute('data-attached')).toBe(false)
  })
})
