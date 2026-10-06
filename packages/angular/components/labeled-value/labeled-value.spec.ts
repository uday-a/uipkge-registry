// @vitest-environment jsdom
import { describe, it, expect } from 'vitest'
import { Component } from '@angular/core'
import { TestBed } from '@angular/core/testing'
import { UiLabeledValueComponent } from './labeled-value.component'

// React LabeledValue parity (`children ?? <value span>`). If these break, users see the value
// text next to their custom badge/avatar instead of being replaced by it, an empty row where a
// plain value should be, or the label/value no longer pushed to opposite ends of the row.

@Component({
  standalone: true,
  imports: [UiLabeledValueComponent],
  template: `
    <div id="a" ui-labeled-value label="Plan" value="Pro" class="max-w-xs"></div>
    <div id="b" ui-labeled-value label="Status" value="ignored"><span class="badge">Active</span></div>
    <div id="c" ui-labeled-value label="Empty"></div>
  `,
})
class Host {}

function render() {
  const f = TestBed.createComponent(Host)
  f.detectChanges()
  const q = (id: string) => (f.nativeElement as HTMLElement).querySelector('#' + id) as HTMLElement
  return { a: q('a'), b: q('b'), c: q('c') }
}

const has = (el: Element, cls: string) => cls.split(' ').every((c) => el.classList.contains(c))

describe('LabeledValue (angular, 5 checks)', () => {
  it('1: renders the label then the value span', () => {
    const { a } = render()
    const kids = [...a.children].map((k) => k.getAttribute('data-slot'))
    expect(kids).toEqual(['labeled-value-label', 'labeled-value-value'])
    expect(a.textContent).toBe('PlanPro')
  })
  it('2: projected content replaces the value span', () => {
    const { b } = render()
    expect(b.querySelector('[data-slot=labeled-value-value]')).toBeNull()
    expect(b.querySelector('.badge')?.textContent).toBe('Active')
  })
  it('3: value span is still rendered when value is undefined (React always renders it)', () => {
    expect(render().c.querySelector('[data-slot=labeled-value-value]')).not.toBeNull()
  })
  it('4: row layout classes + consumer class merge', () => {
    const { a } = render()
    expect(has(a, 'flex items-center justify-between gap-3 text-sm')).toBe(true)
    expect(a.className).toContain('max-w-xs')
    expect(a.getAttribute('data-slot')).toBe('labeled-value')
  })
  it('5: label is muted and never shrinks; value right-aligned', () => {
    const { a } = render()
    expect(a.querySelector('[data-slot=labeled-value-label]')!.className).toBe('text-muted-foreground shrink-0')
    expect(a.querySelector('[data-slot=labeled-value-value]')!.className).toBe('min-w-0 text-right font-medium')
  })
})
